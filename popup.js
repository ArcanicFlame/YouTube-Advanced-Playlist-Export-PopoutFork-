document.addEventListener("DOMContentLoaded", () => {
  const triggerExport = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (!activeTab?.id) return;

      chrome.tabs.sendMessage(activeTab.id, { action }, () => {
        if (chrome.runtime.lastError) {
          console.warn("[Playlist Export] Please open a YouTube playlist or watch page first.");
        }
      });
    });
  };

  document.getElementById("jsonBtn")?.addEventListener("click", () => triggerExport("scrapPlaylistJson"));
  document.getElementById("csvBtn")?.addEventListener("click", () => triggerExport("scrapPlaylistCsv"));
  document.getElementById("txtBtn")?.addEventListener("click", () => triggerExport("scrapPlaylistTxt"));
});
