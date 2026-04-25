import type { Config } from "tailwindcss"
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        critical: "#ef4444",
        warning: "#f59e0b",
        normal: "#22c55e",
      }
    }
  },
  plugins: [],
}
export default config
