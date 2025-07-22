'use client';

import React from 'react';
import { questionPatterns } from '@/lib/question-patterns';
import { Copy, FileText } from 'lucide-react';

interface QuestionPatternsProps {
  onPatternSelect: (pattern: string) => void;
  selectedClass?: string;
  selectedSubject?: string;
}

export function QuestionPatterns({ onPatternSelect, selectedClass, selectedSubject }: QuestionPatternsProps) {
  const copyToEditor = (pattern: string) => {
    let customizedPattern = pattern;
    if (selectedClass && selectedSubject) {
      customizedPattern = pattern
        .replace('[CLASS]', selectedClass)
        .replace('[SUBJECT]', selectedSubject);
    }
    onPatternSelect(customizedPattern);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <FileText className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-medium text-gray-700">Question Paper Patterns</h3>
      </div>
      <div className="space-y-2">
        {questionPatterns.map((pattern) => (
          <div key={pattern.id} className="border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-sm text-gray-900">{pattern.name}</h4>
              <button
                onClick={() => copyToEditor(pattern.example)}
                className="p-1 text-gray-400 hover:text-blue-600 transition-colors flex items-center space-x-1"
                title="Use this pattern"
              >
                <Copy className="h-4 w-4" />
                <span className="text-xs">Use</span>
              </button>
            </div>
            <p className="text-xs text-gray-600 mb-2">{pattern.description}</p>
            <div className="mb-2">
              <div className="flex flex-wrap gap-1">
                {pattern.questionTypes.map((type) => (
                  <span
                    key={type}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
              {pattern.example}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}