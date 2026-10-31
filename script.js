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

// 点击导航里的“联系我”时显示提示；链接仍会继续跳到联系方式区域。
const contactLink = document.querySelector(".nav-contact");
contactLink.addEventListener("click", () => {
  alert("你好！欢迎联系我，邮箱是 6413@163.com。");
});

// 找到主题切换按钮及按钮里的图标和文字。
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");

// 点击时给 body 添加或移除 dark-theme 类，CSS 会据此切换颜色。
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  const nextLabel = isDark ? "浅色模式" : "深色模式";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", `切换到${nextLabel}`);
  themeIcon.textContent = isDark ? "☀" : "☾";
  themeLabel.textContent = nextLabel;
});

// 自动填写今年的年份，明年打开网站时也会自动更新。
document.querySelector("#current-year").textContent = new Date().getFullYear();

// 首次打开时显示的项目，以及用户新增项目时使用的本地存储名称。
const projectStorageKey = "winterPortfolioProjects";
const defaultProjects = [
  {
    id: "autumn-scenes",
    name: "附近秋景推荐",
    description: "围绕附近的秋日风景，整理适合探索与出游的景点灵感。",
    status: "未开始",
    progress: 0,
    category: "旅行推荐 · 项目",
    visual: "autumn"
  },
  {
    id: "qinhuangdao-commute",
    name: "京秦通勤顺风车信息快速匹配",
    description: "聚焦京秦通勤场景，梳理顺风车信息与快速匹配需求。",
    status: "已完成",
    progress: 100,
    category: "出行服务 · 项目",
    visual: "commute"
  },
  {
    id: "popular-destination-marketing",
    name: "网红景点营销项目",
    description: "围绕网红景点，探索内容策划与线上营销表达。",
    status: "进行中",
    progress: 80,
    category: "文旅推广 · 项目",
    visual: "marketing"
  },
  {
    id: "vibe-coding",
    name: "Vibe Coding 开发项目",
    description: "记录通过 Vibe Coding 思路，将创意逐步转化为作品的过程。",
    status: "进行中",
    progress: 60,
    category: "AI 辅助开发 · 项目",
    visual: "vibe"
  }
];
const allowedProjectStatuses = ["未开始", "进行中", "已完成"];
const projectGrid = document.querySelector("#project-grid");
const projectForm = document.querySelector("#project-form");
const projectFormMessage = document.querySelector("#project-form-message");
const projectNameInput = document.querySelector("#project-name");
const projectDescriptionInput = document.querySelector("#project-description");
const projectStatusInput = document.querySelector("#project-status");
const projectProgressInput = document.querySelector("#project-progress");
const projectProgressOutput = document.querySelector("#project-progress-output");

function saveProjects() {
  try {
    localStorage.setItem(projectStorageKey, JSON.stringify(projects));
    return true;
  } catch (error) {
    return false;
  }
}

function loadProjects() {
  try {
    const storedProjects = localStorage.getItem(projectStorageKey);
    if (!storedProjects) return null;

    const parsedProjects = JSON.parse(storedProjects);
    if (!Array.isArray(parsedProjects)) return null;

    return parsedProjects.filter((project) =>
      project &&
      typeof project.name === "string" &&
      typeof project.description === "string" &&
      allowedProjectStatuses.includes(project.status)
    ).map((project) => {
      const defaultProject = defaultProjects.find((item) => item.name === project.name);
      const fallbackProgress = project.status === "已完成"
        ? 100
        : project.status === "未开始"
          ? 0
          : defaultProject?.progress ?? (/股市观察器/.test(project.name) ? 30 : 0);
      const hasProgress = project.progress !== undefined && Number.isFinite(Number(project.progress));
      const progress = project.status === "已完成"
        ? 100
        : project.status === "未开始"
          ? 0
          : Math.min(100, Math.max(0, hasProgress ? Number(project.progress) : fallbackProgress));

      return { ...project, progress };
    });
  } catch (error) {
    return null;
  }
}

function addVisualText(visual, className, text) {
  const element = document.createElement("span");
  element.className = className;
  element.textContent = text;
  visual.append(element);
}

const projectArtPalettes = [
  { background: "#e5eee6", accent: "#78947d", highlight: "#d2ad78", ink: "#44564a" },
  { background: "#e5edf0", accent: "#7896a0", highlight: "#d4b28b", ink: "#43565d" },
  { background: "#f1e7df", accent: "#b67e68", highlight: "#e0bd88", ink: "#644e45" },
  { background: "#ebe8f1", accent: "#8a81a6", highlight: "#d3b88a", ink: "#514d63" },
  { background: "#f0ecdF", accent: "#9b8a64", highlight: "#d3a66f", ink: "#5c5442" }
];

function hashProjectText(text) {
  let hash = 2166136261;
  for (const character of text) {
    hash ^= character.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function appendSvgShape(svg, tagName, attributes) {
  const shape = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  Object.entries(attributes).forEach(([name, value]) => shape.setAttribute(name, value));
  svg.append(shape);
  return shape;
}

function getProjectArtTheme(text) {
  if (/车|通勤|路线|出行|交通|京秦/.test(text)) return "commute";
  if (/营销|推广|景点|打卡|文旅|目的地/.test(text)) return "marketing";
  if (/代码|编程|开发|vibe|网站|网页|软件/i.test(text)) return "digital";
  if (/秋|景|旅游|自然|花|公园|户外|风景/.test(text)) return "nature";
  return "abstract";
}

function createGeneratedProjectArt(project) {
  const text = `${project.name} ${project.description}`;
  const hash = hashProjectText(text);
  const artTheme = getProjectArtTheme(text);
  const themePaletteIndexes = { nature: 0, commute: 1, marketing: 2, digital: 3 };
  const paletteIndex = themePaletteIndexes[artTheme] ?? hash % projectArtPalettes.length;
  const palette = projectArtPalettes[paletteIndex];
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "custom-project-art");
  svg.setAttribute("viewBox", "0 0 320 180");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${project.name}的自动生成插画`);

  appendSvgShape(svg, "rect", { width: "320", height: "180", fill: palette.background });
  appendSvgShape(svg, "circle", { cx: "274", cy: "31", r: "35", fill: palette.highlight, opacity: ".58" });
  appendSvgShape(svg, "circle", { cx: "39", cy: "158", r: "55", fill: palette.accent, opacity: ".16" });

  if (artTheme === "nature") {
    appendSvgShape(svg, "path", { d: "M0 145 Q70 105 145 145 T320 135 V180 H0Z", fill: palette.accent, opacity: ".48" });
    appendSvgShape(svg, "path", { d: "M0 161 Q95 128 190 158 T320 150 V180 H0Z", fill: palette.ink, opacity: ".2" });
    appendSvgShape(svg, "path", { d: "M158 130V78", stroke: palette.ink, "stroke-width": "8", "stroke-linecap": "round" });
    appendSvgShape(svg, "circle", { cx: "158", cy: "69", r: "27", fill: palette.accent });
    appendSvgShape(svg, "circle", { cx: "136", cy: "82", r: "17", fill: palette.highlight });
    appendSvgShape(svg, "circle", { cx: "178", cy: "85", r: "18", fill: palette.accent, opacity: ".8" });
    appendSvgShape(svg, "circle", { cx: "223", cy: "116", r: "12", fill: palette.highlight });
  } else if (artTheme === "commute") {
    appendSvgShape(svg, "path", { d: "M0 137H320", stroke: palette.ink, "stroke-width": "5", "stroke-dasharray": "20 14", opacity: ".28" });
    appendSvgShape(svg, "path", { d: "M82 112L97 82Q101 75 110 75H190Q198 75 203 83L220 112Z", fill: palette.accent });
    appendSvgShape(svg, "rect", { x: "68", y: "108", width: "168", height: "35", rx: "13", fill: palette.ink });
    appendSvgShape(svg, "rect", { x: "105", y: "84", width: "38", height: "24", rx: "6", fill: palette.background });
    appendSvgShape(svg, "rect", { x: "150", y: "84", width: "39", height: "24", rx: "6", fill: palette.background });
    appendSvgShape(svg, "circle", { cx: "106", cy: "143", r: "13", fill: palette.highlight, stroke: palette.background, "stroke-width": "5" });
    appendSvgShape(svg, "circle", { cx: "200", cy: "143", r: "13", fill: palette.highlight, stroke: palette.background, "stroke-width": "5" });
  } else if (artTheme === "marketing") {
    appendSvgShape(svg, "path", { d: "M96 77L160 38L224 77V145H96Z", fill: palette.accent });
    appendSvgShape(svg, "path", { d: "M81 79L160 29L239 79", fill: "none", stroke: palette.ink, "stroke-width": "9", "stroke-linecap": "round", "stroke-linejoin": "round" });
    [120, 151, 182, 213].forEach((x) => {
      appendSvgShape(svg, "rect", { x: String(x), y: "91", width: "10", height: "54", rx: "5", fill: palette.background });
    });
    appendSvgShape(svg, "path", { d: "M83 146H237", stroke: palette.ink, "stroke-width": "8", "stroke-linecap": "round" });
    appendSvgShape(svg, "path", { d: "M259 71L265 83L278 85L268 94L270 107L259 101L248 107L250 94L240 85L253 83Z", fill: palette.highlight });
  } else if (artTheme === "digital") {
    appendSvgShape(svg, "rect", { x: "70", y: "39", width: "180", height: "108", rx: "14", fill: palette.ink });
    appendSvgShape(svg, "circle", { cx: "91", cy: "57", r: "4", fill: palette.highlight });
    appendSvgShape(svg, "circle", { cx: "106", cy: "57", r: "4", fill: palette.accent });
    appendSvgShape(svg, "circle", { cx: "121", cy: "57", r: "4", fill: palette.background });
    appendSvgShape(svg, "path", { d: "M111 83L96 95L111 107M139 83L154 95L139 107", fill: "none", stroke: palette.highlight, "stroke-width": "6", "stroke-linecap": "round", "stroke-linejoin": "round" });
    appendSvgShape(svg, "path", { d: "M171 109L185 81", stroke: palette.accent, "stroke-width": "6", "stroke-linecap": "round" });
    appendSvgShape(svg, "rect", { x: "97", y: "124", width: "104", height: "5", rx: "3", fill: palette.background, opacity: ".65" });
  } else {
    const shift = hash % 36;
    appendSvgShape(svg, "rect", { x: String(83 + shift), y: "42", width: "135", height: "96", rx: "20", fill: palette.accent, opacity: ".85" });
    appendSvgShape(svg, "circle", { cx: String(120 + shift), cy: "83", r: "25", fill: palette.highlight });
    appendSvgShape(svg, "circle", { cx: String(185 + shift), cy: "112", r: "17", fill: palette.background });
    appendSvgShape(svg, "path", { d: `M${105 + shift} 127Q${151 + shift} 71 ${207 + shift} 77`, fill: "none", stroke: palette.ink, "stroke-width": "5", "stroke-linecap": "round", opacity: ".7" });
  }

  return svg;
}

function createProjectVisual(project) {
  const visual = document.createElement("div");
  visual.className = `project-visual project-visual-${project.visual || "custom"}`;

  if (project.visual === "autumn") {
    addVisualText(visual, "visual-symbol", "🍂");
    addVisualText(visual, "visual-caption", "秋日 · 附近");
  } else if (project.visual === "commute") {
    addVisualText(visual, "route-label", "京 ⇄ 秦");
    addVisualText(visual, "visual-caption", "通勤顺风车");
  } else if (project.visual === "marketing") {
    addVisualText(visual, "marketing-sparkle", "✦");
    addVisualText(visual, "marketing-title", "发现目的地");
    addVisualText(visual, "marketing-tag", "值得打卡");
  } else if (project.visual === "vibe") {
    const codeWindow = document.createElement("div");
    codeWindow.className = "code-window";
    addVisualText(codeWindow, "code-dots", "● ● ●");
    ["code-line code-line-long", "code-line", "code-line code-line-short"].forEach((className) => {
      const line = document.createElement("span");
      line.className = className;
      codeWindow.append(line);
    });
    addVisualText(codeWindow, "code-cursor", "▍");
    visual.append(codeWindow);
  } else {
    visual.append(createGeneratedProjectArt(project));
  }

  return visual;
}

function createProjectCard(project) {
  const card = document.createElement("article");
  card.className = `project-card${project.visual ? ` project-${project.visual}` : " project-custom"}`;
  card.dataset.projectId = project.id;

  const info = document.createElement("div");
  info.className = "project-info";
  const textGroup = document.createElement("div");
  textGroup.className = "project-name-group";
  const category = document.createElement("p");
  category.className = "project-type";
  category.textContent = project.category || "个人项目";
  const title = document.createElement("h3");
  title.textContent = project.name;
  textGroup.append(category, title);

  const status = document.createElement("span");
  status.className = "project-status";
  status.dataset.status = project.status;
  status.textContent = project.status;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-project-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `删除项目：${project.name}`);
  deleteButton.textContent = "删除";
  info.append(textGroup, status);

  const description = document.createElement("p");
  description.className = "project-description";
  description.textContent = project.description;

  const progress = document.createElement("div");
  progress.className = "project-progress";
  const progressLabel = document.createElement("span");
  progressLabel.className = "project-progress-label";
  progressLabel.textContent = "完成进度";
  const progressValue = document.createElement("span");
  progressValue.className = "project-progress-value";
  progressValue.textContent = `${project.progress}%`;
  const progressMeter = document.createElement("progress");
  progressMeter.className = "project-progress-meter";
  progressMeter.max = 100;
  progressMeter.value = project.progress;
  progressMeter.setAttribute("aria-label", `${project.name}完成进度`);
  progress.append(progressLabel, progressValue, progressMeter);

  const visual = createProjectVisual(project);
  visual.append(deleteButton);
  card.append(visual, info, description, progress);
  return card;
}

function renderProjects() {
  projectGrid.replaceChildren(...projects.map(createProjectCard));
}

let projects = loadProjects();
if (projects === null) {
  projects = defaultProjects;
  saveProjects();
}
renderProjects();

function syncProgressControl() {
  if (projectStatusInput.value === "已完成") {
    projectProgressInput.value = "100";
    projectProgressInput.disabled = true;
  } else if (projectStatusInput.value === "未开始") {
    projectProgressInput.value = "0";
    projectProgressInput.disabled = true;
  } else {
    projectProgressInput.disabled = false;
  }
  projectProgressOutput.value = `${projectProgressInput.value}%`;
  projectProgressOutput.textContent = `${projectProgressInput.value}%`;
}

projectStatusInput.addEventListener("change", () => {
  if (projectStatusInput.value === "进行中") projectProgressInput.value = "0";
  syncProgressControl();
});
projectProgressInput.addEventListener("input", () => {
  projectProgressOutput.value = `${projectProgressInput.value}%`;
  projectProgressOutput.textContent = `${projectProgressInput.value}%`;
});
syncProgressControl();

projectForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = projectNameInput.value.trim();
  const description = projectDescriptionInput.value.trim();
  const status = projectStatusInput.value;
  const progress = status === "已完成"
    ? 100
    : status === "未开始"
      ? 0
      : Number(projectProgressInput.value);

  if (!name || !description) {
    projectFormMessage.textContent = "请填写项目名称和介绍后再添加。";
    return;
  }

  projects.unshift({
    id: `project-${Date.now()}`,
    name,
    description,
    status,
    progress,
    category: "个人项目",
    visual: "custom"
  });
  renderProjects();
  projectForm.reset();
  syncProgressControl();
  projectFormMessage.textContent = saveProjects()
    ? "项目已添加并保存在此浏览器中。"
    : "项目已添加，但浏览器暂时无法保存；刷新后可能会消失。";
  projectNameInput.focus();
});

// 使用事件委托处理所有卡片的删除按钮，删除前先询问确认。
projectGrid.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".delete-project-button");
  if (!deleteButton) return;

  const card = deleteButton.closest(".project-card");
  const project = projects.find((item) => item.id === card.dataset.projectId);
  if (!project || !window.confirm(`确定删除项目“${project.name}”吗？`)) return;

  projects = projects.filter((item) => item.id !== project.id);
  renderProjects();
  projectFormMessage.textContent = saveProjects()
    ? `项目“${project.name}”已删除。`
    : "项目已从页面移除，但浏览器暂时无法保存此更改。";
});
