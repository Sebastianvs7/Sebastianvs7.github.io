---
title: "Shop8 CMS"
description: "Shop 8 is a mid-sized, custom e-commerce solution for customers."
link: "https://www.shop8.cz"
image: "/images/logo-code8.svg"
position: 3
type: "CMS Platform"
---

::div{.row}

<!-- # Shop8 CMS -->

Shop 8 is a mid-sized, custom e-commerce solution for customers.
::

::div{.row}

## About the Project

The goal was to develop a complete administration panel for managing an e-shop, allowing clients to fully control all aspects of their online store according to their specific needs.

During the project, I collaborated with colleagues who greatly helped me understand the overall system architecture. I contributed as part of a cross-functional team, working on both the backend and frontend.

The administration includes several modules for e-shop management such as: user accounts, shipping, payments, branches, discount coupons, and more. In the content section, clients can manage categories, their own events, but most importantly — products. Users can utilize version control for products, enabling product history, product variants, multilingual variations, and many other features.

Later, the project was refactored into a Monorepo using NX to improve scalability and allow better reuse of modules across multiple clients.

The project is built using React Router for navigation between pages. It leverages native fetch alongside GraphQL and React Query for smoother communication with the API. A significant portion of the admin interface consists of Material Table components, which display data lists for each module and support searching, filtering, sorting, and automatic saving of the latest state. Another large portion involves detailed editing and content management screens, where form handling is heavily based on React Hook Forms and TinyMCE.

For core components and layout, Material UI was used alongside custom SCSS styles.

The application is written in TypeScript and uses ESLint for code quality control and Prettier for code formatting. It is modularized into key components and reusable modules that can be applied across all parts of the application. Each client’s instance has its own configuration for internal needs, including custom styling (e.g., admin panels in the client’s brand colors).

On the dashboard, Chart.js is used to visualize various graphs about orders and complete records stored in the CMS.

For testing, I initially wrote E2E tests using Jest, but later transitioned to Cypress, which proved more effective for testing across all application pages.

The admin panel continues to evolve — we add new functionalities, regularly update libraries, or refactor legacy code.

Result: A fully functional, scalable admin interface with an API that can be adapted to meet any client’s specific project requirements.

::

::div{.row}

## Key Features

- **Custom CMS Development** - Tailored solutions for every client
- **E-commerce Solutions** - Complete online store platforms
- **Scalable Architecture** - Growing alongside the client’s business
- **Focused on Business Growth** - Solutions for expanding companies

::

::div{.row}

## Technology

- React (TypeScript)
- NX Monorepo — for scalable, consistent code across apps
- React Router
- React Query
- React Hook Form
- i18n (i18next)
- React Hot Toast
- React Player
- Cypress (E2E)
- ESLint + Prettier
- Material UI (MUI)
- Ant Design (antd) — especially Tree
- Chonky (data grid)
- React DnD
- Chart.js
- dayjs
- GraphQL
- Webpack

::
