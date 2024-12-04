import { openai } from '@ai-sdk/openai';
import { generateText } from 'ai';;
export const maxDuration = 30;


export async function generateQuestions(grade: number,
    subject: string,
    totalQuestions: number,
    difficulty: string) {
  try {
    const prompt = `Generate ${totalQuestions} multiple-choice questions for a Grade ${grade} student in ${subject}. 
    Questions should have 4 options (A, B, C, D) and specify the correct answer. 
    Make the questions ${difficulty.toLowerCase()} level. Provide the output in JSON format like this:
    [
      {
        "questionText": "string",
        "options": ["A: Option1", "B: Option2", "C: Option3", "D: Option4"],
        "correctAnswer": "A || B || C || D"
      }
    ].don't make lengthy use simple question`;

    // const prompt = "hey write some story";
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
    });
    
    return text;

  } catch (error) {
    console.error("Error generating questions:", error);
    throw new Error("Failed to generate quiz questions. Please try again.");
  }

}