import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear old data (optional, for dev only)
  await prisma.admin.deleteMany();
  await prisma.subAdmin.deleteMany();
  await prisma.lawyerService.deleteMany();
  await prisma.lawyer.deleteMany();
  await prisma.service.deleteMany();
  await prisma.post.deleteMany();
  await prisma.news.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.mediaCoverage.deleteMany();
  await prisma.siteSettings.deleteMany();

  // 🧑‍💼 Admin seed
  const admin = await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      password: 'yourpassword',
      role: 'ADMIN'
    }
  });
  console.log('✅ Admin created');

  // 👩‍💼 SubAdmin seed
  const subAdmin = await prisma.subAdmin.create({
    data: {
      email: 'subadmin@lawfirm.com',
      password: await bcrypt.hash('sub123', 10),
      name: 'John Doe',
      canManageEnquiries: true,
      canManageLawyers: true,
      canManageServices: true,
      createdBy: admin.id
    }
  });
  console.log('✅ SubAdmin created');

  // ⚖️ Services seed
  const services = await prisma.service.createMany({
    data: [
      {
        name: 'Criminal Law',
        slug: 'criminal-law',
        description: 'Legal representation for criminal cases.',
        imageUrl: '/upload/criminal-law.jpg'
      },
      {
        name: 'Corporate Law',
        slug: 'corporate-law',
        description: 'Consultancy and corporate case handling.',
        imageUrl: '/upload/corporate-law.jpg'
      },
      {
        name: 'Family Law',
        slug: 'family-law',
        description: 'Divorce, child custody, and family disputes.',
        imageUrl: '/upload/family-law.jpg'
      }
    ]
  });
  console.log('✅ Services created');

  const allServices = await prisma.service.findMany();

  // 👨‍⚖️ Lawyers seed
  const lawyer1 = await prisma.lawyer.create({
    data: {
      name: 'Adv. Ramesh Kumar',
      title: 'Senior Criminal Lawyer',
      bio: 'Expert in criminal defense and legal advisory.',
      imageUrl: '/upload/ramesh.jpg',
      services: {
        create: [
          {
            service: { connect: { id: allServices[0].id } }
          }
        ]
      }
    }
  });

  const lawyer2 = await prisma.lawyer.create({
    data: {
      name: 'Adv. Priya Singh',
      title: 'Corporate Law Specialist',
      bio: 'Experienced in mergers, acquisitions, and corporate contracts.',
      imageUrl: '/upload/priya.jpg',
      services: {
        create: [
          {
            service: { connect: { id: allServices[1].id } }
          }
        ]
      }
    }
  });
  console.log('✅ Lawyers created');

  // 📰 News seed
  await prisma.news.createMany({
    data: [
      {
        title: 'New Legal Reform Announced',
        description: 'Government introduces new laws to improve justice system.',
        link: 'https://example.com/legal-reform',
        imageUrl: '/upload/news1.jpg'
      },
      {
        title: 'Corporate Law Conference 2025',
        description: 'Annual meet of top corporate lawyers.',
        link: 'https://example.com/corporate-conference',
        imageUrl: '/upload/news2.jpg'
      }
    ]
  });
  console.log('✅ News created');

  // 🧾 Posts seed
  await prisma.post.createMany({
    data: [
      {
        title: 'Understanding Your Legal Rights',
        slug: 'understanding-legal-rights',
        content: 'A guide for citizens to understand their fundamental legal rights.',
        imageUrl: '/upload/post1.jpg'
      },
      {
        title: 'How to Choose the Right Lawyer',
        slug: 'choose-right-lawyer',
        content: 'Tips for finding the best legal representation.',
        imageUrl: '/upload/post2.jpg'
      }
    ]
  });
  console.log('✅ Posts created');

  // 💬 Enquiries seed
  await prisma.enquiry.createMany({
    data: [
      {
        firstName: 'Rahul',
        lastName: 'Verma',
        email: 'rahul.verma@example.com',
        phone: '9876543210',
        message: 'Need legal help for a corporate issue.',
        lawId: allServices[1].id,
        status: 'pending'
      },
      {
        firstName: 'Neha',
        lastName: 'Sharma',
        email: 'neha.sharma@example.com',
        phone: '9876500000',
        message: 'Looking for family law consultation.',
        lawId: allServices[2].id,
        status: 'pending'
      }
    ]
  });
  console.log('✅ Enquiries created');

  // 📢 Media Coverage
  await prisma.mediaCoverage.createMany({
    data: [
      {
        title: 'Law Firm Achieves Top Rating',
        description: 'Our firm was ranked top 5 in India for legal excellence.',
        link: 'https://example.com/achievement'
      },
      {
        title: 'Adv. Ramesh Featured in Times Legal',
        description: 'A feature on notable criminal defense achievements.',
        link: 'https://example.com/ramesh-feature'
      }
    ]
  });
  console.log('✅ Media coverage created');

  // ⚙️ Site Settings
  await prisma.siteSettings.create({
    data: {
      showTeam: true,
      showNews: true,
      showServices: true,
      showBlog: true
    }
  });
  console.log('✅ Site settings created');

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
