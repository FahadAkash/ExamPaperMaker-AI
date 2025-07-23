// pages/index.tsx
import { loadQuestionHeaders } from '@/lib/questionHeaderFormat';

export async function getStaticProps() {
  const { questionFormat, questionPaperFormatMCQ } = loadQuestionHeaders();

  return {
    props: {
      questionFormat,
      questionPaperFormatMCQ,
    },
  };
}