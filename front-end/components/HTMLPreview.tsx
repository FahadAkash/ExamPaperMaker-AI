'use client';

import React, { useState } from 'react';
import { Eye, Code, Download, FileText, Printer, Edit } from 'lucide-react';
import { GeneratedHTML } from '@/types';
import { EditableQuestionPaper } from './EditableQuestionPaper';

interface HTMLPreviewProps {
  generatedHTML: GeneratedHTML | null;
  onExportPDF?: () => void;
  onExportDOC?: () => void;
  onContentUpdate?: (updatedHTML: GeneratedHTML) => void;
  onRegenerateSection?: (sectionId: string, content: string) => void;
  isRegenerating?: boolean;
  regeneratingSection?: string;
}

export function HTMLPreview({ 
  generatedHTML, 
  onExportPDF, 
  onExportDOC, 
  onContentUpdate,
  onRegenerateSection,
  isRegenerating,
  regeneratingSection 
}: HTMLPreviewProps) {
  const [viewMode, setViewMode] = useState<'preview' | 'edit' | 'code'>('preview');

  const downloadHTML = () => {
    if (!generatedHTML) return;

    const fullHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Component</title>
    <style>
        ${generatedHTML.css}
    </style>
</head>
<body>
    ${generatedHTML.html}
    ${generatedHTML.js ? `<script>${generatedHTML.js}</script>` : ''}
</body>
</html>`;

    const blob = new Blob([fullHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printQuestionPaper = () => {
    if (!generatedHTML) return;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Question Paper</title>
          <style>${generatedHTML.css}</style>
        </head>
        <body class="export-ready">
          ${generatedHTML.html}
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };
  if (!generatedHTML) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 bg-gray-50">
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">Question Paper Preview</p>
          <p className="text-sm">Generated question paper will appear here</p>
          <p className="text-xs text-gray-400 mt-2">Select class, subject and generate questions to see preview</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'preview'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Eye className="h-4 w-4 inline mr-1" />
            Preview
          </button>
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'edit'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit className="h-4 w-4 inline mr-1" />
            Edit
          </button>
          <button
            onClick={() => setViewMode('code')}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
              viewMode === 'code'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="h-4 w-4 inline mr-1" />
            Code
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={printQuestionPaper}
            className="flex items-center px-2 py-1 text-xs font-medium text-green-600 hover:text-green-800 transition-colors"
            title="Print Question Paper"
          >
            <Printer className="h-3 w-3 mr-1" />
            Print
          </button>
          
          {onExportPDF && (
            <button
              onClick={onExportPDF}
              className="flex items-center px-2 py-1 text-xs font-medium text-red-600 hover:text-red-800 transition-colors"
              title="Export as PDF"
            >
              <FileText className="h-3 w-3 mr-1" />
              PDF
            </button>
          )}
          
          {onExportDOC && (
            <button
              onClick={onExportDOC}
              className="flex items-center px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              title="Export as DOC"
            >
              <FileText className="h-3 w-3 mr-1" />
              DOC
            </button>
          )}
          
          <button
            onClick={downloadHTML}
            className="flex items-center px-2 py-1 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
            title="Download HTML"
          >
            <Download className="h-3 w-3 mr-1" />
            HTML
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {viewMode === 'preview' ? (
          <div className="h-full">
            <style dangerouslySetInnerHTML={{ __html: generatedHTML.css }} />
            <div 
              className="h-full p-4"
              dangerouslySetInnerHTML={{ __html: generatedHTML.html }}
            />
          </div>
        ) : viewMode === 'edit' ? (
          onContentUpdate && onRegenerateSection ? (
            <EditableQuestionPaper
              generatedHTML={generatedHTML}
              onContentUpdate={onContentUpdate}
              onRegenerateSection={onRegenerateSection}
              isRegenerating={isRegenerating}
              regeneratingSection={regeneratingSection}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <p>Edit functionality not available</p>
            </div>
          )
        ) : (
          <div className="h-full p-4 bg-gray-900 text-green-400 font-mono text-sm overflow-auto">
            <div className="mb-4">
              <h3 className="text-yellow-400 font-bold mb-2">Question Paper HTML:</h3>
              <pre className="whitespace-pre-wrap">
                {generatedHTML.html}
              </pre>
            </div>
            
            <div>
              <h3 className="text-yellow-400 font-bold mb-2">Styling CSS:</h3>
              <pre className="whitespace-pre-wrap">
                {generatedHTML.css}
              </pre>
            </div>
            
            {generatedHTML.js && (
              <div className="mt-4">
                <h3 className="text-yellow-400 font-bold mb-2">JavaScript:</h3>
                <pre className="whitespace-pre-wrap">
                  {generatedHTML.js}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}