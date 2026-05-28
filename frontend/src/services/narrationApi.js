const API_URL = import.meta.env.VITE_API_URL;

export async function playNarration(scene, selectedGenre) {
  const response = await fetch(`${API_URL}/api/narration/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: scene.narration || scene.content || scene.text || String(scene),
      emotion: selectedGenre,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate narration");
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);

  const audio = new Audio(audioUrl);
  audio.play();

  return audio;
}