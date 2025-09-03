import { NextRequest, NextResponse } from 'next/server';
import { wordPressService } from '@/lib/wordpress';

export async function GET() {
  try {
    const categories = await wordPressService.getCategories();

    return NextResponse.json({
      success: true,
      categories: categories.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        count: cat.count,
      })),
    });
  } catch (error) {
    console.error('Categories fetch error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch categories from WordPress', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description = '', slug, parent = 0 } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    const category = await wordPressService.createCategory({
      name,
      description,
      slug,
      parent,
    });

    return NextResponse.json({
      success: true,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
    });
  } catch (error) {
    console.error('Category creation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create category', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
