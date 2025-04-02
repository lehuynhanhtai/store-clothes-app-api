import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.account);
    if (user) throw new ConflictException('User already exists');
    return this.userService.create(createUserDto);
  }

  async validateLocalUser(account: string, password: string): Promise<any> {
    const user = await this.userService.findByEmail(account);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    // Verify the password using argon2
    const isPasswordValid = await verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      id: user.id,
      account: user.account,
    };
  }

  async login(user: any) {
    const payload = { account: user.account, sub: user.id };
    return {
      id: user.id,
      account: user.account,
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateJwtUser(userId: number) {
    const user = await this.userService.findByUserId(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const currentUser = { id: user.id };
    return currentUser;
  }
}
