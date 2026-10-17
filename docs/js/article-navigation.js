!function () {
  "use strict";

  function normalizeRoute(route) {
    var hashIndex = route.indexOf("#");
    if (hashIndex !== -1) route = route.slice(hashIndex + 1);
    route = route.split("?")[0].split("#")[0];

    try {
      route = decodeURIComponent(route);
    } catch (error) {
      console.warn("文章导航：无法解析当前路由。", error);
    }

    return route.replace(/^\/+|\/+$/g, "").replace(/\.md$/i, "").toLowerCase();
  }

  function createItem(label, link, message, className) {
    var item = document.createElement(link ? "a" : "span");
    item.className = "article-pagination__item" + (link ? "" : " is-disabled");
    item.setAttribute("aria-label", label);

    if (link) {
      item.setAttribute("href", link.getAttribute("href"));
      item.setAttribute("title", link.title || link.textContent.trim());
    } else {
      item.setAttribute("aria-disabled", "true");
    }

    var direction = document.createElement("span");
    direction.className = "article-pagination__direction";
    direction.textContent = label;

    var title = document.createElement("span");
    title.className = "article-pagination__title";
    title.textContent = link ? link.textContent.trim() : message;

    item.appendChild(direction);
    item.appendChild(title);

    if (className) item.classList.add(className);
    return item;
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [function (hook) {
    hook.doneEach(function () {
      var content = document.querySelector(".markdown-section");
      var sidebarLinks = Array.prototype.slice.call(
        document.querySelectorAll(".sidebar-nav a.page-link")
      );

      if (!content || !sidebarLinks.length) return;

      var currentRoute = normalizeRoute(window.location.hash);
      var currentLink = sidebarLinks.find(function (link) {
        return normalizeRoute(link.getAttribute("href") || "") === currentRoute;
      });

      if (!currentLink) return;

      var group = currentLink.closest("li.group");
      var list = group && group.querySelector(":scope > ul");
      if (!list) return;

      var moduleLinks = Array.prototype.slice.call(list.children)
        .map(function (item) {
          return item.querySelector(":scope > a.page-link");
        })
        .filter(Boolean);
      var currentIndex = moduleLinks.indexOf(currentLink);

      if (currentIndex === -1) return;

      var existingNavigation = content.querySelector(".article-pagination");
      if (existingNavigation) existingNavigation.remove();

      var navigation = document.createElement("nav");
      navigation.className = "article-pagination";
      navigation.setAttribute("aria-label", "模块文章导航");
      navigation.appendChild(createItem(
        "上一篇",
        moduleLinks[currentIndex - 1],
        "已是本模块第一篇",
        "is-previous"
      ));
      navigation.appendChild(createItem(
        "下一篇",
        moduleLinks[currentIndex + 1],
        "已是本模块最后一篇",
        "is-next"
      ));
      content.appendChild(navigation);
    });
  }].concat(window.$docsify.plugins || []);
}();
