import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateStory = async (prompt) => {

  try {

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
          You are a cinematic AI storyteller.
          Create emotional, immersive, scene-based stories.
          Include dialogues, narration, atmosphere, and tension.
          `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],

      model: "llama-3.3-70b-versatile",

      temperature: 1,
    });

    return completion.choices[0]?.message?.content;

  } catch (error) {

    console.log(error);
    throw new Error("Story generation failed");

  }
};