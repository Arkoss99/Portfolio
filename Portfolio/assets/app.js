(function(){
  // ---------- Language (CZ default in HTML; JS holds only EN) ----------
  // We capture the original (Czech) HTML for each i18n-tagged element so we can restore it.
  const originalContent = new Map(); // element -> {text, html, isHTML}
  const translations = {
    en: {
      "meta.title": "Milan Zlámal — Portfolio",
      "skip": "Skip to content",
      "nav.menu": "Menu",
      "nav.projects": "Projects",
      "nav.about": "About",
      "nav.skills": "Skills",
      "nav.contact": "Contact",

      "hero.eyebrow": "Hello, I'm Milan",
      "hero.title1": "Developer & Game Enthusiast",
      "hero.title2": "crafting clean web experiences",
      "hero.lede": "I build modern sites with HTML, CSS, JavaScript, and PHP — and explore game dev with Unity & Unreal. Have a look below.",
      "hero.cta.projects": "See Projects",
      "hero.cta.github": "GitHub",

      "projects.title": "Featured Projects",
      "projects.muted": "A mix of web and game experiments. Pulled from GitHub when possible.",
      "projects.more": "Browse all on GitHub",

      "about.title": "About",
      "about.p1": "I'm Milan Zlámal (online: <strong>Arkoss99</strong>). I enjoy turning ideas into working interfaces with a focus on clarity and details. On the web I use HTML, CSS, JavaScript, and PHP; for games I tinker in Unity &amp; Unreal.",
      "about.p2": "Right now, I'm experimenting with a moody 3D game <em>“No light left”</em> — early concept focused on atmosphere and lighting.",
      "about.l1": "Based in the Czech Republic",
      "about.l2": "Open to freelance/coop projects",
      "about.l3": "Languages: Czech, English",
      "about.highlights": "Highlights",
      "about.h1": "Built multiple school projects incl. responsive sites",
      "about.h2": "Python utility experiments (e.g., calculator)",
      "about.h3": "Game prototypes in Unreal & browser-based JS",

      "skills.title": "Skills",

      "contact.title": "Contact",
      "contact.helper": "Have an idea? Let's build it. Use the form or email me at <a href=\"mailto:milanzlamal@post.cz\">milanzlamal@post.cz</a>.",
      "form.name": "Name",
      "form.email": "Email",
      "form.message": "Message",
      "form.send": "Send message",

      "footer.copy": "© <span id=\"year\"></span> Milan Zlámal · <a href=\"https://github.com/Arkoss99\">@Arkoss99</a>",

      "lang.label": "Language"
    }
  };

  function cacheOriginals(){
    // Text-only keys
    document.querySelectorAll("[data-i18n]").forEach(el => {
      if(!originalContent.has(el)){
        originalContent.set(el, {isHTML:false, text:el.textContent, html:el.innerHTML});
      }
    });
    // HTML-allowed keys
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      if(!originalContent.has(el)){
        originalContent.set(el, {isHTML:true, text:el.textContent, html:el.innerHTML});
      }
    });
  }

  function applyTranslations(lang){
    const isEN = (lang === "en");
    const dict = translations.en; // only EN exists here

    // Elements with plain text
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.getAttribute("data-i18n");
      if(isEN && dict[key] !== undefined){
        el.textContent = "";      // prevent mixing
        el.innerHTML = dict[key]; // safe keys are plain text in EN set (some may include entities)
      } else {
        // restore Czech (original HTML content)
        const orig = originalContent.get(el);
        if(orig) el.innerHTML = orig.isHTML ? orig.html : orig.text;
      }
    });

    // Elements that allow HTML content explicitly
    document.querySelectorAll("[data-i18n-html]").forEach(el => {
      const key = el.getAttribute("data-i18n-html");
      if(isEN && dict[key] !== undefined){
        el.innerHTML = dict[key];
      } else {
        const orig = originalContent.get(el);
        if(orig) el.innerHTML = orig.html;
      }
    });

    // <html lang="...">
    document.documentElement.lang = isEN ? "en" : "cs";

    // title
    if(isEN && dict["meta.title"]){
      document.title = dict["meta.title"];
    } else {
      // restore original CZ title from DOM <title>
      const titleEl = document.querySelector("head > title");
      if(titleEl) document.title = titleEl.textContent;
    }
  }

  function getLang(){
    return localStorage.getItem("lang") || "cs"; // default Czech
  }
  function setLang(lang){
    const value = (lang === "en" ? "en" : "cs");
    localStorage.setItem("lang", value);
    const switcher = document.getElementById("langSwitch");
    if(switcher) {
      switcher.value = value;
      switcher.setAttribute('value', value); // Pro CSS selektor
    }
    applyTranslations(value);
  }

  // ---------- App init ----------
  document.addEventListener("DOMContentLoaded", () => {
    // year
    const yearEl = document.getElementById('year');
    if(yearEl) yearEl.textContent = new Date().getFullYear();

    // cache original Czech content before any language switch
    cacheOriginals();

    // Mobile nav toggle
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.getElementById('navmenu');
    if(toggle && menu){
      toggle.addEventListener('click', () => {
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        menu.setAttribute('aria-expanded', String(!expanded));
      });
    }

    // Language switcher (only EN available from JS; CZ = original HTML)
    const switcher = document.getElementById("langSwitch");
    if(switcher){
      switcher.addEventListener("change", (e) => setLang(e.target.value));
      setLang(getLang()); // initialize
    } else {
      applyTranslations(getLang());
    }

    // Projects — try GitHub API, fallback to static
    const grid = document.getElementById('projects-grid');
    const username = 'Arkoss99';
    const fallback = [
      {title: 'Portfolio', desc: 'School portfolio project in HTML/CSS.', url: 'https://github.com/Arkoss99/Portfolio', stack:['HTML','CSS']},
      {title: 'Python Calculator', desc: 'Simple Python calculator practice.', url: 'https://github.com/Arkoss99/Python-Calculator', stack:['Python']},
      {title: 'Most-Game', desc: 'Zombie defense prototype.', url: 'https://github.com/Arkoss99/Most-Game', stack:['Unreal']},
      {title: 'Hydra-4421', desc: 'Browser recreation of WTTG2 elements.', url: 'https://github.com/Arkoss99/Hydra-4421', stack:['JavaScript']},
      {title: 'No light left (WIP)', desc: 'Atmospheric 3D game concept.', url: '#', stack:['3D','Unity']}
    ];

    function render(items){
      if(!grid) return;
      grid.innerHTML = '';
      items.forEach(p => {
        const el = document.createElement('article');
        el.className = 'card project';
        el.innerHTML = `
          <h3><a href="${p.url}" target="_blank" rel="noopener">${p.title}</a></h3>
          <p>${p.desc ?? ''}</p>
          <p class="stack">${(p.stack||[]).join(' · ')}</p>
        `;
        grid.appendChild(el);
      });
    }

    fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(list => {
        const wanted = ['Portfolio','Python-Calculator','Most-Game','Hydra-4421'];
        const mapped = list.filter(r => wanted.includes(r.name)).map(r => ({
          title: r.name.replace(/-/g,' '),
          desc: r.description || '—',
          url: r.html_url,
          stack: ['GitHub', (r.language || 'Code')]
        }));
        render([...mapped, fallback.find(f=>f.title.startsWith('No light left (WIP)'))]);
      })
      .catch(() => render(fallback));

    // Contact status helper (non-AJAX to keep PHP simple)
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const msg = params.get('msg');
    const statusEl = document.getElementById('form-status');
    if(statusEl && status){
      const lang = getLang();
      statusEl.textContent = msg || (status === 'ok'
        ? (lang==="en" ? "Thanks! Your message was sent." : "Díky! Zpráva byla odeslána.")
        : (lang==="en" ? "Sorry, something went wrong." : "Bohužel se něco nepovedlo."));
    }
  });
})();
