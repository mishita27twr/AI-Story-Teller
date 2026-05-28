export interface SavedStory {
  id: string;
  title: string;
  genre: string;
  mood: string;
  style: string;
  rawText: string;
  date: string;
}

const STORAGE_KEY = "ai_story_teller_stories";

export function getSavedStories(): SavedStory[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data) as SavedStory[];
  } catch (e) {
    return [];
  }
}

export function saveStory(story: SavedStory): void {
  const stories = getSavedStories();
  stories.push(story);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function deleteStory(id: string): void {
  const stories = getSavedStories();
  const newStories = stories.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newStories));
}

export function clearStories(): void {
  localStorage.removeItem(STORAGE_KEY);
}
