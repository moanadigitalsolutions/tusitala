import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a default user
  const user = await prisma.user.upsert({
    where: { email: 'creator@tusitala.com' },
    update: {},
    create: {
      email: 'creator@tusitala.com',
      name: 'Content Creator',
      role: 'CREATOR',
    },
  });

  console.log('Created user:', user);

  // Create some channels
  const channels = await Promise.all([
    prisma.channel.upsert({
      where: { id: 'twitter' },
      update: {},
      create: {
        id: 'twitter',
        name: 'Twitter/X',
        type: 'TWITTER',
        config: {
          apiKey: 'placeholder',
          connected: false,
        },
      },
    }),
    prisma.channel.upsert({
      where: { id: 'linkedin' },
      update: {},
      create: {
        id: 'linkedin',
        name: 'LinkedIn',
        type: 'LINKEDIN',
        config: {
          apiKey: 'placeholder',
          connected: false,
        },
      },
    }),
    prisma.channel.upsert({
      where: { id: 'blog' },
      update: {},
      create: {
        id: 'blog',
        name: 'Blog',
        type: 'BLOG',
        config: {
          baseUrl: 'https://example.com/blog',
          connected: true,
        },
      },
    }),
  ]);

  console.log('Created channels:', channels);

  // Create a sample campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: 'welcome-campaign' },
    update: {},
    create: {
      id: 'welcome-campaign',
      name: 'Welcome Campaign',
      objective: 'Introduce new users to the platform',
      ownerId: user.id,
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log('Created campaign:', campaign);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
