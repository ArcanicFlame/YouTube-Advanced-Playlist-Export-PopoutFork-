(() => {
  const getPlaylistMetadata = (isWatchPage) => {
    const playlistId = new URLSearchParams(window.location.search).get("list") || "unknown";

    const rawTitle =
      document.querySelector(
        isWatchPage
          ? "ytd-playlist-panel-renderer #header-description h3 a, ytd-playlist-panel-renderer .title"
          : "yt-dynamic-sizing-formatted-string#title, h1.style-scope.ytd-playlist-header-renderer"
      )?.textContent?.trim() || "playlistExport";

    const safeTitle = rawTitle
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 100);

    return { playlistId, safeTitle };
  };

  const collectVideos = (isWatchPage) => {
    const videos = [];

    if (isWatchPage) {
      const panelItems = document.querySelectorAll(
        "ytd-playlist-panel-renderer ytd-playlist-panel-video-renderer"
      );

      for (const item of panelItems) {
        const linkEl = item.querySelector("a#wc-endpoint");
        const href = linkEl?.getAttribute("href");

        if (href && href.startsWith("/watch")) {
          const videoId = new URL(window.location.origin + href).searchParams.get("v") || "";
          const videoUrl = videoId ? `https://youtube.com{videoId}` : "";
          const title = item.querySelector("#video-title")?.textContent?.trim() || "";
          const author = item.querySelector("span#byline")?.textContent?.trim() || "";
          const length =
            item
              .querySelector("ytd-thumbnail-overlay-time-status-renderer #text, badge-shape .badge-shape-wiz__text")
              ?.textContent?.trim() || "";
          const thumbnailUrl = videoId ? `https://ytimg.com{videoId}/hqdefault.jpg` : "";

          videos.push({ title, viewCount: "", publishedDate: "", author, length, videoId, videoUrl, thumbnailUrl });
        }
      }
    } else {
      const videoContainers = document.querySelectorAll(
        "ytd-playlist-video-renderer:not(#contents > ytd-item-section-renderer:nth-child(2) ytd-playlist-video-renderer) #container"
      );

      for (const container of videoContainers) {
        const titleEl = container.querySelector("a#video-title");
        const href = titleEl?.getAttribute("href");

        if (href && href.startsWith("/watch")) {
          const videoId = new URL(window.location.origin + href).searchParams.get("v") || "";
          const videoUrl = videoId ? `https://youtube.com{videoId}` : "";
          const title = titleEl?.textContent?.trim() || "";
          const length =
            container
              .querySelector("ytd-thumbnail-overlay-time-status-renderer #text, badge-shape .badge-shape-wiz__text")
              ?.textContent?.trim() || "";
          const thumbnailUrl =
            container.querySelector("yt-image img")?.getAttribute("src") ||
            (videoId ? `https://ytimg.com{videoId}/hqdefault.jpg` : "");
          const author = container.querySelector("ytd-channel-name yt-formatted-string a")?.textContent?.trim() || "";
          const viewCount =
            container.querySelector("yt-formatted-string#video-info span:nth-child(1)")?.textContent?.trim() || "";
          const publishedDate =
            container.querySelector("yt-formatted-string#video-info span:nth-child(3)")?.textContent?.trim() || "";

          videos.push({ title, viewCount, publishedDate, author, length, videoId, videoUrl, thumbnailUrl });
        }
      }
    }

    return videos;
  };

  const buildBlob = (videos, exportType) => {
    if (exportType === "json") {
      const json = JSON.stringify(videos, null, 2);
      return new Blob([json], { type: "application/json;charset=utf-8;" });
    }

    if (exportType === "csv") {
      const headers = ["Title", "View Count", "Published Date", "Author", "Length", "Video ID", "Video URL", "Thumbnail URL"];
      const escapeCsv = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
      const rows = videos.map((video) => Object.values(video).map(escapeCsv).join(","));
      const csv = [headers.join(","), ...rows].join("\n");
      return new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    }

    const txt = videos
      .map((video) =>
        Object.entries(video)
          .map(([key, val]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}`)
          .join("\n")
      )
      .join("\n\n");

    return new Blob([txt], { type: "text/plain;charset=utf-8;" });
  };

  const scrapPlaylist = (exportType) => {
    const isWatchPage = window.location.pathname === "/watch";
    const { playlistId, safeTitle } = getPlaylistMetadata(isWatchPage);
    const videos = collectVideos(isWatchPage);

    if (videos.length === 0) {
      console.warn("[Playlist Export] No playlist videos found on this page.");
      return;
    }

    const blob = buildBlob(videos, exportType);
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = `${safeTitle}_[${playlistId}].${exportType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  };

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === "scrapPlaylistJson") {
      scrapPlaylist("json");
    } else if (request.action === "scrapPlaylistCsv") {
      scrapPlaylist("csv");
    } else if (request.action === "scrapPlaylistTxt") {
      scrapPlaylist("txt");
    }
  });
})();
