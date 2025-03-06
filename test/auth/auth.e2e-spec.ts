import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { CreateUserDto } from '../../src/user/dto/create-user.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signUp', () => {
    it('POST /auth/signin', async () => {
      const createUserDto: CreateUserDto = {
        account: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      };

      await authController.signUp(createUserDto);

      expect(authService.registerUser).toHaveBeenCalledWith(createUserDto);
    });
  });
});
