'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  ImageIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Type,
  Minus,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function ContentEditor({ content, onChange, placeholder = "Start writing...", className }: ContentEditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [isPreview, setIsPreview] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Get selection and insert markdown
  const insertMarkdown = React.useCallback((before: string, after: string, placeholder: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = selectedText || placeholder;
    
    const newContent = 
      content.substring(0, start) + 
      before + replacement + after + 
      content.substring(end);
    
    onChange(newContent);
    
    // Set cursor position
    setTimeout(() => {
      const newPosition = start + before.length + replacement.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  }, [content, onChange]);

  // Insert link
  const insertLink = React.useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    
    const url = prompt('Enter URL:', 'https://');
    if (!url) return;
    
    const linkText = selectedText || 'link text';
    const replacement = `[${linkText}](${url})`;
    
    const newContent = 
      content.substring(0, start) + 
      replacement + 
      content.substring(end);
    
    onChange(newContent);
    
    setTimeout(() => {
      const newPosition = start + replacement.length;
      textarea.setSelectionRange(newPosition, newPosition);
      textarea.focus();
    }, 0);
  }, [content, onChange]);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current && !isPreview) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content, isPreview]);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            insertMarkdown('**', '**', 'bold text');
            break;
          case 'i':
            e.preventDefault();
            insertMarkdown('*', '*', 'italic text');
            break;
          case 'u':
            e.preventDefault();
            insertMarkdown('<u>', '</u>', 'underlined text');
            break;
          case 'k':
            e.preventDefault();
            insertLink();
            break;
          case '`':
            e.preventDefault();
            insertMarkdown('`', '`', 'code');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [insertMarkdown, insertLink]);

  // Insert header
  const insertHeader = (level: number) => {
    const hashes = '#'.repeat(level);
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = content.indexOf('\n', start);
    const currentLine = content.substring(lineStart, lineEnd === -1 ? content.length : lineEnd);
    
    // Remove existing header if present
    const cleanLine = currentLine.replace(/^#+\s*/, '');
    const newLine = `${hashes} ${cleanLine || `Heading ${level}`}`;
    
    const newContent = 
      content.substring(0, lineStart) + 
      newLine + 
      content.substring(lineEnd === -1 ? content.length : lineEnd);
    
    onChange(newContent);
    
    setTimeout(() => {
      textarea.setSelectionRange(lineStart + newLine.length, lineStart + newLine.length);
      textarea.focus();
    }, 0);
  };

  // Insert list
  const insertList = (ordered: boolean = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf('\n', start - 1) + 1;
    const prefix = ordered ? '1. ' : '- ';
    
    const newContent = 
      content.substring(0, lineStart) + 
      prefix + 
      content.substring(lineStart);
    
    onChange(newContent);
    
    setTimeout(() => {
      textarea.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length);
      textarea.focus();
    }, 0);
  };

  // Calculate reading time (average 200 words per minute)
  const calculateReadingTime = () => {
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    const minutes = Math.ceil(words / 200);
    return minutes;
  };

  // Calculate statistics
  const getStatistics = () => {
    const characters = content.length;
    const words = content.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
    const readingTime = calculateReadingTime();
    
    return { characters, words, sentences, paragraphs, readingTime };
  };

  // Convert markdown to HTML for preview (basic)
  const markdownToHtml = (markdown: string) => {
    return markdown
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/^- (.*$)/gm, '<ul><li>$1</li></ul>')
      .replace(/^\d+\. (.*$)/gm, '<ol><li>$1</li></ol>')
      .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
      .replace(/\n/g, '<br>');
  };

  const stats = getStatistics();

  return (
    <div className={cn("border rounded-lg", isFullscreen && "fixed inset-0 z-50 bg-background", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('**', '**', 'bold text')}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('*', '*', 'italic text')}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('<u>', '</u>', 'underlined text')}
          title="Underline (Ctrl+U)"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('`', '`', 'code')}
          title="Inline Code (Ctrl+`)"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        {/* Headers */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertHeader(1)}
          title="Heading 1"
        >
          H1
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertHeader(2)}
          title="Heading 2"
        >
          H2
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertHeader(3)}
          title="Heading 3"
        >
          H3
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        {/* Lists & Content */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertList(false)}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertList(true)}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('> ', '', 'blockquote')}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('---\n', '\n', '')}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        {/* Media & Links */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={insertLink}
          title="Insert Link (Ctrl+K)"
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => insertMarkdown('![alt text](', ')', 'image-url')}
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        
        <div className="flex-1" />
        
        {/* View Controls */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => setIsPreview(!isPreview)}
          title={isPreview ? "Edit Mode" : "Preview Mode"}
        >
          {isPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        >
          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Editor */}
      <div className="relative">
        {isPreview ? (
          <div 
            className="w-full p-4 min-h-[200px] prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 resize-none border-0 outline-none focus:ring-0 min-h-[200px] bg-transparent"
            style={{ overflow: 'hidden' }}
          />
        )}
      </div>
      
      {/* Footer */}
      <div className="border-t p-2 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>{stats.characters} characters</span>
          <span>{stats.words} words</span>
          <span>{stats.sentences} sentences</span>
          <span>{stats.paragraphs} paragraphs</span>
        </div>
        <div className="flex items-center gap-4">
          <span>{stats.readingTime} min read</span>
          <span className="text-xs opacity-60">
            Ctrl+B, Ctrl+I, Ctrl+K shortcuts available
          </span>
        </div>
      </div>
    </div>
  );
}
