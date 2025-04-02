import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();
import { faker } from '@faker-js/faker';

export async function seedProducts() {
  // First create some categories and brands
  const categories = await Promise.all(
    ['T-Shirts', 'Jeans', 'Dresses', 'Jackets', 'Shoes'].map((name) =>
      prisma.category.create({
        data: { name },
      }),
    ),
  );

  const brands = await Promise.all(
    ['Nike', 'Adidas', 'Zara', 'H&M', "Levi's"].map((name) =>
      prisma.brand.create({
        data: { name },
      }),
    ),
  );

  // Create products
  const numberOfProducts = 20;
  for (let i = 0; i < numberOfProducts; i++) {
    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        images: Array.from({ length: 3 }, () =>
          faker.image.urlLoremFlickr({ category: 'fashion' }),
        ),
        price: parseFloat(faker.commerce.price({ min: 10, max: 200 })),
        salePrice:
          Math.random() > 0.7
            ? parseFloat(faker.commerce.price({ min: 5, max: 150 }))
            : null,
        sku: faker.string.alphanumeric(10).toUpperCase(),
        stockQuantity: faker.number.int({ min: 0, max: 100 }),
        color: faker.color.human(),
        size: ['S', 'M', 'L', 'XL'],
        material: faker.commerce.productMaterial(),
        categoryId: faker.helpers.arrayElement(categories).id,
        brandId: faker.helpers.arrayElement(brands).id,
        isFeatured: Math.random() > 0.8,
        isActive: true,
      },
    });
  }
  console.log('Product seed data created successfully');
}
