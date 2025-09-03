import { NextRequest, NextResponse } from 'next/server';
import { wordPressService } from '@/lib/wordpress';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Only image files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    const mediaData = await wordPressService.uploadMedia(file);

    return NextResponse.json({
      success: true,
      media: mediaData,
    });
  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload media to WordPress', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('per_page') || '20');

    const media = await wordPressService.getMediaLibrary(page, perPage);

    return NextResponse.json({
      success: true,
      media: media.map(item => ({
        id: item.id,
        url: item.source_url,
        title: item.title.rendered,
        alt: item.alt_text,
        caption: item.caption.rendered,
        date: item.date,
        mime_type: item.mime_type,
      })),
    });
  } catch (error) {
    console.error('Media library error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch media library', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
