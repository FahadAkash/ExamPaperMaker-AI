'use client';

import React, { useState, useRef } from 'react';
import { Bold, Italic, Underline, List, Image, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  className?: string;
}

export function RichTextEditor({ content, onChange, onImageUpload, className = '' }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    setIsUploading(true);
    try {
      const imageUrl = await onImageUpload(file);
      execCommand('insertImage', imageUrl);
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file && onImageUpload) {
          handleImageUpload({ target: { files: [file] } } as any);
        }
      }
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg ${className}`}>
      <div className="flex items-center space-x-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('underline')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Insert Image"
          disabled={isUploading || !onImageUpload}
        >
          {isUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
          ) : (
            <Image className="h-4 w-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onPaste={handlePaste}
        className="p-4 min-h-[200px] focus:outline-none"
        style={{ wordBreak: 'break-word' }}
      />
    </div>
  );
}