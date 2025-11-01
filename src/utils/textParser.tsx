import { Link } from "react-router-dom";

/**
 * Renders text with newlines converted to <br /> elements
 * Text is automatically HTML-escaped by React
 * @param text The text to render with newlines
 * @returns JSX elements with newlines converted to line breaks
 */
export function renderTextWithNewlines(text: string): JSX.Element[] {
  if (!text) return [];

  const lines = text.split('\n');
  const elements: JSX.Element[] = [];

  lines.forEach((line, index) => {
    elements.push(<span key={`line-${index}`}>{line}</span>);
    if (index < lines.length - 1) {
      elements.push(<br key={`br-${index}`} />);
    }
  });

  return elements;
}

/**
 * Validates and sanitizes a URL to prevent XSS attacks
 * Only allows http, https, and relative URLs
 * @param url The URL to validate
 * @returns The sanitized URL or null if invalid
 */
function sanitizeUrl(url: string): string | null {
  if (!url) return null;

  // Trim whitespace
  url = url.trim();

  // Allow http, https, and relative URLs (starting with /)
  // Block dangerous protocols like javascript:, data:, etc.
  const allowedProtocolRegex = /^(https?:\/\/|\/)/i;

  if (!allowedProtocolRegex.test(url)) {
    // If no protocol, assume relative URL and prepend /
    // But don't allow URLs that could be protocol handlers
    if (url.includes(':')) {
      return null;
    }
    return url;
  }

  return url;
}

/**
 * Parses text and converts:
 * - Hashtags (e.g., #DOT) into clickable internal links
 * - Markdown links (e.g., [text](url)) into clickable external links
 * - Newlines into <br /> elements
 *
 * Hashtags must contain only uppercase letters A-Z and be 2-10 characters long
 * URLs in markdown links are sanitized to prevent XSS attacks
 * All text is automatically HTML-escaped by React to prevent XSS attacks
 *
 * @param text The text to parse
 * @returns JSX elements with all features parsed
 */
export function parseHashtags(text: string): JSX.Element[] {
  if (!text) return [];

  // Combined regex to match both markdown links and hashtags
  // Markdown link: [text](url)
  // Hashtag: #ABBREVIATION (2-10 uppercase letters)
  const combinedRegex = /(\[([^\]]+)\]\(([^)]+)\))|(#([A-Z]{2,10})\b)/g;

  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = combinedRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Add text before this match (with newlines handled)
    if (matchIndex > lastIndex) {
      const textBefore = text.substring(lastIndex, matchIndex);
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {renderTextWithNewlines(textBefore)}
        </span>
      );
    }

    // Check if it's a markdown link (group 1) or hashtag (group 4)
    if (match[1]) {
      // Markdown link: [text](url)
      const linkText = match[2];
      const linkUrl = match[3];
      const sanitizedUrl = sanitizeUrl(linkUrl);

      if (sanitizedUrl) {
        parts.push(
          <a
            key={`mdlink-${keyCounter++}`}
            href={sanitizedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 hover:underline"
          >
            {linkText}
          </a>
        );
      } else {
        // If URL is invalid, just render the original text (escaped)
        parts.push(
          <span key={`invalid-${keyCounter++}`}>
            {match[1]}
          </span>
        );
      }
    } else if (match[4]) {
      // Hashtag: #ABBREVIATION
      const fullHashtag = match[4];
      const abbreviation = match[5];

      parts.push(
        <Link
          key={`hashtag-${keyCounter++}`}
          to={`/${abbreviation}`}
          className="text-blue-400 hover:text-blue-300 hover:underline"
        >
          {fullHashtag}
        </Link>
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  // Add remaining text after the last match (with newlines handled)
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    parts.push(
      <span key={`text-${keyCounter++}`}>
        {renderTextWithNewlines(remainingText)}
      </span>
    );
  }

  return parts;
}
