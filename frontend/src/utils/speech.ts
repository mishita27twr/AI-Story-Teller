import { cleanMarkdown } from './storyParser';

export function speakText(text: string): void {
  if (!('speechSynthesis' in window)) return;
  
  stopSpeech();
  
  const utterance = new SpeechSynthesisUtterance(cleanMarkdown(text));
  // Try to use a dramatic/deep voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.name.includes("Google UK English Male") || v.name.includes("Daniel") || v.name.includes("Male"));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  utterance.rate = 0.9;
  utterance.pitch = 0.9;
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeech(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export function pauseSpeech(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.pause();
}

export function resumeSpeech(): void {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.resume();
}
