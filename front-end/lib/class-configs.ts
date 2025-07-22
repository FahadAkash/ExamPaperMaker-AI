import { ClassConfig } from '@/types';

export const classConfigs: ClassConfig[] = [
  // SSC Level (Classes 9-10)
  {
    id: 'ssc-9',
    name: 'SSC - Class 9',
    subjects: ['Bangla', 'English', 'Mathematics', 'General Science', 'Bangladesh & Global Studies', 'Islam & Moral Education', 'ICT', 'Physical Education', 'Arts & Crafts'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'ssc-10',
    name: 'SSC - Class 10',
    subjects: ['Bangla', 'English', 'Mathematics', 'General Science', 'Bangladesh & Global Studies', 'Islam & Moral Education', 'ICT', 'Physical Education', 'Arts & Crafts'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  
  // HSC Level (Classes 11-12)
  {
    id: 'hsc-11',
    name: 'HSC - Class 11 (Science)',
    subjects: ['Bangla', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'ICT'],
    questionTypes: ['MCQ', 'Structured Questions', 'Creative Questions', 'Mathematical Problems'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'hsc-12',
    name: 'HSC - Class 12 (Science)',
    subjects: ['Bangla', 'English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'ICT'],
    questionTypes: ['MCQ', 'Structured Questions', 'Creative Questions', 'Mathematical Problems'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'hsc-11-humanities',
    name: 'HSC - Class 11 (Humanities)',
    subjects: ['Bangla', 'English', 'History', 'Civics', 'Economics', 'Geography', 'Islamic Studies', 'Logic'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'hsc-12-humanities',
    name: 'HSC - Class 12 (Humanities)',
    subjects: ['Bangla', 'English', 'History', 'Civics', 'Economics', 'Geography', 'Islamic Studies', 'Logic'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'hsc-11-business',
    name: 'HSC - Class 11 (Business Studies)',
    subjects: ['Bangla', 'English', 'Accounting', 'Business Organization', 'Finance & Banking', 'Economics', 'Marketing'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions', 'Practical Problems'],
    timeLimit: '3 hours',
    totalMarks: 100
  },
  {
    id: 'hsc-12-business',
    name: 'HSC - Class 12 (Business Studies)',
    subjects: ['Bangla', 'English', 'Accounting', 'Business Organization', 'Finance & Banking', 'Economics', 'Marketing'],
    questionTypes: ['MCQ', 'Creative Questions', 'Short Answer', 'Broad Questions', 'Practical Problems'],
    timeLimit: '3 hours',
    totalMarks: 100
  },

  // University Level
  {
    id: 'university-undergraduate',
    name: 'University - Undergraduate',
    subjects: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Administration', 'English Literature', 'Bangla Literature', 'History', 'Political Science', 'Sociology'],
    questionTypes: ['MCQ', 'Short Answer', 'Long Answer', 'Case Study', 'Problem Solving', 'Essay Questions'],
    timeLimit: '3-4 hours',
    totalMarks: 100
  },
  {
    id: 'university-masters',
    name: 'University - Masters',
    subjects: ['Computer Science', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Business Administration', 'English Literature', 'Bangla Literature', 'History', 'Political Science', 'Sociology'],
    questionTypes: ['MCQ', 'Analytical Questions', 'Research Questions', 'Case Study', 'Critical Analysis', 'Essay Questions'],
    timeLimit: '3-4 hours',
    totalMarks: 100
  },

  // Professional Courses
  {
    id: 'bcs-preliminary',
    name: 'BCS Preliminary',
    subjects: ['Bangla', 'English', 'Mathematics', 'General Knowledge', 'Bangladesh Affairs', 'International Affairs', 'Geography', 'Science & Technology'],
    questionTypes: ['MCQ'],
    timeLimit: '2 hours',
    totalMarks: 200
  },
  {
    id: 'medical-admission',
    name: 'Medical Admission Test',
    subjects: ['Physics', 'Chemistry', 'Biology', 'English', 'General Knowledge'],
    questionTypes: ['MCQ'],
    timeLimit: '1 hour',
    totalMarks: 100
  },
  {
    id: 'engineering-admission',
    name: 'Engineering Admission Test',
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'English'],
    questionTypes: ['MCQ'],
    timeLimit: '1 hour',
    totalMarks: 100
  }
];