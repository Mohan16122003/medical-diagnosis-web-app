import React from "react";
import styled from "styled-components";

const ThemeToggleButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
  }

  svg {
    width: 24px;
    height: 24px;
    transition: all 0.3s ease-in-out;
    fill: ${({ theme }) => theme.text};
  }
`;

const ThemeToggle = ({ toggleTheme, currentTheme }) => {
  return (
    <ThemeToggleButton
      onClick={toggleTheme}
      title={`Switch to ${currentTheme === "light" ? "Dark" : "Light"} Mode`}
      aria-label={`Switch to ${currentTheme === "light" ? "Dark" : "Light"} Mode`}
      aria-live="polite"
    >
      {currentTheme === "light" ? (
        // Sun Icon for Light Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 4a1 1 0 0 1 1 1V2a1 1 0 1 0-2 0v3a1 1 0 0 1 1 1zm6.364 2.05a1 1 0 0 1 0 1.414l2.121 2.122a1 1 0 0 0 1.415-1.414l-2.122-2.122a1 1 0 0 0-1.414 0zM20 11h3a1 1 0 1 1 0 2h-3a1 1 0 1 1 0-2zm-2.364 6.95a1 1 0 0 0 1.414 0l2.122 2.122a1 1 0 1 1-1.414 1.415l-2.122-2.122a1 1 0 0 0-1.414 0zM12 20a1 1 0 0 1-1-1v3a1 1 0 1 0 2 0v-3a1 1 0 0 1-1-1zm-6.364-2.05a1 1 0 0 1 1.414 0l-2.122 2.122a1 1 0 0 1-1.415-1.415l2.122-2.122zm-3.636-5.95H2a1 1 0 1 1 0-2h3a1 1 0 1 1 0 2zm2.364-6.95a1 1 0 0 1 0-1.414L4.05 4.05a1 1 0 1 0-1.414 1.414l2.122 2.122a1 1 0 0 0 1.414 0zM12 7a5 5 0 1 1 0 10A5 5 0 0 1 12 7z"
          />
        </svg>
      ) : (
        // Moon Icon for Dark Mode
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path
            d="M21.75 14.552a9.15 9.15 0 0 1-9.302-9.303 8.25 8.25 0 1 0 9.302 9.303z"
          />
        </svg>
      )}
    </ThemeToggleButton>
  );
};

export default ThemeToggle;
