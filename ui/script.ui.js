let settings = { theme: "dark", scale: 1 };
let weather = { temperature: "--", unit: "C", label: "LOADING", icon: "assets/WeatherIcons/cloudy.png" };

const COLORS = {
  light: { main: "rgb(18,22,28)", accent: "rgb(0,126,220)", shadow: "rgba(0,0,0,0.12)" },
  dark: { main: "rgb(245,248,252)", accent: "rgb(44,157,255)", shadow: "rgba(0,0,0,0.42)" }
};

function render() {
  const s = settings.scale;
  const c = COLORS[settings.theme];
  const W = 200 * s;
  const H = 120 * s;
  ["temperature", "degree", "unit", "condition", "icon"].forEach(function (id) { if (ui.isElementExist(id)) ui.removeElementById(id); });
  ui.beginUpdate();
  ui.addImage({ id: "icon", x: 15 * s, y: 39 * s, width: 41 * s, height: 41 * s, path: weather.icon });
  ui.addText({ id: "temperature", x: 87 * s, y: 14 * s, width: 76 * s, height: 65 * s, text: String(weather.temperature), fontFace: "Segoe UI Light", fontSize: 53 * s, fontWeight: "light", fontColor: c.main, textAlign: "center-center", fontShadow: { x: 0, y: 2 * s, blur: 8 * s, color: c.shadow } });
  ui.addText({ id: "degree", x: 145 * s, y: 15 * s, width: 23 * s, height: 25 * s, text: "°", fontFace: "Segoe UI", fontSize: 24 * s, fontWeight: "light", fontColor: c.main, textAlign: "center-center" });
  ui.addText({ id: "unit", x: 165 * s, y: 30 * s, width: 20 * s, height: 22 * s, text: weather.unit, fontFace: "Segoe UI", fontSize: 13 * s, fontWeight: "normal", fontColor: c.main, textAlign: "center-center" });
  ui.addText({ id: "condition", x: 87 * s, y: 79 * s, width: 105 * s, height: 21 * s, text: weather.label, fontFace: "Segoe UI", fontSize: 13 * s, fontWeight: "semibold", letterSpacing: Math.max(1, 2 * s), fontColor: c.accent, textAlign: "center-center" });
  ui.endUpdate();
}

function updateWeather(data) {
  if (!data) return;
  weather = data;
  render();
}

const startup = ipcRenderer.invoke("AeroWeather.getSettings");
if (startup) settings = startup;
render();
ipcRenderer.on("AeroWeather.settings", function (event, next) { if (next) { settings = next; render(); } });
ipcRenderer.on("AeroWeather.weather", function (event, data) { updateWeather(data); });
ipcRenderer.send("AeroWeather.ready");
