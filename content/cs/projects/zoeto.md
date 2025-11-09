---
title: "Zoeto"
description: "Zoeto je komplexní mobilní aplikace, která veterinářům umožňuje snadný přístup k produktovému katalogu společnosti Zoetis. Aplikace obsahuje podrobné informace o lécích, včetně složení, indikací, balení a cen."
links:
  - url: "https://apps.apple.com/cz/app/zoeto/id6447378302"
    text: "iOS App"
  - url: "https://play.google.com/store/apps/details?id=com.zoeto&hl=cs&pli=1"
    text: "Android App"
image: "/images/logo_zoetis.svg"
position: 2
type: "Mobile Application"
---

::div{.row}

<!-- # Zoeto -->

Zoeto je komplexní mobilní aplikace, která veterinářům umožňuje snadný přístup k produktovému katalogu společnosti Zoetis. Aplikace obsahuje podrobné informace o lécích, včetně složení, indikací, balení a cen.
::

::div{.row}

## O aplikaci

Aplikace Zoeto byla moje první zkušenost s nativními aplikacemi a také React Native.
Mým úkolem na tomto projektu bylo nakódovat aplikaci dle grafického návrhu který se připravoval in-house.
Pro vstup do tohoto světa jsem využil kurzu ze stránek udemy.com s názvem React Native - The Practical Guide od Maximilian Schwarzmüller který mi dal skvělý úvod do nativních aplikací.

Projekt byl založen na Expu ale postupem času se přešlo na klasický React Native.
Při tvorbě obrazovek jsem se setkal s mnoha novým jako práce s Xcode a Android Studio a simulátory tak i nativním kódem.
Při práci na projektu jsem byl v kontaktu s externí firmou která si nás najala pro tvorbu této aplikace.
To vyžadovalo občasné meetingy které jsem za naši firmu většinou vedl spolu s kolegou který připravoval backend.

Pro aplikaci jsem použil React Navigation jako router aplikace kde je potřeba rozeznávat, zda-li je uživatel přihlášen a tím mu odemknout hlavní obsah aplikace. Pro komunikaci s API jsem využil Axios. Aplikace má také několik animací pro které jsem využil React Native Reanimated. hlavní je rozbalování hlavního katalogu kde rozklikáváním vnořených kategorií se uživately zobrazují různé produkty dle specifikace. Pro state management jsem využil Reduxjs který má na starosti hlavní logiku aplikace.

Klient se později rozhodnul že pro snadnější registraci a přihlašování využije Gigya - SAP Customer Data Cloud.
Pro integraci s React Native jsem využil "@sap_oss/gigya-react-native-plugin-for-sap-customer-data-cloud" kde bylo potřeba refaktorovat část logiky na frontendu tak i na straně API.

Po spuštění aplikace jsem se pravidelně staral o aktualizaci knihoven a samotného React Native.
nahrával nová vydání pro interní testování na Google Play nebo vytvářel soubory apk tak aby je bylo možné testovat vývojáři.

Zajímavostí pro mne byla práce s Xcode kde jsem pro build aplikace a následné odeslání na Testflight využíval pro podpis aplikace příslušné certifikáty a provisioning profile, které jsem obdržel od vývojářů ze strany Zoetisu.

Další fází vývoje bylo přidání Push notifikací kde jsme zvolily Firebase pro rozesílání notifikací.
Připravovat notifikace byla delší cesta než se zpočátku zdálo jelikož se funkcionalita stále rozrůstala a bylo potřeba připravit nejen obrazovky jako seznam a detail notifikací nebo nastavení notifikací ale také zajištění správné funkčnosti na obou platformách které mě dovedlo až k úpravám na API které je napsané v .NET.

Výsledkem je aplikace která má pomoci veterinářům pomoci usnadnit orientaci v lécích a jejim nákupu.

::

::div{.row}

## Klíčové funkce

- **Cross-platform mobilní aplikace** - Dostupná pro iOS i Android
- **Přístup k produktovému katalogu** - Detailní informace o lécích
- **Systém správy objednávek** - Snadné vytváření a sledování objednávek
- **Správa uživatelských účtů** - Personalizované prostředí

::

::div{.row}

## Technologie

- React Native
- SAP Gigya plugin pro zpracování dat uživatelů
- Firebase (Messaging, Notifee)
- React Native Reanimated
- React Navigation
- Redux.js
- Axios (pro REST API)

::
