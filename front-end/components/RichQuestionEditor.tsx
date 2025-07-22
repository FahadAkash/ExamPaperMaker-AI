'use client';

import React, { useState } from 'react';
import { Bold, Italic, List, Code, Type, Wand2 } from 'lucide-react';

interface RichQuestionEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export function RichQuestionEditor({ value, onChange, onSubmit, isLoading, disabled }: RichQuestionEditorProps) {
  const [isFormatting, setIsFormatting] = useState(false);

  const formatText = (prefix: string, suffix: string = '') => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-1 mr-2">
          <Wand2 className="h-4 w-4 text-blue-600" />
          <span className="text-xs font-medium text-gray-700">Question Generator</span>
        </div>
        <div className="h-4 w-px bg-gray-300" />
        <button
          type="button"
          onClick={() => formatText('**', '**')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Bold"
          disabled={disabled}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('*', '*')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Italic"
          disabled={disabled}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('`', '`')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="Code"
          disabled={disabled}
        >
          <Code className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => formatText('- ')}
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors disabled:opacity-50"
          title="List"
          disabled={disabled}
        >
          <List className="h-4 w-4" />
        </button>
        <div className="h-6 w-px bg-gray-300 mx-1" />
        <span className="text-xs text-gray-500">Ctrl+Enter to send</span>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe the type of questions you want to generate... e.g., 'Generate 10 MCQ questions on Photosynthesis for Class 10 Science'"
          className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={disabled}
        />
        
        <button
          onClick={onSubmit}
          disabled={!value.trim() || isLoading || disabled}
          className="absolute bottom-3 right-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Wand2 className="h-3 w-3" />
              <span>Generate</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}