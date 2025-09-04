async function testWordPressContent() {
  console.log('Testing WordPress content and meta handling...\n');

  // Test content with embedded image
  const testContent = `
    <h2>Test Content with Image</h2>
    <p>This is a test paragraph.</p>
    <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500" alt="Test Image" />
    <p>This paragraph comes after the image.</p>
  `;

  const testPostData = {
    action: 'create-post',
    postData: {
      title: 'Debug Test Post - Content and Meta',
      content: testContent,
      status: 'draft',
      excerpt: 'Test excerpt for debugging',
      meta: {
        description: 'Test meta description for SEO debugging',
        _yoast_wpseo_metadesc: 'Yoast meta description test',
        _yoast_wpseo_title: 'Yoast title test'
      }
    }
  };

  try {
    console.log('Sending test post data:');
    console.log(JSON.stringify(testPostData, null, 2));
    console.log('\n');

    const response = await fetch('http://localhost:3000/api/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPostData)
    });

    const result = await response.json();
    
    console.log('WordPress API Response:');
    console.log(JSON.stringify(result, null, 2));

    if (result.success) {
      console.log(`\nTest post created with ID: ${result.post.id}`);
      console.log(`View at: ${result.post.url}`);
    } else {
      console.log('\nError creating test post:', result.error);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testWordPressContent();
