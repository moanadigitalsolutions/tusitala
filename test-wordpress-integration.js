// Test WordPress posting functionality
// Run this with: node test-wordpress-post.js

const http = require('http');

const testPost = {
  action: "create-post",
  postData: {
    title: "Test Post from Tusitala Platform",
    content: `
      <h2>Welcome to My Test Post</h2>
      <p>This is a <strong>test post</strong> created using the <em>Tusitala content creator platform</em>. The post includes:</p>
      <ul>
        <li>Rich text formatting with the WYSIWYG editor</li>
        <li>WordPress REST API integration</li>
        <li>Category and tag support</li>
        <li>SEO fields integration</li>
      </ul>
      <p>This demonstrates the full content creation workflow from the Tusitala platform to WordPress!</p>
      <blockquote>
        <p>"Content is king, but engagement is queen, and the lady rules the house!" - Mari Smith</p>
      </blockquote>
    `,
    status: "draft",
    categories: [],
    tags: ["test", "tusitala", "content-creation", "wordpress-integration"],
    excerpt: "A test post demonstrating the Tusitala platform's WordPress integration capabilities and WYSIWYG editor functionality.",
    slug: "test-post-tusitala-platform-" + Date.now()
  }
};

function makeRequest(path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: data ? 'POST' : 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(body);
          resolve({ ok: res.statusCode === 200, data: result });
        } catch (e) {
          resolve({ ok: false, data: { error: 'Invalid JSON response' } });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testWordPressPost() {
  try {
    console.log('🚀 Testing WordPress integration...');
    console.log('📝 Post data:', JSON.stringify(testPost, null, 2));
    
    const response = await makeRequest('/api/wordpress', testPost);
    
    if (response.ok) {
      console.log('✅ SUCCESS! Post created in WordPress:');
      console.log('📄 Post ID:', response.data.post?.id);
      console.log('🔗 Post URL:', response.data.post?.link);
      console.log('📊 Status:', response.data.post?.status);
      console.log('🏷️ Categories:', response.data.post?.categories);
      console.log('🏷️ Tags:', response.data.post?.tags);
    } else {
      console.log('❌ ERROR:', response.data.error || 'Unknown error');
      console.log('📋 Full response:', response.data);
    }
    
  } catch (error) {
    console.log('💥 NETWORK ERROR:', error.message);
    console.log('🔧 Make sure the development server is running on http://localhost:3000');
  }
}

// Also test connection
async function testConnection() {
  try {
    console.log('🔌 Testing WordPress connection...');
    
    const response = await makeRequest('/api/wordpress', { action: 'test-connection' });
    
    if (response.data.connected) {
      console.log('✅ WordPress connection successful!');
      return true;
    } else {
      console.log('❌ WordPress connection failed');
      return false;
    }
  } catch (error) {
    console.log('💥 Connection test failed:', error.message);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('🎯 TUSITALA WORDPRESS INTEGRATION TEST');
  console.log('=====================================');
  
  const isConnected = await testConnection();
  
  if (isConnected) {
    console.log('');
    await testWordPressPost();
  } else {
    console.log('⚠️  Skipping post creation test due to connection failure');
    console.log('💡 Please check your WordPress credentials in .env file');
  }
}

runTests();
