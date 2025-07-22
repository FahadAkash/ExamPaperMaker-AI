'use client';

import React, { useState, useCallback } from 'react';
import { Edit3, Save, X, RotateCcw, Image } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { TypewriterText } from './TypewriterText';
import { GeneratedHTML, EditableContent } from '@/types';

interface EditableQuestionPaperProps {
  generatedHTML: GeneratedHTML;
  onContentUpdate: (updatedHTML: GeneratedHTML) => void;
  onRegenerateSection: (sectionId: string, content: string) => void;
  isRegenerating?: boolean;
  regeneratingSection?: string;
}

export function EditableQuestionPaper({ 
  generatedHTML, 
  onContentUpdate, 
  onRegenerateSection,
  isRegenerating,
  regeneratingSection 
}: EditableQuestionPaperProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [selectionRange, setSelectionRange] = useState<{ start: number; end: number } | null>(null);

  const handleTextSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString());
      const range = selection.getRangeAt(0);
      setSelectionRange({
        start: range.startOffset,
        end: range.endOffset
      });
    }
  }, []);

  const startEditing = (id: string, currentContent: string) => {
    setEditingId(id);
    setEditContent(currentContent);
  };

  const saveEdit = () => {
    if (!editingId) return;

    // Update the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(generatedHTML.html, 'text/html');
    const element = doc.querySelector(`[data-editable-id="${editingId}"]`);
    
    if (element) {
      element.innerHTML = editContent;
      const updatedHTML = {
        ...generatedHTML,
        html: doc.documentElement.outerHTML
      };
      onContentUpdate(updatedHTML);
    }

    setEditingId(null);
    setEditContent('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    // Create a local URL for the image
    const imageUrl = URL.createObjectURL(file);
    return imageUrl;
  };

  const handleRegenerateSelected = () => {
    if (selectedText && selectionRange) {
      onRegenerateSection('selected-text', selectedText);
    }
  };

  // Parse HTML and make elements editable
  const makeEditable = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Add editable attributes to questions and key elements
    const questions = doc.querySelectorAll('.question-text, .section-instructions, .paper-header h1, .paper-header h2');
    questions.forEach((element, index) => {
      element.setAttribute('data-editable-id', `editable-${index}`);
      element.setAttribute('data-editable-type', 'question');
    });

    return doc.documentElement.outerHTML;
  };

  const editableHTML = makeEditable(generatedHTML.html);

  return (
    <div className="h-full flex flex-col">
      {/* Editing Toolbar */}
      {selectedText && (
        <div className="bg-blue-50 border-b border-blue-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-blue-800">Selected:</span>
              <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                &quot;{selectedText.substring(0, 50)}...&quot;
              </span>
            </div>
            <button
              onClick={handleRegenerateSelected}
              disabled={isRegenerating}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Regenerate</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <style dangerouslySetInnerHTML={{ __html: generatedHTML.css + `
          [data-editable-id] {
            position: relative;
            transition: all 0.2s ease;
          }
          [data-editable-id]:hover {
            background-color: rgba(59, 130, 246, 0.1);
            cursor: pointer;
          }
          [data-editable-id]:hover::after {
            content: '✏️';
            position: absolute;
            top: -8px;
            right: -8px;
            background: #3B82F6;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            z-index: 10;
          }
          .editing-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 50;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.2s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .regenerating-text {
            background: linear-gradient(90deg, #3B82F6, #10B981, #3B82F6);
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
        ` }} />
        
        <div 
          className="h-full p-4"
          onMouseUp={handleTextSelection}
          onClick={(e) => {
            const target = e.target as HTMLElement;
            const editableElement = target.closest('[data-editable-id]');
            if (editableElement) {
              const id = editableElement.getAttribute('data-editable-id');
              if (id) {
                startEditing(id, editableElement.innerHTML);
              }
            }
          }}
        >
          {regeneratingSection === 'selected-text' && selectedText ? (
            <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm font-medium text-blue-800">Regenerating selected content...</span>
              </div>
              <div className="text-sm text-gray-600">
                <TypewriterText 
                  text="Creating improved version of your selected text with AI assistance..."
                  speed={30}
                />
              </div>
            </div>
          ) : null}
          
          <div dangerouslySetInnerHTML={{ __html: editableHTML }} />
        </div>
      </div>

      {/* Editing Modal */}
      {editingId && (
        <div className="editing-overlay">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Edit3 className="h-5 w-5 mr-2 text-blue-600" />
                Edit Content
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveEdit}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  <Save className="h-4 w-4" />
                  <span>Save</span>
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              <RichTextEditor
                content={editContent}
                onChange={setEditContent}
                onImageUpload={handleImageUpload}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}