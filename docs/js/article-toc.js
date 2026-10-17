!function () {
  "use strict";

  function createTocLink(heading) {
    var anchor = heading.querySelector("a.anchor");
    var href = anchor && anchor.getAttribute("href");

    if (!href && heading.id) {
      var route = window.location.hash.split("?")[0];
      href = route + "?id=" + encodeURIComponent(heading.id);
    }

    if (!href) return null;

    var item = document.createElement("div");
    item.className = "lv" + heading.tagName.slice(1);

    var link = document.createElement("a");
    link.href = href;
    link.title = heading.textContent.trim();

    var label = document.createElement("span");
    label.textContent = heading.textContent.trim();
    link.appendChild(label);
    item.appendChild(link);
    return item;
  }

  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [function (hook) {
    hook.doneEach(function () {
      var content = document.querySelector(".content");
      var article = document.getElementById("main");
      if (!content || !article) return;

      var toc = document.querySelector(".toc-nav");
      if (!toc) {
        toc = document.createElement("aside");
        toc.className = "toc-nav";
        content.parentNode.insertBefore(toc, content);
      }

      var items = Array.prototype.map.call(
        article.querySelectorAll("h2, h3"),
        createTocLink
      ).filter(Boolean);

      toc.replaceChildren();
      if (!items.length) {
        toc.classList.add("nothing");
        return;
      }

      toc.classList.remove("nothing");
      var list = document.createElement("div");
      list.className = "page_toc";
      items.forEach(function (item) {
        list.appendChild(item);
      });
      toc.appendChild(list);
    });
  }].concat(window.$docsify.plugins || []);
}();
