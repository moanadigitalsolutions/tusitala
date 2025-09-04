# Image Upload Feature Documentation

## Overview

The enhanced content editor now supports local image uploads with automatic WordPress integration. This feature allows users to upload images locally during content creation and automatically transfers them to WordPress when publishing.

## Architecture

### Hybrid Storage Approach
- **During Editing**: Images stored locally in `/public/uploads/temp/` with metadata in PostgreSQL
- **During Publishing**: Images automatically uploaded to WordPress media library
- **After Publishing**: Local images can be cleaned up (optional)

### Database Schema

```sql
-- Image metadata table
CREATE TABLE "Image" (
  id            String   PRIMARY KEY DEFAULT cuid(),
  filename      String   NOT NULL,
  originalName  String   NOT NULL,
  mimeType      String   NOT NULL,
  size          Int      NOT NULL,
  width         Int      NULL,
  height        Int      NULL,
  altText       String   NULL,
  caption       String   NULL,
  filePath      String   NOT NULL, -- Local file path during editing
  wpMediaId     Int      NULL,     -- WordPress media ID when published
  wpUrl         String   NULL,     -- WordPress media URL
  uploadedBy    String   NOT NULL, -- User ID
  createdAt     DateTime DEFAULT now(),
  updatedAt     DateTime DEFAULT now()
);
```

## Features

### 1. Multiple Upload Methods
- **Drag & Drop**: Drag images directly into the upload area
- **File Browser**: Click to browse and select files
- **URL Import**: Insert images from external URLs
- **Image Library**: Select from previously uploaded images

### 2. Image Processing
- **Format Support**: JPEG, PNG, WebP, GIF
- **Size Limits**: Maximum 10MB per file
- **Automatic Optimization**: Uses Sharp for image processing
- **Metadata Extraction**: Automatically extracts dimensions

### 3. WordPress Integration
- **Automatic Upload**: Local images uploaded to WordPress on publish
- **URL Replacement**: Content URLs updated to WordPress media URLs
- **Media Library**: Images appear in WordPress media library
- **SEO Optimization**: Alt text and captions preserved

## Usage

### For Users

1. **Upload Image**: Click image button (📷) in editor toolbar
2. **Choose Method**: Select Upload, URL, or Library tab
3. **Add Metadata**: Include alt text (required for accessibility) and optional caption
4. **Insert**: Image appears in content with local URL
5. **Publish**: Local images automatically uploaded to WordPress

### For Developers

#### Basic Implementation

```tsx
import { ContentEditor } from '@/components/content-editor';
import { WordPressPublisher } from '@/components/wordpress-publisher';

function MyEditor() {
  const [content, setContent] = useState('');
  
  return (
    <>
      <ContentEditor
        content={content}
        onChange={setContent}
        userId="user-123" // User ID for image ownership
      />
      
      <WordPressPublisher
        title="My Post"
        content={content}
        userId="user-123" // Same user ID for image processing
        onPublishSuccess={(result) => console.log('Published:', result)}
      />
    </>
  );
}
```

#### API Endpoints

- `POST /api/images/upload` - Upload local images
- `GET /api/images/upload?userId=xxx` - Get user's images
- `POST /api/wordpress` - Publish with image processing

## File Structure

```
src/
├── components/
│   ├── content-editor.tsx          # Enhanced TipTap editor
│   ├── image-upload-dialog.tsx     # Image upload interface
│   └── wordpress-publisher.tsx     # Enhanced publisher
├── lib/
│   └── content-image-processor.ts  # Image processing utilities
├── app/
│   ├── api/
│   │   ├── images/upload/route.ts  # Image upload API
│   │   └── wordpress/route.ts      # Enhanced WordPress API
│   └── demo/image-upload/page.tsx  # Demo page
└── public/uploads/temp/            # Temporary image storage
```

## Configuration

### Environment Variables

```env
# WordPress Configuration
WP_BASE_URL=https://your-wordpress-site.com
WP_USERNAME=your-username
WP_APP_PASSWORD=your-app-password

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/tusitala
```

### Dependencies

```json
{
  "dependencies": {
    "sharp": "^0.33.0",      // Image processing
    "@prisma/client": "^5.0.0", // Database ORM
    "next": "^14.2.5"       // Framework
  }
}
```

## Security Considerations

### File Upload Security
- **File Type Validation**: Only allows image formats
- **Size Limits**: Maximum 10MB per file
- **User Isolation**: Files isolated by user ID
- **Path Sanitization**: Prevents directory traversal

### Database Security
- **User Ownership**: Images linked to specific users
- **Access Control**: Users can only access their own images
- **Input Validation**: All inputs validated before database storage

### WordPress Security
- **Authentication**: Uses WordPress Application Passwords
- **API Validation**: WordPress validates all uploads
- **Media Library**: Images follow WordPress security policies

## Performance Considerations

### Image Optimization
- **Sharp Processing**: Fast, memory-efficient image processing
- **Lazy Loading**: Images loaded on demand in library
- **Chunked Uploads**: Large files handled efficiently

### Database Performance
- **Indexed Queries**: User ID and WordPress media ID indexed
- **Metadata Only**: No binary data stored in database
- **Efficient Queries**: Optimized for common operations

### Storage Management
- **Temporary Files**: Local storage for editing phase only
- **Cleanup Options**: Can remove local files after publishing
- **WordPress Storage**: Final storage in WordPress media library

## Error Handling

### Upload Errors
- **File Too Large**: Clear error message with size limit
- **Invalid Format**: List of supported formats
- **Network Issues**: Retry mechanisms for uploads
- **Disk Space**: Graceful handling of storage limits

### WordPress Errors
- **Connection Issues**: Clear error messages
- **Authentication**: Helpful troubleshooting info
- **Upload Failures**: Continue with original URLs if needed
- **Partial Success**: Report which images succeeded/failed

## Testing

### Demo Page
Visit `/demo/image-upload` to test all features:
- Upload different image formats
- Test drag & drop functionality
- Verify WordPress publishing
- Check image library management

### API Testing
```bash
# Upload image
curl -X POST http://localhost:3000/api/images/upload \
  -F "file=@test-image.jpg" \
  -F "userId=test-user" \
  -F "altText=Test image"

# Get user images
curl "http://localhost:3000/api/images/upload?userId=test-user"
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and DATABASE_URL is correct
2. **Prisma Setup**: Run `npx prisma generate` and `npx prisma db push`
3. **WordPress Connection**: Verify WP_BASE_URL, WP_USERNAME, and WP_APP_PASSWORD
4. **File Permissions**: Ensure write access to `public/uploads/temp/`
5. **Sharp Installation**: Some systems may need platform-specific Sharp builds

### Debug Mode
Enable debug logging by setting environment variable:
```env
DEBUG_IMAGE_UPLOADS=true
```

## Future Enhancements

### Planned Features
- **Image Editing**: Basic crop/resize functionality
- **Cloud Storage**: Optional AWS S3/Cloudinary integration
- **Image Optimization**: WebP conversion, responsive images
- **Bulk Operations**: Multi-image upload and management
- **Analytics**: Image usage tracking and optimization suggestions

### API Extensions
- **Batch Upload**: Upload multiple images simultaneously
- **Image Variants**: Generate different sizes automatically
- **CDN Integration**: Automatic CDN deployment
- **Backup System**: Automated image backup solutions

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review console logs for error details
3. Test with the demo page first
4. Verify WordPress configuration
5. Check database connectivity

## License

This image upload feature is part of the Tusitala content creation platform and follows the same licensing terms as the main project.
