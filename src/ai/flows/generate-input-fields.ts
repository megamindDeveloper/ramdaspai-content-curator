'use server';

/**
 * @fileOverview A Genkit flow to dynamically generate input fields based on the selected content type.
 *
 * - generateInputFields - A function that returns the input fields required for a given content type.
 * - GenerateInputFieldsInput - The input type for the generateInputFields function.
 * - GenerateInputFieldsOutput - The return type for the generateInputFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInputFieldsInputSchema = z.object({
  contentType: z
    .enum(['YouTube', 'Images', 'Reels', 'Screenshots'])
    .describe('The type of content to be submitted.'),
});
export type GenerateInputFieldsInput = z.infer<typeof GenerateInputFieldsInputSchema>;

const GenerateInputFieldsOutputSchema = z.object({
  fields: z.array(z.string()).describe('A list of input field names required for the content type.'),
});
export type GenerateInputFieldsOutput = z.infer<typeof GenerateInputFieldsOutputSchema>;

export async function generateInputFields(input: GenerateInputFieldsInput): Promise<GenerateInputFieldsOutput> {
  return generateInputFieldsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInputFieldsPrompt',
  input: {schema: GenerateInputFieldsInputSchema},
  output: {schema: GenerateInputFieldsOutputSchema},
  prompt: `You are a form generation expert. You determine the fields necessary to collect the given content type.

Given the content type: {{{contentType}}}, return a JSON array containing only the names of the necessary input fields.

Possible fields include: youtubeUrl, imageUrl, reelsUrl, thumbnail, screenshot1, screenshot2, screenshot3, screenshot4, screenshot5.

Do not include any fields that are not relevant to the content type.

For example, if the content type is "Images", the output should be ["imageUrl"].
`,
});

const generateInputFieldsFlow = ai.defineFlow(
  {
    name: 'generateInputFieldsFlow',
    inputSchema: GenerateInputFieldsInputSchema,
    outputSchema: GenerateInputFieldsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
