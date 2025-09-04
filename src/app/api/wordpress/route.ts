import { NextRequest, NextResponse } from 'next/server';
import { wordPressService } from '@/lib/wordpress';

export async function GET() {
  try {
    const isConnected = await wordPressService.testConnection();
    
    if (!isConnected) {
      return NextResponse.json(
        { error: 'Failed to connect to WordPress site' },
        { status: 500 }
      );
    }

    const [posts, categories, tags] = await Promise.all([
      wordPressService.getPosts({ per_page: 10 }),
      wordPressService.getCategories(),
      wordPressService.getTags(),
    ]);

    return NextResponse.json({
      connected: true,
      posts: posts.length,
      categories: categories.length,
      tags: tags.length,
      recentPosts: posts.slice(0, 5).map(post => ({
        id: post.id,
        title: post.title.rendered,
        status: post.status,
        date: post.date,
      })),
    });
  } catch (error) {
    console.error('WordPress status error:', error);
    return NextResponse.json(
      { error: 'Failed to get WordPress status', connected: false },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, postData } = body;

    if (action === 'test-connection') {
      const isConnected = await wordPressService.testConnection();
      return NextResponse.json({ connected: isConnected });
    }

    if (action === 'create-post') {
      const { 
        title, 
        content, 
        status = 'draft', 
        categories = [], 
        tags = [], 
        featured_media,
        excerpt,
        slug,
        meta,
        date
      } = postData;

      if (!title || !content) {
        return NextResponse.json(
          { error: 'Title and content are required' },
          { status: 400 }
        );
      }

      // Handle tag names - convert to tag IDs if they're strings
      let tagIds = tags;
      if (tags.length > 0 && typeof tags[0] === 'string') {
        tagIds = await wordPressService.getOrCreateTags(tags);
      }

      const postPayload: any = {
        title: { raw: title },
        content: { raw: content },
        status,
        categories,
        tags: tagIds,
        featured_media,
      };

      // Add optional fields only if they exist
      if (excerpt) {
        postPayload.excerpt = { raw: excerpt };
      }
      if (slug) {
        postPayload.slug = slug;
      }
      if (meta) {
        postPayload.meta = meta;
      }
      if (date) {
        postPayload.date = date;
      }

      const wpPost = await wordPressService.createPost(postPayload);

      return NextResponse.json({
        success: true,
        post: {
          id: wpPost.id,
          title: wpPost.title.rendered,
          status: wpPost.status,
          url: `${process.env.WP_BASE_URL}/?p=${wpPost.id}`,
        },
      });
    }

    if (action === 'upload-media') {
      // This will be handled by a separate multipart form endpoint
      return NextResponse.json(
        { error: 'Use /api/wordpress/media for file uploads' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('WordPress API error:', error);
    return NextResponse.json(
      { error: 'WordPress operation failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
