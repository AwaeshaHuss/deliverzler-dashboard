'use server';

/**
 * @fileOverview A flow for setting a custom 'admin' claim on a Firebase user.
 *
 * - setAdminClaim - A function that assigns admin privileges to a user by their email.
 * - SetAdminClaimInput - The input type for the setAdminClaim function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const SetAdminClaimInputSchema = z.object({
  email: z.string().email().describe('The email address of the user to make an admin.'),
});

export type SetAdminClaimInput = z.infer<typeof SetAdminClaimInputSchema>;

export async function setAdminClaim(input: SetAdminClaimInput): Promise<{
  success: boolean;
  message: string;
}> {
  return setAdminClaimFlow(input);
}

const setAdminClaimFlow = ai.defineFlow(
  {
    name: 'setAdminClaimFlow',
    inputSchema: SetAdminClaimInputSchema,
    outputSchema: z.object({ success: z.boolean(), message: z.string() }),
  },
  async (input) => {
    try {
      const user = await admin.auth().getUserByEmail(input.email);
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      return {
        success: true,
        message: `Successfully set admin claim for user: ${input.email}`,
      };
    } catch (error: any) {
      console.error('Error setting custom claim:', error);
      return {
        success: false,
        message: `Error setting custom claim: ${error.message}`,
      };
    }
  }
);
