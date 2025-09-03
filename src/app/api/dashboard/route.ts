import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get counts for dashboard stats
    const [
      totalPosts,
      activeCampaigns,
      scheduledPosts,
      publishedPosts,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.campaign.count({
        where: {
          AND: [
            { startsAt: { lte: new Date() } },
            { OR: [{ endsAt: null }, { endsAt: { gte: new Date() } }] },
          ],
        },
      }),
      prisma.post.count({
        where: { status: 'SCHEDULED' },
      }),
      prisma.post.count({
        where: { status: 'PUBLISHED' },
      }),
    ]);

    // Get recent posts
    const recentPosts = await prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json({
      stats: {
        totalPosts,
        activeCampaigns,
        scheduledPosts,
        publishedPosts,
      },
      recentPosts,
    });
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}
