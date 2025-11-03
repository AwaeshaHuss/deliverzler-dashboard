'use server';

/**
 * @fileOverview A flow to summarize user reviews, filter profanity, and highlight key topics.
 *
 * - summarizeUserReviews - A function that handles the summarization and filtering of user reviews.
 * - SummarizeUserReviewsInput - The input type for the summarizeUserReviews function.
 * - SummarizeUserReviewsOutput - The return type for the summarizeUserReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUserReviewsInputSchema = z.object({
  reviews: z
    .array(z.string())
    .describe('An array of user review strings.'),
});
export type SummarizeUserReviewsInput = z.infer<typeof SummarizeUserReviewsInputSchema>;

const SummarizeUserReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key topics in the reviews.'),
  filteredReviews: z
    .array(z.string())
    .describe('The user reviews with profanity filtered out.'),
});
export type SummarizeUserReviewsOutput = z.infer<typeof SummarizeUserReviewsOutputSchema>;

export async function summarizeUserReviews(input: SummarizeUserReviewsInput): Promise<SummarizeUserReviewsOutput> {
  return summarizeUserReviewsFlow(input);
}

const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeUserReviewsInputSchema},
  output: {schema: SummarizeUserReviewsOutputSchema},
  prompt: `You are an AI assistant helping to moderate user reviews for a food delivery application.

  Your task is to:
  1. Filter out any profanity from the reviews.
  2. Summarize the key topics that users are discussing in their reviews.

  Here are the reviews:
  {{#each reviews}}
  - {{{this}}}
  {{/each}}

  Please provide a summary of the key topics and the filtered reviews in the format specified in the output schema.
  `,
});

const summarizeUserReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeUserReviewsFlow',
    inputSchema: SummarizeUserReviewsInputSchema,
    outputSchema: SummarizeUserReviewsOutputSchema,
  },
  async input => {
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);
