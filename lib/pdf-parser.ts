// Server-only: PDF text extraction
// Uses pdf-parse which requires Node.js runtime
import type { Buffer } from 'buffer'

export async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // Dynamically import to avoid edge runtime issues
  const pdfParse = (await import('pdf-parse')).default

  const data = await pdfParse(buffer)
  const text = data.text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  if (!text || text.length < 100) {
    throw new Error(
      'Could not extract readable text from this PDF. Make sure the file is not scanned or image-based.'
    )
  }

  return text
}

export function truncateCVText(text: string, maxChars = 8000): string {
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n[... truncated for analysis]'
}
