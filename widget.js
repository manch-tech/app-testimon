/**
 * Widget de Testemunhos — cole em qualquer site
 *
 * Uso:
 * <div id="meus-testemunhos"
 *      data-supabase-url="https://SEU-PROJETO.supabase.co"
 *      data-supabase-key="SUA_CHAVE_ANON_PUBLIC"
 *      data-limit="6"
 *      data-layout="grid"></div>
 * <script src="https://SEU-USUARIO.github.io/testimonial-app/widget.js"></script>
 *
 * data-layout pode ser "grid" (cartões lado a lado) ou "carousel" (rolagem horizontal)
 */
(function () {
  const FONT_LINK_ID = "tw-fonts";
  if (!document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement("link");
    link.id = FONT_LINK_ID;
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Work+Sans:wght@400;500;600&display=swap";
    document.head.appendChild(link);
  }

  const STYLE_ID = "tw-styles";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tw-wrap{ --tw-ink:#1D2B36; --tw-paper:#FBF7EC; --tw-teal:#1B4B43; --tw-mustard:#E8A33D;
        font-family:'Work Sans', sans-serif; color:var(--tw-ink); width:100%; box-sizing:border-box; }
      .tw-wrap *{ box-sizing:border-box; }
      .tw-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:18px; }
      .tw-carousel{ display:flex; gap:18px; overflow-x:auto; padding-bottom:8px; scroll-snap-type:x mandatory; }
      .tw-carousel .tw-card{ flex:0 0 260px; scroll-snap-align:start; }
      .tw-card{
        background:var(--tw-paper); border:1px solid rgba(29,43,54,0.1); border-radius:10px;
        padding:20px; position:relative;
      }
      .tw-stars{ color:var(--tw-mustard); font-size:14px; margin-bottom:10px; letter-spacing:1px; }
      .tw-msg{ font-family:'Fraunces', serif; font-size:16px; line-height:1.5; margin:0 0 14px; }
      .tw-name{ font-weight:600; font-size:14px; }
      .tw-role{ font-size:12px; opacity:.6; }
      .tw-empty{ opacity:.5; font-size:14px; padding:20px; text-align:center; }
      .tw-loading{ opacity:.5; font-size:14px; padding:20px; text-align:center; }
    `;
    document.head.appendChild(style);
  }

  function starString(n) {
    if (!n) return "";
    return "★".repeat(n) + "☆".repeat(5 - n);
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str || "";
    return d.innerHTML;
  }

  async function renderWidget(container) {
    const url = container.dataset.supabaseUrl;
    const key = container.dataset.supabaseKey;
    const limit = parseInt(container.dataset.limit || "6", 10);
    const layout = container.dataset.layout === "carousel" ? "carousel" : "grid";

    if (!url || !key) {
      container.innerHTML = '<p class="tw-empty">Widget de testemunhos: configure data-supabase-url e data-supabase-key.</p>';
      return;
    }

    container.classList.add("tw-wrap");
    container.innerHTML = '<p class="tw-loading">Carregando depoimentos...</p>';

    try {
      const endpoint = `${url.replace(/\/$/, "")}/rest/v1/testimonials?select=name,role_company,message,rating,created_at&approved=eq.true&order=created_at.desc&limit=${limit}`;
      const res = await fetch(endpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`
        }
      });
      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = '<p class="tw-empty">Ainda não há depoimentos publicados.</p>';
        return;
      }

      const wrapClass = layout === "carousel" ? "tw-carousel" : "tw-grid";
      container.innerHTML = `<div class="${wrapClass}">${data.map(t => `
        <div class="tw-card">
          ${t.rating ? `<div class="tw-stars">${starString(t.rating)}</div>` : ""}
          <p class="tw-msg">"${escapeHtml(t.message)}"</p>
          <div class="tw-name">${escapeHtml(t.name)}</div>
          ${t.role_company ? `<div class="tw-role">${escapeHtml(t.role_company)}</div>` : ""}
        </div>
      `).join("")}</div>`;
    } catch (err) {
      container.innerHTML = '<p class="tw-empty">Não foi possível carregar os depoimentos.</p>';
      console.error("Widget de testemunhos:", err);
    }
  }

  function init() {
    document.querySelectorAll("[data-supabase-url]").forEach(renderWidget);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
