export interface Document {
  id: string;
  name: string;
  content: string;
  type: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  htmlOutput?: string;
}

export interface QuestionPattern {
  id: string;
  name: string;
  pattern: string;
  description: string;
  example: string;
  questionTypes: string[];
}

export interface GeneratedHTML {
  header?: string;
  footer?: string;
  html: string;
  css: string;
  js?: string;
  editableContent?: EditableContent[];
}

export interface QuestionHeader {
  schoolName: string;
  schoolAddress: string;
  schoolPhone: string;
  examTitle: string;
  examDate: string;
  examTime: string;
  examDuration: string;
  totalMarks: number;
  instructions: string[];
}

export interface EditableContent {
  id: string;
  type: 'question' | 'instruction' | 'header';
  content: string;
  sectionId?: string;
  questionId?: string;
}

export interface ClassConfig {
  id: string;
  name: string;
  subjects: string[];
  questionTypes: string[];
  timeLimit: string;
  totalMarks: number;
}

export interface QuestionPaper {
  id: string;
  className: string;
  subject: string;
  title: string;
  timeLimit: string;
  totalMarks: number;
  instructions: string[];
  sections: QuestionSection[];
  generatedAt: Date;
}

export interface QuestionSection {
  id: string;
  title: string;
  instructions: string;
  questions: Question[];
  marks: number;
}

export interface Question {
  id: string;
  type: 'mcq' | 'short' | 'long' | 'fill' | 'true-false';
  question: string;
  options?: string[];
  marks: number;
  difficulty: 'easy' | 'medium' | 'hard';
}