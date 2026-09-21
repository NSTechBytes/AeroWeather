import { app, widgetWindow } from "novadesk";
import { webFetch } from "system";

const BASE_WIDTH = 200;
const BASE_HEIGHT = 120;
const SCALE_OPTIONS = [0.75, 1, 1.25, 1.5, 1.75, 2];
const STORAGE = {
  latitude: "AeroWeather.latitude",
  longitude: "AeroWeather.longitude",
  unit: "AeroWeather.unit",
  theme: "AeroWeather.theme",
  scale: "AeroWeather.scale",
  cachedWeather: "AeroWeather.cachedWeather"
};

let settings = { latitude: 51.5072, longitude: -0.1276, unit: "celsius", theme: "dark", scale: 1 };
let cachedWeather = null;
let weatherWindow = null;
let settingsWindow = null;
let weatherTimer = null;

function loadSettings() {
  try {
    const latitude = app.storage.get(STORAGE.latitude, settings.latitude);
    const longitude = app.storage.get(STORAGE.longitude, settings.longitude);
    const unit = app.storage.get(STORAGE.unit, settings.unit);
    const theme = app.storage.get(STORAGE.theme, settings.theme);
    const scale = app.storage.get(STORAGE.scale, settings.scale);
    if (typeof latitude === "number" && latitude >= -90 && latitude <= 90) settings.latitude = latitude;
    if (typeof longitude === "number" && longitude >= -180 && longitude <= 180) settings.longitude = longitude;
    if (unit === "celsius" || unit === "fahrenheit") settings.unit = unit;
    if (theme === "light" || theme === "dark") settings.theme = theme;
    if (SCALE_OPTIONS.indexOf(scale) !== -1) settings.scale = scale;
    const cached = app.storage.get(STORAGE.cachedWeather, null);
    if (cached && typeof cached.temperature === "number" && typeof cached.icon === "string") cachedWeather = cached;
  } catch (error) { console.log("AeroWeather could not load settings:", error); }
}

function saveSettings() {
  try {
    app.storage.set(STORAGE.latitude, settings.latitude);
    app.storage.set(STORAGE.longitude, settings.longitude);
    app.storage.set(STORAGE.unit, settings.unit);
    app.storage.set(STORAGE.theme, settings.theme);
    app.storage.set(STORAGE.scale, settings.scale);
  } catch (error) { console.log("AeroWeather could not save settings:", error); }
}

function weatherIcon(code, isDay) {
  const day = isDay === 1 || isDay === true;
  if (code === 0) return day ? "clear_day" : "clear_night";
  if (code === 1) return day ? "mostly_clear_day" : "mostly_clear_night";
  if (code === 2) return day ? "partly_cloudy_day" : "partly_cloudy_night";
  if (code === 3) return day ? "mostly_cloudy_day" : "mostly_cloudy_night";
  if (code === 45 || code === 48) return "haze_fog_dust_smoke";
  if (code >= 51 && code <= 55) return "drizzle";
  if (code === 56 || code === 57) return "icy";
  if (code >= 61 && code <= 63) return day ? "scattered_showers_day" : "scattered_showers_night";
  if (code >= 65 && code <= 67) return "heavy_rain";
  if (code >= 71 && code <= 73) return day ? "scattered_snow_showers_day" : "scattered_snow_showers_night";
  if (code >= 75 && code <= 77) return "heavy_snow";
  if (code >= 80 && code <= 82) return "showers_rain";
  if (code >= 85 && code <= 86) return "showers_snow";
  if (code >= 95) return day ? "isolated_scattered_thunderstorms_day" : "isolated_scattered_thunderstorms_night";
  return "cloudy";
}

function weatherLabel(code) {
  if (code === 0) return "CLEAR";
  if (code <= 2) return "PARTLY CLOUDY";
  if (code === 3) return "CLOUDY";
  if (code <= 48) return "FOG";
  if (code <= 57) return "DRIZZLE";
  if (code <= 67) return "RAIN";
  if (code <= 77) return "SNOW";
  if (code <= 86) return "SHOWERS";
  return "THUNDERSTORM";
}

async function fetchWeather() {
  try {
    const unit = settings.unit === "fahrenheit" ? "fahrenheit" : "celsius";
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + settings.latitude + "&longitude=" + settings.longitude + "&current=temperature_2m,weather_code,is_day&temperature_unit=" + unit + "&timezone=auto";
    const raw = await webFetch(url);
    const data = typeof raw === "string" ? JSON.parse(raw) : raw;
    const current = data.current;
    cachedWeather = {
      temperature: Math.round(current.temperature_2m),
      unit: settings.unit === "fahrenheit" ? "F" : "C",
      label: weatherLabel(current.weather_code),
      icon: "assets/WeatherIcons/" + weatherIcon(current.weather_code, current.is_day) + ".png"
    };
    try { app.storage.set(STORAGE.cachedWeather, cachedWeather); } catch (error) { console.log("AeroWeather could not cache weather:", error); }
    ipcMain.send("AeroWeather.weather", cachedWeather);
    return cachedWeather;
  } catch (error) { console.log("AeroWeather weather request failed:", error); }
}

function applyAppearance() {
  weatherWindow.setSize(Math.round(BASE_WIDTH * settings.scale), Math.round(BASE_HEIGHT * settings.scale));
  ipcMain.send("AeroWeather.settings", settings);
  // Immediately repaint from the last successful result while the fresh
  // location request is in flight, so theme/size changes are visible at once.
  if (cachedWeather) ipcMain.send("AeroWeather.weather", cachedWeather);
}

function openSettings() {
  if (settingsWindow && !settingsWindow.isDestroyed()) { settingsWindow.show(); return; }
  settingsWindow = new widgetWindow({
    id: "AeroWeather.Settings",
    width: 370,
    height: 345,
    script: "ui/settings.ui.js",
    backgroundColor: "rgba(0,0,0,0)",
    draggable: true,
    showInToolbar: true,
    toolbarTitle: "AeroWeather Settings"
  });
  settingsWindow.disableContextMenu(true);
  settingsWindow.on("closed", function () { settingsWindow = null; });
}

loadSettings();
ipcMain.handle("AeroWeather.getSettings", function () { return settings; });
ipcMain.handle("AeroWeather.getStartupData", function () { return { settings: settings, weather: cachedWeather }; });
weatherWindow = new widgetWindow({
  id: "AeroWeather.Window",
  width: Math.round(BASE_WIDTH * settings.scale),
  height: Math.round(BASE_HEIGHT * settings.scale),
  script: "ui/script.ui.js",
  backgroundColor: "rgba(0,0,0,0)",
  draggable: true,
  snapEdges: true,
  keepOnScreen: true
});
weatherWindow.setContextMenu([{ text: "Settings", action: openSettings }]);
ipcMain.on("AeroWeather.saveSettings", function (event, next) {
  if (!next) return;
  const latitude = Number(next.latitude);
  const longitude = Number(next.longitude);
  if (isFinite(latitude) && latitude >= -90 && latitude <= 90) settings.latitude = latitude;
  if (isFinite(longitude) && longitude >= -180 && longitude <= 180) settings.longitude = longitude;
  if (next.unit === "celsius" || next.unit === "fahrenheit") settings.unit = next.unit;
  if (next.theme === "light" || next.theme === "dark") settings.theme = next.theme;
  if (SCALE_OPTIONS.indexOf(Number(next.scale)) !== -1) settings.scale = Number(next.scale);
  saveSettings();
  applyAppearance();
  // Keep the existing weather window and update it in place.
  if (!weatherWindow || weatherWindow.isDestroyed()) return;
  weatherWindow.setSize(Math.round(BASE_WIDTH * settings.scale), Math.round(BASE_HEIGHT * settings.scale));
  ipcMain.send("AeroWeather.settings", settings);
  fetchWeather();
});

// Match FluentWidgets: fetch after the widget has been constructed. A UI-ready
// listener registered here can miss an event sent during construction.
applyAppearance();
fetchWeather();
weatherTimer = setInterval(fetchWeather, 600000);
weatherWindow.on("close", function () { if (weatherTimer) clearInterval(weatherTimer); weatherTimer = null; });
