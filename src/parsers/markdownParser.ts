import { readFile } from 'fs/promises';

export interface LinkData {
  title: string;
  url: string;
}

export class MarkdownParser {
  parseLinks(markdown: string): LinkData[] {
    if (!markdown.trim()) {
      return [];
    }

    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const links: LinkData[] = [];
    let match;

    while ((match = linkRegex.exec(markdown)) !== null) {
      links.push({
        title: match[1],
        url: match[2]
      });
    }

    return links;
  }

  async readFromFile(filePath: string): Promise<LinkData[]> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return this.parseLinks(content);
    } catch (error) {
      throw new Error(`Failed to read markdown file: ${error}`);
    }
  }
}