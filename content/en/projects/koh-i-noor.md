---
title: "Koh-I-Noor Deutschland"
type: "E-shop · Next.js"
role: "Frontend developer, communication with the client and the marketing agency"
description: "An e-shop for the German market connected to WordPress and the client's own system. I migrated it to the Next.js App Router and moved the data logic to the backend, so marketing changes no longer need a rebuild. E2E tests in Cypress cover the main e-shop features."
link: "https://www.kohinoordeutschland.de"
image: "/images/kin-logo.svg"
position: 1
tags: ["Next.js", "TypeScript", "Redux", "WordPress/ACF", "Cypress"]
---

::div{.row}

<!-- # Koh-I-Noor Deutschland -->

## Context

KOH-I-NOOR Deutschland GmbH is the German subsidiary of the renowned Czech company KOH-I-NOOR Hardtmuth, specializing in high-quality writing and art supplies.

For the German market it needed a modern e-shop with a range of products for artists, students and offices, including promotional offers and new arrivals.
::

::div{.row}

## My role

I worked on the project as a frontend developer and also led the communication with the client and the marketing agency.
::

::div{.row}

## Challenge

The client uses their own system, which synchronizes data with WordPress. The website had to be optimized for performance, yet the application increasingly had to be rebuilt because of data changes needed for marketing.
::

::div{.row}

## Solution

- I built the website in Next.js. In a prebuild step I fetched data from the API, adapted it for the application and saved it into JSON files.
- To synchronize data with WordPress we used a custom plugin that better matched the e-shop logic.
- In WordPress I prepared several custom sections and pages using ACF (Advanced Custom Fields).
- The website uses marketing tools to support sales and analytics: Facebook Conversion API, Google Tag Manager, Ecomail and AI-powered search.
- Later I rewrote the project to the new Next.js App Router and moved a significant part of the logic from the frontend to the backend.
- E2E tests in Cypress cover most of the website's pages and e-shop features.
::

::div{.row}

## Result

Marketing data changes no longer require a new build of the application. The website keeps evolving with new redesigns, library updates and refactoring of older code.
::

::div{.row}

## Technologies

- Next.js
- WordPress, ACF
- Sass
- Redux
- Google Maps React Markers + Supercluster
- React Player, Swiper
- REST API
- gtag, Facebook Pixel, Ecomail
- ESLint, Prettier
- Cypress

::
