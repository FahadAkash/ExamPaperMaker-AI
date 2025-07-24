'use client';

import React, { useState, useCallback } from 'react';
import { DocumentUpload } from '@/components/DocumentUpload';
import { RichQuestionEditor } from '@/components/RichQuestionEditor';
import { ChatInterface } from '@/components/ChatInterface';
import { HTMLPreview } from '@/components/HTMLPreview';
import { QuestionPatterns } from '@/components/QuestionPatterns';
import { ClassSelector } from '@/components/ClassSelector';
import { AIService } from '@/lib/ai-service';
import { Document, ChatMessage, GeneratedHTML, ClassConfig, QuestionPaper } from '@/types';
import { MessageSquare, FileText, Sparkles, BookOpen, GraduationCap } from 'lucide-react';

export default function Home() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentHTML, setCurrentHTML] = useState<GeneratedHTML | null>(null);
  const [currentQuestionPaper, setCurrentQuestionPaper] = useState<QuestionPaper | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'docs' | 'patterns' | 'config'>('config');
  const [selectedClass, setSelectedClass] = useState<ClassConfig | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regeneratingSection, setRegeneratingSection] = useState<string | undefined>(undefined);

  const aiService = AIService.getInstance();

  const handleSubmitQuestion = useCallback(async () => {
    if (!question.trim() || isLoading) return;
    
    if (!selectedClass || !selectedSubject) {
      alert('Please select a class and subject first!');
      return;
    }

    const userMessage: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const documentContents = documents.map(doc => doc.content);
      const response = await aiService.generateQuestionPaper(
        question,
        documentContents,
        selectedClass,
        selectedSubject,
        messages
      );
      
      const assistantMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
        htmlOutput: response.htmlOutput ? JSON.stringify(response.htmlOutput) : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (response.htmlOutput) {
        setCurrentHTML(response.htmlOutput);
      }
      
      if (response.questionPaper) {
        setCurrentQuestionPaper(response.questionPaper);
      }
    } catch (error) {
      console.error('Error generating question paper:', error);
      const errorMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating the question paper. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [question, documents, messages, isLoading, aiService, selectedClass, selectedSubject]);

  const handlePatternSelect = (pattern: string) => {
    setQuestion(pattern);
    setActiveTab('chat');
  };

  const handleContentUpdate = (updatedHTML: GeneratedHTML) => {
    setCurrentHTML(updatedHTML);
  };

  const handleRegenerateSection = async (sectionId: string, content: string) => {
    if (!selectedClass || !selectedSubject) return;

    setIsRegenerating(true);
    setRegeneratingSection(sectionId);

    try {
      const response = await aiService.regenerateSection(
        content,
        `Regenerating content for ${selectedClass.name} ${selectedSubject}`,
        selectedClass,
        selectedSubject
      );

      // Add regeneration message to chat
      const regenerationMessage: ChatMessage = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, regenerationMessage]);

      // Update the HTML content with regenerated section
      if (currentHTML) {
        const updatedHTML = { ...currentHTML };
        // In a real implementation, you would replace the specific section
        // For now, we'll just update the entire content
        setCurrentHTML(updatedHTML);
      }
    } catch (error) {
      console.error('Error regenerating section:', error);
    } finally {
      setIsRegenerating(false);
      setRegeneratingSection(undefined);
    }
  };

  const handleExportPDF = () => {
    if (!currentHTML) return;
    
    // Create a temporary element for PDF generation
    const element = document.createElement('div');
    element.innerHTML = currentHTML.html;
    element.className = 'export-ready';
    
    // Add CSS styles
    const style = document.createElement('style');
    style.textContent = currentHTML.css;
    document.head.appendChild(style);
    
    // In a real implementation, you would use a library like jsPDF or html2pdf
    alert('PDF export functionality would be implemented here using libraries like jsPDF or html2pdf.js');
    
    // Clean up
    document.head.removeChild(style);
  };

  const handleExportDOC = () => {
    if (!currentHTML) return;
    
    // In a real implementation, you would use a library like docx or html-docx-js
    alert('DOC export functionality would be implemented here using libraries like docx or html-docx-js');
  };

  const isConfigurationComplete = selectedClass && selectedSubject;

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Left Panel - Question Paper Preview */}
      <div className="flex-1 border-r border-gray-200">
        <div className="h-full flex flex-col">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <h1 className="text-xl font-semibold text-gray-900 flex items-center">
              <GraduationCap className="h-5 w-5 mr-2 text-blue-600" />
              Question Paper Generator
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered educational content generator
              {selectedClass && selectedSubject && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {selectedClass.name} - {selectedSubject}
                </span>
              )}
            </p>
          </div>
          <HTMLPreview 
            generatedHTML={currentHTML} 
            onExportPDF={handleExportPDF}
            onExportDOC={handleExportDOC}
            onContentUpdate={handleContentUpdate}
            onRegenerateSection={handleRegenerateSection}
            isRegenerating={isRegenerating}
            regeneratingSection={regeneratingSection}
          />
        </div>
      </div>

      {/* Right Panel - Controls & Chat */}
      <div className="w-96 bg-white flex flex-col">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'config'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BookOpen className="h-4 w-4 inline mr-1" />
              Config
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="h-4 w-4 inline mr-1" />
              Generate
            </button>
            <button
              onClick={() => setActiveTab('docs')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'docs'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-1" />
              Docs ({documents.length})
            </button>
            <button
              onClick={() => setActiveTab('patterns')}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'patterns'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="h-4 w-4 inline mr-1" />
              Patterns
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'config' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <ClassSelector
                selectedClass={selectedClass}
                selectedSubject={selectedSubject}
                onClassChange={setSelectedClass}
                onSubjectChange={setSelectedSubject}
              />
              
              {!isConfigurationComplete && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Next Step:</strong> Select both class and subject to start generating questions.
                  </p>
                </div>
              )}
              
              {isConfigurationComplete && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Ready!</strong> Go to the Generate tab to create your question paper.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'chat' && (
            <>
              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  messages={messages} 
                  isLoading={isLoading || isRegenerating} 
                  regeneratingSection={regeneratingSection}
                />
              </div>
              <div className="border-t border-gray-200 p-4">
                <RichQuestionEditor
                  value={question}
                  onChange={setQuestion}
                  onSubmit={handleSubmitQuestion}
                  isLoading={isLoading}
                  disabled={!isConfigurationComplete}
                />
                {!isConfigurationComplete && (
                  <p className="text-xs text-red-600 mt-2">
                    Please configure class and subject first
                  </p>
                )}
              </div>
            </>
          )}

          {activeTab === 'docs' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <DocumentUpload
                documents={documents}
                onDocumentsChange={setDocuments}
              />
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Upload curriculum documents, textbooks, or reference materials to help generate more relevant questions.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'patterns' && (
            <div className="flex-1 p-4 overflow-y-auto">
              <QuestionPatterns 
                onPatternSelect={handlePatternSelect}
                selectedClass={selectedClass?.name}
                selectedSubject={selectedSubject}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}