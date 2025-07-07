import { readFile, writeFile } from 'fs/promises';

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

  getAvailableLinks(markdown: string): LinkData[] {
    if (!markdown.trim()) {
      return [];
    }

    const sections = markdown.split(/^##\s/m);
    const currentSection = sections.find(section => 
      section.trim().startsWith('今週の投稿')
    );

    if (!currentSection) {
      return [];
    }

    const postedSectionIndex = currentSection.indexOf('## 投稿済み');
    const contentToUse = postedSectionIndex !== -1 
      ? currentSection.substring(0, postedSectionIndex)
      : currentSection;

    return this.parseLinks(contentToUse);
  }

  getRandomLink(markdown: string, seed?: number): LinkData | null {
    const availableLinks = this.getAvailableLinks(markdown);
    
    if (availableLinks.length === 0) {
      return null;
    }

    let randomIndex: number;
    if (seed !== undefined) {
      const seededRandom = this.seededRandom(seed);
      randomIndex = Math.floor(seededRandom * availableLinks.length);
    } else {
      randomIndex = Math.floor(Math.random() * availableLinks.length);
    }

    return availableLinks[randomIndex];
  }

  async markAsPosted(filePath: string, linkToMove: LinkData): Promise<string> {
    try {
      const content = await readFile(filePath, 'utf-8');
      
      const linkMarkdown = `[${linkToMove.title}](${linkToMove.url})`;
      
      const updatedContent = content
        .replace(new RegExp(`^- ${this.escapeRegex(linkMarkdown)}.*$`, 'm'), '')
        .replace(/## 投稿済み/, `## 投稿済み\n- ${linkMarkdown}`)
        .replace(/\n\n\n/g, '\n\n');

      await writeFile(filePath, updatedContent, 'utf-8');
      return updatedContent;
    } catch (error) {
      throw new Error(`Failed to update markdown file: ${error}`);
    }
  }

  async readFromFile(filePath: string): Promise<LinkData[]> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return this.parseLinks(content);
    } catch (error) {
      throw new Error(`Failed to read markdown file: ${error}`);
    }
  }

  async getRandomFromFile(filePath: string, seed?: number): Promise<LinkData | null> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return this.getRandomLink(content, seed);
    } catch (error) {
      throw new Error(`Failed to read markdown file: ${error}`);
    }
  }

  private seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  resetPostedToAvailable(markdown: string): string {
    if (!markdown.trim()) {
      return markdown;
    }

    const sections = markdown.split(/^##\s/m);
    let currentSection = '';
    let postedSection = '';
    let otherSections: string[] = [];

    sections.forEach((section, index) => {
      if (index === 0) {
        otherSections.push(section);
      } else if (section.trim().startsWith('今週の投稿')) {
        currentSection = section;
      } else if (section.trim().startsWith('投稿済み')) {
        postedSection = section;
      } else {
        otherSections.push('##' + section);
      }
    });

    // 投稿済みセクションからリンクを抽出
    const postedLinks = this.parseLinks(postedSection);
    
    // 現在の投稿可能リンクを取得
    const currentLinks = this.parseLinks(currentSection);
    
    // 全てのリンクを統合
    const allLinks = [...currentLinks, ...postedLinks];
    
    // 新しい今週の投稿セクションを構築
    const linksList = allLinks.map(link => `- [${link.title}](${link.url})`).join('\n');
    const newCurrentSection = `今週の投稿\n${linksList}\n\n`;
    
    // 空の投稿済みセクション
    const newPostedSection = `投稿済み\n<!-- 投稿済みの記事はここに移動 -->`;
    
    // 全体を再構築
    const result = otherSections[0] + 
                  '## ' + newCurrentSection + 
                  '## ' + newPostedSection + 
                  otherSections.slice(1).join('');
    
    return result;
  }

  async resetPostedToAvailableFile(filePath: string): Promise<string> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const updatedContent = this.resetPostedToAvailable(content);
      await writeFile(filePath, updatedContent, 'utf-8');
      return updatedContent;
    } catch (error) {
      throw new Error(`Failed to reset posted clips: ${error}`);
    }
  }

  getPostedClipsCount(markdown: string): number {
    if (!markdown.trim()) {
      return 0;
    }

    const sections = markdown.split(/^##\s/m);
    const postedSection = sections.find(section => 
      section.trim().startsWith('投稿済み')
    );

    if (!postedSection) {
      return 0;
    }

    const postedLinks = this.parseLinks(postedSection);
    return postedLinks.length;
  }

  async getPostedClipsCountFromFile(filePath: string): Promise<number> {
    try {
      const content = await readFile(filePath, 'utf-8');
      return this.getPostedClipsCount(content);
    } catch (error) {
      throw new Error(`Failed to read posted clips count: ${error}`);
    }
  }

  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}