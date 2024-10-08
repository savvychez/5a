import { type Config } from "tailwindcss";
import { withUt } from "uploadthing/tw";

export default withUt({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'acid-black': '#242529',
        'acid-green': '#E4FF67',
        'acid-white': '#FAFAFA',
        'acid-darkened-green': '#DCF765'
      },
      boxShadow: {
        'scroll-shadow': '0 -6px 6px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}) satisfies Config;
