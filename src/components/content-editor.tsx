'use client';

import * as React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  ImageIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Code,
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
  const [isPreview, setIsPreview] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: content || '<p></p>',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none p-4 min-h-[200px]',
      },
    },
  });

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || '<p></p>');
    }
  }, [content, editor]);

  // Toolbar button functions
  const toggleBold = () => editor?.chain().focus().toggleBold().run();
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run();
  const toggleCode = () => editor?.chain().focus().toggleCode().run();
  const insertLink = () => {
    const url = window.prompt('Enter URL:', 'https://');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };
  const insertImage = () => {
    const url = window.prompt('Enter image URL:', 'https://');
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  };
  const setHeading = (level: 1 | 2 | 3) => {
    editor?.chain().focus().toggleHeading({ level }).run();
  };
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const insertHorizontalRule = () => editor?.chain().focus().setHorizontalRule().run();

  // Calculate statistics
  const getStatistics = () => {
    // Extract text content from HTML for accurate statistics
    const textContent = content.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    const characters = textContent.length;
    const words = textContent.split(/\s+/).filter(word => word.length > 0).length;
    const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const paragraphs = content.split(/<\/p>|<br\s*\/?>/i).filter(p => p.replace(/<[^>]*>/g, '').trim().length > 0).length;
    const readingTime = Math.ceil(words / 200);
    
    return { characters, words, sentences, paragraphs, readingTime };
  };

  const stats = getStatistics();

  if (!editor) {
    return <div className="p-4">Loading editor...</div>;
  }

  return (
    <div className={cn("border rounded-lg", isFullscreen && "fixed inset-0 z-50 bg-background", className)}>
      {/* Toolbar */}
      <div className="border-b p-2 flex items-center gap-1 flex-wrap">
        {/* Text Formatting */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={toggleBold}
          className={editor.isActive('bold') ? 'bg-accent' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={toggleItalic}
          className={editor.isActive('italic') ? 'bg-accent' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={toggleCode}
          className={editor.isActive('code') ? 'bg-accent' : ''}
          title="Inline Code"
        >
          <Code className="h-4 w-4" />
        </Button>
        
        <div className="h-4 w-px bg-border mx-1" />
        
        {/* Headers */}
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => setHeading(1)}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''}
          title="Heading 1"
        >
          H1
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => setHeading(2)}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''}
          title="Heading 2"
        >
          H2
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={() => setHeading(3)}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''}
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
          onClick={toggleBulletList}
          className={editor.isActive('bulletList') ? 'bg-accent' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={toggleOrderedList}
          className={editor.isActive('orderedList') ? 'bg-accent' : ''}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={toggleBlockquote}
          className={editor.isActive('blockquote') ? 'bg-accent' : ''}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={insertHorizontalRule}
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
          className={editor.isActive('link') ? 'bg-accent' : ''}
          title="Insert Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          type="button"
          onClick={insertImage}
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
            dangerouslySetInnerHTML={{ __html: content || '<p>No content</p>' }}
          />
        ) : (
          <EditorContent editor={editor} />
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
            WYSIWYG Rich Text Editor
          </span>
        </div>
      </div>
    </div>
  );
}