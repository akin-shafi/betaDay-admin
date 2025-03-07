/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        azoSansLight: ["var(--font-light)", ...fontFamily.sans],
        azoSansMedium: ["var(--font-medium)", ...fontFamily.sans],
        azoSansRegular: ["var(--font-regular)", ...fontFamily.sans],
        azoSansBold: ["var(--font-bold)", ...fontFamily.sans],
        azoSansItalic: ["var(--font-italic)", ...fontFamily.sans],
      },
      colors: {
        primary: "#101828",
        appGreen: "#247A84",
        secondary: "#032541",
        appMuted: "#667085",
      },
    },
  },
  plugins: [],
};
