'use server';

/**
 * @fileOverview A flow for creating targeted push notifications to users or drivers.
 *
 * - createTargetedNotification - A function that generates a targeted push notification message.
 * - CreateTargetedNotificationInput - The input type for the createTargetedNotification function.
 * - CreateTargetedNotificationOutput - The return type for the createTargetedNotification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateTargetedNotificationInputSchema = z.object({
  recipientType: z.enum(['user', 'driver']).describe('The type of recipient for the notification (user or driver).'),
  situation: z.string().describe('The specific situation or context for the notification (e.g., promotion, order update, driver availability).'),
  details: z.string().optional().describe('Additional details or context to include in the notification.'),
  tone: z.enum(['formal', 'informal', 'friendly', 'urgent']).default('friendly').describe('The desired tone of the notification.'),
});
export type CreateTargetedNotificationInput = z.infer<typeof CreateTargetedNotificationInputSchema>;

const CreateTargetedNotificationOutputSchema = z.object({
  title: z.string().describe('The title of the notification.'),
  body: z.string().describe('The body of the notification.'),
});
export type CreateTargetedNotificationOutput = z.infer<typeof CreateTargetedNotificationOutputSchema>;

export async function createTargetedNotification(input: CreateTargetedNotificationInput): Promise<CreateTargetedNotificationOutput> {
  return createTargetedNotificationFlow(input);
}

const notificationPrompt = ai.definePrompt({
  name: 'notificationPrompt',
  input: {schema: CreateTargetedNotificationInputSchema},
  output: {schema: CreateTargetedNotificationOutputSchema},
  prompt: `You are an expert notification composer for the Deliverzler app. Your task is to create engaging and informative push notifications for users and drivers.

  Recipient Type: {{{recipientType}}}
  Situation: {{{situation}}}
  Details: {{{details}}}
  Tone: {{{tone}}}

  Compose a notification with a suitable title and body, optimized for a mobile push notification. The tone should be appropriate for the recipient type and situation. Be concise and engaging.
  Ensure that the generated notification is no longer than 200 characters in body.
  `,
});

const createTargetedNotificationFlow = ai.defineFlow(
  {
    name: 'createTargetedNotificationFlow',
    inputSchema: CreateTargetedNotificationInputSchema,
    outputSchema: CreateTargetedNotificationOutputSchema,
  },
  async input => {
    const {output} = await notificationPrompt(input);
    return output!;
  }
);
