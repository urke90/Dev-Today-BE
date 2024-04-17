import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// const main = async () => {
//   // const user = await prisma.user.create({
//   //   data: {
//   //     firstName: 'Uros',
//   //     lastName: 'Bijelic',
//   //     email: 'urosbijelic90@gmail.com',
//   //     password: '123123',
//   //     currentKnowledge: 'Nesam skolovala',
//   //   },
//   // });
//   // console.log('user', user);
//   // await prisma.user.create({
//   //   data: {
//   //   }
//   // })
//   // await prisma.user.deleteMany();
// };

// main()
//   .catch((e) => {
//     console.error('Prisma connection error', e);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// "prismaTest": "nodemon prisma-client.ts"
