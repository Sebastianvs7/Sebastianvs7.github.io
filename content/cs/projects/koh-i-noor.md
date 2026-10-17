---
title: "Koh-I-Noor Deutschland"
type: "E-shop · Next.js"
role: "Frontend vývojář, komunikace s klientem a marketingovou agenturou"
description: "E-shop pro německý trh napojený na WordPress a vlastní systém klienta. Převedl jsem ho na Next.js App Router a přesunul datovou logiku na backend, takže marketingové změny už nevyžadují rebuild. E2E testy v Cypressu pokrývají hlavní funkce e-shopu."
link: "https://www.kohinoordeutschland.de"
image: "/images/kin-logo.svg"
position: 1
tags: ["Next.js", "TypeScript", "Redux", "WordPress/ACF", "Cypress"]
---

::div{.row}

<!-- # Koh-I-Noor Deutschland -->

## Kontext

KOH-I-NOOR Deutschland GmbH je německá pobočka renomované české společnosti KOH-I-NOOR Hardtmuth, která se specializuje na kvalitní psací a výtvarné potřeby.

Pro německý trh potřebovala moderní e-shop se sortimentem pro umělce, studenty i kanceláře, včetně akčních nabídek a novinek.
::

::div{.row}

## Moje role

Na projektu jsem pracoval jako frontend vývojář a zároveň jsem vedl komunikaci s klientem i marketingovou agenturou.
::

::div{.row}

## Výzva

Klient používá vlastní systém, který synchronizuje data s WordPressem. Web musel být optimalizovaný pro výkon, a přitom bylo stále častěji potřeba aplikaci znovu buildovat kvůli změnám v datech pro marketing.
::

::div{.row}

## Řešení

- Web jsem postavil v Next.js. Při prebuildu jsem stahoval data z API, upravoval je pro potřeby aplikace a ukládal do JSON souborů.
- Pro synchronizaci s WordPressem jsme použili vlastní plugin, který lépe vyhovoval logice e-shopu.
- Ve WordPressu jsem připravil několik vlastních sekcí a stránek pomocí ACF (Advanced Custom Fields).
- Web využívá marketingové nástroje pro podporu prodeje a analýzy: Facebook Conversion API, Google Tag Manager, Ecomail a AI vyhledávání.
- Projekt jsem později přepsal na App Router nového Next.js a značnou část logiky přesunul z frontendu na backend.
- E2E testy v Cypressu pokrývají většinu stránek a funkcí e-shopu.
::

::div{.row}

## Výsledek

Změny v datech pro marketing už nevyžadují nový build aplikace. Web se dál rozvíjí: přibývají redesigny, aktualizace knihoven a opravy starších částí kódu.
::

::div{.row}

## Technologie

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
