/**
 * docsify-dark-mode v0.6.2（适配 Docsify v5 修改版）
 * Original file: /npm/docsify-dark-mode@0.6.2/dist/index.js
 *
 * v5 适配说明：
 * 原版依赖 checkbox 的 change 事件（label → 隐藏 input → change 委托），
 * 在 Docsify v5 渲染流程下该链路不稳定（监听器随内容重渲染丢失）。
 * 本版彻底移除 checkbox 依赖，改为：
 * 1. afterEach 注入纯 label 按钮结构；
 * 2. 脚本加载时即在 document 上做点击事件委托（不随渲染丢失）；
 * 3. 按钮视觉状态由 JS 维护的 .dark 类驱动（日间月亮 / 夜间太阳）。
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

  function syncState() {
    var label = document.querySelector("#dark_mode > label");
    if (label) {
      if (current === "dark") {
        label.classList.add("dark");
      } else {
        label.classList.remove("dark");
      }
    }
    // 根元素类：驱动全站夜间配色（v5 主题变量在 html.dark-mode 下翻转）
    document.documentElement.classList.toggle("dark-mode", current === "dark");
  }

  function toggle() {
    current = current === "light" ? "dark" : "light";
    transition();
    apply(config[current]);
    try {
      localStorage.setItem("DOCSIFY_DARK_MODE", current);
    } catch (err) {}
    syncState();
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
      next('<div id="dark_mode">\n' +
        '  <label title="切换日间 / 夜间模式">\n' +
        '    <span class="dm-icon dm-moon">\uD83C\uDF19</span>\n' +
        '    <span class="dm-icon dm-sun">\u2600\uFE0F</span>\n' +
        '  </label>\n' +
        '</div>' + html);
    });

    hook.doneEach(function () {
      var saved = null;
      try {
        saved = localStorage.getItem("DOCSIFY_DARK_MODE");
      } catch (err) {}
      current = saved === "dark" ? "dark" : "light";
      apply(config[current]);
      syncState();
    });
  }, window.$docsify.plugins || []);

  // document 级点击委托：不依赖 checkbox / change / for-id 链路，重渲染也不会丢失
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!t || !t.closest || !t.closest("#dark_mode > label")) {
      return;
    }
    toggle();
  });
})();
