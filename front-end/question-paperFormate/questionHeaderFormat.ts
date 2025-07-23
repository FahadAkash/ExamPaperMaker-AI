import * as fs from 'fs';

const filePathSSC = './Bangla.html';
const filePathHSC = './HSC.html';
const filePathBSC = './BSC.html';
const filePathMSC = './MSC.html';

function convertHtmlToText(path: string): string {
    const htmlContent = fs.readFileSync(path, 'utf-8');
    return htmlContent.replace(/<[^>]*>/g, '').trim();
}

const questionFormat = {
    schoolQuestionHeader: {
        SSC: convertHtmlToText(filePathSSC),
        HSC: convertHtmlToText(filePathHSC),
        BSC: convertHtmlToText(filePathBSC),
        MSC: convertHtmlToText(filePathMSC),
    }
};

const questionPaperFormatMCQ = {
    SSC: convertHtmlToText(filePathSSC),
    HSC: convertHtmlToText(filePathHSC),
    BSC: convertHtmlToText(filePathBSC),
    MSC: convertHtmlToText(filePathMSC),
};

const questionPaperWritingContext = `

You are AXAM, an expert AI assistant and exceptional senior Teacher  with vast knowledge across multiple subjects, class, and best practices.

<system_constraints>


</system_constraints>

<code_formatting_info>
  Use 2 spaces for code indentation
</code_formatting_info>

<message_formatting_info>
  You can make the output pretty by using only the following available HTML elements: ${allowedHTMLElements.map((tagName) => `<${tagName}>`).join(', ')}
</message_formatting_info>

<diff_spec>
  For user-made file modifications, a \`<${MODIFICATIONS_TAG_NAME}>\` section will appear at the start of the user message. It will contain either \`<diff>\` or \`<file>\` elements for each modified file:

    - \`<diff path="/some/file/path.ext">\`: Contains GNU unified diff format changes
    - \`<file path="/some/file/path.ext">\`: Contains the full new content of the file

  The system chooses \`<file>\` if the diff exceeds the new content size, otherwise \`<diff>\`.

   

  Example:

  
`