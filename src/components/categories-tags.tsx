'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { X, Plus, Tag, Folder } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface TagItem {
  id: number;
  name: string;
  slug: string;
}

interface CategoriesTagsProps {
  selectedCategories: number[];
  selectedTags: string[];
  onCategoriesChange: (categories: number[]) => void;
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
}

export function CategoriesTags({
  selectedCategories,
  selectedTags,
  onCategoriesChange,
  onTagsChange,
  disabled = false
}: CategoriesTagsProps) {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [availableTags, setAvailableTags] = React.useState<TagItem[]>([]);
  const [tagInput, setTagInput] = React.useState('');
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  const [loadingTags, setLoadingTags] = React.useState(true);

  // Load categories and tags from WordPress
  React.useEffect(() => {
    loadCategories();
    loadTags();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/wordpress/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadTags = async () => {
    try {
      const response = await fetch('/api/wordpress/tags');
      const data = await response.json();
      if (data.success) {
        setAvailableTags(data.tags);
      }
    } catch (error) {
      console.error('Failed to load tags:', error);
    } finally {
      setLoadingTags(false);
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    if (disabled) return;
    
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onCategoriesChange(newCategories);
  };

  const handleAddTag = (tagName: string) => {
    if (disabled || !tagName.trim()) return;
    
    const normalizedTag = tagName.trim().toLowerCase();
    if (!selectedTags.some(tag => tag.toLowerCase() === normalizedTag)) {
      onTagsChange([...selectedTags, tagName.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (disabled) return;
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    } else if (e.key === 'Backspace' && !tagInput && selectedTags.length > 0) {
      handleRemoveTag(selectedTags[selectedTags.length - 1]);
    }
  };

  const suggestedTags = availableTags
    .filter(tag => 
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) && 
      !selectedTags.some(selected => selected.toLowerCase() === tag.name.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingCategories ? (
            <div className="text-sm text-muted-foreground">Loading categories...</div>
          ) : (
            <div className="space-y-2">
              {categories.length === 0 ? (
                <div className="text-sm text-muted-foreground">No categories available</div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        disabled={disabled}
                        className="rounded border-input"
                      />
                      <span className="text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selected Tags */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedTags.map(tag => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add tags..."
                value={tagInput}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={disabled}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={() => handleAddTag(tagInput)}
                disabled={disabled || !tagInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Tag Suggestions */}
            {tagInput && suggestedTags.length > 0 && (
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">Suggestions:</div>
                <div className="flex flex-wrap gap-1">
                  {suggestedTags.map(tag => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddTag(tag.name)}
                      disabled={disabled}
                      className="h-6 text-xs"
                    >
                      {tag.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {loadingTags && (
            <div className="text-sm text-muted-foreground">Loading tags...</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
