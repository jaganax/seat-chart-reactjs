import type { Preview } from "@storybook/react-vite";
import { useDarkMode } from "storybook-dark-mode";
import { useEffect } from "react";
import "../src/index.css";

const preview: Preview = {
  decorators: [
    (Story) => {
      const isDark = useDarkMode();

      useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
      }, [isDark]);

      return Story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "todo",
    },
  },
};

export default preview;
