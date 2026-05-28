import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function generateStory(payload: {
  genre: string;
  idea: string;
  mood: string;
  style: string;
  length: string;
  motionMode: string;
}): Promise<string> {

  const combinedIdea = `
Story idea: ${payload.idea}

Mood: ${payload.mood}
Style: ${payload.style}
Length: ${payload.length}
Motion Mode: ${payload.motionMode}
`;

  try {

    const response = await axios.post(
      `${API_URL}/api/story/generate`,
      {
        genre: payload.genre,
        idea: combinedIdea,
      },
      {
        timeout: 60000,
      }
    );

    const data = response.data;

    if (typeof data === "string") return data;

    if (data.story) return data.story;

    if (data.result) return data.result;

    if (data.content) return data.content;

    return JSON.stringify(data);

  } catch (error) {

    console.error("Failed to generate story", error);

    throw error;

  }
}