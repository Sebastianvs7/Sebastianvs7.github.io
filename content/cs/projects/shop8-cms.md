---
title: "Shop8 CMS"
description: "Shop 8 je mid-size e-commerce řešení na míru pro zákazníky."
link: "https://www.shop8.cz"
image: "/images/logo-code8.svg"
position: 3
type: "CMS Platform"
---

::div{.row}

<!-- # Shop8 CMS -->

Shop 8 je mid-size e-commerce řešení na míru pro zákazníky.
::

::div{.row}

## O projektu

Úkolem bylo připravit kompletní administraci pro správu eshopu, kde budou moci klienti ovládat všechny části svého eshopu tak aby to vyhovovalo jejich potřebám.
Na projektu jsem pracoval s kolegy kteří mě hodně naučily o celkové stavbě systému a byl jsem součástí teamu jak backendu tak i frontendu.
Administrace zahrnuje několik modulů pro správu eshopu jako je uživatelský účet, dopravy, platby, pobočky, slevové kupóny a jiné. V obsahové části lze mimo jiné spravovat kategorie, vlastní eventy ale nejhlavnější jsou produkty kde uživatel může využít správů verzí tedy historie produktu, varianty produkty nebo jazykové mutace a mnoho dalšího.
Projekt byl posléze uprav pro Monorepo NX aby se dal lépe škálovat a mohlo se lépe využít již hotových modulů pro více klientů.
Projekt je postaven na React Router pro navigaci mezi stránkami. Využívá nativní fetch spolu s graphql a react-query pro snadnější komunikaci s API. Značnou část administrace tvoří tabulky Material Table se seznamem dat pro danný modul které umějí vyhledávat, filtrovat, řadit a automaticky ukládají poslední stav. Další značnou částí tvoří samotné detaily pro tvorbu nebo správu obsahu kde se hodně využívá práce s formuláři za pomoci React Hook Forms nebo TinyMCE. Pro klíčové komponenty a layout admninistrace byl použit Material UI a vlastní SCSS styly.
Projekt je napsán v Typescriptu a využívá Eslint pro kontrolu kvality kódu, Prettier pro formátování kódu. Aplikace je rozdělena na klíčové moduly a komponenty které lze používat napříč všemi části aplikace. Každá aplikace má svoji konfikuraci pro interní potřeby klienta tak i stylové úpravy např. administrace v barvách kterou klient využívá.
Administrace na nástěnce za pomocí Chart.js zobrazuje různé grafy o objednávkách a kompletní informace o záznamech v CMS.
Pro admninistraci jsem, napsal automatické E2E testy pomocí Jest ale později jsem přešel na Cypress se kterým se mi pracovalo po všech stránkách lépe.
Administrace se neustále rozvíjí. Přidáváme nové funkcionality, pravidelně aktualizuji knihovny nebo refakturuji starší kód.
Výsledkem je plně funkční administrace s API které se dokáží přizpůsobit potřebám projektu.

::

::div{.row}

## Klíčové funkce

- **Vývoj CMS na míru** - Přizpůsobené řešení pro každého klienta
- **E-commerce řešení** - Kompletní online obchodní platformy
- **Škálovatelná architektura** - Růst spolu s byznysem klienta
- **Zaměření na růst byznysu** - Řešení pro rozvíjející se firmy

::

::div{.row}

## Technologie

- React (TypeScript)
- NX Monorepo — pro škálovatelný a konzistentní kód mezi aplikacemi
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
