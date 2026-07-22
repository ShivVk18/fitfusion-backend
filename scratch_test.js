import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenAI } from '@google/genai';

async function testFormat() {
  const ai = new GoogleGenAI({});

  const interaction = await ai.interactions.create({
    model: 'gemini-3.5-flash',
    input: 'Explain how AI works in a few words',
  });

  console.log("Format Output:", interaction.output_text);
}

testFormat();
