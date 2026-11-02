(function () {
  "use strict";

  var button = document.getElementById("music-player-toggle");
  var audio = document.getElementById("music-player-audio");

  audio.src = "https://cdn.jsdmirror.com/gh/caix-github/pics-storage/River-Flows-in-You.mp3";
  audio.loop = true;

  function syncButton() {
    var isPlaying = !audio.paused && !audio.ended;
    var label = isPlaying ? "暂停音乐" : "播放音乐";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.setAttribute("aria-pressed", String(isPlaying));
  }

  button.addEventListener("click", function () {
    if (audio.paused) {
      audio.play().catch(function (error) {
        console.error("Unable to play the music track.", error);
        button.setAttribute("aria-label", "播放失败，请检查音频链接");
        button.setAttribute("title", "播放失败，请检查音频链接");
        button.setAttribute("aria-pressed", "false");
      });
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", syncButton);
  audio.addEventListener("pause", syncButton);
  audio.addEventListener("ended", syncButton);
  audio.addEventListener("error", function () {
    console.error("The configured music track could not be loaded.", audio.error);
    button.setAttribute("aria-label", "无法加载音乐，请检查音频链接");
    button.setAttribute("title", "无法加载音乐，请检查音频链接");
    button.setAttribute("aria-pressed", "false");
  });

  syncButton();
})();
