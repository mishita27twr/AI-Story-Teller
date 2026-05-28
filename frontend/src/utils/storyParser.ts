export interface Scene {
  id: number;
  title: string;
  content: string;
  mood?: string;
}

export function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s*/g, '')         // ### headings
    .replace(/\*{3}(.+?)\*{3}/g, '$1') // ***bold italic***
    .replace(/\*{2}(.+?)\*{2}/g, '$1') // **bold**
    .replace(/\*(.+?)\*/g, '$1')        // *italic*
    .replace(/_{3}(.+?)_{3}/g, '$1')    // ___bold italic___
    .replace(/_{2}(.+?)_{2}/g, '$1')    // __bold__
    .replace(/_(.+?)_/g, '$1')          // _italic_
    .replace(/`{3}[\s\S]*?`{3}/g, '')  // ```code blocks```
    .replace(/`(.+?)`/g, '$1')          // `inline code`
    .replace(/^[-*_]{3,}\s*$/gm, '')    // --- horizontal rules
    .replace(/^\s*[-*+]\s+/gm, '')      // - bullet points
    .replace(/^\s*\d+\.\s+/gm, '')      // 1. numbered lists
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // [links](url)
    .replace(/\n{3,}/g, '\n\n')         // collapse excess blank lines
    .trim();
}

export function parseStoryIntoScenes(rawText: string): Scene[] {
  if (!rawText) return [];
  
  const text = cleanMarkdown(rawText);
  
  // Try to split by "Scene X" or "SCENE X"
  const sceneRegex = /(?:\n|^)(?=Scene \d+|SCENE \d+)/i;
  const parts = text.split(sceneRegex).filter(p => p.trim() !== '');
  
  if (parts.length > 1) {
    return parts.map((part, index) => {
      const match = part.match(/^(Scene \d+|SCENE \d+)(?::|-)?\s*/i);
      let title = `Scene ${index + 1}`;
      let content = part;
      
      if (match) {
        title = match[1];
        content = part.substring(match[0].length).trim();
      }
      
      return {
        id: index + 1,
        title,
        content: content.trim()
      };
    });
  }
  
  // Fallback: split by double newlines into paragraphs, group 2-3 per scene
  const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(p => p !== '');
  const scenes: Scene[] = [];
  
  let currentContent: string[] = [];
  let sceneIndex = 1;
  
  for (let i = 0; i < paragraphs.length; i++) {
    currentContent.push(paragraphs[i]);
    if (currentContent.length >= 2 || i === paragraphs.length - 1) {
      scenes.push({
        id: sceneIndex,
        title: `Scene ${sceneIndex}`,
        content: currentContent.join('\n\n')
      });
      currentContent = [];
      sceneIndex++;
    }
  }
  
  if (scenes.length === 0 && text) {
    scenes.push({ id: 1, title: "Scene 1", content: text });
  }
  
  return scenes;
}
