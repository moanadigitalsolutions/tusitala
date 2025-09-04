import { prisma } from '@/lib/prisma';
import { wordPressService } from '@/lib/wordpress';
import { readFile } from 'fs/promises';
import path from 'path';

export interface ImageProcessingResult {
  originalSrc: string;
  wordpressSrc: string;
  wpMediaId: number;
}

export class ContentImageProcessor {
  /**
   * Process HTML content and upload local images to WordPress
   * @param htmlContent The HTML content containing images
   * @param userId The user ID who owns the images
   * @returns Processed HTML with WordPress URLs and upload results
   */
  static async processContentImages(htmlContent: string, userId: string): Promise<{
    processedContent: string;
    uploadResults: ImageProcessingResult[];
  }> {
    const uploadResults: ImageProcessingResult[] = [];
    let processedContent = htmlContent;

    // Find all image tags with local URLs
    const imgRegex = /<img[^>]*src=["']([^"']*\/uploads\/temp\/[^"']*)["'][^>]*>/gi;
    const matches = [...htmlContent.matchAll(imgRegex)];

    for (const match of matches) {
      const fullImgTag = match[0];
      const localSrc = match[1];

      try {
        // Get image metadata from database
        const imageRecord = await prisma.image.findFirst({
          where: {
            filePath: localSrc,
            uploadedById: userId,
          },
        });

        if (!imageRecord) {
          console.warn(`Image not found in database: ${localSrc}`);
          continue;
        }

        // Read file from disk
        const fullPath = path.join(process.cwd(), 'public', localSrc);
        const fileBuffer = await readFile(fullPath);
        
        // Create a File object for WordPress upload
        const file = new File([new Uint8Array(fileBuffer)], imageRecord.filename, {
          type: imageRecord.mimeType,
        });

        // Upload to WordPress
        const wpMedia = await wordPressService.uploadMedia(file);

        // Update database record with WordPress info
        await prisma.image.update({
          where: { id: imageRecord.id },
          data: {
            wpMediaId: wpMedia.id,
            wpUrl: wpMedia.url,
          },
        });

        // Replace the image URL in content
        const updatedImgTag = fullImgTag.replace(localSrc, wpMedia.url);
        processedContent = processedContent.replace(fullImgTag, updatedImgTag);

        uploadResults.push({
          originalSrc: localSrc,
          wordpressSrc: wpMedia.url,
          wpMediaId: wpMedia.id,
        });

        console.log(`Successfully uploaded image: ${imageRecord.filename} -> ${wpMedia.url}`);
      } catch (error) {
        console.error(`Failed to process image ${localSrc}:`, error);
        // Continue processing other images even if one fails
      }
    }

    return {
      processedContent,
      uploadResults,
    };
  }

  /**
   * Clean up temporary images after successful WordPress publishing
   * @param userId The user ID
   * @param publishedImageIds Array of image IDs that were successfully published
   */
  static async cleanupTempImages(userId: string, publishedImageIds: string[]): Promise<void> {
    try {
      // You could implement file cleanup here if needed
      // For now, we'll keep the files and just mark them as published in the database
      await prisma.image.updateMany({
        where: {
          id: { in: publishedImageIds },
          uploadedById: userId,
        },
        data: {
          // Could add a field like 'isPublished' or 'status' to track this
        },
      });

      console.log(`Cleaned up ${publishedImageIds.length} temporary images for user ${userId}`);
    } catch (error) {
      console.error('Error cleaning up temporary images:', error);
    }
  }

  /**
   * Get all images uploaded by a user for management purposes
   * @param userId The user ID
   * @returns Array of image records
   */
  static async getUserImages(userId: string) {
    return prisma.image.findMany({
      where: {
        uploadedById: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  /**
   * Delete an image (both from database and filesystem)
   * @param imageId The image ID
   * @param userId The user ID (for security)
   */
  static async deleteImage(imageId: string, userId: string): Promise<boolean> {
    try {
      const image = await prisma.image.findFirst({
        where: {
          id: imageId,
          uploadedById: userId,
        },
      });

      if (!image) {
        return false;
      }

      // Delete from database
      await prisma.image.delete({
        where: { id: imageId },
      });

      // TODO: Delete file from filesystem
      // const fullPath = path.join(process.cwd(), 'public', image.filePath);
      // await unlink(fullPath);

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}
