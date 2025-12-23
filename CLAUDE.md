# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a Next.js 16 project using the App Router with React 19 and TypeScript.

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **UI**: React 19
- **Styling**: Tailwind CSS 4 (via `@tailwindcss/postcss`)
- **Language**: TypeScript (strict mode)
- **Fonts**: Geist Sans and Geist Mono via `next/font`

### Project Structure
- `app/` - App Router pages and layouts
  - `layout.tsx` - Root layout with font configuration
  - `page.tsx` - Homepage
  - `globals.css` - Global styles with Tailwind and CSS custom properties
- `public/` - Static assets

### Path Aliases
Use `@/*` to import from the project root (configured in tsconfig.json).
