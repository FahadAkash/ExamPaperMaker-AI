import { ChatMessage, GeneratedHTML, QuestionPaper, ClassConfig } from '@/types';


export class AIService {
  private static instance: AIService;

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
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    const questionPaper = this.createQuestionPaper(message, classConfig, subject, documents);
    const htmlOutput = this.generateQuestionPaperHTML(questionPaper);
    return {
      response: `I've generated a comprehensive question paper for ${classConfig.name} ${subject}. The paper includes multiple question types with proper marking scheme and instructions.`,
      questionPaper,
      htmlOutput
    };
  }

  async regenerateSection(
    sectionContent: string,
    context: string,
    classConfig: ClassConfig,
    subject: string
  ): Promise<{ response: string; regeneratedContent: string }> {
    // Simulate API delay for regeneration
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate improved version of the selected content
    const improvedContent = this.improveContent(sectionContent, context, classConfig, subject);

    return {
      response: `I've regenerated the selected content with improvements for better clarity and educational value.`,
      regeneratedContent: improvedContent
    };
  }

  private improveContent(content: string, context: string, classConfig: ClassConfig, subject: string): string {
    // Simple content improvement logic - in real implementation, use AI API
    const improvements = [
      'Enhanced with clearer language and better structure',
      'Improved with more specific examples and context',
      'Refined for better understanding and engagement',
      'Optimized for the target class level and subject'
    ];

    return `${content} (${improvements[Math.floor(Math.random() * improvements.length)]})`;
  }

  private createQuestionPaper(
    prompt: string,
    classConfig: ClassConfig,
    subject: string,
    documents: string[]
  ): QuestionPaper {
    const topics = this.extractTopicsFromPrompt(prompt, documents);
    const questionPaper: QuestionPaper = {
      id: Math.random().toString(36).substr(2, 9),
      className: classConfig.name,
      subject: subject,
      title: `${classConfig.name} ${subject} - Examination`,
      timeLimit: classConfig.timeLimit,
      totalMarks: classConfig.totalMarks,
      instructions: this.generateInstructions(classConfig),
      sections: this.generateSections(classConfig, subject, topics),
      generatedAt: new Date()
    };

    return questionPaper;
  }

  private extractTopicsFromPrompt(prompt: string, documents: string[]): string[] {
    // Extract topics from prompt and documents
    const commonTopics = {
      'Mathematics': ['Algebra', 'Geometry', 'Arithmetic', 'Statistics', 'Probability'],
      'Science': ['Physics', 'Chemistry', 'Biology', 'Environmental Science'],
      'English': ['Grammar', 'Literature', 'Comprehension', 'Writing Skills'],
      'Social Studies': ['History', 'Geography', 'Civics', 'Economics']
    };

    // Simple topic extraction - in real implementation, use NLP
    return ['Chapter 1', 'Chapter 2', 'Chapter 3'];
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

  private generateSections(classConfig: ClassConfig, subject: string, topics: string[]) {
    const sections = [];

    // Section A - MCQs (if applicable)
    if (classConfig.questionTypes.includes('MCQ')) {
      sections.push({
        id: 'section-a',
        title: 'Section A - Multiple Choice Questions',
        instructions: 'Choose the correct option for each question. Each question carries 1 mark.',
        questions: this.generateMCQs(subject, topics, Math.min(20, Math.floor(classConfig.totalMarks * 0.2))),
        marks: Math.min(20, Math.floor(classConfig.totalMarks * 0.2))
      });
    }

    // Section B - Short Answer Questions
    if (classConfig.questionTypes.includes('Short Answer')) {
      sections.push({
        id: 'section-b',
        title: 'Section B - Short Answer Questions',
        instructions: 'Answer any 8 questions from this section. Each question carries 3 marks.',
        questions: this.generateShortAnswerQuestions(subject, topics, 10),
        marks: 24
      });
    }

    // Section C - Long Answer Questions
    if (classConfig.questionTypes.includes('Long Answer')) {
      sections.push({
        id: 'section-c',
        title: 'Section C - Long Answer Questions',
        instructions: 'Answer any 4 questions from this section. Each question carries 5 marks.',
        questions: this.generateLongAnswerQuestions(subject, topics, 6),
        marks: 20
      });
    }

    return sections;
  }

  private generateMCQs(subject: string, topics: string[], count: number) {
    const questions = [];
    const sampleQuestions = {
      'Mathematics': [
        { question: 'x² - 5x + 6 = 0 সমীকরণের মূল কোনটি?', options: ['2, 3', '1, 6', '-2, -3', '5, 1'], answer: 0 },
        { question: 'একটি সমকোণী ত্রিভুজের অতিভুজ 5 সেমি এবং একটি বাহু 3 সেমি হলে অপর বাহুর দৈর্ঘ্য কত?', options: ['4 সেমি', '8 সেমি', '2 সেমি', '6 সেমি'], answer: 0 },
        { question: 'log₁₀ 100 এর মান কত?', options: ['1', '2', '10', '100'], answer: 1 }
      ],
      'Physics': [
        { question: 'আলোর বেগ কত?', options: ['3×10⁸ m/s', '3×10⁶ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], answer: 0 },
        { question: 'নিউটনের প্রথম সূত্রের অপর নাম কী?', options: ['জড়তার সূত্র', 'ত্বরণের সূত্র', 'ক্রিয়া-প্রতিক্রিয়ার সূত্র', 'মহাকর্ষের সূত্র'], answer: 0 },
        { question: 'শব্দের বেগ বাতাসে কত?', options: ['332 m/s', '3×10⁸ m/s', '1500 m/s', '5000 m/s'], answer: 0 }
      ],
      'Chemistry': [
        { question: 'পানির রাসায়নিক সংকেত কী?', options: ['H₂O', 'CO₂', 'NaCl', 'O₂'], answer: 0 },
        { question: 'অক্সিজেনের পারমাণবিক সংখ্যা কত?', options: ['6', '7', '8', '9'], answer: 2 },
        { question: 'কোনটি একটি নিষ্ক্রিয় গ্যাস?', options: ['অক্সিজেন', 'নাইট্রোজেন', 'আর্গন', 'কার্বন ডাই-অক্সাইড'], answer: 2 }
      ],
      'Biology': [
        { question: 'সালোকসংশ্লেষণ প্রক্রিয়ায় কোন গ্যাস নির্গত হয়?', options: ['অক্সিজেন', 'কার্বন ডাই-অক্সাইড', 'নাইট্রোজেন', 'হাইড্রোজেন'], answer: 0 },
        { question: 'মানুষের হৃৎপিণ্ডে কয়টি প্রকোষ্ঠ আছে?', options: ['2টি', '3টি', '4টি', '5টি'], answer: 2 },
        { question: 'DNA এর পূর্ণরূপ কী?', options: ['Deoxyribonucleic Acid', 'Dinitric Acid', 'Diacetic Acid', 'Deoxyribose Acid'], answer: 0 }
      ],
      'Bangla': [
        { question: '"পদ্মা নদীর মাঝি" উপন্যাসের লেখক কে?', options: ['মানিক বন্দ্যোপাধ্যায়', 'বিভূতিভূষণ বন্দ্যোপাধ্যায়', 'তারাশঙ্কর বন্দ্যোপাধ্যায়', 'সতীনাথ ভাদুড়ী'], answer: 0 },
        { question: 'বাংলা সাহিত্যের প্রথম মহাকাব্য কোনটি?', options: ['মেঘনাদবধ কাব্য', 'বৃত্রসংহার', 'শর্মিষ্ঠা', 'কৃষ্ণকুমারী'], answer: 0 },
        { question: '"সংশপ্তক" শব্দের অর্থ কী?', options: ['প্রতিজ্ঞাবদ্ধ যোদ্ধা', 'বীর যোদ্ধা', 'সাহসী যোদ্ধা', 'দক্ষ যোদ্ধা'], answer: 0 }
      ],
      'English': [
        { question: 'Which of the following is a noun?', options: ['Run', 'Beautiful', 'Book', 'Quickly'], answer: 2 },
        { question: 'What is the past tense of "go"?', options: ['Gone', 'Going', 'Went', 'Goes'], answer: 2 },
        { question: 'The synonym of "Abundant" is:', options: ['Scarce', 'Plentiful', 'Limited', 'Rare'], answer: 1 }
      ],
      'Bangladesh & Global Studies': [
        { question: 'বাংলাদেশের স্বাধীনতা দিবস কবে?', options: ['২৬ মার্চ', '১৬ ডিসেম্বর', '২১ ফেব্রুয়ারি', '১৪ এপ্রিল'], answer: 0 },
        { question: 'বাংলাদেশের জাতীয় ফুল কোনটি?', options: ['গোলাপ', 'শাপলা', 'জুঁই', 'বেলি'], answer: 1 },
        { question: 'বাংলাদেশের সর্ববৃহৎ নদী কোনটি?', options: ['পদ্মা', 'মেঘনা', 'যমুনা', 'ব্রহ্মপুত্র'], answer: 0 }
      ]
    };

    const subjectQuestions = sampleQuestions[subject as keyof typeof sampleQuestions] || sampleQuestions['Physics'];

    for (let i = 0; i < count; i++) {
      const baseQuestion = subjectQuestions[i % subjectQuestions.length];
      questions.push({
        id: `mcq-${i + 1}`,
        type: 'mcq' as const,
        question: `${i + 1}. ${baseQuestion.question}`,
        options: baseQuestion.options.map((option, index) => `${String.fromCharCode(2453 + index)}) ${option}`), // ক, খ, গ, ঘ
        marks: 1,
        difficulty: 'medium' as const
      });
    }

    return questions;
  }

  private generateShortAnswerQuestions(subject: string, topics: string[], count: number) {
    const questions = [];
    const sampleQuestions = {
      'Mathematics': [
        '2x + 5 = 15 সমীকরণটি সমাধান করো।',
        'একটি আয়তক্ষেত্রের দৈর্ঘ্য 8 সেমি এবং প্রস্থ 5 সেমি হলে এর ক্ষেত্রফল নির্ণয় করো।',
        'মূলদ ও অমূলদ সংখ্যার মধ্যে পার্থক্য লেখো।'
      ],
      'Physics': [
        'উদ্ভিদের সালোকসংশ্লেষণ প্রক্রিয়া ব্যাখ্যা করো।',
        'নিউটনের গতিসূত্রগুলো বিবৃত করো।',
        'পরমাণুর গঠন বর্ণনা করো।'
      ],
      'Chemistry': [
        'অ্যাসিড ও ক্ষারের মধ্যে পার্থক্য লেখো।',
        'রাসায়নিক বন্ধনের প্রকারভেদ আলোচনা করো।',
        'জারণ-বিজারণ বিক্রিয়া কী? উদাহরণসহ ব্যাখ্যা করো।'
      ],
      'Biology': [
        'কোষ বিভাজনের প্রকারভেদ ও গুরুত্ব আলোচনা করো।',
        'মানুষের পরিপাকতন্ত্রের বর্ণনা দাও।',
        'বংশগতির সূত্রগুলো ব্যাখ্যা করো।'
      ],
      'Bangla': [
        'বাংলা সাহিত্যে রবীন্দ্রনাথ ঠাকুরের অবদান আলোচনা করো।',
        'বাংলা ভাষার উৎপত্তি ও বিকাশ সম্পর্কে লেখো।',
        'আধুনিক বাংলা কবিতার বৈশিষ্ট্য আলোচনা করো।'
      ],
      'English': [
        'Write a paragraph about the importance of education.',
        'Explain the difference between a simile and a metaphor with examples.',
        'Describe the role of technology in modern education.'
      ],
      'Bangladesh & Global Studies': [
        'বাংলাদেশের মুক্তিযুদ্ধের কারণ ও ফলাফল আলোচনা করো।',
        'বাংলাদেশের ভৌগোলিক অবস্থান ও জলবায়ু বর্ণনা করো।',
        'জাতিসংঘের গঠন ও কার্যাবলী আলোচনা করো।'
      ]
    };

    const subjectQuestions = sampleQuestions[subject as keyof typeof sampleQuestions] || sampleQuestions['Physics'];

    for (let i = 0; i < count; i++) {
      questions.push({
        id: `short-${i + 1}`,
        type: 'short' as const,
        question: `${i + 1}. ${subjectQuestions[i % subjectQuestions.length]}`,
        marks: 3,
        difficulty: 'medium' as const
      });
    }

    return questions;
  }

  private generateLongAnswerQuestions(subject: string, topics: string[], count: number) {
    const questions = [];
    const sampleQuestions = {
      'Mathematics': [
        'প্রমাণ করো যে, ত্রিভুজের তিন কোণের সমষ্টি 180°।',
        'x² - 5x + 6 = 0 দ্বিঘাত সমীকরণটি উৎপাদকে বিশ্লেষণ পদ্ধতিতে সমাধান করো।',
        'সম্ভাব্যতার ধারণা উদাহরণসহ ব্যাখ্যা করো।'
      ],
      'Physics': [
        'মানুষের পরিপাকতন্ত্রের একটি পরিচ্ছন্ন চিহ্নিত চিত্রসহ বর্ণনা দাও।',
        'জল চক্র এবং প্রকৃতিতে এর গুরুত্ব ব্যাখ্যা করো।',
        'গ্লোবাল ওয়ার্মিং কী? এর কারণ ও প্রভাব আলোচনা করো।'
      ],
      'Chemistry': [
        'জৈব রসায়নের মূলনীতিগুলো বিস্তারিত আলোচনা করো।',
        'তড়িৎ বিশ্লেষণের নীতি ও প্রয়োগ ব্যাখ্যা করো।',
        'পর্যায় সারণির আধুনিক রূপ ও এর বৈশিষ্ট্য আলোচনা করো।'
      ],
      'Biology': [
        'ফটোসিনথেসিস প্রক্রিয়ার বিস্তারিত বিবরণ দাও।',
        'মানুষের রক্ত সংবহনতন্ত্রের গঠন ও কার্যাবলী আলোচনা করো।',
        'বিবর্তনবাদের মূল তত্ত্বগুলো ব্যাখ্যা করো।'
      ],
      'Bangla': [
        'বাংলা সাহিত্যে মধুসূদন দত্তের অবদান মূল্যায়ন করো।',
        'আধুনিক বাংলা গদ্যের বিকাশে বঙ্কিমচন্দ্রের ভূমিকা আলোচনা করো।',
        'বাংলা ভাষা আন্দোলনের ইতিহাস ও তাৎপর্য বিশ্লেষণ করো।'
      ],
      'English': [
        'Write an essay on "The Role of Technology in Education".',
        'Analyze the character development in Shakespeare\'s Hamlet.',
        'Discuss the theme of social justice in modern literature with examples.'
      ],
      'Bangladesh & Global Studies': [
        'বাংলাদেশের অর্থনৈতিক উন্নয়নে কৃষিখাতের ভূমিকা বিশ্লেষণ করো।',
        'দক্ষিণ এশিয়ার রাজনৈতিক পরিস্থিতি ও বাংলাদেশের অবস্থান আলোচনা করো।',
        'জলবায়ু পরিবর্তনের প্রভাব ও বাংলাদেশের করণীয় নিয়ে আলোচনা করো।'
      ]
    };

    const subjectQuestions = sampleQuestions[subject as keyof typeof sampleQuestions] || sampleQuestions['Physics'];

    for (let i = 0; i < count; i++) {
      questions.push({
        id: `long-${i + 1}`,
        type: 'long' as const,
        question: `${i + 1}. ${subjectQuestions[i % subjectQuestions.length]}`,
        marks: 5,
        difficulty: 'hard' as const
      });
    }

    return questions;
  }

  private generateCreativeQuestions(subject: string, topics: string[], count: number) {
    const questions = [];
    const sampleCreativeQuestions = {
      'Mathematics': [
        {
          stem: 'একটি ত্রিভুজের তিনটি বাহুর দৈর্ঘ্য যথাক্রমে 3 সেমি, 4 সেমি এবং 5 সেমি।',
          info: 'জ্যামিতিতে ত্রিভুজ একটি গুরুত্বপূর্ণ আকৃতি। বিভিন্ন ধরনের ত্রিভুজের বিভিন্ন বৈশিষ্ট্য রয়েছে।',
          subquestions: [
            'ক) ত্রিভুজটি কী ধরনের ত্রিভুজ? (১ নম্বর)',
            'খ) ত্রিভুজটির ক্ষেত্রফল নির্ণয় করো। (২ নম্বর)',
            'গ) ত্রিভুজটির পরিসীমা ও ক্ষেত্রফলের অনুপাত নির্ণয় করো। (৩ নম্বর)',
            'ঘ) এই ত্রিভুজের অনুরূপ আরেকটি ত্রিভুজের বাহুগুলো দ্বিগুণ হলে ক্ষেত্রফল কত গুণ হবে? গাণিতিক যুক্তিসহ ব্যাখ্যা করো। (৪ নম্বর)'
          ]
        }
      ],
      'Physics': [
        {
          stem: 'একটি গাড়ি স্থির অবস্থা থেকে 2 m/s² ত্বরণে চলতে শুরু করল।',
          info: 'গতিবিদ্যায় ত্বরণ একটি গুরুত্বপূর্ণ রাশি। এটি বেগ পরিবর্তনের হার নির্দেশ করে।',
          subquestions: [
            'ক) ত্বরণ কাকে বলে? (১ নম্বর)',
            'খ) ৫ সেকেন্ড পর গাড়িটির বেগ কত হবে? (২ নম্বর)',
            'গ) প্রথম ১০ সেকেন্ডে গাড়িটি কত দূরত্ব অতিক্রম করবে? (৩ নম্বর)',
            'ঘ) গাড়িটি যদি ১০ সেকেন্ড পর ব্রেক করে 3 m/s² মন্দনে থামে, তাহলে মোট কত দূরত্ব অতিক্রম করবে? গাণিতিক বিশ্লেষণসহ ব্যাখ্যা করো। (৪ নম্বর)'
          ]
        }
      ]
    };

    const subjectQuestions = sampleCreativeQuestions[subject as keyof typeof sampleCreativeQuestions] || sampleCreativeQuestions['Physics'];

    for (let i = 0; i < count; i++) {
      const baseQuestion = subjectQuestions[i % subjectQuestions.length];
      questions.push({
        id: `creative-${i + 1}`,
        type: 'creative' as const,
        question: `${i + 1}. <div class="creative-question">
          <div class="creative-stem">${baseQuestion.stem}</div>
          <div class="creative-info">${baseQuestion.info}</div>
          <div class="creative-subquestions">
            ${baseQuestion.subquestions.map(sq => `<div class="subquestion">${sq}</div>`).join('')}
          </div>
        </div>`,
        marks: 10,
        difficulty: 'medium' as const
      });
    }

    return questions;
  }

  private generateStructuredQuestions(subject: string, topics: string[], count: number) {
    const questions = [];
    const sampleStructuredQuestions = {
      'Physics': [
        'তড়িৎ প্রবাহ ও রোধের মধ্যে সম্পর্ক ব্যাখ্যা করো। ওহমের সূত্র প্রয়োগ করে একটি সমস্যা সমাধান করো।',
        'আলোর প্রতিফলন ও প্রতিসরণের মধ্যে পার্থক্য লেখো। স্নেলের সূত্র বিবৃত করো।',
        'তাপ ও তাপমাত্রার মধ্যে পার্থক্য আলোচনা করো। তাপ পরিবহনের পদ্ধতিগুলো ব্যাখ্যা করো।'
      ],
      'Chemistry': [
        'অ্যাসিড ও ক্ষারের বৈশিষ্ট্য তুলনা করো। pH স্কেলের গুরুত্ব ব্যাখ্যা করো।',
        'জৈব যৌগের শ্রেণিবিভাগ আলোচনা করো। হাইড্রোকার্বনের প্রকারভেদ বর্ণনা করো।',
        'রাসায়নিক বিক্রিয়ার হার নির্ধারণকারী উপাদানগুলো আলোচনা করো।'
      ]
    };

    const subjectQuestions = sampleStructuredQuestions[subject as keyof typeof sampleStructuredQuestions] || sampleStructuredQuestions['Physics'];

    for (let i = 0; i < count; i++) {
      questions.push({
        id: `structured-${i + 1}`,
        type: 'structured' as const,
        question: `${i + 1}. ${subjectQuestions[i % subjectQuestions.length]}`,
        marks: 10,
        difficulty: 'medium' as const
      });
    }

    return questions;
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
    <section class="question-section">
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
  font-family: 'Times New Roman', serif;
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

/* Creative Question Styling */
.creative-question {
  border: 1px solid #ddd;
  margin: 15px 0;
  padding: 15px;
  background: #fafafa;
}

.creative-stem {
  font-weight: bold;
  margin-bottom: 10px;
  padding: 8px;
  background: #e8f4f8;
  border-left: 4px solid #2196F3;
}

.creative-info {
  margin: 10px 0;
  padding: 10px;
  background: #f0f8e8;
  border-left: 4px solid #4CAF50;
  font-style: italic;
}

.creative-subquestions {
  margin-top: 15px;
}

.creative-subquestions .subquestion {
  margin: 8px 0;
  padding-left: 15px;
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

  async generateResponse(
    message: string,
    documents: string[],
    previousMessages: ChatMessage[]
  ): Promise<{ response: string; htmlOutput?: GeneratedHTML }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      response: "I can help you generate question papers! Please select a class and subject from the dropdown menus, then use the question patterns or describe what type of questions you'd like me to create."
    };
  }
}