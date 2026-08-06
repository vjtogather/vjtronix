# MicroHelp Web

Public-facing web application for MicroHelp, India's learning platform for Embedded Systems, Firmware Development, Linux, C/C++, IoT, Robotics, and Open Source. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS v4.

## Current Scope

- Dark-first landing page
- SEO metadata foundation
- Reusable UI primitives
- Shared layout components
- Homepage sections for vision, features, technology stack, and calls to action

## Development

Install dependencies from this app directory, then run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

```bash
pnpm lint
pnpm build
pnpm start
```

## Structure

```text
src/app              App Router pages, layout, and global styles
src/components/ui    Reusable UI primitives
src/components/layout Shared shell components
src/components/sections Shared page sections and templates
src/components/home  Landing page sections
src/constants        Brand and navigation constants
src/data             Static typed data contracts before CMS integration
src/lib              Shared utilities
src/types            Shared TypeScript types
```

## Architecture Notes

The current landing page is static and server-rendered. Client Components should be introduced only when a feature needs browser state, effects, or event-driven interactivity.

See `docs/architecture/WEB_FOUNDATION.md` for the first architecture decision record.
