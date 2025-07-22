import { QuestionPattern } from '@/types';

export const questionPatterns: QuestionPattern[] = [
  // SSC/HSC Creative Questions
  {
    id: '1',
    name: 'Creative Question Pattern (SSC/HSC)',
    pattern: 'Create a creative question on [TOPIC] for [CLASS] [SUBJECT] with stem, information, and 4 sub-questions (a, b, c, d) following Bangladesh education board format',
    description: 'Creates creative questions with stem, information passage, and graded sub-questions',
    example: 'Create a creative question on "Photosynthesis" for SSC - Class 10 Biology with stem, information, and 4 sub-questions (a, b, c, d) following Bangladesh education board format',
    questionTypes: ['Creative Questions']
  },
  
  // MCQ Pattern for Bangladesh
  {
    id: '2',
    name: 'MCQ Questions (Bangladesh Format)',
    pattern: 'Generate [NUMBER] MCQ questions on [TOPIC] for [CLASS] [SUBJECT] with 4 options (ক, খ, গ, ঘ) following Bangladesh education board format',
    description: 'Creates MCQ questions with Bengali option labels (ক, খ, গ, ঘ)',
    example: 'Generate 30 MCQ questions on "Algebra" for HSC - Class 11 Mathematics with 4 options (ক, খ, গ, ঘ) following Bangladesh education board format',
    questionTypes: ['MCQ']
  },

  // Structured Questions
  {
    id: '3',
    name: 'Structured Questions (HSC Science)',
    pattern: 'Create [NUMBER] structured questions on [TOPIC] for [CLASS] [SUBJECT] with multiple parts (a, b, c) worth [MARKS] marks each',
    description: 'Generates structured questions with multiple sub-parts for HSC science subjects',
    example: 'Create 5 structured questions on "Organic Chemistry" for HSC - Class 12 Chemistry with multiple parts (a, b, c) worth 10 marks each',
    questionTypes: ['Structured Questions']
  },

  // Short Answer Questions
  {
    id: '4',
    name: 'Short Answer Questions',
    pattern: 'Generate [NUMBER] short answer questions on [TOPIC] for [CLASS] [SUBJECT] worth [MARKS] marks each following Bangladesh curriculum',
    description: 'Creates short answer questions (2-5 marks each) following Bangladesh education format',
    example: 'Generate 10 short answer questions on "Bangladesh Liberation War" for SSC - Class 10 Bangladesh & Global Studies worth 3 marks each following Bangladesh curriculum',
    questionTypes: ['Short Answer']
  },

  // Broad Questions
  {
    id: '5',
    name: 'Broad Questions (SSC/HSC)',
    pattern: 'Create [NUMBER] broad questions on [TOPIC] for [CLASS] [SUBJECT] worth [MARKS] marks each with detailed answer requirements',
    description: 'Generates broad questions (7-10 marks each) for comprehensive answers',
    example: 'Create 6 broad questions on "Bangla Literature" for HSC - Class 12 Bangla worth 10 marks each with detailed answer requirements',
    questionTypes: ['Broad Questions']
  },

  // Mathematical Problems
  {
    id: '6',
    name: 'Mathematical Problems',
    pattern: 'Generate [NUMBER] mathematical problems on [TOPIC] for [CLASS] [SUBJECT] with step-by-step solutions following Bangladesh math curriculum',
    description: 'Creates mathematical problems with detailed solutions',
    example: 'Generate 8 mathematical problems on "Calculus" for HSC - Class 12 Mathematics with step-by-step solutions following Bangladesh math curriculum',
    questionTypes: ['Mathematical Problems']
  },

  // Complete Question Paper
  {
    id: '7',
    name: 'Complete SSC Question Paper',
    pattern: 'Create a complete SSC question paper for [CLASS] [SUBJECT] with Part A: [MCQ_COUNT] MCQs (30 marks), Part B: [CREATIVE_COUNT] creative questions (70 marks)',
    description: 'Generates a complete SSC format question paper with proper marking distribution',
    example: 'Create a complete SSC question paper for SSC - Class 10 General Science with Part A: 30 MCQs (30 marks), Part B: 7 creative questions (70 marks)',
    questionTypes: ['MCQ', 'Creative Questions']
  },

  {
    id: '8',
    name: 'Complete HSC Question Paper',
    pattern: 'Create a complete HSC question paper for [CLASS] [SUBJECT] with Part A: [MCQ_COUNT] MCQs (30 marks), Part B: [STRUCTURED_COUNT] structured questions (70 marks)',
    description: 'Generates a complete HSC format question paper with proper sections',
    example: 'Create a complete HSC question paper for HSC - Class 12 Physics with Part A: 30 MCQs (30 marks), Part B: 7 structured questions (70 marks)',
    questionTypes: ['MCQ', 'Structured Questions']
  },

  // University Level
  {
    id: '9',
    name: 'University Question Paper',
    pattern: 'Create a university level question paper for [SUBJECT] with [SHORT_COUNT] short questions (40 marks) and [LONG_COUNT] long questions (60 marks)',
    description: 'Generates university format question papers with flexible marking',
    example: 'Create a university level question paper for Computer Science with 8 short questions (40 marks) and 4 long questions (60 marks)',
    questionTypes: ['Short Answer', 'Long Answer']
  },

  // Professional Exams
  {
    id: '10',
    name: 'BCS Preliminary MCQ',
    pattern: 'Generate [NUMBER] BCS preliminary MCQ questions covering [SUBJECT] with detailed explanations',
    description: 'Creates BCS preliminary exam format MCQ questions',
    example: 'Generate 50 BCS preliminary MCQ questions covering General Knowledge with detailed explanations',
    questionTypes: ['MCQ']
  },

  // Admission Test
  {
    id: '11',
    name: 'Medical/Engineering Admission MCQ',
    pattern: 'Create [NUMBER] admission test MCQ questions on [SUBJECT] for [EXAM_TYPE] with high difficulty level',
    description: 'Generates competitive admission test MCQ questions',
    example: 'Create 25 admission test MCQ questions on Physics for Medical Admission Test with high difficulty level',
    questionTypes: ['MCQ']
  }
];