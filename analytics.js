(function() {
  const endpoint = "https://portfolio-analytics.mkato.workers.dev/api/analytics";
  let sessionId = sessionStorage.getItem("analytics_session");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem("analytics_session", sessionId);
  }

  let maxScroll = 0;
  let clicks = 0;
  let dataSent = false;

  window.addEventListener("scroll", () => {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight > 0) {
      const depth = Math.round((window.scrollY / docHeight) * 100);
      if (depth > maxScroll) maxScroll = depth;
    }
  }, { passive: true });

  window.addEventListener("click", () => {
    clicks++;
  }, { passive: true });

  function sendData() {
    if (dataSent) return;
    dataSent = true;

    // Collect Performance Data
    let loadTime = 0;
    let ttfb = 0;
    if (window.performance) {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        loadTime = Math.round(nav.loadEventEnd - nav.startTime);
        ttfb = Math.round(nav.responseStart - nav.startTime);
      } else if (performance.timing) {
        loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        ttfb = performance.timing.responseStart - performance.timing.navigationStart;
      }
    }

    let timezone = "unknown";
    try {
      timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {}

    const payload = {
      sessionId: sessionId,
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: timezone,
      screenRes: `${window.screen.width}x${window.screen.height}`,
      deviceMemory: navigator.deviceMemory || null,
      cores: navigator.hardwareConcurrency || null,
      connType: navigator.connection ? navigator.connection.effectiveType : null,
      loadTimeMs: loadTime > 0 ? loadTime : null,
      ttfbMs: ttfb > 0 ? ttfb : null,
      maxScrollDepth: maxScroll,
      clickCount: clicks
    };

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } else {
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain" },
        keepalive: true
      }).catch(e => console.error(e));
    }
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      sendData();
    }
  });
  window.addEventListener("pagehide", sendData);
  window.addEventListener("beforeunload", sendData);
})();
