(() => {
  const C = window.SITE_CONFIG || {};
  const D = window.I18N;
  const LANGS = Object.keys(D);

  function pickLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (q && D[q]) return q;
    try {
      const saved = localStorage.getItem("lang");
      if (saved && D[saved]) return saved;
    } catch (e) {}
    for (const l of navigator.languages || [navigator.language || ""]) {
      const low = l.toLowerCase();
      if (low.startsWith("zh")) return /cn|sg|hans/.test(low) ? "zh-CN" : "zh-TW";
      if (low.startsWith("ja")) return "ja";
      if (low.startsWith("en")) return "en";
    }
    return "en";
  }

  function apply(lang) {
    const t = D[lang];
    document.documentElement.lang = lang;
    document.title = t.title;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const k = el.getAttribute("data-i18n");
      if (t[k] != null) el.textContent = t[k];
    });
    document.querySelectorAll(".roadmap li").forEach((li) => {
      li.querySelector(".tag").textContent = t[li.dataset.status];
    });
    try { localStorage.setItem("lang", lang); } catch (e) {}
  }

  // 依設定顯示或隱藏按鈕
  function link(id, url) {
    const el = document.getElementById(id);
    if (!el) return false;
    if (url) { el.href = url; return true; }
    el.remove();
    return false;
  }
  const hasStore = link("install", C.CHROME_STORE_URL);
  if (hasStore) document.getElementById("soon").remove();
  const k = link("kofi", C.KOFI_URL);
  const e = link("ecpay", C.ECPAY_URL);
  if (k || e) document.getElementById("supportSoon").remove();
  link("contact", C.CONTACT_EMAIL ? "mailto:" + C.CONTACT_EMAIL : "");

  const sel = document.getElementById("lang");
  for (const l of LANGS) {
    const o = document.createElement("option");
    o.value = l;
    o.textContent = D[l].langName;
    sel.append(o);
  }
  const lang = pickLang();
  sel.value = lang;
  sel.addEventListener("change", () => apply(sel.value));
  apply(lang);
})();
