'use server';

import { motionParser } from '@/ai/flows/motion-parser';
import { mapMotionTemplate } from '@/ai/flows/motion-template-mapper';
import type { MotionPlan } from '@/types';

export async function generateMotionPlan(prompt: string): Promise<{ plan: MotionPlan | null; error: string | null }> {
  if (!prompt) {
    return { plan: null, error: 'Prompt cannot be empty.' };
  }

  try {
    const parsingResult = await motionParser({ prompt });
    if (!parsingResult || !parsingResult.motionPrimitives || parsingResult.motionPrimitives.length === 0) {
      return { plan: null, error: 'Could not parse any motion steps from the prompt. Try being more specific.' };
    }

    const templateResult = await mapMotionTemplate({ motionPrimitives: parsingResult.motionPrimitives });
    if (!templateResult.motionPlan || templateResult.motionPlan.length === 0) {
      return { plan: null, error: 'Could not map the parsed steps to motion templates.' };
    }

    const plan: MotionPlan = templateResult.motionPlan.map((step) => ({
      ...step,
      id: crypto.randomUUID(),
    }));

    return { plan, error: null };
  } catch (e: any) {
    console.error('Error generating motion plan:', e);
    const errorMessage = e.message?.includes('JSON') 
      ? 'The AI returned an invalid format. Please try rephrasing your prompt.'
      : 'An unexpected error occurred. Please try again.';
    return { plan: null, error: e.message || errorMessage };
  }
}
