import { ChatMessage, GeneratedHTML, QuestionPaper, ClassConfig } from '@/types';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { questionPatternContextSSCORHSC } from './questionPaperContext';

export class AIService {
  private static instance: AIService;
  private googleAI: any;

  private constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || 
                  process.env.GOOGLE_API_KEY || 
                  'AIzaSyACqVW_-0J1657A0DLT0kARchGLYJvXvLM';
    
    if (!apiKey.trim()) {
      throw new Error('Google Generative AI API key is missing');
    }

    this.googleAI = createGoogleGenerativeAI({ apiKey });
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async generateQuestionPaper(
    message: string,
    documents: string[],
    classConfig: ClassConfig,
    subject: string,
    previousMessages: ChatMessage[]
  ): Promise<{ response: string; questionPaper?: QuestionPaper; htmlOutput?: GeneratedHTML }> {
    try {
      const questionPaper = await this.createQuestionPaper(message, classConfig, subject, documents);
      const htmlOutput = this.generateQuestionPaperHTML(questionPaper);

      return {
        response: `Successfully generated question paper for ${classConfig.name} ${subject}`,
        questionPaper,
        htmlOutput
      };
    } catch (error) {
      console.error('Error generating question paper:', error);
      return {
        response: 'Failed to generate question paper. Please try again.',
        questionPaper: undefined,
        htmlOutput: undefined
      };
    }
  }

  private async createQuestionPaper(
    prompt: string,
    classConfig: ClassConfig,
    subject: string,
    documents: string[]
  ): Promise<QuestionPaper> {
    const topics = this.extractTopicsFromPrompt(prompt, documents);
    const sections = await this.generateSections(classConfig, subject, topics);

    return {
      id: Math.random().toString(36).substring(2, 11),
      className: classConfig.name,
      subject: subject,
      title: `${classConfig.name} ${subject} - Examination`,
      timeLimit: classConfig.timeLimit,
      totalMarks: classConfig.totalMarks,
      instructions: this.generateInstructions(classConfig),
      sections,
      generatedAt: new Date()
    };
  }

  private async generateSections(classConfig: ClassConfig, subject: string, topics: string[]) {
    const sections = [];
    const questionContext = this.getQuestionContext(classConfig);

    // Section A - MCQs
    if (classConfig.questionTypes.includes('MCQ')) {
      const count = Math.min(20, Math.floor(classConfig.totalMarks * 0.2));
      const questions = await this.generateAIQuestions(
        subject,
        topics,
        count,
        'mcq',
        questionContext
      );
      sections.push({
        id: 'section-a',
        title: 'Section A - Multiple Choice Questions',
        instructions: 'Choose the correct option for each question. Each question carries 1 mark.',
        questions,
        marks: count
      });
    }

    // Section B - Short Answer Questions
    if (classConfig.questionTypes.includes('Short Answer')) {
      const count = 10;
      const questions = await this.generateAIQuestions(
        subject,
        topics,
        count,
        'short',
        questionContext
      );
      sections.push({
        id: 'section-b',
        title: 'Section B - Short Answer Questions',
        instructions: `Answer any ${Math.floor(count * 0.8)} questions from this section. Each question carries 3 marks.`,
        questions,
        marks: Math.floor(count * 0.8) * 3
      });
    }

    // Section C - Long Answer Questions
    if (classConfig.questionTypes.includes('Long Answer')) {
      const count = 6;
      const questions = await this.generateAIQuestions(
        subject,
        topics,
        count,
        'long',
        questionContext
      );
      sections.push({
        id: 'section-c',
        title: 'Section C - Long Answer Questions',
        instructions: `Answer any ${Math.floor(count * 0.66)} questions from this section. Each question carries 5 marks.`,
        questions,
        marks: Math.floor(count * 0.66) * 5
      });
    }

    return sections;
  }

  async generateResponseAI() : Promise<{ response: string; htmlOutput?: GeneratedHTML }>{
    const prompt = `
 ${questionPatternContextSSCORHSC("SSC")}
 `;
    console.log('Generating response with prompt:', prompt);
    try {
      const model = this.googleAI('gemini-1.5-flash');
      const { text } = await generateText({ model, prompt });
      console.log('AI response:', text);
      return {
        response: text,
        htmlOutput: undefined
      };
    } catch (error) {
      console.error('AI generation failed, using fallback questions:', error);
      return {
        response: 'Failed to generate question paper. Please try again.',
        htmlOutput: undefined
      };
    }
  }

  private async generateAIQuestions(
    subject: string,
    topics: string[],
    count: number,
    type: 'mcq' | 'short' | 'long',
    context: string
  ): Promise<any[]> {
    const questionTypeMap = {
      mcq: 'multiple choice',
      short: 'short answer',
      long: 'long answer'
    };

    const prompt = `
${context}
${questionPatternContextSSCORHSC("SSC")}
 `;

    try {
      const model = this.googleAI('gemini-1.5-flash');
      const { text } = await generateText({ model, prompt });
      console.log('AI response:', text);
      return this.parseQuestions(text, type);
    } catch (error) {
      console.error('AI generation failed, using fallback questions:', error);
      return this.getFallbackQuestions(subject, count, type);
    }
  }

  private parseQuestions(text: string, type: string): any[] {
    const questions = [];
    const lines = text.split('\n');
    let currentQuestion = '';
    let currentOptions: string[] = [];

    for (const line of lines) {
      // Check if line starts with a number (question indicator)
      if (/^\d+[\.\)]?\s/.test(line)) {
        if (currentQuestion) {
          questions.push(this.formatQuestion(currentQuestion, currentOptions, type));
        }
        currentQuestion = line.trim();
        currentOptions = [];
      } 
      // Detect MCQ options (Bengali or English)
      else if (/^[a-d]\)|\s*[কখগঘ]\)/.test(line)) {
        currentOptions.push(line.trim());
      }
      else if (currentQuestion) {
        currentQuestion += ' ' + line.trim();
      }
    }

    if (currentQuestion) {
      questions.push(this.formatQuestion(currentQuestion, currentOptions, type));
    }

    return questions.slice(0, 20); // Ensure we don't exceed limit
  }

  private formatQuestion(text: string, options: string[], type: string): any {
    const baseQuestion = {
      id: Math.random().toString(36).substring(2, 8),
      type,
      question: text.replace(/^\d+[\.\)]?\s/, '').trim(), // Remove question number
      difficulty: 'medium' as const
    };

    if (type === 'mcq') {
      return {
        ...baseQuestion,
        options: options.length > 0 ? options : [
          'ক) প্রথম বিকল্প',
          'খ) দ্বিতীয় বিকল্প',
          'গ) তৃতীয় বিকল্প',
          'ঘ) চতুর্থ বিকল্প'
        ],
        marks: 1
      };
    } else if (type === 'short') {
      return {
        ...baseQuestion,
        marks: 3
      };
    } else {
      return {
        ...baseQuestion,
        marks: 5
      };
    }
  }

  private getQuestionContext(classConfig: ClassConfig): string {
    const level = classConfig.id.includes('ssc') ? 'SSC' :
      classConfig.id.includes('hsc') ? 'HSC' :
        classConfig.id.includes('bsc') ? 'BSC' : 'MSC';

    return level ? `Generate questions suitable for ${level} level students.` : '';
  }

  private getFallbackQuestions(subject: string, count: number, type: 'mcq' | 'short' | 'long'): any[] {
    const questions = [];
    const subjects = {
      'Mathematics': 'গণিত',
      'Physics': 'পদার্থবিজ্ঞান',
      'Chemistry': 'রসায়ন',
      'Biology': 'জীববিজ্ঞান',
      'Bangla': 'বাংলা',
      'English': 'ইংরেজি',
      'Bangladesh & Global Studies': 'বাংলাদেশ ও বিশ্বপরিচয়'
    };

    const subjectName = subjects[subject as keyof typeof subjects] || subject;

    for (let i = 0; i < count; i++) {
      const id = `${type}-${i + 1}`;
      const question = `${i + 1}. ${subjectName} বিষয়ে ${type === 'mcq' ? 'বহুনির্বাচনি' : type === 'short' ? 'সংক্ষিপ্ত' : 'বিস্তারিত'} প্রশ্ন নম্বর ${i + 1}`;

      if (type === 'mcq') {
        questions.push({
          id,
          type,
          question,
          options: [
            'ক) প্রথম বিকল্প',
            'খ) দ্বিতীয় বিকল্প',
            'গ) তৃতীয় বিকল্প',
            'ঘ) চতুর্থ বিকল্প'
          ],
          marks: 1,
          difficulty: 'medium'
        });
      } else {
        questions.push({
          id,
          type,
          question,
          marks: type === 'short' ? 3 : 5,
          difficulty: 'medium'
        });
      }
    }

    return questions;
  }

  private extractTopicsFromPrompt(prompt: string, documents: string[]): string[] {
    // Enhanced topic extraction with NLP-like matching
    const topicKeywords = [
      'অধ্যায়', 'chapter', 'topic', 'unit', 'বিষয়', 'পাঠ্যাংশ',
      'পদার্থ', 'রসায়ন', 'গণিত', 'ইংরেজি', 'বাংলা', 'জীববিজ্ঞান',
      'পদার্থবিজ্ঞান', 'রসায়নবিজ্ঞান', 'সাহিত্য', 'ব্যাকরণ', 'পরিমাপ',
      'গতি', 'তাপ', 'তড়িৎ', 'চুম্বক', 'জীবকোষ', 'উদ্ভিদ', 'প্রাণী'
    ];

    const foundTopics = new Set<string>();
    
    // Extract from prompt
    for (const keyword of topicKeywords) {
      if (prompt.toLowerCase().includes(keyword.toLowerCase())) {
        foundTopics.add(keyword);
      }
    }

    // Extract from documents (first 1000 characters)
    const docText = documents.join(' ').substring(0, 1000);
    for (const keyword of topicKeywords) {
      if (docText.toLowerCase().includes(keyword.toLowerCase())) {
        foundTopics.add(keyword);
      }
    }

    // Add numbered chapters if no topics found
    if (foundTopics.size === 0) {
      return ['অধ্যায় ১', 'অধ্যায় ২', 'অধ্যায় ৩'];
    }

    return Array.from(foundTopics);
  }

  private generateInstructions(classConfig: ClassConfig): string[] {
    const baseInstructions = [];

    // Add specific instructions based on exam level
    if (classConfig.id.includes('ssc')) {
      baseInstructions.push(
        `সময়: ${classConfig.timeLimit}`,
        `পূর্ণমান: ${classConfig.totalMarks} নম্বর`,
        'সব প্রশ্নের উত্তর দিতে হবে।',
        'প্রশ্নপত্রটি দুটি অংশে বিভক্ত: ক ও খ।',
        'ক অংশ: বহুনির্বাচনি প্রশ্ন (৩০ নম্বর)',
        'খ অংশ: সৃজনশীল প্রশ্ন (৭০ নম্বর)',
        'প্রতিটি প্রশ্নের উত্তর সুন্দর ও পরিচ্ছন্ন হাতের লেখায় লিখতে হবে।',
        'প্রয়োজনে চিত্র অঙ্কন করতে হবে।'
      );
    } else if (classConfig.id.includes('hsc')) {
      baseInstructions.push(
        `সময়: ${classConfig.timeLimit}`,
        `পূর্ণমান: ${classConfig.totalMarks} নম্বর`,
        'সব প্রশ্নের উত্তর দিতে হবে।',
        'প্রশ্নপত্রটি দুটি অংশে বিভক্ত: ক ও খ।',
        'ক অংশ: বহুনির্বাচনি প্রশ্ন (৩০ নম্বর)',
        'খ অংশ: কাঠামোবদ্ধ প্রশ্ন (৭০ নম্বর)',
        'গাণিতিক সমস্যার ক্ষেত্রে প্রয়োজনীয় সূত্র ব্যবহার করতে হবে।',
        'চিত্র অঙ্কনের ক্ষেত্রে পরিচ্ছন্নতা বজায় রাখতে হবে।'
      );
    } else if (classConfig.id.includes('university')) {
      baseInstructions.push(
        `Time: ${classConfig.timeLimit}`,
        `Full Marks: ${classConfig.totalMarks}`,
        'Answer all questions.',
        'All questions carry equal marks unless otherwise mentioned.',
        'Write legibly and maintain proper presentation.',
        'Draw neat diagrams wherever necessary.'
      );
    } else if (classConfig.id.includes('bcs') || classConfig.id.includes('admission')) {
      baseInstructions.push(
        `সময়: ${classConfig.timeLimit}`,
        `পূর্ণমান: ${classConfig.totalMarks} নম্বর`,
        'সব প্রশ্নের উত্তর দিতে হবে।',
        'প্রতিটি প্রশ্নের জন্য ৪টি বিকল্প উত্তর দেওয়া আছে।',
        'সঠিক উত্তরটি OMR শিটে চিহ্নিত করতে হবে।',
        'একাধিক উত্তর চিহ্নিত করলে সেই প্রশ্নের জন্য কোনো নম্বর পাওয়া যাবে না।',
        'ভুল উত্তরের জন্য নেগেটিভ মার্কিং থাকতে পারে।'
      );
    }

    return baseInstructions;
  }

  private generateQuestionPaperHTML(questionPaper: QuestionPaper): GeneratedHTML {
    const html = `
<div class="question-paper">
  <header class="paper-header">
    <div class="school-info">
      <h1>বার্ষিক পরীক্ষা - ${new Date().getFullYear()}</h1>
      <h2>${questionPaper.className} - ${questionPaper.subject}</h2>
      <div class="exam-details">
        <p>পরীক্ষার তারিখ: ___________</p>
        <p>পরীক্ষার্থীর নাম: ___________</p>
        <p>রোল নং: ___________</p>
      </div>
    </div>
    <div class="paper-details">
      <div class="detail-item">
        <span class="label">সময়:</span>
        <span class="value">${questionPaper.timeLimit}</span>
      </div>
      <div class="detail-item">
        <span class="label">পূর্ণমান:</span>
        <span class="value">${questionPaper.totalMarks}</span>
      </div>
    </div>
  </header>

  <div class="instructions">
    <h3>সাধারণ নির্দেশনা:</h3>
    <ul>
      ${questionPaper.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
    </ul>
  </div>

  ${questionPaper.sections.map(section => `
    <section class="question-section ${section.id === 'section-a' ? 'mcq-section' : ''}">
      <div class="section-header">
        <h3>${section.title}</h3>
        <span class="section-marks">[${section.marks} নম্বর]</span>
      </div>
      <p class="section-instructions">${section.instructions}</p>
      
      <div class="questions">
        ${section.questions.map(question => `
          <div class="question-item">
            <div class="question-text">${question.question}</div>
            ${question.options ? `
              <div class="options">
                ${question.options.map((option) => `
                  <div class="option">
                    <span class="option-text">${option}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
            <div class="question-marks">[${question.marks} নম্বর]</div>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('')}

  <footer class="paper-footer">
    <p>তৈরি করা হয়েছে: ${questionPaper.generatedAt.toLocaleDateString('bn-BD')}</p>
    <p>*** প্রশ্নপত্র সমাপ্ত ***</p>
  </footer>
</div>`;

    const css = `
@page {
  margin: 1in;
  size: A4;
}

.question-paper {
  font-family: 'Kalpurush', 'Times New Roman', serif;
  max-width: 8.5in;
  margin: 0 auto;
  padding: 20px;
  background: white;
  color: #000;
  line-height: 1.6;
}

.paper-header {
  text-align: center;
  border-bottom: 2px solid #000;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.school-info h1 {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 10px 0;
  text-transform: uppercase;
  border-bottom: 1px solid #000;
  padding-bottom: 5px;
}

.school-info h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

.exam-details {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-size: 12px;
}

.exam-details p {
  margin: 0;
  padding: 5px 0;
}

.paper-details {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  font-weight: bold;
}

.detail-item {
  display: flex;
  gap: 10px;
}

.label {
  font-weight: bold;
}

.instructions {
  margin-bottom: 25px;
  padding: 15px;
  border: 1px solid #000;
}

.instructions h3 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: bold;
  text-decoration: underline;
}

.instructions ul {
  margin: 0;
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 5px;
  font-size: 12px;
}

.question-section {
  margin-bottom: 30px;
  page-break-inside: avoid;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding-bottom: 5px;
  margin-bottom: 10px;
}

.section-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  text-transform: uppercase;
}

.section-marks {
  font-weight: bold;
  font-size: 12px;
}

.section-instructions {
  font-style: italic;
  margin-bottom: 15px;
  font-size: 12px;
}

.questions {
  margin-left: 10px;
}

.question-item {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.question-text {
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 13px;
}

.options {
  margin: 10px 0 10px 20px;
}

.option {
  display: flex;
  margin-bottom: 5px;
  font-size: 12px;
  align-items: flex-start;
}

.option-text {
  flex: 1;
  line-height: 1.4;
}

.question-marks {
  text-align: right;
  font-size: 11px;
  font-style: italic;
  margin-top: 5px;
}

.paper-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #000;
  font-size: 11px;
}

.paper-footer p {
  margin: 5px 0;
}

/* Print styles */
@media print {
  .question-paper {
    margin: 0;
    padding: 0;
    box-shadow: none;
  }
  
  .question-section {
    page-break-inside: avoid;
  }
  
  .question-item {
    page-break-inside: avoid;
  }
}

/* Export styles for better formatting */
.export-ready {
  font-size: 12pt;
  line-height: 1.5;
}

.export-ready .school-info h1 {
  font-size: 16pt;
}

.export-ready .school-info h2 {
  font-size: 14pt;
}

.export-ready .section-header h3 {
  font-size: 13pt;
}

.export-ready .question-text {
  font-size: 12pt;
}

/* MCQ specific styling for Bangladesh format */
.mcq-section .options {
  margin: 8px 0 8px 25px;
}

.mcq-section .option {
  margin-bottom: 3px;
  font-size: 11px;
}

.export-ready .paper-header h1 {
  font-size: 16pt;
}

.export-ready .paper-header h2 {
  font-size: 14pt;
}

.export-ready .section-header h3 {
  font-size: 13pt;
}

.export-ready .question-text {
  font-size: 12pt;
}`;

    return { html: html, css: css };
  }

  async regenerateSection(
    sectionContent: string,
    context: string,
    classConfig: ClassConfig,
    subject: string
  ): Promise<{ response: string; regeneratedContent: string }> {
    try {
      const prompt = `
${this.getQuestionContext(classConfig)}
Regenerate the following section content for ${classConfig.name} ${subject}:
${context}
Current content:
${sectionContent}
Improvements needed:
- Enhance clarity and educational value
- Ensure alignment with curriculum
- Maintain appropriate difficulty level
- Add more context where needed
      `;

      const model = this.googleAI('gemini-1.5-flash');
      const { text } = await generateText({ model, prompt });

      return {
        response: 'Section successfully regenerated with improvements',
        regeneratedContent: text
      };
    } catch (error) {
      console.error('Error regenerating section:', error);
      return {
        response: 'Failed to regenerate section. Using original content.',
        regeneratedContent: sectionContent
      };
    }
  }

  async generateResponse(
    message: string,
    documents: string[],
    previousMessages: ChatMessage[]
  ): Promise<{ response: string; htmlOutput?: GeneratedHTML }> {
    try {
      const prompt = `
You are AXAM, an expert AI assistant and exceptional senior Teacher with vast knowledge across multiple subjects.
User message: ${message}
Previous conversation context: ${previousMessages.slice(-3).map(m => m.content).join('\n')}
      `;

      const model = this.googleAI('gemini-1.5-flash', {
        temperature: 0.7,
        maxTokens: 1000,
        topP: 0.9,
      });
      
      const { text } = await generateText({ model, prompt });

      return {
        response: text,
        htmlOutput: undefined
      };
    } catch (error) {
      console.error('Error generating response:', error);
      return {
        response: "I can help you generate question papers! Please select a class and subject from the dropdown menus, then use the question patterns or describe what type of questions you'd like me to create.",
        htmlOutput: undefined
      };
    }
  }
}