---
title: "Zoeto"
type: "Mobile app · React Native"
role: "Mobile developer, the whole app and client communication"
description: "A product catalogue of Zoetis medicines for veterinarians, released on iOS and Android. I built the whole app in React Native, including SAP Gigya sign-in and Firebase push notifications."
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

## Context

Zoeto is a mobile app that gives veterinarians easy access to the Zoetis product catalogue. It includes detailed information about medicines, including composition, indications, packaging and prices.

We developed the app for an external company that hired us to build it.
::

::div{.row}

## My role

I coded the app according to the graphic design prepared in-house. I was in contact with the external company and usually led the meetings for our side, together with a colleague responsible for the backend.

After the launch I regularly updated the libraries and React Native itself, uploaded new releases for internal testing on Google Play and generated APK files so developers could test the app.
::

::div{.row}

## Challenge

This was my first experience with native apps and with React Native. To get started I took the course React Native – The Practical Guide by Maximilian Schwarzmüller on Udemy.

While building the screens I met many new things: Xcode, Android Studio, simulators and native code. To build the app and submit it to TestFlight I signed it with the certificates and provisioning profiles I received from the Zoetis developers.
::

::div{.row}

## Solution

- The project started on Expo and over time we moved to plain React Native.
- React Navigation serves as the router and checks whether the user is logged in, unlocking the main app content.
- Axios handles API communication and Redux handles the core app logic.
- I built the animations in React Native Reanimated. The main one is the expanding catalogue, where users open nested categories and see products by specification.
- The client later chose Gigya (SAP Customer Data Cloud) for registration and login. I integrated the `@sap_oss/gigya-react-native-plugin-for-sap-customer-data-cloud` plugin and refactored part of the logic on the frontend and on the API side.
- We chose Firebase for push notifications. The feature kept growing: besides the notification list, detail and settings screens it had to work correctly on both platforms, which led me to changes in the .NET API.
::

::div{.row}

## Result

The app is released on iOS and Android and helps veterinarians find their way around medicines and buy them.
::

::div{.row}

## Technologies

- React Native
- SAP Gigya plugin for processing user data
- Firebase (Messaging, Notifee)
- React Native Reanimated
- React Navigation
- Redux.js
- Axios (for REST APIs)

::
