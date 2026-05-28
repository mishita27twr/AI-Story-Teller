import fetch from "node-fetch";

export const generateNarration = async (req, res) => {
  try {
    const { text, emotion, voiceId } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Narration text is required",
      });
    }

    const normalizedEmotion = emotion?.toLowerCase()?.trim();

    const voiceMap = {
      romance: process.env.ELEVENLABS_RACHEL_ID,
      "dark romance": process.env.ELEVENLABS_ADAM_ID,
      horror: process.env.ELEVENLABS_ADAM_ID,
      thriller: process.env.ELEVENLABS_ANTONI_ID,
      action: process.env.ELEVENLABS_ARNOLD_ID,
      comedy: process.env.ELEVENLABS_BELLA_ID,
      fantasy: process.env.ELEVENLABS_ELLI_ID,
      drama: process.env.ELEVENLABS_RACHEL_ID,
    };

    const selectedVoiceId =
      voiceId || voiceMap[normalizedEmotion] || process.env.ELEVENLABS_VOICE_ID;

    if (!selectedVoiceId) {
      return res.status(500).json({
        success: false,
        message: "No ElevenLabs voice ID found. Check your .env variables.",
      });
    }

    console.log("Narration emotion:", normalizedEmotion);
    console.log("Selected voice ID:", selectedVoiceId);

    const emotionTag = {
      romance: "Softly, with warmth and emotion:",
      "dark romance": "Low, intense, mysterious:",
      horror: "Whispered, slow, tense:",
      thriller: "Suspenseful and serious:",
      action: "Fast, intense, dramatic:",
      comedy: "Playful, expressive, funny:",
      fantasy: "Magical, cinematic, graceful:",
      drama: "Deep, emotional, gentle:",
    };

    const finalText = `${emotionTag[normalizedEmotion] || "Cinematic:"} ${text}`;

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: finalText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.25,
            similarity_boost: 0.75,
            style: 0.95,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "ElevenLabs request failed");
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": audioBuffer.length,
    });

    res.send(audioBuffer);
  } catch (error) {
    console.error("Narration Error:", error.message);

    res.status(500).json({
      success: false,
      message: "Narration generation failed",
      error: error.message,
    });
  }
};