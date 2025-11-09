---
title: "Zoeto"
description: "Zoeto is a comprehensive mobile application that enables veterinarians easy access to Zoetis’s product catalog. The app includes detailed information about medications, including composition, indications, packaging, and pricing."
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

Zoeto is a comprehensive mobile application that enables veterinarians easy access to Zoetis’s product catalog. The app includes detailed information about medications, including composition, indications, packaging, and pricing.
::

::div{.row}

## About the app

App Zoeto was my first experience with native apps — and specifically, React Native.
My task on this project was to code the app according to the graphic design being prepared in-house.
To get started in this space, I used the course React Native - The Practical Guide by Maximilian Schwarzmüller from Udemy, which gave me an excellent introduction to native app development.

The project initially was built on Expo, but over time, we transitioned to classic React Native.
During development, I encountered many new concepts — working with Xcode and Android Studio, using simulators, and even writing native code.
I worked alongside an external company that had been hired to develop this app.
This required occasional meetings, which I often led for our side, together with a colleague responsible for the backend.

For the app, I used React Navigation as the routing system — essential for determining whether the user is logged in, and thus unlocking the main app content.
For API communication, I used Axios.
The app also includes several animations, which I implemented using React Native Reanimated.
The main feature is the product catalog expansion: when users expand nested categories, they are presented with different products based on specific filters.
For state management, I used Redux.js, which handles the app’s core logic.

Later, the client decided to switch to Gigya — SAP Customer Data Cloud for easier user registration and login.
To integrate with React Native, I used the plugin:
"@sap_oss/gigya-react-native-plugin-for-sap-customer-data-cloud".
This required refactoring parts of the frontend logic, as well as API-side changes.

After launch, I regularly managed library updates and the React Native framework itself.
I also uploaded new builds for internal testing on Google Play, or generated APK files so developers could test the app directly.

An interesting challenge for me was working with Xcode — to build the app and submit it to TestFlight, I needed to use appropriate signing certificates and provisioning profiles, which I received from the Zoetis development team.

Another phase of development involved implementing Push Notifications, for which we chose Firebase for notifications delivery.
Preparing the notification feature turned out to be a longer journey than expected — as the functionality kept expanding.
We had to not only design screens such as the notification list, detail view, and settings, but also ensure full compatibility across both platforms.
This eventually led to modifications in the .NET-based API.

The result is an app designed to help veterinarians navigate and purchase medications more easily.

::

::div{.row}

## Key Features

- **Cross-platform mobile app** - Available for iOS and Android
- **Access to product catalog** - Detailed information about medications
- **Order management system** - Easy creation and tracking of orders
- **User account management** - Personalized environment

::

::div{.row}

## Technology

- React Native
- SAP Gigya plugin for processing user data
- Firebase — Messaging, Notifee
- React Native Reanimated
- React Navigation
- Redux.js
- Axios — for REST APIs

::
