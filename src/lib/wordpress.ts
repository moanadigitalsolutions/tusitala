// WordPress REST API integration service
export interface WordPressPost {
  id?: number;
  title: {
    rendered?: string;
    raw?: string;
  };
  content: {
    rendered?: string;
    raw?: string;
  };
  excerpt?: {
    rendered?: string;
    raw?: string;
  };
  status: 'draft' | 'publish' | 'private' | 'pending' | 'future';
  categories?: number[];
  tags?: number[];
  featured_media?: number;
  slug?: string;
  date?: string;
  date_gmt?: string;
  author?: number;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

class WordPressService {
  private baseUrl: string;
  private username: string;
  private appPassword: string;

  constructor() {
    this.baseUrl = process.env.WP_BASE_URL || '';
    this.username = process.env.WP_USERNAME || '';
    this.appPassword = process.env.WP_APP_PASSWORD || '';
  }

  private getAuthHeaders() {
    const credentials = Buffer.from(`${this.username}:${this.appPassword}`).toString('base64');
    return {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    };
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}/wp-json/wp/v2${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Test connection to WordPress
  async testConnection(): Promise<boolean> {
    try {
      await this.makeRequest('/posts?per_page=1');
      return true;
    } catch (error) {
      console.error('WordPress connection test failed:', error);
      return false;
    }
  }

  // Create a new post
  async createPost(post: Omit<WordPressPost, 'id'>): Promise<WordPressPost> {
    return this.makeRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(post),
    });
  }

  // Update an existing post
  async updatePost(id: number, post: Partial<WordPressPost>): Promise<WordPressPost> {
    return this.makeRequest(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(post),
    });
  }

  // Get a post by ID
  async getPost(id: number): Promise<WordPressPost> {
    return this.makeRequest(`/posts/${id}`);
  }

  // Get all posts
  async getPosts(params: {
    page?: number;
    per_page?: number;
    status?: string;
    author?: number;
  } = {}): Promise<WordPressPost[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const endpoint = `/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.makeRequest(endpoint);
  }

  // Delete a post
  async deletePost(id: number, force: boolean = false): Promise<WordPressPost> {
    const endpoint = `/posts/${id}${force ? '?force=true' : ''}`;
    return this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  // Publish a draft post
  async publishPost(id: number): Promise<WordPressPost> {
    return this.updatePost(id, { status: 'publish' });
  }

  // Convert post to draft
  async draftPost(id: number): Promise<WordPressPost> {
    return this.updatePost(id, { status: 'draft' });
  }

  // Upload media file to WordPress
  async uploadMedia(file: File): Promise<{ id: number; url: string; title: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('alt_text', '');

    const url = `${this.baseUrl}/wp-json/wp/v2/media`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${this.username}:${this.appPassword}`).toString('base64')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`WordPress media upload error: ${response.status} - ${errorText}`);
    }

    const mediaData = await response.json();
    
    return {
      id: mediaData.id,
      url: mediaData.source_url,
      title: mediaData.title.rendered,
    };
  }

  // Get media library items
  async getMediaLibrary(page: number = 1, perPage: number = 20): Promise<any[]> {
    return this.makeRequest(`/media?page=${page}&per_page=${perPage}&orderby=date&order=desc`);
  }

  // Delete media item
  async deleteMedia(id: number): Promise<void> {
    await this.makeRequest(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  // Get categories
  async getCategories(): Promise<WordPressCategory[]> {
    return this.makeRequest('/categories?per_page=100&orderby=name&order=asc');
  }

  // Create category
  async createCategory(category: Omit<WordPressCategory, 'id' | 'count'>): Promise<WordPressCategory> {
    return this.makeRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  // Get tags
  async getTags(): Promise<WordPressTag[]> {
    return this.makeRequest('/tags?per_page=100&orderby=name&order=asc');
  }

  // Create tag
  async createTag(tag: Omit<WordPressTag, 'id' | 'count'>): Promise<WordPressTag> {
    return this.makeRequest('/tags', {
      method: 'POST',
      body: JSON.stringify(tag),
    });
  }

  // Create tags from string array (creates new tags if they don't exist)
  async getOrCreateTags(tagNames: string[]): Promise<number[]> {
    if (tagNames.length === 0) return [];

    const existingTags = await this.getTags();
    const tagIds: number[] = [];

    for (const tagName of tagNames) {
      const existingTag = existingTags.find(
        tag => tag.name.toLowerCase() === tagName.toLowerCase()
      );

      if (existingTag) {
        tagIds.push(existingTag.id);
      } else {
        // Create new tag
        try {
          const newTag = await this.createTag({
            name: tagName,
            slug: tagName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: '',
          });
          tagIds.push(newTag.id);
        } catch (error) {
          console.error(`Failed to create tag "${tagName}":`, error);
        }
      }
    }

    return tagIds;
  }
}

export const wordPressService = new WordPressService();
