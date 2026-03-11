(function () {
  "use strict";

  // --- Viewer page: set the SVG image source from URL parameter ---
  var svgImg = document.getElementById("svg-img");
  if (svgImg) {
    var params = new URLSearchParams(window.location.search);
    var svgUrl = params.get("url");
    if (svgUrl) {
      svgImg.src = svgUrl;
      // Show original filename in the title
      try {
        var filename = decodeURIComponent(new URL(svgUrl).pathname.split("/").pop());
        document.title = filename;
      } catch (e) {}
    }
  }

  // --- Detection ---
  if (!document.getElementById("svg-bg-toolbar-host")) return;
  if (!document.body) return;

  // --- Constants ---

  var PRESETS = [
    { id: "white", value: "#ffffff", className: "swatch-white" },
    { id: "black", value: "#000000", className: "swatch-black" },
    { id: "dark-gray", value: "#555555", className: "swatch-dark-gray" },
    { id: "light-gray", value: "#cccccc", className: "swatch-light-gray" },
    { id: "checkerboard", value: "checkerboard", className: "swatch-checkerboard" },
  ];

  var STORAGE_KEY = "svg-bg-color";
  var DEFAULT_COLOR = "#ffffff";
  var RAINBOW = "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)";

  var CSS = [
    ":host { all: initial; display: block; }",
    ".toolbar { display:flex; align-items:center; gap:12px; padding:6px 14px; background:#f0f0f0; border-bottom:1px solid #d0d0d0; font-family:system-ui,-apple-system,sans-serif; font-size:11px; box-sizing:border-box; }",
    ".label { color:#555; font-weight:500; user-select:none; }",
    ".swatches { display:flex; gap:4px; align-items:center; }",
    ".swatch { width:20px; height:20px; border-radius:50%; border:2px solid #bbb; cursor:pointer; box-sizing:border-box; transition:border-color 0.15s; }",
    ".swatch:hover { border-color:#888; }",
    ".swatch.active { border-color:#4a90d9; box-shadow:0 0 0 2px rgba(74,144,217,0.3); }",
    ".swatch-white { background:#fff; }",
    ".swatch-black { background:#000; }",
    ".swatch-dark-gray { background:#555; }",
    ".swatch-light-gray { background:#ccc; }",
    ".swatch-checkerboard { background:repeating-conic-gradient(#808080 0% 25%,#fff 0% 50%) 50%/8px 8px; }",
    ".separator { width:1px; height:16px; background:#ccc; }",
    ".color-input { position:absolute; width:0; height:0; opacity:0; pointer-events:none; }",
  ].join("\n");

  // --- State ---

  var shadow;
  var customSwatch;
  var colorInput;
  var bgTargets = []; // elements to apply background to

  // --- Setup ---

  var body = document.body;
  var hostEl = document.getElementById("svg-bg-toolbar-host");
  var svgContainer = document.getElementById("svg-bg-container");

  bgTargets = [body, svgContainer];

  // --- Toolbar ---

  shadow = hostEl.attachShadow({ mode: "closed" });

  var style = document.createElement("style");
  style.textContent = CSS;
  shadow.appendChild(style);

  var toolbar = document.createElement("div");
  toolbar.className = "toolbar";

  var label = document.createElement("span");
  label.className = "label";
  label.textContent = "Background:";
  toolbar.appendChild(label);

  var swatchesEl = document.createElement("div");
  swatchesEl.className = "swatches";

  PRESETS.forEach(function (preset) {
    var swatch = document.createElement("div");
    swatch.className = "swatch " + preset.className;
    swatch.dataset.value = preset.value;
    swatch.title = preset.id;
    swatch.addEventListener("click", function () { selectColor(preset.value); });
    swatchesEl.appendChild(swatch);
  });

  toolbar.appendChild(swatchesEl);

  var sep = document.createElement("div");
  sep.className = "separator";
  toolbar.appendChild(sep);

  customSwatch = document.createElement("div");
  customSwatch.className = "swatch";
  customSwatch.style.background = RAINBOW;
  customSwatch.title = "Custom color";

  colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.className = "color-input";
  colorInput.value = "#ff0000";
  colorInput.addEventListener("input", function (e) { selectColor(e.target.value); });

  customSwatch.addEventListener("click", function () { colorInput.click(); });
  toolbar.appendChild(customSwatch);
  toolbar.appendChild(colorInput);

  shadow.appendChild(toolbar);

  // --- Color Application ---

  function applyColor(color) {
    var bg = color === "checkerboard"
      ? "repeating-conic-gradient(#808080 0% 25%, #ffffff 0% 50%) 50% / 16px 16px"
      : color;

    bgTargets.forEach(function (el) { el.style.background = bg; });

    shadow.querySelectorAll(".swatch").forEach(function (s) {
      s.classList.remove("active");
    });

    var preset = PRESETS.find(function (p) { return p.value === color; });
    if (preset) {
      shadow.querySelector("." + preset.className).classList.add("active");
      customSwatch.style.background = RAINBOW;
    } else {
      customSwatch.classList.add("active");
      customSwatch.style.background = color;
      colorInput.value = color;
    }
  }

  function selectColor(color) {
    applyColor(color);
    chrome.storage.local.set({ [STORAGE_KEY]: color }).catch(function () {});
  }

  // --- Init ---

  chrome.storage.local.get(STORAGE_KEY).then(function (result) {
    var saved = result[STORAGE_KEY] || DEFAULT_COLOR;
    applyColor(saved);
  }).catch(function () {
    applyColor(DEFAULT_COLOR);
  });
})();
