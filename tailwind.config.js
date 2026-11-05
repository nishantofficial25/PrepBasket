const { fontFamily } = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./app/**/*.tsx", "./components/**/*.tsx"],
  theme: { extend: {
    fontFamily: { sans: ["var(--font)", ...fontFamily.sans] },
    colors: {
      brand: { DEFAULT: "#2D7A3E", 50: "#F2F8EF", 100: "#E4F0DD", 200: "#C6E1BB", 600: "#256833", 700: "#1D5428" },
      forest: "#1B4A31", ink: "#16231B", paper: "#F6F8F5", tint: "#F5F9F2", sand: "#F8F1E4", line: "#E2E8E0", muted: "#5E6B62",
    },
    boxShadow: { soft: "0 1px 3px rgba(22,35,27,.08)", pop: "0 10px 28px -12px rgba(22,35,27,.30)" },
  } },
};
