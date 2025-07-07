import { MarkdownParser } from '../markdownParser';

describe('MarkdownParser', () => {
  let parser: MarkdownParser;

  beforeEach(() => {
    parser = new MarkdownParser();
  });

  describe('parseLinks', () => {
    it('should parse markdown links correctly', () => {
      const markdown = '- [タイトル1](https://example.com/url1)\n- [タイトル2](https://example.com/url2)';
      const expected = [
        { title: 'タイトル1', url: 'https://example.com/url1' },
        { title: 'タイトル2', url: 'https://example.com/url2' }
      ];
      
      const result = parser.parseLinks(markdown);
      
      expect(result).toEqual(expected);
    });

    it('should handle empty markdown', () => {
      const markdown = '';
      const result = parser.parseLinks(markdown);
      
      expect(result).toEqual([]);
    });

    it('should handle markdown without links', () => {
      const markdown = '# タイトル\n\n普通のテキスト';
      const result = parser.parseLinks(markdown);
      
      expect(result).toEqual([]);
    });

    it('should handle mixed content with links', () => {
      const markdown = `# 投稿リスト

## 今週の投稿
- [記事1](https://example.com/1)
- 普通のテキスト
- [記事2](https://example.com/2)

## その他
何かしらの説明`;
      
      const expected = [
        { title: '記事1', url: 'https://example.com/1' },
        { title: '記事2', url: 'https://example.com/2' }
      ];
      
      const result = parser.parseLinks(markdown);
      
      expect(result).toEqual(expected);
    });
  });

  describe('readFromFile', () => {
    it('should read and parse markdown file', async () => {
      const testFilePath = './data/posts.md';
      
      const result = await parser.readFromFile(testFilePath);
      
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('url');
    });
  });

  describe('getAvailableLinks', () => {
    it('should extract links from "今週の投稿" section only', () => {
      const markdown = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)
- [記事2](https://example.com/2)

## 投稿済み
- [投稿済み記事](https://example.com/posted)`;

      const result = parser.getAvailableLinks(markdown);
      
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('記事1');
      expect(result[1].title).toBe('記事2');
    });

    it('should return empty array when no available links', () => {
      const markdown = `# 週間投稿データ

## 今週の投稿
<!-- すべて投稿済み -->

## 投稿済み
- [投稿済み記事](https://example.com/posted)`;

      const result = parser.getAvailableLinks(markdown);
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getRandomLink', () => {
    it('should return random link from available links', () => {
      const markdown = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)
- [記事2](https://example.com/2)
- [記事3](https://example.com/3)

## 投稿済み
<!-- 投稿済みの記事はここに移動 -->`;

      const result = parser.getRandomLink(markdown);
      
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('url');
      expect(['記事1', '記事2', '記事3']).toContain(result?.title);
    });

    it('should return null when no available links', () => {
      const markdown = `# 週間投稿データ

## 今週の投稿
<!-- すべて投稿済み -->

## 投稿済み
- [投稿済み記事](https://example.com/posted)`;

      const result = parser.getRandomLink(markdown);
      
      expect(result).toBeNull();
    });

    it('should return deterministic result with seed', () => {
      const markdown = `# 週間投稿データ

## 今週の投稿
- [記事A](https://example.com/a)
- [記事B](https://example.com/b)
- [記事C](https://example.com/c)`;

      const result1 = parser.getRandomLink(markdown, 12345);
      const result2 = parser.getRandomLink(markdown, 12345);
      
      expect(result1).toEqual(result2);
    });
  });

  describe('markAsPosted', () => {
    it('should handle file update gracefully', async () => {
      const filePath = './non-existent-file.md';
      const linkToMove = { title: 'テスト', url: 'https://test.com' };
      
      await expect(
        parser.markAsPosted(filePath, linkToMove)
      ).rejects.toThrow();
    });
  });

  describe('getRandomFromFile', () => {
    it('should return random link from actual file', async () => {
      const result = await parser.getRandomFromFile('./data/posts.md');
      
      expect(result).toBeTruthy();
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('url');
      expect(result?.title).toMatch(/^No\d+/);
    });

    it('should handle file reading errors', async () => {
      await expect(
        parser.getRandomFromFile('./non-existent-file.md')
      ).rejects.toThrow();
    });
  });

  describe('resetPostedToAvailable', () => {
    it('should move all posted clips back to available section', async () => {
      const testContent = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)

## 投稿済み
- [投稿済み記事1](https://example.com/posted1)
- [投稿済み記事2](https://example.com/posted2)
<!-- 投稿済みの記事はここに移動 -->`;

      const result = parser.resetPostedToAvailable(testContent);
      
      expect(result).toContain('## 今週の投稿');
      expect(result).toContain('[投稿済み記事1](https://example.com/posted1)');
      expect(result).toContain('[投稿済み記事2](https://example.com/posted2)');
      expect(result).toContain('[記事1](https://example.com/1)');
      
      // 投稿済みセクションが空になることを確認
      const postedSection = result.split('## 投稿済み')[1];
      expect(postedSection).not.toContain('[投稿済み記事1]');
    });

    it('should handle case with no posted clips', () => {
      const testContent = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)

## 投稿済み
<!-- 投稿済みの記事はここに移動 -->`;

      const result = parser.resetPostedToAvailable(testContent);
      
      expect(result).toContain('[記事1](https://example.com/1)');
      expect(result).toContain('## 投稿済み');
    });

    it('should preserve order of clips', () => {
      const testContent = `# 週間投稿データ

## 今週の投稿
- [No1 記事](https://example.com/1)
- [No3 記事](https://example.com/3)

## 投稿済み
- [No2 記事](https://example.com/2)
- [No4 記事](https://example.com/4)`;

      const result = parser.resetPostedToAvailable(testContent);
      
      // 元の順序を維持しつつ投稿済みが末尾に追加される
      const availableSection = result.split('## 投稿済み')[0];
      expect(availableSection.indexOf('[No1 記事]')).toBeLessThan(availableSection.indexOf('[No3 記事]'));
      expect(availableSection).toContain('[No2 記事]');
      expect(availableSection).toContain('[No4 記事]');
    });
  });

  describe('resetPostedToAvailableFile', () => {
    it('should handle file operations gracefully', async () => {
      const filePath = './non-existent-file.md';
      
      await expect(
        parser.resetPostedToAvailableFile(filePath)
      ).rejects.toThrow();
    });
  });

  describe('getPostedClipsCount', () => {
    it('should count posted clips correctly', () => {
      const testContent = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)

## 投稿済み
- [投稿済み記事1](https://example.com/posted1)
- [投稿済み記事2](https://example.com/posted2)
- [投稿済み記事3](https://example.com/posted3)`;

      const count = parser.getPostedClipsCount(testContent);
      
      expect(count).toBe(3);
    });

    it('should return 0 when no posted clips', () => {
      const testContent = `# 週間投稿データ

## 今週の投稿
- [記事1](https://example.com/1)

## 投稿済み
<!-- 投稿済みの記事はここに移動 -->`;

      const count = parser.getPostedClipsCount(testContent);
      
      expect(count).toBe(0);
    });
  });
});