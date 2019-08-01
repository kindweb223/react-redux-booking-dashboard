import React, { useState } from "react";
import { cx, css } from "emotion";
import colors from "../style/colors";
import iconSearchSVG from "../../images/Glyphs/iconSearch.svg";

const SearchField = props => {
  const {
    query,
    onChange,
    onEnterKeyPress,
    placeholder = "Search",
    className = "",
    style
  } = props;
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={style}
      className={cx(
        className,
        css`
          margin-right: 1em;
          background-color: white;
          padding: 5px 7px;
          border-radius: 4px;
          height: 35px;
          border: 1px solid ${focused ? colors.accent_pink : colors.light_grey};
          display: flex;
          flex-direction: row;
          align-items: center;
        `
      )}
    >
      <img
        alt="search"
        src={iconSearchSVG}
        className={css`
          width: 15px;
          height: 15px;
          margin-top: -1px;
          margin-right: 8px;
        `}
      />
      <input
        value={query}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyPress={e =>
          e.key === "Enter" && onEnterKeyPress && onEnterKeyPress()
        }
        className={css`
          font-family: Circular;
          font-size: 1.05em;
          border: none;
          :focus {
            outline: none;
          }
        `}
      />
    </div>
  );
};

export default SearchField;
