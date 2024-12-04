import { type Config } from "tailwindcss";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx,js,jsx}",
  ],
  theme: {
    colors: {
      "yellow": "#FDB913",
      "blue": "#0074BC",
      "grey-light": "#EFEDED",
      "grey-dark": "#323232",
      "black": "#000000",
    },
    fontFamily: {
      sans: ["Graphik", "sans-serif"],
      serif: ["Merriweather", "serif"],
      display: ["Oswald"],
    },
  },
} satisfies Config;
