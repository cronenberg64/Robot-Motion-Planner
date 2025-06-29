'use server';

/**
 * @fileOverview Motion parser flow. Parses natural language motion prompts into a structured list of motion primitives.
 *
 * - motionParser - A function that handles the motion parsing process.
 * - MotionParserInput - The input type for the motionParser function.
 * - MotionParserOutput - The return type for the motionParser function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotionParserInputSchema = z.object({
  prompt: z.string().describe('A natural language motion prompt.'),
});
export type MotionParserInput = z.infer<typeof MotionParserInputSchema>;

const MotionParserOutputSchema = z.object({
  motionPrimitives: z
    .array(z.string())
    .describe('A list of motion primitives parsed from the prompt.'),
});
export type MotionParserOutput = z.infer<typeof MotionParserOutputSchema>;

export async function motionParser(input: MotionParserInput): Promise<MotionParserOutput> {
  return motionParserFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motionParserPrompt',
  input: {schema: MotionParserInputSchema},
  output: {schema: MotionParserOutputSchema},
  prompt: `You are a robot motion planning expert. Your task is to parse natural language motion prompts into a structured list of motion primitives.
You must respond with a valid JSON object that adheres to the following schema:
{ "motionPrimitives": ["primitive1", "primitive2"] }

Example:
Input: Make the robot wave, then point, then rest.
Output: { "motionPrimitives": ["wave", "point", "rest"] }

Input: {{{prompt}}}
Output:`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const motionParserFlow = ai.defineFlow(
  {
    name: 'motionParserFlow',
    inputSchema: MotionParserInputSchema,
    outputSchema: MotionParserOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
