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
});