'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const behaviorSchema = z.object({ isHarmful: z.boolean(), reason: z.string().optional(), action: z.enum(['warn', 'flag', 'block']).optional(), });

export const moderateUserBehavior = async (userInput: string) => {
  const prompt = `Analyze the following user input for harmful behavior. Return a JSON object with:
isHarmful: boolean indicating if the content is harmful
reason: string explaining why it's considered harmful (if applicable)
action: one of 'warn', 'flag', or 'block' (if harmful)
Input: ${userInput}`;

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt,
      config: { temperature: 0.2 },
      output: { format: 'json', schema: behaviorSchema },
    });

    return response.output;
  } catch (error) {
    console.error('Error in behavior moderation:', error);
    return { isHarmful: false, reason: 'Error processing moderation request' };
  }
};