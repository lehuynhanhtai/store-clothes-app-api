import { PrismaClient, Role } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

async function main() {
  // Create admin user
  const adminPassword = await hashPassword('admin123');
  await prisma.user.create({
    data: {
      account: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  // Create regular users
  const numberOfUsers = 10;
  for (let i = 0; i < numberOfUsers; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const password = await hashPassword('password123');

    await prisma.user.create({
      data: {
        account: faker.internet.email({ firstName, lastName }),
        firstName,
        lastName,
        password,
        role: Role.USER,
      },
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
