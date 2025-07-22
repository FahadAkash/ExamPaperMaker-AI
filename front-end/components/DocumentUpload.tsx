'use client';

import React, { useCallback, useState } from 'react';
import { Upload, X, File, FileText } from 'lucide-react';
import { Document } from '@/types';

interface DocumentUploadProps {
  documents: Document[];
  onDocumentsChange: (documents: Document[]) => void;
}

export function DocumentUpload({ documents, onDocumentsChange }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type === 'text/plain' || file.type === 'application/json' || file.name.endsWith('.md')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const newDocument: Document = {
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            content,
            type: file.type,
            uploadedAt: new Date()
          };
          onDocumentsChange([...documents, newDocument]);
        };
        reader.readAsText(file);
      }
    });
  };

  const removeDocument = (id: string) => {
    onDocumentsChange(documents.filter(doc => doc.id !== id));
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".txt,.md,.json"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag & drop documents here, or click to select
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supports: .txt, .md, .json files
        </p>
      </div>

      {documents.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {doc.type === 'application/json' ? (
                  <File className="h-5 w-5 text-blue-500" />
                ) : (
                  <FileText className="h-5 w-5 text-green-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeDocument(doc.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}