'use server';
/**
 * @fileOverview Suggests improvements to a user-provided prompt.
 *
 * - suggestPromptImprovements - A function that suggests improvements to a prompt.
 * - SuggestPromptImprovementsInput - The input type for the suggestPromptImprovements function.
 * - SuggestPromptImprovementsOutput - The return type for the suggestPromptImprovements function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestPromptImprovementsInputSchema = z.object({
  prompt: z.string().describe('The prompt to improve.'),
});
export type SuggestPromptImprovementsInput = z.infer<typeof SuggestPromptImprovementsInputSchema>;

const SuggestPromptImprovementsOutputSchema = z.object({
  improvedPromptSuggestions: z
    .array(z.string())
    .describe('An array of suggested improvements to the prompt.'),
});
export type SuggestPromptImprovementsOutput = z.infer<typeof SuggestPromptImprovementsOutputSchema>;

export async function suggestPromptImprovements(
  input: SuggestPromptImprovementsInput
): Promise<SuggestPromptImprovementsOutput> {
  return suggestPromptImprovementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPromptImprovementsPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('The prompt to improve.'),
    }),
  },
  output: {
    schema: z.object({
      improvedPromptSuggestions: z
        .array(z.string())
        .describe('An array of suggested improvements to the prompt.'),
    }),
  },
  prompt: `You are an expert prompt engineer. Given the following prompt, suggest three concrete improvements to the prompt to make it more effective. Respond with the improved prompts in a JSON array.

Prompt: {{{prompt}}}`,
});

const suggestPromptImprovementsFlow = ai.defineFlow<
  typeof SuggestPromptImprovementsInputSchema,
  typeof SuggestPromptImprovementsOutputSchema
>(
  {
    name: 'suggestPromptImprovementsFlow',
    inputSchema: SuggestPromptImprovementsInputSchema,
    outputSchema: SuggestPromptImprovementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
