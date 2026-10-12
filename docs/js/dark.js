/**
 * docsify-dark-mode v0.6.2（适配 Docsify v5 修改版）
 * Original file: /npm/docsify-dark-mode@0.6.2/dist/index.js
 *
 * v5 适配说明：
 * 原版在每次 doneEach 中对 input[name=mode] 直接绑定 change 监听，
 * Docsify v5 渲染流程下监听器会随内容重渲染丢失导致切换失效。
 * 改为 ready 时在 document 上做一次性事件委托，并对 checkbox
 * 状态与当前模式做同步。
 */
(function () {
  "use strict";

  var current = "light";
  var config = {
    dark: {
      background: "#1c2022",
      toggleBtnBg: "#34495e",
      textColor: "#b4b4b4"
    },
    light: {
      background: "white",
      toggleBtnBg: "var(--theme-color)",
      textColor: "var(--theme-color)"
    }
  };

  function transition() {
    document.documentElement.classList.add("transition");
    window.setTimeout(function () {
      document.documentElement.classList.remove("transition");
    }, 800);
  }

  function apply(theme) {
    document.documentElement.style.setProperty("--docsify_dark_mode_bg", theme.background);
    document.documentElement.style.setProperty("--docsify_dark_mode_btn", theme.toggleBtnBg);
    document.documentElement.style.setProperty("--text_color", theme.textColor);
  }

  function mergeCustom(userCfg) {
    if (userCfg && userCfg.dark) {
      config.dark = Object.assign({}, config.dark, userCfg.dark);
    }
    if (userCfg && userCfg.light) {
      config.light = Object.assign({}, config.light, userCfg.light);
    }
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(function (hook, vm) {
    mergeCustom(vm.config && vm.config.darkMode);

    hook.afterEach(function (html, next) {
      next(' <div id="dark_mode">\n' +
        '             <input class="container_toggle" type="checkbox" id="switch" name="mode" />\n' +
        '             <label for="switch">Toggle</label>\n' +
        '           </div>' + html);
    });

    hook.doneEach(function () {
      var saved = localStorage.getItem("DOCSIFY_DARK_MODE");
      current = saved === "dark" ? "dark" : "light";
      apply(config[current]);
      var input = document.querySelector("input[name=mode]");
      if (input) {
        input.checked = current === "dark";
      }
    });

    hook.ready(function () {
      document.addEventListener("change", function (e) {
        if (!e.target || e.target.name !== "mode") {
          return;
        }
        if (current === "light") {
          transition();
          apply(config.dark);
          localStorage.setItem("DOCSIFY_DARK_MODE", "dark");
          current = "dark";
        } else {
          transition();
          apply(config.light);
          localStorage.setItem("DOCSIFY_DARK_MODE", "light");
          current = "light";
        }
      });
    });
  }, window.$docsify.plugins || []);
})();
