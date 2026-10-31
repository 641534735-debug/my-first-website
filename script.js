// 找到页面上的菜单按钮和导航区域。
const menuButton = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

// 点击按钮时打开或收起手机导航菜单。
menuButton.addEventListener("click", () => {
  const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isExpanded));
  menuButton.setAttribute("aria-label", isExpanded ? "打开导航菜单" : "关闭导航菜单");
  siteNav.classList.toggle("is-open", !isExpanded);
});

// 点击导航链接后收起菜单，方便在手机上继续浏览。
siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "打开导航菜单");
    siteNav.classList.remove("is-open");
  });
});

// 自动填写今年的年份，明年打开网站时也会自动更新。
document.querySelector("#current-year").textContent = new Date().getFullYear();
