"use strict";

/**
 * BHH Pharmacy Digital Hub
 * Add/edit application records here. Never put secrets or tokens in this file.
 * URLs come from the portal owner's provided application list.
 */
const APPS = Object.freeze([
  {
    id: "pedidose",
    name: "PediDose TH",
    subtitle: "ค้นหาและคำนวณขนาดยา",
    description: "ค้นหาข้อมูลยาและช่วยคำนวณขนาดยาตามเงื่อนไขที่ระบบรองรับ พร้อมทวนสอบก่อนใช้งานจริง",
    category: "clinical", icon: "pill", tone: "blue",
    url: "https://pedidose-th.bhh-infirmary-sandbox.workers.dev/"
  },
  {
    id: "pedidose-admin",
    name: "PediDose Admin",
    subtitle: "จัดการยาและสูตรคำนวณ",
    description: "พื้นที่สำหรับผู้ดูแลระบบ เพื่อจัดการข้อมูลยาและกฎการคำนวณขนาดยา",
    category: "admin", icon: "lock", tone: "amber", restricted: true
  },
  {
    id: "prescribing-error",
    name: "Prescribing Error",
    subtitle: "ระบบความคลาดเคลื่อนการสั่งยา",
    description: "เข้าถึงเครื่องมือสำหรับงานติดตามและจัดการข้อมูลความคลาดเคลื่อนด้านการสั่งใช้ยา",
    category: "clinical", icon: "shield", tone: "rose",
    url: "https://juipharm.github.io/BHH_Prescribing_Error/"
  },
  {
    id: "pharmacist-leave",
    name: "Pharmacist Leave",
    subtitle: "ระบบจัดการวันลาเภสัชกร",
    description: "เครื่องมือสนับสนุนการจัดการข้อมูลวันลาและการวางแผนกำลังคนของเภสัชกร",
    category: "operations", icon: "calendar", tone: "purple",
    url: "https://juipharm.github.io/BHH_Pharmacist_Leave/"
  },
  {
    id: "drug-price",
    name: "Drug Price",
    subtitle: "ระบบค้นหาราคายา",
    description: "ค้นหาและตรวจสอบข้อมูลราคายาที่บันทึกไว้ในระบบเพื่อประกอบการทำงาน",
    category: "operations", icon: "coins", tone: "teal",
    url: "https://juipharm.github.io/drug_price_app/"
  },
  {
    id: "formulary-admin",
    name: "Drug Formulary Admin",
    subtitle: "ระบบจัดการแบบฟอร์มบัญชียา",
    description: "สำหรับผู้ดูแลระบบ เพื่อจัดการข้อมูลและกระบวนการด้านแบบฟอร์มบัญชียา",
    category: "admin", icon: "file", tone: "slate",
    url: "https://juipharm.github.io/BHH_drug-formulary-form-app/admin/"
  },
  {
    id: "formulary",
    name: "Drug Formulary Form",
    subtitle: "แบบฟอร์มด้านบัญชียา",
    description: "เข้าถึงแบบฟอร์มงานบัญชียา สำหรับบันทึกหรือส่งข้อมูลตามขั้นตอนที่ระบบกำหนด",
    category: "operations", icon: "file", tone: "cyan",
    url: "https://juipharm.github.io/BHH_drug-formulary-form-app/"
  },
  {
    id: "vaccine",
    name: "Vaccine Advisor",
    subtitle: "ระบบแนะนำและคำนวณนัดวัคซีน",
    description: "ช่วยค้นหาข้อมูลวัคซีนตามเงื่อนไขที่กำหนด และสนับสนุนการพิจารณาวันนัดครั้งถัดไป",
    category: "clinical", icon: "syringe", tone: "teal",
    url: "https://juipharm.github.io/Vaccine/"
  },
  {
    id: "nlem",
    name: "NLEMz Explorer",
    subtitle: "สำรวจข้อมูลบัญชียาหลักแห่งชาติ",
    description: "เครื่องมือค้นหาและสำรวจข้อมูลยาในบัญชียาหลักแห่งชาติ",
    category: "resources", icon: "book", tone: "blue",
    url: "https://juipharm.github.io/NLEMz_Explorer/"
  },
  {
    id: "file-hosting",
    name: "File & Image Hosting",
    subtitle: "เครื่องมือสำหรับไฟล์และรูปภาพ",
    description: "เข้าถึงระบบจัดการไฟล์และรูปภาพ เพื่อสนับสนุนการทำงานร่วมกับแอปพลิเคชันอื่น",
    category: "resources", icon: "image", tone: "purple",
    url: "https://juipharm.github.io/files-images_hosting/"
  }
]);

const ADMIN_BASE_URL = "https://pedidose-th.bhh-infirmary-sandbox.workers.dev/admin";
const FAVORITES_KEY = "bhh-pharmacy-portal-favorites-v1";
const CATEGORY_LABELS = {
  all: "แอปพลิเคชันทั้งหมด",
  clinical: "Clinical Tools",
  operations: "Operations",
  resources: "Resources",
  admin: "Administration",
  favorites: "รายการโปรด"
};
const FILTERS = ["all", "clinical", "operations", "resources", "admin", "favorites"];
const $ = (selector) => document.querySelector(selector);

let activeFilter = "all";
let searchTerm = "";
let favoriteIds = loadFavorites();

function loadFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return new Set(Array.isArray(stored) ? stored.filter((id) => APPS.some((app) => app.id === id)) : []);
  } catch {
    return new Set();
  }
}

function saveFavorites() {
  try { localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favoriteIds])); }
  catch { /* Browsers can disable persistent storage; the current session still works. */ }
}

function icon(name) {
  return '<svg class="icon" aria-hidden="true"><use href="#i-' + name + '"></use></svg>';
}

function appCard(app) {
  const favorite = favoriteIds.has(app.id);
  const status = app.restricted ? "Restricted" : "External app";
  const statusClass = app.restricted ? "lock-dot" : "tiny-dot";
  const action = app.restricted
    ? '<button class="card-open open-admin" type="button" data-id="' + app.id + '">กรอก Token เพื่อเข้าใช้งาน ' + icon("arrow") + '</button>'
    : '<a class="card-open" href="' + app.url + '" target="_blank" rel="noopener noreferrer" aria-label="เปิด ' + app.name + ' ในแท็บใหม่">เปิดแอป ' + icon("arrow") + '</a>';

  return '<article class="app-card" data-id="' + app.id + '" tabindex="0" aria-label="' + app.name + ' — ' + app.subtitle + '">' +
    '<div class="card-top"><span class="card-icon tone-' + app.tone + '">' + icon(app.icon) + '</span>' +
    '<div class="card-actions"><span class="card-chip ' + (app.restricted ? "admin" : "") + '">' + (app.restricted ? "ADMIN ACCESS" : CATEGORY_LABELS[app.category]) + '</span>' +
    '<button class="favorite-button ' + (favorite ? "is-favorite" : "") + '" type="button" data-favorite="' + app.id + '" aria-pressed="' + favorite + '" aria-label="' + (favorite ? "นำออกจาก" : "เพิ่มใน") + 'รายการโปรด: ' + app.name + '" title="รายการโปรด">' + icon("star") + '</button></div></div>' +
    '<h3 class="card-title">' + app.name + '</h3>' +
    '<p class="card-subtitle">' + app.subtitle + '</p>' +
    '<p class="card-description">' + app.description + '</p>' +
    '<div class="card-footer"><span class="card-label"><i class="' + statusClass + '"></i>' + status + '</span>' + action + '</div></article>';
}

function updateCounts() {
  const counts = {
    all: APPS.length,
    clinical: APPS.filter((app) => app.category === "clinical").length,
    operations: APPS.filter((app) => app.category === "operations").length,
    resources: APPS.filter((app) => app.category === "resources").length,
    admin: APPS.filter((app) => app.category === "admin").length,
    favorites: favoriteIds.size
  };
  const selectors = {
    all: "#countAll", clinical: "#countClinical", operations: "#countOperations",
    resources: "#countResources", admin: "#countAdmin", favorites: "#countFavorites"
  };
  for (const key of FILTERS) {
    const target = $(selectors[key]);
    if (target) target.textContent = counts[key];
  }
  $("#heroCount").textContent = counts.all;
  $("#totalMetric").textContent = counts.all;
  $("#clinicalMetric").textContent = counts.clinical;
  $("#operationsMetric").textContent = counts.operations;
  $("#favoritesMetric").textContent = counts.favorites;
}

function render() {
  const normalized = searchTerm.trim().toLocaleLowerCase("th-TH");
  const visibleApps = APPS.filter((app) => {
    const inCategory = activeFilter === "all" || (activeFilter === "favorites" ? favoriteIds.has(app.id) : app.category === activeFilter);
    const matches = !normalized || [app.name, app.subtitle, app.description, CATEGORY_LABELS[app.category]]
      .some((value) => value.toLocaleLowerCase("th-TH").includes(normalized));
    return inCategory && matches;
  });
  $("#appGrid").innerHTML = visibleApps.map(appCard).join("");
  $("#emptyState").hidden = visibleApps.length > 0;
  $("#visibleCount").textContent = visibleApps.length;
  $("#sectionTitle").firstChild.textContent = CATEGORY_LABELS[activeFilter] + " ";
  $("#sectionDescription").textContent = activeFilter === "favorites"
    ? "รายการที่คุณบันทึกเป็นรายการโปรดในเบราว์เซอร์เครื่องนี้"
    : "เลือกเครื่องมือที่ต้องการเพื่อเริ่มใช้งาน";
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const selected = button.dataset.filter === activeFilter;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  updateCounts();
}

function setFilter(value) {
  if (!FILTERS.includes(value)) return;
  activeFilter = value;
  render();
  closeMobileMenu();
}

function setFavorite(id) {
  if (!APPS.some((app) => app.id === id)) return;
  if (favoriteIds.has(id)) favoriteIds.delete(id);
  else favoriteIds.add(id);
  saveFavorites();
  render();
}

function openExternal(url) {
  // An actual anchor avoids storing or changing any third-party URL.
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openApp(id) {
  const app = APPS.find((item) => item.id === id);
  if (!app) return;
  if (app.restricted) {
    $("#adminToken").value = "";
    $("#adminToken").type = "password";
    $("#toggleToken").textContent = "แสดง";
    $("#adminDialog").showModal();
    $("#adminToken").focus();
  } else {
    openExternal(app.url);
  }
}

function closeMobileMenu() {
  $("#sidebar").classList.remove("is-open");
  $("#mobileBackdrop").hidden = true;
  $("#mobileMenu").setAttribute("aria-expanded", "false");
}

function init() {
  $("#copyrightYear").textContent = String(new Date().getFullYear());
  $("#todayLabel").textContent = new Intl.DateTimeFormat("th-TH", {
    timeZone: "Asia/Bangkok", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());

  $("#mobileFilters").innerHTML = FILTERS.map((value) =>
    '<button type="button" class="filter-chip" data-filter="' + value + '" aria-pressed="false">' + CATEGORY_LABELS[value] + '</button>'
  ).join("");
  document.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-favorite]");
    if (favoriteButton) { setFavorite(favoriteButton.dataset.favorite); return; }
    const filterButton = event.target.closest("[data-filter]");
    if (filterButton) { setFilter(filterButton.dataset.filter); return; }
    const adminButton = event.target.closest(".open-admin");
    if (adminButton) { openApp(adminButton.dataset.id); return; }
    const card = event.target.closest(".app-card");
    if (card && !event.target.closest("a, button")) openApp(card.dataset.id);
  });
  $("#appGrid").addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".app-card")) {
      event.preventDefault();
      openApp(event.target.dataset.id);
    }
  });
  $("#searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    render();
  });
  $("#resetFilters").addEventListener("click", () => {
    $("#searchInput").value = "";
    searchTerm = "";
    setFilter("all");
  });
  document.addEventListener("keydown", (event) => {
    const isTyping = event.target.matches("input, textarea, [contenteditable='true']");
    if (!isTyping && (event.key === "/" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"))) {
      event.preventDefault();
      $("#searchInput").focus();
    }
    if (event.key === "Escape") closeMobileMenu();
  });

  $("#mobileMenu").addEventListener("click", () => {
    const opening = !$("#sidebar").classList.contains("is-open");
    $("#sidebar").classList.toggle("is-open", opening);
    $("#mobileBackdrop").hidden = !opening;
    $("#mobileMenu").setAttribute("aria-expanded", String(opening));
  });
  $("#mobileBackdrop").addEventListener("click", closeMobileMenu);
  $("#dialogClose").addEventListener("click", () => $("#adminDialog").close());
  $("#toggleToken").addEventListener("click", () => {
    const field = $("#adminToken");
    const visible = field.type === "password";
    field.type = visible ? "text" : "password";
    $("#toggleToken").textContent = visible ? "ซ่อน" : "แสดง";
  });
  $("#adminForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const token = $("#adminToken").value.trim();
    if (!token) { $("#adminToken").focus(); return; }
    // Secrets are never hardcoded or persisted in portal source/localStorage.
    // The downstream app currently requires URL-based token authentication.
    const target = ADMIN_BASE_URL + "?token=" + encodeURIComponent(token);
    $("#adminDialog").close();
    $("#adminToken").value = "";
    openExternal(target);
  });
  $("#adminDialog").addEventListener("click", (event) => {
    if (event.target === $("#adminDialog")) $("#adminDialog").close();
  });
  render();
}

document.addEventListener("DOMContentLoaded", init);
