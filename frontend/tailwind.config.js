import path from 'node:path'
import { fileURLToPath } from 'node:url'

const duongDanTapTin = fileURLToPath(import.meta.url)
const thuMucFrontend = path.dirname(duongDanTapTin)

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(thuMucFrontend, 'index.html'),
    path.join(thuMucFrontend, 'src/**/*.{js,jsx,ts,tsx}'),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
