import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-user-reviews.ts';
import '@/ai/flows/create-targeted-notifications.ts';
import '@/ai/flows/moderate-user-behavior.ts';