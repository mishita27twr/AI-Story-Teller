import { generateStory } from "../services/groqService.js";

export const createStory = async (req, res) => {
  try {
    const { genre, idea } = req.body;

    if (!genre || !idea) {
      return res.status(400).json({
        success: false,
        message: "Genre and idea are required",
      });
    }

    const prompt = `
Create a cinematic ${genre} story based on this idea:

${idea}

Return the story in 5 scenes.

For each scene include:
- sceneTitle
- narration
- dialogues
- mood
- visualDescription
`;

    const story = await generateStory(prompt);

    res.status(200).json({
      success: true,
      story,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};