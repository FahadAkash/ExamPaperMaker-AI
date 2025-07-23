'use client'
import React, { useEffect, useState } from 'react';
import { AIService } from '@/lib/ai-service';
import { ClassConfig } from '@/types';

export default function AiTest() {
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateQuestionPaper = async () => {
      try {
        setIsLoading(true);
        
        const classConfig: ClassConfig = {
            id: 'ssc-10',
            name: 'Class 10',
            timeLimit: '2 hours',
            totalMarks: 100,
            questionTypes: ['MCQ', 'Short Answer', 'Long Answer'],
            subjects: []
        };

        const aiService = AIService.getInstance();
        const { response, questionPaper } = await aiService.generateQuestionPaper(
          'Generate physics questions about mechanics',
          [],
          classConfig,
          'Physics',
          []
        );

        setResult(response + '\n\n' + JSON.stringify(questionPaper, null, 2));
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestionPaper();
  }, []);

  return (
    <div>
      <h1>AI Question Generator</h1>
      {isLoading && <p>Generating questions...</p>}
      {error && <p>Error: {error}</p>}
      {result && (
        <div>
          <h2>Generated Question Paper:</h2>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}