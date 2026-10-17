---
title: "Shop8 CMS"
type: "E-commerce platforma · React"
role: "Frontend vývojář v týmu, podíl na backendu"
description: "Platforma na míru pro e-shopy více klientů. Stavěl jsem moduly administrace v Reactu s GraphQL, převedl projekt do Nx monorepa a napsal E2E testy v Cypressu."
link: "https://www.shop8.cz"
image: "/images/logo-code8.svg"
position: 3
tags: ["React", "TypeScript", "GraphQL", "Nx", "Cypress"]
---

::div{.row}

<!-- # Shop8 CMS -->

## Kontext

Shop8 je e-commerce řešení na míru pro středně velké e-shopy. Úkolem bylo připravit kompletní administraci, ve které klienti ovládají všechny části svého e-shopu tak, jak potřebují.
::

::div{.row}

## Moje role

Na projektu jsem pracoval s kolegy, kteří mě hodně naučili o celkové stavbě systému, a byl jsem součástí týmu backendu i frontendu.
::

::div{.row}

## Výzva

Administrace zahrnuje mnoho modulů pro správu e-shopu: uživatelský účet, dopravy, platby, pobočky, slevové kupóny a další. V obsahové části se spravují kategorie a vlastní eventy, hlavně ale produkty – včetně správy verzí (historie produktu), variant a jazykových mutací.

Stejné moduly navíc musely sloužit více klientům, každému s vlastní konfigurací.
::

::div{.row}

## Řešení

- Projekt jsme převedli do Nx monorepa, aby lépe škáloval a hotové moduly šly použít pro více klientů.
- Navigaci mezi stránkami řeší React Router, komunikaci s API nativní fetch spolu s GraphQL a React Query.
- Seznamy dat jednotlivých modulů tvoří tabulky Material Table, které umí vyhledávat, filtrovat, řadit a automaticky ukládají poslední stav.
- Detaily pro tvorbu a správu obsahu stojí na formulářích v React Hook Form a editoru TinyMCE.
- Pro klíčové komponenty a layout administrace jsme použili Material UI a vlastní SCSS styly.
- Každá aplikace má vlastní konfiguraci pro interní potřeby klienta i stylové úpravy, například administraci v barvách klienta.
- Nástěnka zobrazuje pomocí Chart.js grafy objednávek a přehled záznamů v CMS.
- Automatické E2E testy jsem nejdřív psal v Jestu, později jsem přešel na Cypress, se kterým se mi pracovalo lépe.
- Kód je v TypeScriptu, kvalitu hlídá ESLint a formátování Prettier.
::

::div{.row}

## Výsledek

Plně funkční administrace s API, která se dokáže přizpůsobit potřebám projektu. Administrace se dál rozvíjí: přidáváme nové funkce, pravidelně aktualizuji knihovny a refaktoruji starší kód.
::

::div{.row}

## Technologie

- React (TypeScript)
- Nx monorepo – pro škálovatelný a konzistentní kód mezi aplikacemi
- React Router
- React Query
- React Hook Form
- i18n (i18next)
- React Hot Toast
- React Player
- Cypress (E2E)
- ESLint + Prettier
- Material UI (MUI)
- Ant Design (antd) – hlavně Tree
- Chonky (data grid)
- React DnD
- Chart.js
- dayjs
- GraphQL
- Webpack

::
