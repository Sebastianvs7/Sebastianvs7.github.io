---
title: "Shop8 CMS"
type: "E-commerce platform · React"
role: "Frontend developer in a team, contributions to the backend"
description: "A custom platform powering e-shops for multiple clients. I built admin modules in React with GraphQL, moved the project into an Nx monorepo and wrote E2E tests in Cypress."
link: "https://www.shop8.cz"
image: "/images/logo-code8.svg"
position: 3
tags: ["React", "TypeScript", "GraphQL", "Nx", "Cypress"]
---

::div{.row}

<!-- # Shop8 CMS -->

## Context

Shop8 is a custom e-commerce solution for mid-sized e-shops. The goal was to build a complete administration in which clients control every part of their e-shop the way they need.
::

::div{.row}

## My role

I worked with colleagues who taught me a lot about the overall system architecture, and I was part of both the backend and the frontend team.
::

::div{.row}

## Challenge

The administration includes many modules for running an e-shop: user accounts, shipping, payments, branches, discount coupons and more. The content section manages categories and custom events, but above all products – with version history, variants and language versions.

The same modules also had to serve multiple clients, each with their own configuration.
::

::div{.row}

## Solution

- We moved the project into an Nx monorepo so it scales better and finished modules can be reused for multiple clients.
- React Router handles navigation; native fetch with GraphQL and React Query handles communication with the API.
- Data lists in each module are Material Table tables that support searching, filtering and sorting and automatically save their last state.
- Detail screens for creating and managing content are built on forms with React Hook Form and the TinyMCE editor.
- Core components and the admin layout use Material UI and custom SCSS styles.
- Each app has its own configuration for the client's internal needs and styling, for example an admin in the client's brand colours.
- The dashboard uses Chart.js to show order charts and an overview of CMS records.
- I first wrote automated E2E tests in Jest and later moved to Cypress, which worked better for me.
- The code is written in TypeScript, with ESLint for code quality and Prettier for formatting.
::

::div{.row}

## Result

A fully functional administration with an API that adapts to the needs of each project. The admin keeps evolving: we add new features, and I regularly update libraries and refactor older code.
::

::div{.row}

## Technologies

- React (TypeScript)
- Nx monorepo – for scalable, consistent code across apps
- React Router
- React Query
- React Hook Form
- i18n (i18next)
- React Hot Toast
- React Player
- Cypress (E2E)
- ESLint + Prettier
- Material UI (MUI)
- Ant Design (antd) – especially Tree
- Chonky (data grid)
- React DnD
- Chart.js
- dayjs
- GraphQL
- Webpack

::
