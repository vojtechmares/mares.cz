module.exports = {
  root: true,
  extends: [
    "next",
    "prettier",
    "next/core-web-vitals",
    "plugin:jest-dom/recommended",
    "plugin:testing-library/react",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
