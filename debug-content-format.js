// Debug script to test content format and WordPress API
const { marked } = require('marked');

// Sample content that mimics what Tiptap might generate
const testMarkdownContent = `## Testing WordPress Integration

This is a comprehensive test to verify that both **embedded images** and **meta descriptions** are properly transferred to WordPress.

### Image Testing

First, let me add some text before the image. This paragraph demonstrates that our content includes rich formatting with bold text and proper headings.

Next, I'll insert an image to test if it appears correctly in WordPress:

![Test Image](https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop)

The image above should appear correctly in WordPress with proper formatting.`;

// Alternative HTML content (what Tiptap actually might store)
const testHtmlContent = `<h2>Testing WordPress Integration</h2>

<p>This is a comprehensive test to verify that both <strong>embedded images</strong> and <strong>meta descriptions</strong> are properly transferred to WordPress.</p>

<h3>Image Testing</h3>

<p>First, let me add some text before the image. This paragraph demonstrates that our content includes rich formatting with bold text and proper headings.</p>

<p>Next, I'll insert an image to test if it appears correctly in WordPress:</p>

<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop" alt="Test Image" class="max-w-full h-auto rounded">

<p>The image above should appear correctly in WordPress with proper formatting.</p>`;

console.log('=== MARKDOWN CONTENT ===');
console.log(testMarkdownContent);
console.log('\n=== CONVERTED TO HTML (using marked) ===');

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

const convertedHtml = marked(testMarkdownContent);
console.log(convertedHtml);

console.log('\n=== DIRECT HTML CONTENT ===');
console.log(testHtmlContent);

console.log('\n=== TESTING BOTH FORMATS ===');

async function testWordPressContent() {
  const testData = [
    {
      title: 'Test 1 - Markdown Converted',
      content: convertedHtml
    },
    {
      title: 'Test 2 - Direct HTML',
      content: testHtmlContent
    }
  ];

  for (const test of testData) {
    console.log(`\n--- ${test.title} ---`);
    console.log('Content length:', test.content.length);
    console.log('Contains img tag:', test.content.includes('<img'));
    console.log('Image src:', test.content.match(/src="([^"]+)"/)?.[1] || 'NOT FOUND');
    
    // Test WordPress API call
    try {
      const response = await fetch('http://localhost:3000/api/wordpress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create-post',
          postData: {
            title: test.title,
            content: test.content,
            status: 'draft'
          }
        })
      });

      const result = await response.json();
      console.log('WordPress API Result:', result.success ? 'SUCCESS' : 'FAILED');
      if (result.post) {
        console.log('Post ID:', result.post.id);
        console.log('Post URL:', result.post.url);
      }
      if (result.error) {
        console.log('Error:', result.error);
      }
    } catch (error) {
      console.log('API Error:', error.message);
    }
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testWordPressContent().catch(console.error);
}
