# Copilot Instructions for the Webshop Project

## What This File Teaches

This `copilot-instructions.md` is designed to be a **teaching example** for GitHub Copilot workshops. It demonstrates:
- How to encode project context into a persistent system prompt
- How to define domain models, naming conventions, and architectural patterns
- How to guide Copilot toward production-ready code and explanations
- How instructions shape every completion without manual re-explanation

Use this as a template for your own projects.

---

## Project Context

This is a simple webshop application used in a GitHub Copilot workshop. Favor clear, readable code and explain trade-offs when generating suggestions so participants can learn from the output.

**Stack:** Vite + React + TypeScript (frontend) · Kotlin + Spring Boot + H2 (backend)

## Domain Glossary
- **Product**: `id`, `name`, `price`, `description`, `imageUrl`, `category`, `stock`
- **CartItem**: `product` + `quantity`
- **Order**: `id`, `items`, `total`, `status`, `customerName`, `customerEmail`, `createdAt`
- **SKU**: A stock keeping unit used to uniquely identify a sellable product variant in a catalog or inventory system

## Naming and File Structure
- Use `PascalCase` for React component files and Kotlin classes.
- Use `camelCase` for variables, functions, and properties.
- Keep frontend API helpers in `frontend/src/services`.
- Keep backend packages organized by `controller`, `service`, `repository`, and `model`.

## Workshop Expectations
- This repository intentionally contains stubs for participants to complete with Copilot.
- Always include TODO comments on stubs to guide participants toward the next step.
- When filling in a stub, keep the implementation incremental and educational.
- When suggesting code, prefer examples that are realistic and production-shaped, but still approachable for workshop participants.
- If a task touches both frontend and backend, mention the integration points clearly.

## Agent Skills
Deeper conventions live in dedicated agent skills — load them for focused work:
- **`.github/skills/frontend-engineer`** — React, TypeScript, Tailwind, API service patterns
- **`.github/skills/backend-engineer`** — Kotlin, Spring Boot, JPA, REST endpoint patterns
- **`.github/skills/designer`** — UI/UX, color palette, accessibility, component design
- **`.github/skills/yoda`** — May the Force be with your code reviews

## Extra Conventions
- Never use `var` in Kotlin — always use `val` or `lateinit var`.
- Always add JSDoc comments to exported TypeScript functions.
- Prefer `useReducer` over `useState` for complex state shapes.
- All API errors should be displayed to the user — never silently swallowed.
