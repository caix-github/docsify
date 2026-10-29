(function () {
  "use strict";

  var button = document.getElementById("fullscreen-toggle");
  var status = document.getElementById("fullscreen-status");
  var statusTimer;
  var scrollTimer;

  window.addEventListener("scroll", function () {
    document.documentElement.classList.add("controls-scrolling");
    window.clearTimeout(scrollTimer);
    scrollTimer = window.setTimeout(function () {
      document.documentElement.classList.remove("controls-scrolling");
    }, 900);
  }, { passive: true });

  function syncButton() {
    var isFullscreen = Boolean(document.fullscreenElement);
    var label = isFullscreen ? "退出全屏" : "进入全屏";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(isFullscreen));
  }

  function showError(message, error) {
    console.error(message, error);
    status.textContent = message;
    status.classList.add("is-visible");
    window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(function () {
      status.classList.remove("is-visible");
    }, 4000);
  }

  if (!document.documentElement.requestFullscreen || !document.exitFullscreen) {
    button.disabled = true;
    button.setAttribute("aria-label", "当前浏览器不支持全屏");
    button.setAttribute("title", "当前浏览器不支持全屏");
    return;
  }

  button.addEventListener("click", function () {
    var action = document.fullscreenElement
      ? document.exitFullscreen()
      : document.documentElement.requestFullscreen();

    action.catch(function (error) {
      showError(
        document.fullscreenElement ? "退出全屏失败，请重试。" : "无法进入全屏，请检查浏览器权限。",
        error
      );
    });
  });

  document.addEventListener("fullscreenchange", syncButton);
  syncButton();
})();
