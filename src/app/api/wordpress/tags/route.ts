import { NextRequest, NextResponse } from 'next/server';
import { wordPressService } from '@/lib/wordpress';

export async function GET() {
  try {
    const tags = await wordPressService.getTags();

    return NextResponse.json({
      success: true,
      tags: tags.map((tag: any) => ({
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
        count: tag.count,
      })),
    });
  } catch (error) {
    console.error('Tags fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch tags from WordPress', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description = '', slug } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }

    const tag = await wordPressService.createTag({
      name,
      description,
      slug,
    });

    return NextResponse.json({
      success: true,
      tag: {
        id: tag.id,
        name: tag.name,
        slug: tag.slug,
        description: tag.description,
      },
    });
  } catch (error) {
    console.error('Tag creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create tag', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
