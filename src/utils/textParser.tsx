import { Link } from "react-router-dom";

/**
 * Parses text and converts hashtags (e.g., #DOT) into clickable links
 * Hashtags must contain only uppercase letters A-Z and be 2-10 characters long
 * @param text The text to parse
 * @returns JSX elements with hashtags converted to links
 */
export function parseHashtags(text: string): JSX.Element[] {
  // Regex to match hashtags: # followed by 2-10 uppercase letters A-Z
  const hashtagRegex = /#([A-Z]{2,10})\b/g;
  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;

  while ((match = hashtagRegex.exec(text)) !== null) {
    const fullHashtag = match[0]; // e.g., "#DOT"
    const abbreviation = match[1]; // e.g., "DOT"
    const matchIndex = match.index;

    // Add text before the hashtag
    if (matchIndex > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {text.substring(lastIndex, matchIndex)}
        </span>
      );
    }

    // Add the hashtag as a link
    parts.push(
      <Link
        key={`link-${matchIndex}`}
        to={`/${abbreviation}`}
        className="text-blue-400 hover:text-blue-300 hover:underline"
      >
        {fullHashtag}
      </Link>
    );

    lastIndex = matchIndex + fullHashtag.length;
  }

  // Add remaining text after the last hashtag
  if (lastIndex < text.length) {
    parts.push(<span key={`text-${lastIndex}`}>{text.substring(lastIndex)}</span>);
  }

  return parts;
}
