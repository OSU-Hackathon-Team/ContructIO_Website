/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  // hover: styles only on hover-capable pointers, so they don't stick after a tap.
  future: { hoverOnlyWhenSupported: true },
  theme: { extend: {} },
  plugins: [],
};
