---
title: "Zoeto"
type: "Mobilní aplikace · React Native"
role: "Mobilní vývojář, celá aplikace a komunikace s klientem"
description: "Produktový katalog léčiv společnosti Zoetis pro veterináře, vydaný na iOS i Androidu. Postavil jsem celou aplikaci v React Native včetně přihlášení přes SAP Gigya a push notifikací přes Firebase."
links:
  - url: "https://apps.apple.com/cz/app/zoeto/id6447378302"
    text: "iOS App"
  - url: "https://play.google.com/store/apps/details?id=com.zoeto&hl=cs&pli=1"
    text: "Android App"
image: "/images/logo_zoetis.svg"
position: 2
tags: ["React Native", "Expo", "Firebase", "TypeScript"]
---

::div{.row}

<!-- # Zoeto -->

## Kontext

Zoeto je mobilní aplikace, která veterinářům umožňuje snadný přístup k produktovému katalogu společnosti Zoetis. Obsahuje podrobné informace o lécích, včetně složení, indikací, balení a cen.

Aplikaci jsme vyvíjeli pro externí firmu, která si nás na její tvorbu najala.
::

::div{.row}

## Moje role

Aplikaci jsem kódoval podle grafického návrhu, který se připravoval in-house. S externí firmou jsem byl v kontaktu a schůzky za naši firmu jsem většinou vedl spolu s kolegou, který připravoval backend.

Po spuštění aplikace jsem se pravidelně staral o aktualizace knihoven a samotného React Native, nahrával nová vydání pro interní testování na Google Play a vytvářel APK soubory, aby je mohli testovat vývojáři.
::

::div{.row}

## Výzva

Byla to moje první zkušenost s nativními aplikacemi a s React Native. Pro vstup do tohoto světa jsem využil kurz React Native – The Practical Guide od Maximiliana Schwarzmüllera na Udemy.

Při tvorbě obrazovek jsem se setkal s mnoha novými věcmi: s Xcode, Android Studiem, simulátory i nativním kódem. Pro build aplikace a odeslání na TestFlight jsem aplikaci podepisoval certifikáty a provisioning profily, které jsem dostal od vývojářů ze strany Zoetisu.
::

::div{.row}

## Řešení

- Projekt začal na Expu, postupem času jsme přešli na klasický React Native.
- React Navigation slouží jako router a rozlišuje, zda je uživatel přihlášený, a tím mu odemyká hlavní obsah aplikace.
- Pro komunikaci s API jsem použil Axios, hlavní logiku aplikace má na starosti Redux.
- Animace jsem napsal v React Native Reanimated. Hlavní je rozbalování katalogu, kde se uživatelům po rozkliknutí vnořených kategorií zobrazují produkty podle specifikace.
- Klient se později rozhodl pro registraci a přihlašování přes Gigya (SAP Customer Data Cloud). Napojil jsem plugin `@sap_oss/gigya-react-native-plugin-for-sap-customer-data-cloud` a refaktoroval část logiky na frontendu i na straně API.
- Pro push notifikace jsme zvolili Firebase. Funkcionalita se postupně rozrůstala: kromě obrazovek se seznamem, detailem a nastavením notifikací bylo potřeba zajistit správnou funkčnost na obou platformách, což mě dovedlo až k úpravám API napsaného v .NET.
::

::div{.row}

## Výsledek

Aplikace je vydaná na iOS i Androidu a pomáhá veterinářům v orientaci v lécích a v jejich nákupu.
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
