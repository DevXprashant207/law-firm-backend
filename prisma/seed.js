import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create default admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@lawfirm.com' },
    update: {},
    create: {
      email: 'admin@lawfirm.com',
      password: hashedPassword,
    },
  });

  // Create sample lawyers
  const lawyer1 = await prisma.lawyer.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'John Smith',
      title: 'Senior Partner',
      bio: 'John Smith is a senior partner with over 20 years of experience in corporate law.',
      imageUrl: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  });

  const lawyer2 = await prisma.lawyer.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Sarah Johnson',
      title: 'Associate Partner',
      bio: 'Sarah Johnson specializes in family law and has helped countless families navigate complex legal matters.',
      imageUrl: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400',
    },
  });

  // Create sample services
  const service1 = await prisma.service.upsert({
    where: { slug: 'corporate-law' },
    update: {},
    create: {
      name: 'Corporate Law',
      slug: 'corporate-law',
      description: 'Comprehensive corporate legal services for businesses of all sizes.',
    },
  });

  const service2 = await prisma.service.upsert({
    where: { slug: 'family-law' },
    update: {},
    create: {
      name: 'Family Law',
      slug: 'family-law',
      description: 'Expert legal assistance for family-related matters including divorce and custody.',
    },
  });

  // Associate lawyers with services
  await prisma.lawyerService.upsert({
    where: { 
      lawyerId_serviceId: {
        lawyerId: lawyer1.id,
        serviceId: service1.id
      }
    },
    update: {},
    create: {
      lawyerId: lawyer1.id,
      serviceId: service1.id,
    },
  });

  await prisma.lawyerService.upsert({
    where: { 
      lawyerId_serviceId: {
        lawyerId: lawyer2.id,
        serviceId: service2.id
      }
    },
    update: {},
    create: {
      lawyerId: lawyer2.id,
      serviceId: service2.id,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });