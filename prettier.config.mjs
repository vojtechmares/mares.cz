/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: false,
  trailingComma: "all",
  bracketSpacing: false,

  plugins: ["prettier-plugin-tailwindcss"],
}

export default config
