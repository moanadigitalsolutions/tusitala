import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const altText = data.get('altText') as string;
    const caption = data.get('caption') as string;
    const userId = data.get('userId') as string; // In real app, get from session/auth

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = path.extname(file.name);
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    
    // Create user-specific directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'temp', userId);
    
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const relativePath = `/uploads/temp/${userId}/${filename}`;

    // Get image dimensions using sharp
    let width: number | undefined;
    let height: number | undefined;
    
    try {
      const metadata = await sharp(buffer).metadata();
      width = metadata.width;
      height = metadata.height;
    } catch (error) {
      console.warn('Could not get image dimensions:', error);
    }

    // Save file to disk
    await writeFile(filePath, buffer);

    // Save metadata to database
    const imageRecord = await prisma.image.create({
      data: {
        filename,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        width,
        height,
        altText: altText || null,
        caption: caption || null,
        filePath: relativePath,
        uploadedById: userId,
      },
    });

    return NextResponse.json({
      id: imageRecord.id,
      url: relativePath,
      filename: imageRecord.filename,
      originalName: imageRecord.originalName,
      size: imageRecord.size,
      width: imageRecord.width,
      height: imageRecord.height,
      altText: imageRecord.altText,
      caption: imageRecord.caption,
    });

  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      error: 'Failed to upload image' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const images = await prisma.image.findMany({
      where: {
        uploadedById: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        filename: true,
        originalName: true,
        filePath: true,
        size: true,
        width: true,
        height: true,
        altText: true,
        caption: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ images });

  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch images' 
    }, { status: 500 });
  }
}
