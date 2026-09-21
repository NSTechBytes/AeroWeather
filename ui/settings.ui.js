let settings = ipcRenderer.invoke("AeroWeather.getSettings") || {
  latitude: 51.5072,
  longitude: -0.1276,
  unit: "celsius",
  theme: "dark",
  scale: 1,
};

const PALETTE = {
  dark: {
    background: "rgb(28,30,34)",
    card: "rgb(43,46,52)",
    text: "rgb(245,247,250)",
    subtle: "rgba(245,247,250,0.64)",
    accent: "rgb(44,157,255)",
    border: "rgba(255,255,255,0.15)",
  },
  light: {
    background: "rgb(246,248,251)",
    card: "rgb(255,255,255)",
    text: "rgb(25,28,33)",
    subtle: "rgba(25,28,33,0.62)",
    accent: "rgb(0,120,215)",
    border: "rgba(0,0,0,0.13)",
  },
};

function button(id, text, x, y, width, selected, action) {
  const p = PALETTE[settings.theme];
  const run = function () {
    captureLocation();
    action();
  };
  // Text anchors are baseline-oriented in this runtime. Offset by half of the
  // label width so each label is visually centered in its button.
  const centeredTextX = x + width / 2 + text.length * 2.5;
  ui.addShape({
    id: id + "Bg",
    shapeType: "rectangle",
    x: x,
    y: y,
    width: width,
    height: 34,
    radius: 6,
    fillColor: selected ? p.accent : p.card,
    strokeColor: selected ? p.accent : p.border,
    strokeWidth: 1,
    onLeftMouseUp: run,
  });
  ui.addText({
    id: id,
    x: centeredTextX,
    y: y + 7,
    width: width,
    height: 20,
    text: text,
    fontFace: "Segoe UI",
    fontSize: 12,
    fontWeight: "semibold",
    fontColor: selected ? "rgb(255,255,255)" : p.text,
    textAlign: "centercenter",
    onLeftMouseUp: run,
    mouseEventCursor: true,
  });
}

function captureLocation() {
  if (ui.isElementExist("latitude"))
    settings.latitude = ui.getElementProperty("latitude", "text");
  if (ui.isElementExist("longitude"))
    settings.longitude = ui.getElementProperty("longitude", "text");
}

function render() {
  const p = PALETTE[settings.theme];
  const ids = [
    "panel",
    "title",
    "location",
    "latitudeLabel",
    "longitudeLabel",
    "latitude",
    "longitude",
    "formatLabel",
    "celsius",
    "celsiusBg",
    "fahrenheit",
    "fahrenheitBg",
    "themeLabel",
    "light",
    "lightBg",
    "dark",
    "darkBg",
    "sizeLabel",
    "size075",
    "size075Bg",
    "size1",
    "size1Bg",
    "size125",
    "size125Bg",
    "size15",
    "size15Bg",
    "size175",
    "size175Bg",
    "size2",
    "size2Bg",
    "save",
    "saveBg",
    "status",
  ];
  ids.forEach(function (id) {
    if (ui.isElementExist(id)) ui.removeElementById(id);
  });
  ui.beginUpdate();
  ui.addShape({
    id: "panel",
    shapeType: "rectangle",
    x: 0,
    y: 0,
    width: 370,
    height: 400,
    radius: 12,
    fillColor: p.background,
    strokeColor: p.border,
    strokeWidth: 1,
  });
  ui.addText({
    id: "title",
    x: 22,
    y: 20,
    width: 300,
    height: 30,
    text: "AeroWeather Settings",
    fontFace: "Segoe UI",
    fontSize: 20,
    fontWeight: "semibold",
    fontColor: p.text,
    textAlign: "left-center",
  });
  ui.addText({
    id: "location",
    x: 22,
    y: 62,
    width: 320,
    height: 18,
    text: "LOCATION",
    fontFace: "Segoe UI",
    fontSize: 11,
    fontWeight: "semibold",
    letterSpacing: 2,
    fontColor: p.accent,
    textAlign: "left-center",
  });
  ui.addText({
    id: "latitudeLabel",
    x: 22,
    y: 88,
    width: 100,
    height: 20,
    text: "Latitude",
    fontFace: "Segoe UI",
    fontSize: 13,
    fontColor: p.subtle,
    textAlign: "left-center",
  });
  ui.addText({
    id: "longitudeLabel",
    x: 195,
    y: 88,
    width: 100,
    height: 20,
    text: "Longitude",
    fontFace: "Segoe UI",
    fontSize: 13,
    fontColor: p.subtle,
    textAlign: "left-center",
  });
  ui.addInputBox({
    id: "latitude",
    x: 22,
    y: 112,
    width: 145,
    height: 34,
    text: String(settings.latitude),
    inputType: "float",
    fontFace: "Segoe UI",
    fontSize: 14,
    fontColor: p.text,
    fillColor: p.card,
    borderWidth: 1,
    borderColor: p.border,
    borderFocusColor: p.accent,
    borderRadius: 6,
  });
  ui.addInputBox({
    id: "longitude",
    x: 195,
    y: 112,
    width: 145,
    height: 34,
    text: String(settings.longitude),
    inputType: "float",
    fontFace: "Segoe UI",
    fontSize: 14,
    fontColor: p.text,
    fillColor: p.card,
    borderWidth: 1,
    borderColor: p.border,
    borderFocusColor: p.accent,
    borderRadius: 6,
  });
  ui.addText({
    id: "formatLabel",
    x: 22,
    y: 160,
    width: 180,
    height: 18,
    text: "WEATHER FORMAT",
    fontFace: "Segoe UI",
    fontSize: 11,
    fontWeight: "semibold",
    letterSpacing: 2,
    fontColor: p.accent,
    textAlign: "left-center",
  });
  button(
    "celsius",
    "Celsius",
    22,
    184,
    145,
    settings.unit === "celsius",
    function () {
      settings.unit = "celsius";
      render();
    },
  );
  button(
    "fahrenheit",
    "Fahrenheit",
    195,
    184,
    145,
    settings.unit === "fahrenheit",
    function () {
      settings.unit = "fahrenheit";
      render();
    },
  );
  ui.addText({
    id: "themeLabel",
    x: 22,
    y: 232,
    width: 100,
    height: 18,
    text: "THEME",
    fontFace: "Segoe UI",
    fontSize: 11,
    fontWeight: "semibold",
    letterSpacing: 2,
    fontColor: p.accent,
    textAlign: "left-center",
  });
  button(
    "light",
    "Light",
    22,
    256,
    68,
    settings.theme === "light",
    function () {
      settings.theme = "light";
      render();
    },
  );
  button("dark", "Dark", 98, 256, 68, settings.theme === "dark", function () {
    settings.theme = "dark";
    render();
  });
  ui.addText({
    id: "sizeLabel",
    x: 185,
    y: 232,
    width: 100,
    height: 18,
    text: "SIZE",
    fontFace: "Segoe UI",
    fontSize: 11,
    fontWeight: "semibold",
    letterSpacing: 2,
    fontColor: p.accent,
    textAlign: "left-center",
  });
  const scales = [0.75, 1, 1.25, 1.5, 1.75, 2];
  scales.forEach(function (value, index) {
    button(
      "size" + String(value).replace(".", ""),
      value === 1 ? "1X" : String(value) + "X",
      185 + (index % 3) * 54,
      256 + Math.floor(index / 3) * 39,
      48,
      settings.scale === value,
      function () {
        settings.scale = value;
        render();
      },
    );
  });
  button("save", "Save changes", 22, 345, 318, true, save);
  ui.endUpdate();
}

function save() {
  ipcRenderer.send("AeroWeather.saveSettings", {
    latitude: settings.latitude,
    longitude: settings.longitude,
    unit: settings.unit,
    theme: settings.theme,
    scale: settings.scale,
  });
}

render();
ipcRenderer.on("AeroWeather.settingsSaved", function (event, next) {
  if (next) {
    settings = next;
    render();
  }
});
