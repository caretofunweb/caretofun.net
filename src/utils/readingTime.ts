/**
 * Reading Time Calculator
 *
 * Calculates the estimated reading time for a given text.
 * Uses an average reading speed of 200 words per minute.
 */

/**
 * Calculate reading time in minutes from text content
 * @param content - Raw text or markdown content
 * @returns Formatted reading time string (e.g., "5 min read")
 */
export function getReadingTime(content: string): string {
  const WORDS_PER_MINUTE = 200;

  // Strip markdown syntax for more accurate word count
  const plainText = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '')        // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]*)\]\(.*?\)/g, '$1') // Keep link text
    .replace(/[#*_~>`-]/g, '')       // Remove markdown chars
    .replace(/\n+/g, ' ')           // Normalize whitespace
    .trim();

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}

/**
 * Get raw minute count for reading time
 * @param content - Raw text or markdown content
 * @returns Number of minutes
 */
export function getReadingTimeMinutes(content: string): number {
  const WORDS_PER_MINUTE = 200;
  const plainText = content.replace(/[#*_~>`\-\[\]()!]/g, '').trim();
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}
