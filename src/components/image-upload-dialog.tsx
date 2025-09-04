'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ImageIcon, Upload, ExternalLink, Eye, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageData {
  id: string;
  url: string;
  filename: string;
  originalName: string;
  size: number;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  createdAt?: string;
}

interface ImageUploadDialogProps {
  onImageSelect: (imageData: { src: string; alt?: string; title?: string }) => void;
  userId: string; // In real app, get from auth context
  isOpen: boolean;
  onClose: () => void;
}

export function ImageUploadDialog({ onImageSelect, userId, isOpen, onClose }: ImageUploadDialogProps) {
  const [activeTab, setActiveTab] = React.useState('upload');
  const [uploading, setUploading] = React.useState(false);
  const [urlInput, setUrlInput] = React.useState('');
  const [altTextInput, setAltTextInput] = React.useState('');
  const [captionInput, setCaptionInput] = React.useState('');
  const [images, setImages] = React.useState<ImageData[]>([]);
  const [loadingImages, setLoadingImages] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const loadImages = React.useCallback(async () => {
    setLoadingImages(true);
    try {
      const response = await fetch(`/api/images/upload?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setImages(data.images || []);
      }
    } catch (error) {
      console.error('Error loading images:', error);
    } finally {
      setLoadingImages(false);
    }
  }, [userId]);

  // Load user's uploaded images when dialog opens
  React.useEffect(() => {
    if (isOpen && activeTab === 'library') {
      loadImages();
    }
  }, [isOpen, activeTab, loadImages]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('altText', altTextInput);
      formData.append('caption', captionInput);

      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageData = await response.json();
        
        // Insert image into editor
        onImageSelect({
          src: imageData.url,
          alt: imageData.altText || imageData.originalName,
          title: imageData.caption || undefined,
        });

        // Reset form and close dialog
        setAltTextInput('');
        setCaptionInput('');
        onClose();
        
        // Refresh image library
        if (activeTab === 'library') {
          loadImages();
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleUrlInsert = () => {
    if (!urlInput.trim()) return;
    
    onImageSelect({
      src: urlInput.trim(),
      alt: altTextInput.trim() || undefined,
      title: captionInput.trim() || undefined,
    });
    
    setUrlInput('');
    setAltTextInput('');
    setCaptionInput('');
    onClose();
  };

  const handleLibrarySelect = (image: ImageData) => {
    onImageSelect({
      src: image.url,
      alt: image.altText || image.originalName,
      title: image.caption || undefined,
    });
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Insert Image</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex border-b mb-6">
            <button
              className={cn(
                "px-4 py-2 border-b-2 transition-colors",
                activeTab === 'upload' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('upload')}
            >
              Upload
            </button>
            <button
              className={cn(
                "px-4 py-2 border-b-2 transition-colors",
                activeTab === 'url' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('url')}
            >
              URL
            </button>
            <button
              className={cn(
                "px-4 py-2 border-b-2 transition-colors",
                activeTab === 'library' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
              onClick={() => setActiveTab('library')}
            >
              Library
            </button>
          </div>
          
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  "hover:border-primary/50 hover:bg-accent/50",
                  uploading && "opacity-50 pointer-events-none"
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">
                    Drag and drop an image here, or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPEG, PNG, WebP, and GIF up to 10MB
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Choose File'}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="alt-text">Alt Text</Label>
                  <Input
                    id="alt-text"
                    placeholder="Describe the image for accessibility"
                    value={altTextInput}
                    onChange={(e) => setAltTextInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caption">Caption (Optional)</Label>
                  <Input
                    id="caption"
                    placeholder="Image caption or title"
                    value={captionInput}
                    onChange={(e) => setCaptionInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* URL Tab */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-url">Image URL</Label>
                <Input
                  id="image-url"
                  placeholder="https://example.com/image.jpg"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="url-alt-text">Alt Text</Label>
                  <Input
                    id="url-alt-text"
                    placeholder="Describe the image for accessibility"
                    value={altTextInput}
                    onChange={(e) => setAltTextInput(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url-caption">Caption (Optional)</Label>
                  <Input
                    id="url-caption"
                    placeholder="Image caption or title"
                    value={captionInput}
                    onChange={(e) => setCaptionInput(e.target.value)}
                  />
                </div>
              </div>
              
              {urlInput && (
                <div className="border rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                  <Image
                    src={urlInput}
                    alt="Preview"
                    width={300}
                    height={200}
                    className="max-w-full max-h-48 object-contain rounded"
                    onError={() => {}}
                  />
                </div>
              )}
              
              <Button
                onClick={handleUrlInsert}
                disabled={!urlInput.trim()}
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Insert Image
              </Button>
            </div>
          )}
          
          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="space-y-4">
              {loadingImages ? (
                <div className="text-center py-8">
                  <p>Loading images...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No images uploaded yet</p>
                  <p className="text-sm">Upload some images to build your library</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleLibrarySelect(image)}
                    >
                      <div className="aspect-square bg-gray-100">
                        <Image
                          src={image.url}
                          alt={image.altText || image.originalName}
                          width={200}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-xs font-medium truncate" title={image.originalName}>
                          {image.originalName}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatFileSize(image.size)}
                          </Badge>
                          {image.width && image.height && (
                            <span className="text-xs text-muted-foreground">
                              {image.width}×{image.height}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4 mr-2" />
                          Select
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
