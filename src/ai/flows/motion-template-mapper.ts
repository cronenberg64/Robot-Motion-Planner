'use server';

/**
 * @fileOverview Maps motion primitives to predefined joint angle templates.
 *
 * - mapMotionTemplate - A function that maps motion primitives to joint angle templates.
 * - MotionTemplateInput - The input type for the mapMotionTemplate function.
 * - MotionTemplateOutput - The return type for the mapMotionTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MotionTemplateInputSchema = z.object({
  motionPrimitives: z
    .array(
      z.string().describe('A list of motion primitives, e.g., wave, point, rest.')
    )
    .describe('The list of motion primitives to map to joint angle templates.'),
});
export type MotionTemplateInput = z.infer<typeof MotionTemplateInputSchema>;

const JointAnglesSchema = z.object({
  joint1: z.array(z.number()).describe('An array of numbers representing the angle sequence for joint1.'),
  joint2: z.array(z.number()).describe('An array of numbers representing the angle sequence for joint2.'),
});

const MotionTemplateOutputSchema = z.object({
  motionPlan: z
    .array(
      z.object({
        motionPrimitive: z.string().describe('The motion primitive name.'),
        jointAngles: JointAnglesSchema.describe('The joint angles for the motion primitive.'),
      })
    )
    .describe('The motion plan containing motion primitives and their corresponding joint angles.'),
});
export type MotionTemplateOutput = z.infer<typeof MotionTemplateOutputSchema>;

export async function mapMotionTemplate(input: MotionTemplateInput): Promise<MotionTemplateOutput> {
  return mapMotionTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'motionTemplatePrompt',
  input: {schema: MotionTemplateInputSchema},
  output: {schema: MotionTemplateOutputSchema},
  prompt: `You are a robot motion planning expert. You will receive a list of motion primitives and map them to predefined joint angle templates.

  The joint angle templates are as follows:
  wave: {joint1: [0, 0.5, 0], joint2: [0, 0.5, 0]}
  point: {joint1: [0.5, 0, 0], joint2: [0.5, 0, 0]}
  rest: {joint1: [0, 0, 0], joint2: [0, 0, 0]}

  Map the motion primitives to the correct joint angles.

  Motion Primitives: {{{motionPrimitives}}}
  `,
});

const mapMotionTemplateFlow = ai.defineFlow(
  {
    name: 'mapMotionTemplateFlow',
    inputSchema: MotionTemplateInputSchema,
    outputSchema: MotionTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
