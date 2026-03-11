// When a tab navigates to an SVG file, redirect it to our viewer page
// which embeds the SVG in a proper HTML context with the toolbar.

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;

  // Don't redirect if already viewing through our viewer
  if (tab.url.startsWith("chrome-extension://")) return;

  var path = "";
  try {
    path = new URL(tab.url).pathname.toLowerCase();
  } catch (e) {
    return;
  }

  if (!path.endsWith(".svg")) return;

  // Redirect to our viewer page with the SVG URL as a parameter
  var viewerUrl = chrome.runtime.getURL("viewer.html") + "?url=" + encodeURIComponent(tab.url);
  chrome.tabs.update(tabId, { url: viewerUrl });
});
