import { buildHeaderEntry, createHeaderState } from './headerEntry';

function isBlocked(line: string, context: any): boolean {
  // check code block
  if (!line.match(/(?:```)(?:.+?)(?:```)/)) {
    if (line.match(/(?:^\s{0,3}```)/)) {
      context.flagBlock = !context.flagBlock;
      return true;
    }
  }

  // check comment block
  if (line.match(/(?:<!--)/) && !line.match(/(?:-->)/)) {
    context.flagComment = true;
    return true;
  }
  if (line.match(/(?:-->)/)) {
    context.flagComment = false;
    return true;
  }

  return context.flagBlock || context.flagComment;
}

function matchMarkdownHeader(line: string): { level: number; text: string } | null {
  if (!line.match(/^ {0,3}#/)) return null;

  let trimmed = line.trim();
  // remove closing '#'s
  trimmed = trimmed.replace(/\s+#*$/, '');

  const match = trimmed.match(/^(#+)\s+(.*?)\s*$/);
  if (!match) return null;
  const level = match[1].length;
  if (level > 6) return null;
  return { level, text: match[2] ?? '' };
}

// A literal HTML header (e.g. `<h2>Title</h2>`) that occupies the whole line
function matchInlineHtmlHeader(line: string): { level: number; text: string } | null {
  const match = line.trim().match(/^<h([1-6])(?:\s[^>]*)?>(.*)<\/h\1>$/i);
  if (!match) return null;
  return { level: parseInt(match[1], 10), text: match[2] ?? '' };
}

/* eslint-disable no-continue */
export default function markdownHeaders(noteBody: string) {
  const headers = [];
  const lines = noteBody.split('\n').map((line, index) => ({ index, line }));
  const state = createHeaderState();

  const checkContext: any = {
    flagBlock: false,
    flagComment: false,
  };

  for (const { index, line } of lines) {
    if (isBlocked(line, checkContext)) continue;

    const match = matchMarkdownHeader(line) ?? matchInlineHtmlHeader(line);
    if (!match) continue;

    headers.push(buildHeaderEntry(match.text, match.level, index, state));
  }
  return headers;
}
