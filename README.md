<h1 align="center">AeroWeather</h1>

<p align="center">
  A transparent, compact weather widget with local weather icons and configurable location for Novadesk.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/platform-Windows-0078D4?style=flat-square&logo=windows&logoColor=white" alt="Windows">
  <img src="https://img.shields.io/badge/Novadesk-widget%20package-4B8BBE?style=flat-square" alt="Novadesk widget package">
  <img src="https://img.shields.io/badge/version-1.0.0.0-2EA44F?style=flat-square" alt="Version 1.0.0.0">
  <img src="https://img.shields.io/badge/license-Apache--2.0-D22128?style=flat-square" alt="Apache 2.0 license">
</p>

<p align="center">
  <img src="https://res.cloudinary.com/i8b6ikc3/image/upload/v1790264581/p9kznwu99er2eypdqco9.png" alt="AeroWeather preview">
</p>

## About

**AeroWeather** is a transparent, minimalist weather widget created for [Novadesk](https://novadesk.pages.dev/). It displays current temperature, weather conditions, and day/night adaptive weather icons without cluttering your desktop.

Key features include:

- **Live Weather Updates**: Fetches real-time weather data powered by Open-Meteo with automatic 10-minute refreshes.
- **Adaptive Weather Icons**: Bundled set of 26 day and night condition icons for clear skies, rain, snow, thunderstorms, and more.
- **Transparent Design**: Floats cleanly over your desktop background with customizable accent colors and drop shadows.
- **Dedicated Settings Window**: Easily configure location coordinates, units, theme, and scale in an intuitive panel.
- **Instant Startup Caching**: Caches the last received weather forecast so the widget renders immediately upon startup without flickering.
- **Light and Dark Themes**: Switch between crisp light mode and sleek dark mode to match your desktop setup.
- **Adjustable UI Scaling**: Scales smoothly from 0.75X up to 2X.

## Requirements

- Windows 10 or later
- [Novadesk](https://novadesk.pages.dev/) (v0.9.11.0 or higher)

## Download

Download the latest widget package (`.ndpkg`) from the project releases:

[Download AeroWeather_v1.0.ndpkg](https://github.com/NSTechBytes/AeroWeather/releases)

Double-click the downloaded `.ndpkg` file to install it directly with Novadesk. Novadesk must be installed before opening the package.

## Run from source

Clone or download this folder, then start it through the Novadesk Widget Manager:

```powershell
cd D:\Novadesk-Project\AeroWeather
nwm run
```

The project entry point is `index.js`. If your Novadesk executable is in a different location, use the Widget Manager configuration or start Novadesk with this file as its script.

## Settings

Right-click the widget and select **Settings** to open the configuration window.

The Settings window includes the following options:

- **Location**: Enter your desired Latitude and Longitude coordinates (press Enter or unfocus to apply immediately).
- **Weather Format**: Choose between Celsius (°C) and Fahrenheit (°F).
- **Theme**: Choose between Light and Dark styles.
- **Size**: Adjust the widget scale between 0.75X, 1X (Default), 1.25X, 1.5X, 1.75X, and 2X.

All configuration options and window states are saved automatically to Novadesk storage (`app.storage`) and persist across sessions.

## Patreon

If AeroWeather is useful to you, supporting the project on [Patreon](https://patreon.com/cw/nstechbytes) helps cover the time spent maintaining widgets, improving features, and testing new Novadesk releases. Support is optional, but it makes continued work on the project possible.

## License

AeroWeather is licensed under the [Apache License 2.0](LICENSE).
