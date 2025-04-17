import React from "react";
import { useState } from "react";

/**
 * This component displays a truncated version of a text string with buttons to
 * expand and then reduce.
 * @param {object} props
 * @param {string} - props.text
 * @param {number} - props.maxLength
 * @returns
 */
export default function TextExpansion({ text, maxLength = 100 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return <p>{text}</p>;
  }

  /**
   * ternary which checks if the state of isExpanded is true. If true is shows the full text,
   * if false it uses splice() to return a new array of the deired legth. 0 to maxLength
   */
  const displayedText = isExpanded ? text : text.slice(0, maxLength) + "...";

  //toggles is expandeds state by setting it to the opposite of what it is.
  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const readMoreStyle = {
    border: "none",
    backgroundColor: "transparent",
    color: "var(--accent-Orange)",
  };

  return (
    <p>
      {displayedText}
      {!isExpanded && (
        <button
          onClick={toggleExpansion}
          className="readmore-button read-more"
          style={readMoreStyle}
        >
          Read More
        </button>
      )}
      {isExpanded && (
        <button
          onClick={toggleExpansion}
          className="readmore-button read-less"
          style={readMoreStyle}
        >
          Read Less
        </button>
      )}
    </p>
  );
}
