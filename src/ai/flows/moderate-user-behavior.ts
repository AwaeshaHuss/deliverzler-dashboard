'use server';

/**
 * @fileOverview A flow to moderate user behavior and determine if a user account should be blocked.
 *
 * - moderateUserBehavior - A function that moderates user behavior and returns a recommendation on whether to block the user.
 * - ModerateUserBehaviorInput - The input type for the moderateUserBehavior function.
 * - ModerateUserBehaviorOutput - The return type for the moderateUserBehavior function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ModerateUserBehaviorInputSchema = z.object({
  userActivitySummary: z
    .string()
    .describe('A summary of the user\'s recent activity on the platform.'),
});
export type ModerateUserBehaviorInput = z.infer<typeof ModerateUserBehaviorInputSchema>;

const ModerateUserBehaviorOutputSchema = z.object({
  blockUser: z
    .boolean()
    .describe(
      'A boolean value indicating whether the user account should be blocked based on their recent activity.'
    ),
  reason: z.string().describe('The reason for the block recommendation.'),
});
export type ModerateUserBehaviorOutput = z.infer<typeof ModerateUserBehaviorOutputSchema>;

export async function moderateUserBehavior(
  input: ModerateUserBehaviorInput
): Promise<ModerateUserBehaviorOutput> {
  return moderateUserBehaviorFlow(input);
}

const moderateUserBehaviorPrompt = ai.definePrompt({
  name: 'moderateUserBehaviorPrompt',
  input: {schema: ModerateUserBehaviorInputSchema},
  output: {schema: ModerateUserBehaviorOutputSchema},
  prompt: `You are an AI assistant tasked with moderating user behavior on a social media platform.

  Based on the user activity summary provided, determine whether the user\'s account should be blocked.
  Consider factors such as hate speech, harassment, spamming, and other inappropriate behavior.

  User Activity Summary: {{{userActivitySummary}}}

  Provide a boolean value for the 'blockUser' field, indicating whether the account should be blocked.
  Also, provide a detailed reason for your recommendation in the 'reason' field.
  Be brief and to the point.
  `,
});

const moderateUserBehaviorFlow = ai.defineFlow(
  {
    name: 'moderateUserBehaviorFlow',
    inputSchema: ModerateUserBehaviorInputSchema,
    outputSchema: ModerateUserBehaviorOutputSchema,
  },
  async input => {
    const {output} = await moderateUserBehaviorPrompt(input);
    return output!;
  }
);
