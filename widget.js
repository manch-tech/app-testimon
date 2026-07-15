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
// widget.js - v3 isolado - funciona 100% no localhost e na loja //
(function () {
  const STYLE_ID = "tw-styles";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      .tw-wrap{ --tw-ink:#111827; --tw-paper:#F5F5F7; --tw-border:#E5E7EB; --tw-mustard:#FFB400;
        font-family:'Work Sans', system-ui, -apple-system, sans-serif; width:100%; box-sizing:border-box; }
      .tw-wrap *{ box-sizing:border-box; }
      .tw-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:16px; }
      .tw-carousel{ display:flex; gap:16px; overflow-x:auto; padding-bottom:8px; scroll-snap-type:x mandatory; }
      .tw-carousel .tw-card{ flex:0 0 300px; scroll-snap-align:start; }
      .tw-card{ background:var(--tw-paper); border:1px solid var(--tw-border); border-radius:14px; padding:20px; position:relative; }
      .tw-top{ display:flex; align-items:center; gap:12px; margin-bottom:12px; }
      .tw-avatar{ width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; color:#fff; flex-shrink:0; }
      .tw-info{ flex:1; min-width:0; }
      .tw-name{ font-weight:600; font-size:14.5px; color:var(--tw-ink); line-height:1.2; }
      .tw-date{ font-size:12px; color:#6B7280; margin-top:2px; }
      .tw-stars{ display:flex; align-items:center; gap:6px; margin-bottom:12px; }
      .tw-stars .stars{ color:var(--tw-mustard); font-size:16px; letter-spacing:1.5px; }
      .tw-badge{ width:16px; height:16px; color:#3B82F6; display:inline-flex; }
      .tw-msg{ font-size:14px; line-height:1.6; color:#1F2937; margin:0; }
      .tw-msg.truncated{ display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
      .tw-readmore{ font-size:13px; color:#6B7280; cursor:pointer; margin-top:10px; display:none; }
      .tw-readmore:hover{ color:#111827; }
      .tw-empty,.tw-loading{ opacity:.5; font-size:14px; padding:20px; text-align:center; }
       .tw-footer{text-align:right;font-size:11px;color:#9CA3AF;margin-top:12px}
  `;
    
    document.head.appendChild(style);
  }

  function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
  function getInitial(n){ return (n||'?').trim().charAt(0).toUpperCase(); }
  function avatarColor(n){ const colors=['#2E5C4D','#4A6FA5','#7C5CFC','#B45309','#374151']; let h=0; for(let i=0;i<(n||'').length;i++) h+=n.charCodeAt(i); return colors[h%colors.length]; }
  function formatDate(iso){ try{ return new Date(iso).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}); }catch{ return ''; } }
  function starString(n){ return '★'.repeat(Math.max(0,Math.min(5,n||5))); }

  async function renderWidget(container){
    const url = container.dataset.supabaseUrl;
    const key = container.dataset.supabaseKey;
    const limit = parseInt(container.dataset.limit||'6',10);
    const layout = container.dataset.layout==='carousel'?'carousel':'grid';
    const bg = container.dataset.cardBg || '#F5F5F7';
    const border = container.dataset.cardBorder || '#E5E7EB';

    if(!url||!key){ container.innerHTML='<p class="tw-empty">Configure data-supabase-url e key</p>'; return; }

    container.classList.add('tw-wrap');
    container.style.setProperty('--tw-paper', bg);
    container.style.setProperty('--tw-border', border);
    container.innerHTML='<p class="tw-loading">Carregando...</p>';

    try{
      const endpoint = `${url.replace(/\/$/,'')}/rest/v1/testimonials?select=name,message,rating,created_at&approved=eq.true&order=created_at.desc&limit=${limit}`;
      const res = await fetch(endpoint,{headers:{apikey:key,Authorization:`Bearer ${key}`}});
      const data = await res.json();
      if(!Array.isArray(data)||!data.length){ container.innerHTML='<p class="tw-empty">Sem depoimentos</p>'; return; }

      const wrapClass = layout==='carousel'?'tw-carousel':'tw-grid';
      container.innerHTML = `<div class="${wrapClass}">${data.map(t=>{
        const initial = getInitial(t.name);
        const color = avatarColor(t.name);
        return `
        <div class="tw-card">
          <div class="tw-top">
            <div class="tw-avatar" style="background:${color}">${escapeHtml(initial)}</div>
            <div class="tw-info">
              <div class="tw-name">${escapeHtml(t.name)}</div>
              <div class="tw-date">${escapeHtml(formatDate(t.created_at))}</div>
            </div>
          </div>
          <div class="tw-stars">
            <span class="stars">${starString(t.rating)}</span>
            <span class="tw-badge"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm-1.2 14.5-3.5-3.5 1.4-1.4 2.1 2.1 4.6-4.6 1.4Z"/></svg></span>
          </div>
          <p class="tw-msg truncated">"${escapeHtml(t.message)}"</p>
          <span class="tw-readmore">Read more</span>
          <div class="tw-footer">RevewsTestimon</div>
        </div>`;
      }).join('')}</div>`;

      container.querySelectorAll('.tw-card').forEach(card=>{
        const msg = card.querySelector('.tw-msg');
        const more = card.querySelector('.tw-readmore');
        if(msg.scrollHeight > msg.clientHeight + 5) more.style.display='inline-block';
        more.addEventListener('click',()=>{
          const isTrunc = msg.classList.contains('truncated');
          msg.classList.toggle('truncated');
          more.textContent = isTrunc ? 'Show less' : 'Read more';
        });
      });

    }catch(e){ container.innerHTML='<p class="tw-empty">Erro ao carregar</p>'; console.error(e); }
  }

  function init(){ document.querySelectorAll('[data-supabase-url]').forEach(renderWidget); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();