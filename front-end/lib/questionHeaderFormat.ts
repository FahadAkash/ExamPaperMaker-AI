// lib/loadQuestionHeaders.ts
import fs from 'fs';
import path from 'path';

function convertHtmlToText(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function loadQuestionHeaders() {
  const filePathSSC = path.join(process.cwd(), 'question-paperFormate', 'Bangla.html');
  const filePathHSC = path.join(process.cwd(), 'question-paperFormate', 'HSC.html');
  const filePathBSC = path.join(process.cwd(), 'question-paperFormate', 'BSC.html');
  const filePathMSC = path.join(process.cwd(), 'question-paperFormate', 'MSC.html');

  const questionFormat = {
    schoolQuestionHeader: {
      SSC: convertHtmlToText(fs.readFileSync(filePathSSC, 'utf-8')),
      HSC: convertHtmlToText(fs.readFileSync(filePathHSC, 'utf-8')),
      BSC: convertHtmlToText(fs.readFileSync(filePathBSC, 'utf-8')),
      MSC: convertHtmlToText(fs.readFileSync(filePathMSC, 'utf-8')),
    },
  };

  const questionPaperFormatMCQ = {
    SSC: questionFormat.schoolQuestionHeader.SSC,
    HSC: questionFormat.schoolQuestionHeader.HSC,
    BSC: questionFormat.schoolQuestionHeader.BSC,
    MSC: questionFormat.schoolQuestionHeader.MSC,
  };

  return { questionFormat, questionPaperFormatMCQ };
}