/*
 * Copyright (c) 2026 nstechbytes
 *
 * Licensed under the Apache License, Version 2.0.
 * You may obtain a copy of the License at:
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

let settings = { theme: "dark", scale: 1 };
let weather = { temperature: "--", unit: "", label: "", icon: "" };

const COLORS = {
  light: {
    main: "rgb(0,0,0)",
    accent: "rgb(0,126,220)",
    shadow: "rgba(0,0,0,1)",
  },
  dark: {
    main: "rgb(245,248,252)",
    accent: "rgb(44,157,255)",
    shadow: "rgba(0,0,0,1)",
  },
};

function render() {
  const s = settings.scale;
  const c = COLORS[settings.theme];
  const W = 200 * s;
  const H = 120 * s;
  ["temperature", "degree", "condition", "icon", "separator"].forEach(
    function (id) {
      if (ui.isElementExist(id)) ui.removeElementById(id);
    },
  );
  ui.beginUpdate();
  if (weather.icon)
    ui.addImage({
      id: "icon",
      x: 15 * s,
      y: 39 * s,
      width: 41 * s,
      height: 41 * s,
      path: weather.icon,
    });
  ui.addShape({
    id: "separator",
    shapeType: "rectangle",
    x: 68 * s,
    y: 29 * s,
    width: Math.max(2, 3 * s),
    height: 56 * s,
    fillColor: c.accent,
    strokeWidth: 0,
  });
  ui.addText({
    id: "temperature",
    x: 114 * s,
    y: 42 * s,
    width: 76 * s,
    height: 65 * s,
    text: String(weather.temperature),
    fontFace: "Segoe UI Light",
    fontSize: 53 * s,
    fontWeight: "light",
    fontColor: c.main,
    textAlign: "center-center",
    fontShadow: { x: 0, y: 2 * s, blur: 8 * s, color: c.shadow },
  });
  ui.addText({
    id: "degree",
    x: 151 * s,
    y: 30 * s,
    width: 23 * s,
    height: 25 * s,
    text: "°",
    fontFace: "Segoe UI",
    fontSize: 24 * s,
    fontWeight: "light",
    fontColor: c.main,
    textAlign: "center-center",
  });
  ui.addText({
    id: "condition",
    x: 88 * s,
    y: 84 * s,
    width: 125 * s,
    height: 21 * s,
    text: weather.label,
    fontFace: "Segoe UI",
    fontSize: 13 * s,
    fontWeight: "semibold",
    letterSpacing: Math.max(1, 2 * s),
    fontColor: c.accent,
    textAlign: "left-center",
  });
  ui.endUpdate();
}

function updateWeather(data) {
  if (!data) return;
  weather = data;
  // The first response creates the icon. Every later weather update only
  // changes existing properties, so the widget never flashes or reloads.
  if (!ui.isElementExist("icon")) {
    render();
    return;
  }
  ui.beginUpdate();
  ui.setElementProperties("temperature", { text: String(weather.temperature) });
  ui.setElementProperties("condition", { text: weather.label });
  ui.setElementProperties("icon", { path: weather.icon });
  ui.endUpdate();
}

function applySettings(next) {
  if (!next) return;
  settings = next;
  const s = settings.scale;
  const c = COLORS[settings.theme];
  // Update the existing elements rather than removing/recreating them.
  ui.beginUpdate();
  if (ui.isElementExist("icon"))
    ui.setElementProperties("icon", {
      x: 15 * s,
      y: 39 * s,
      width: 41 * s,
      height: 41 * s,
    });
  ui.setElementProperties("separator", {
    x: 68 * s,
    y: 29 * s,
    width: Math.max(2, 3 * s),
    height: 56 * s,
    fillColor: c.accent,
  });
  ui.setElementProperties("temperature", {
    x: 114 * s,
    y: 42 * s,
    width: 76 * s,
    height: 65 * s,
    fontSize: 53 * s,
    fontColor: c.main,
    fontShadow: { x: 0, y: 2 * s, blur: 8 * s, color: c.shadow },
  });
  ui.setElementProperties("degree", {
    x: 151 * s,
    y: 30 * s,
    width: 23 * s,
    height: 25 * s,
    fontSize: 24 * s,
    fontColor: c.main,
  });
  ui.setElementProperties("condition", {
    x: 88 * s,
    y: 84 * s,
    width: 125 * s,
    height: 21 * s,
    fontSize: 13 * s,
    letterSpacing: Math.max(1, 2 * s),
    fontColor: c.accent,
    textAlign: "left-center",
  });
  ui.endUpdate();
}

const startup = ipcRenderer.invoke("AeroWeather.getStartupData");
if (startup) {
  if (startup.settings) settings = startup.settings;
  if (startup.weather) weather = startup.weather;
}
render();
ipcRenderer.on("AeroWeather.settings", function (event, next) {
  applySettings(next);
});
ipcRenderer.on("AeroWeather.weather", function (event, data) {
  updateWeather(data);
});
ipcRenderer.send("AeroWeather.ready");
