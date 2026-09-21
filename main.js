// Лендинг Barba: чёлка вверху страницы, её состояния, мелкие анимации, скачивание и отправка ссылки.
(() => {
  const cfg = window.USY || {};
  const html = document.documentElement;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!canHover) html.classList.add('no-hover');
  if (/slots/.test(location.search + location.hash)) html.classList.add('show-slots');
  const ICON = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  // Маскоты по сценам (заполняются ниже, в разделе «Маскот»). Хуки чёлки и демо зовут mascotEvent().
  const mascot = {};
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // Счётчики страницы: включаются, только если заданы в config.js. Яндекс Метрика — с вебвизором,
  // чтобы видеть, где люди спотыкаются в демо. События уходят целями (reachGoal) с теми же именами, что в track().
  if (cfg.metrika) {
    window.ym = window.ym || function () { (ym.a = ym.a || []).push(arguments); };
    ym.l = Date.now();
    const s = document.createElement('script');
    s.async = true;
    s.src = 'https://mc.yandex.ru/metrika/tag.js';
    document.head.appendChild(s);
    ym(cfg.metrika, 'init', { webvisor: true, clickmap: true, trackLinks: true, accurateTrackBounce: true });
  }
  if (cfg.goatcounter) {
    const s = document.createElement('script');
    s.async = true;
    s.dataset.goatcounter = cfg.goatcounter;
    s.src = 'https://gc.zgo.at/count.js';
    document.head.appendChild(s);
  }
  const sent = new Set();
  function track(name, once = true) {
    if (once && sent.has(name)) return;
    sent.add(name);
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: name, title: name, event: true });
    if (cfg.metrika && window.ym) ym(cfg.metrika, 'reachGoal', name);
  }

  const topbar = document.getElementById('topbar');
  const onScroll = () => topbar.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- Чёлка ----------
  const notch = document.getElementById('notch');
  const nb = notch.querySelector('.nb');
  const compactEl = notch.querySelector('.n-compact');
  const peekEl = notch.querySelector('.n-peek');
  const demo = UsyDemo.create(notch.querySelector('.n-island'), { interactive: true });

  const ctx = document.createElement('canvas').getContext('2d');
  function textW(t, weight = 500, size = 12) {
    ctx.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, "SF Pro Text", Onest, sans-serif`;
    return Math.ceil(ctx.measureText(t).width);
  }
  const gap = () => (innerWidth < 600 ? 130 : 180);

  let open = false, peek = null, override = null, typed = false, lastKey = '';
  let openT, closeT, peekT, pulseT;

  function compactItem() {
    if (override) return override;
    const t = demo.timer();
    if (t.running) return { icon: 'i-play', left: UsyDemo.clock(t.sec), right: t.label, tint: 'accent', num: true };
    if (t.paused) return { icon: 'i-pause', left: 'пауза', right: t.label, tint: 'dim' };
    return null;
  }
  // Ширина боковых зон по тексту, как в приложении: зоны симметричны, камера по центру.
  function side(it) {
    const l = textW(it.num ? it.left.replace(/\d/g, '0') : it.left) + 42;
    const r = Math.min(textW(it.right), 190) + 26 + (it.rightIcon ? 16 : 0);
    return Math.max(70, l, r);
  }
  function pulse() {
    notch.classList.add('pulse');
    clearTimeout(pulseT);
    pulseT = setTimeout(() => notch.classList.remove('pulse'), 200);
  }
  function renderCompact(it, s, g) {
    const key = `${it.icon}|${it.iconTint}|${it.tint}|${it.rightIcon}|${it.rightTint}|${it.right}`;
    if (key !== lastKey) {
      // Иконки могут быть своего цвета (созвон: камера зелёная, микрофон оранжевый, как индикаторы macOS).
      const ic = (id, t) => t ? `<i class="t-${t}">${ICON(id)}</i>` : ICON(id);
      compactEl.innerHTML = `<div class="nc-side nc-left t-${it.tint}">${ic(it.icon, it.iconTint)}<span class="${it.num ? 'num' : ''}"></span></div><div class="nc-gap"></div><div class="nc-side nc-right">${it.rightIcon ? ic(it.rightIcon, it.rightTint) : ''}<span></span></div>`;
      if (lastKey) pulse();
      lastKey = key;
    }
    const [l, gp, r] = compactEl.children;
    l.style.width = r.style.width = `${s}px`;
    gp.style.width = `${g}px`;
    l.querySelector('span').textContent = it.left;
    r.querySelector('span').textContent = it.right;
  }
  function layout() {
    const g = gap();
    let mode, w, h = 30;
    if (open) { mode = 'open'; w = 720; h = 320; }
    else if (peek) { mode = 'peek'; w = Math.min(g + 360, notchMax()); h = 60; }
    else {
      const it = compactItem();
      if (it) {
        mode = 'compact';
        w = Math.min(g + 2 * side(it), notchMax());
        renderCompact(it, (w - g) / 2, g);
      } else { mode = 'idle'; w = g; lastKey = ''; }
    }
    notch.dataset.mode = mode;
    notch.setAttribute('aria-expanded', String(open));
    // Открытый остров сам фокус не берёт: иначе клик по пустому месту уводит фокус из поля, и пробел листает страницу.
    notch.tabIndex = open ? -1 : 0;
    nb.style.width = `${w}px`;
    nb.style.height = `${h}px`;
    const sc = Math.min(1, (innerWidth - 16) / 720);
    notch.style.setProperty('--s', sc.toFixed(3));
    // Если чёлка всё же шире свободного места (телефон, раскрытый остров), логотип на это время уходит.
    topbar.classList.toggle('yield', (open ? 720 * sc : w) > freeW() + 1);
  }

  // Свободное место между логотипом и «Скачать» в шапке (видимые части, брейкпоинт тот же, что в CSS).
  const logoEl = document.querySelector('.logo'), topLink = document.querySelector('.top-link');
  const phone = matchMedia('(max-width: 600px)');
  function freeW() {
    const c = innerWidth / 2, box = el => el && el.getClientRects().length ? el.getBoundingClientRect() : null;
    const lg = box(logoEl), tl = box(topLink);
    let half = c - 8;
    if (lg) half = Math.min(half, c - lg.right - 12);
    if (tl) half = Math.min(half, tl.left - c - 12);
    return 2 * half;
  }
  // Свёрнутые усы и уведомление не наезжают на шапку. На телефоне места мало: там можно во всю ширину, логотип уступит.
  function notchMax() {
    return phone.matches ? innerWidth - 16 : Math.max(gap() + 120, Math.min(innerWidth - 16, freeW()));
  }

  function showPeek(p, ms = 6000) {
    if (open) return;
    const g = gap(), w = Math.min(g + 360, notchMax()), s = (w - g) / 2;
    peekEl.style.width = `${w}px`;
    peekEl.innerHTML = `<div class="np-row"><div class="np-src" style="width:${s}px">${ICON(p.icon)}${esc(p.source)}</div><div style="width:${g}px"></div>
      <div class="np-title" style="width:${s}px">${esc(p.title)}</div></div><div class="np-body">${esc(p.body)}</div>`;
    peek = p;
    layout();
    mascotEvent('peek');
    clearTimeout(peekT);
    peekT = setTimeout(() => { peek = null; layout(); mascotEvent('peekEnd'); }, ms);
  }

  function openNotch(src) {
    clearTimeout(openT); clearTimeout(closeT);
    if (open) return;
    open = true; typed = false; peek = null;
    clearTimeout(peekT);
    notch.classList.add('is-open');
    notch.classList.remove('hint');
    layout();
    track('demo_open');
    if (canHover) setTimeout(() => demo.focusInput(), 260);
    mascotEvent('open');
  }
  function closeNotch() {
    clearTimeout(openT); clearTimeout(closeT);
    if (!open) return;
    open = false;
    notch.classList.remove('is-open');
    if (notch.contains(document.activeElement)) document.activeElement.blur();
    layout();
    mascotEvent('close');
  }

  notch.setAttribute('role', 'button');
  notch.addEventListener('mouseenter', () => {
    clearTimeout(closeT);
    if (!open) { clearTimeout(openT); openT = setTimeout(() => openNotch('hover'), 220); }
  });
  notch.addEventListener('mouseleave', () => {
    clearTimeout(openT);
    if (open && !typed) closeT = setTimeout(closeNotch, 380);
  });
  notch.addEventListener('click', () => { if (!open) openNotch('click'); });
  notch.addEventListener('keydown', e => {
    if (!open && e.target === notch && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openNotch('keyboard'); }
  });
  document.addEventListener('pointerdown', e => {
    if (open && !notch.contains(e.target) && !e.target.closest('[data-open-notch]')) closeNotch();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && open) { closeNotch(); return; }
    if (open && (e.metaKey || e.ctrlKey) && /^[1-7]$/.test(e.key)) {
      e.preventDefault();
      demo.setTab(UsyDemo.TABS[+e.key - 1][0]);
    }
  });
  document.querySelectorAll('[data-open-notch]').forEach(b => {
    b.addEventListener('mouseenter', () => notch.classList.add('hint'));
    b.addEventListener('mouseleave', () => notch.classList.remove('hint'));
    b.addEventListener('click', () => openNotch('button'));
  });

  // ---------- Задания в блоке демо ----------
  const tries = { task: false, timer: false, claude: false };
  function done(k) {
    if (tries[k]) return;
    tries[k] = true;
    const li = document.querySelector(`[data-try="${k}"]`);
    if (li) li.classList.add('done');
    track(`try_${k}`);
    if (Object.values(tries).every(Boolean)) {
      document.querySelector('.tries-done').hidden = false;
      track('try_all');
      mascotEvent('triesAll');
    } else mascotEvent('try');
  }
  demo.on('typed', () => { typed = true; });
  demo.on('task', () => { done('task'); track('demo_task_added'); });
  demo.on('timer', t => { if (t.running || t.manual) { done('timer'); track('demo_timer_started'); } layout(); });
  demo.on('tab', t => { if (t === 'claude') done('claude'); });
  demo.on('tick', () => { if (!open && !peek) layout(); });

  // ---------- Карточки фич меняют состояние чёлки ----------
  const STATES = {
    task: { icon: 'i-list', left: '⌥ Space', right: 'запиши задачу', tint: 'dim' },
    timer: { icon: 'i-play', left: '12:34', right: 'Отчёт по проекту', tint: 'accent', num: true },
    meeting: { icon: 'i-cal', left: 'через 7 мин', right: 'Созвон с командой', tint: 'accent' },
    claude: { icon: 'i-spark', left: 'ждёт ответа', right: 'Рефакторинг API', tint: 'accent' },
    tg: { icon: 'i-plane', left: '2 новых', right: 'Аня', tint: 'accent' },
    music: { icon: 'i-play', left: 'Тёплый вечер', right: 'Демо-оркестр', tint: 'accent' },
    call: { icon: 'i-video', iconTint: 'cam', left: '42 мин', right: 'Созвон с командой', rightIcon: 'i-mic', rightTint: 'mic', tint: 'dim' },
    tr: { icon: 'i-lang', left: '⌘4', right: 'перевод под рукой', tint: 'dim' }
  };
  let overrideT;
  document.querySelectorAll('.card[data-state]').forEach(card => {
    const st = STATES[card.dataset.state];
    const set = v => { override = v; if (!open) layout(); mascotEvent('card', v ? card.dataset.state : null); };
    if (canHover) {
      card.addEventListener('mouseenter', () => set(st));
      card.addEventListener('mouseleave', () => set(null));
    } else {
      card.addEventListener('click', () => { set(st); clearTimeout(overrideT); overrideT = setTimeout(() => set(null), 3500); });
    }
  });

  // ---------- Статичная копия раскрытых усов в блоке демо ----------
  const prev = document.getElementById('preview');
  if (prev) {
    const host = document.createElement('div');
    host.className = 'n-layer n-island';
    prev.appendChild(host);
    UsyDemo.create(host, { interactive: false, tab: 'tasks' });
    const screen = prev.parentElement;
    const fit = () => {
      const w = screen.clientWidth, s = Math.min(1, (w - (w < 500 ? 20 : 64)) / 720);
      prev.style.setProperty('--ps', s.toFixed(3));
      screen.style.setProperty('--ph', `${Math.round(320 * s + 40)}px`);
    };
    new ResizeObserver(fit).observe(screen);
    fit();
  }

  // ---------- Маленькие чёлки ----------
  const MINI = {
    tg: { icon: 'i-plane', l: 'Telegram', r: 'Аня', body: 'Скинула макеты, глянь' },
    claude: { icon: 'i-spark', l: 'Claude', r: 'ответил' },
    meeting: { icon: 'i-cal', l: '7 мин', r: 'Созвон' },
    limit: { icon: 'i-spark', l: 'лимит', r: 'обновился' }
  };
  const minis = [...document.querySelectorAll('.mini')];
  function buildMinis() {
    minis.forEach(fig => {
      const m = MINI[fig.dataset.mini], n = fig.querySelector('.mini-notch'), G = 48;
      // Сторона = поле у края 12 + текст + поле у камеры 6; слева ещё иконка 8 и зазор 4.
      const s = Math.max(textW(m.l, 600, 9.5) + 30, textW(m.r, 600, 9.5) + 18, 34);
      const W = Math.max(G + 2 * s, m.body ? textW(m.body, 400, 9.5) + 32 : 0);
      const half = (W - G) / 2;
      n.innerHTML = `<div class="mn-in" style="width:${W}px"><div class="mn-row"><div class="mn-l" style="width:${half}px">${ICON(m.icon)}${m.l}</div>
        <div style="width:${G}px"></div><div class="mn-r" style="width:${half}px">${m.r}</div></div>${m.body ? `<div class="mn-body">${m.body}</div>` : ''}</div>`;
      const screen = fig.querySelector('.mini-screen');
      fig._on = () => {
        fig.classList.add('on'); n.style.width = `${W}px`; n.style.height = `${m.body ? 34 : 18}px`;
        // Узкая карточка: уменьшаем чёлку целиком, чтобы она не упиралась в края и не обрезалась.
        const k = Math.min(1, (screen.clientWidth - 20) / W);
        n.style.transform = k < 1 ? `translateX(-50%) scale(${k.toFixed(3)})` : '';
      };
      fig._off = () => { fig.classList.remove('on'); n.style.width = ''; n.style.height = ''; n.style.transform = ''; };
    });
  }
  let miniLoop = null;
  const t0 = performance.now();
  function stepMinis() {
    const period = 5600, t = performance.now() - t0;
    minis.forEach((f, i) => {
      const phase = (((t - i * 700) % period) + period) % period;
      const on = phase >= 500 && phase < 3300, was = f.classList.contains('on');
      on ? f._on() : f._off();
      if (on && !was && (i === 0 || i === 2)) mascotEvent('mini');
    });
  }
  if (minis.length) {
    buildMinis();
    if (reduce) minis.forEach(f => f._on());
    else new IntersectionObserver(entries => {
      const visible = entries.some(e => e.isIntersecting);
      if (visible && !miniLoop) miniLoop = setInterval(stepMinis, 150);
      if (!visible && miniLoop) { clearInterval(miniLoop); miniLoop = null; }
    }).observe(document.getElementById('minis'));
  }

  // ---------- Галерея карточек на телефоне: точки под ней ----------
  const cardsEl = document.querySelector('.cards');
  if (cardsEl) {
    const dots = document.createElement('div');
    dots.className = 'cards-dots';
    dots.setAttribute('aria-hidden', 'true');
    const cards = [...cardsEl.children];
    dots.innerHTML = cards.map(() => '<i></i>').join('');
    cardsEl.after(dots);
    const syncDots = () => {
      if (!phone.matches) { dots.hidden = true; return; }
      dots.hidden = false;
      const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
      const i = Math.min(cards.length - 1, Math.round(cardsEl.scrollLeft / step));
      [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    };
    cardsEl.addEventListener('scroll', syncDots, { passive: true });
    addEventListener('resize', syncDots);
    syncDots();
  }

  // ---------- Маскот: усы с глазами (mascot.js) ----------
  // Сцена → начальная поза. Смонтированный слот получает .is-on и становится видимым.
  const SCENES = {
    1: { pose: 'lookup' },            // первый экран: смотрит на чёлку, потом следит за курсором
    2: { pose: 'point' },             // демо: показывает кончиком вверх, на чёлку
    3: { pose: 'calm' },              // «Что возьму на себя»: реагирует на карточки
    events: { pose: 'calm' },         // «Шевельну усами»: дёргает усами вместе с маленькими чёлками
    4: { pose: 'stern' },             // разрешения: строг, но добр
    6: { pose: 'happy', crop: 'icon' }, // скачать: на янтарном квадрате, как будущая иконка
    7: { pose: 'dozing' }             // подвал: дремлет
  };
  const CARD_POSE = { task: 'approve', timer: 'point', meeting: 'surprised', claude: 'happy', tg: 'lookup', music: 'wave', call: 'stern', tr: 'thinking' };
  if (window.BarbaMascot) {
    document.querySelectorAll('.char[data-scene]').forEach(el => {
      const sc = SCENES[el.dataset.scene];
      if (!sc) return;
      el.querySelectorAll('.dl-fallback').forEach(n => n.remove());
      el.classList.add('is-on');
      const m = BarbaMascot.mount(el, sc);
      m.base = sc.pose;
      mascot[el.dataset.scene] = m;
    });
    if (mascot[7]) mascot[7].sleep(true);
  }
  // Поза на время, потом возврат к базовой.
  function mood(key, pose, ms) {
    const m = mascot[key];
    if (!m) return;
    clearTimeout(m.moodT);
    m.setPose(pose);
    if (ms) m.moodT = setTimeout(() => m.setPose(m.base), ms);
  }
  // Первый экран: пока не двигали мышь, смотрит на чёлку; потом спокоен и следит глазами за курсором.
  let heroFollow = false, lookRaf = 0;
  if (mascot[1] && canHover && !reduce) {
    addEventListener('pointermove', e => {
      const m = mascot[1];
      if (!heroFollow) {
        if (performance.now() < 1800 || peek || open) return;
        heroFollow = true; m.base = 'calm'; m.setPose('calm');
      }
      if (lookRaf || m.pose !== 'calm') return;
      lookRaf = requestAnimationFrame(() => {
        lookRaf = 0;
        const r = m.el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const k = v => Math.max(-1, Math.min(1, v));
        m.look(k((e.clientX - (r.left + r.width / 2)) / 320), k((e.clientY - (r.top + r.height / 2)) / 240));
      });
    }, { passive: true });
  }
  function mascotEvent(ev, arg) {
    const hero = mascot[1];
    switch (ev) {
      case 'peek': if (hero) { hero.look(); mood(1, 'surprised'); setTimeout(() => { if (peek) hero.setPose('lookup'); }, 650); } break;
      case 'peekEnd': if (hero && !open) hero.setPose(hero.base); break;
      case 'open': if (hero) { hero.look(); mood(1, 'happy'); } break;
      case 'close': if (hero) hero.setPose(hero.base); break;
      case 'try': mood(2, 'happy', 1600); break;
      case 'triesAll': if (mascot[2]) { mascot[2].base = 'approve'; mood(2, 'approve'); } break;
      case 'card': if (mascot[3]) { clearTimeout(mascot[3].moodT); mascot[3].setPose(arg ? CARD_POSE[arg] || 'calm' : mascot[3].base); } break;
      case 'mini': if (mascot.events) mascot.events.twitch(); break;
      case 'download': if (mascot[6]) { mood(6, 'approve', 2400); mascot[6].twitch(); } break;
    }
  }
  // Подвал: при наведении просыпается на секунду и снова засыпает.
  const foot = document.querySelector('.foot');
  if (foot && mascot[7]) foot.addEventListener('pointerenter', () => {
    const m = mascot[7];
    clearTimeout(m.moodT);
    m.sleep(false); m.setPose('surprised');
    m.moodT = setTimeout(() => m.sleep(true), 1600);
  });

  // ---------- Появление блоков при прокрутке ----------
  // Только тем, что ещё ниже экрана: видимое при загрузке не мигает. Группы появляются по очереди.
  if (!reduce && 'IntersectionObserver' in window) {
    const REVEAL = [
      ['main section:not(.hero) h2, main section:not(.hero) .sub, .sec-head > .char, .demo-cta .char, .aside, .nonotch, .perms .note, .preview, .author-card, .dl-mark, .download .meta, #dlBtn', 0],
      ['.tries li', 70], ...(phone.matches ? [] : [['.card', 60]]), ['.mini', 80], ['.perm', 70], ['.faq details', 50]
    ];
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, d = parseFloat(el.style.getPropertyValue('--d')) || 0;
      io.unobserve(el);
      el.classList.add('in');
      // Снимаем классы после появления, чтобы вернулись собственные переходы блока (наведение на карточку и т. п.).
      setTimeout(() => { el.classList.remove('rv', 'in'); el.style.removeProperty('--d'); }, 800 + d * 1000);
    }), { rootMargin: '0px 0px -6% 0px' });
    const seen = new Set();
    for (const [sel, step] of REVEAL) {
      document.querySelectorAll(sel).forEach(el => {
        if (seen.has(el) || el.getBoundingClientRect().top < innerHeight) return;
        seen.add(el);
        if (step) el.style.setProperty('--d', `${([...el.parentElement.children].indexOf(el) * step) / 1000}s`);
        el.classList.add('rv');
        io.observe(el);
      });
    }
  }

  // ---------- Скачать, отзыв, отправить себе ----------
  const pageUrl = location.origin + location.pathname;
  const shareText = 'Barba: рабочий пульт в чёлке MacBook. Открой с ноутбука:';
  const dlBtn = document.getElementById('dlBtn');
  if (dlBtn && cfg.downloadUrl) {
    dlBtn.href = cfg.downloadUrl;
    dlBtn.addEventListener('click', () => {
      track('download_click', false);
      document.getElementById('nextSteps').hidden = false;
      mascotEvent('download');
    });
  }
  document.querySelectorAll('[data-unsigned]').forEach(li => { if (cfg.notarized) li.remove(); });
  const typo = window.UsyDemo ? UsyDemo.nb : t => t;
  document.getElementById('dlMeta').textContent =
    typo(`Бесплатно. macOS 15 и новее, Apple\u00A0Silicon и Intel, ${cfg.sizeLabel || 'около 3 МБ'}.${cfg.autoUpdates ? ' Обновления ставятся сами.' : ''}`);
  if (cfg.appAnalytics) {
    document.getElementById('netText').textContent = typo('В сеть уходит анонимная статистика использования без текстов, она выключается в настройках. За лимитами Claude приложение ходит, только если ты это включил.');
  }
  document.querySelectorAll('[data-feedback]').forEach(a => {
    if (!cfg.feedbackUrl) { a.remove(); return; }
    a.href = cfg.feedbackUrl;
    a.addEventListener('click', () => track('feedback_click', false));
  });
  document.querySelectorAll('[data-linkedin]').forEach(a => { if (cfg.linkedinUrl) a.href = cfg.linkedinUrl; else a.remove(); });
  document.getElementById('footVersion').textContent = cfg.version || '';
  if (cfg.metrika) document.getElementById('statsNote').hidden = false;   // честно говорим про счётчик
  const rel = document.getElementById('footReleases');
  if (cfg.releasesUrl) rel.href = cfg.releasesUrl; else rel.remove();

  document.querySelectorAll('[data-share]').forEach(b => b.addEventListener('click', async () => {
    track('share_click', false);
    if (navigator.share) {
      try { await navigator.share({ title: 'Barba для Mac', text: shareText, url: pageUrl }); return; }
      catch (e) { if (e.name === 'AbortError') return; }
    }
    document.getElementById('download').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }));
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const label = b.querySelector('span');
    try { await navigator.clipboard.writeText(pageUrl); label.textContent = 'Скопировано'; track('share_copy', false); }
    catch { label.textContent = pageUrl; }
  }));
  document.querySelectorAll('[data-tg]').forEach(a => { a.href = `https://t.me/share/url?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(shareText)}`; });
  document.querySelectorAll('[data-mail]').forEach(a => { a.href = `mailto:?subject=${encodeURIComponent('Barba для Mac')}&body=${encodeURIComponent(`${shareText}\n${pageUrl}`)}`; });

  // ---------- Старт ----------
  addEventListener('resize', () => { layout(); if (reduce) minis.forEach(f => f._on()); });
  layout();
  if (document.fonts) document.fonts.ready.then(() => { layout(); buildMinis(); });
  // Через пару секунд усы один раз шевелятся: приходит выдуманное сообщение, чтобы было видно, где смотреть.
  setTimeout(() => {
    if (!open && !sent.has('demo_open')) showPeek({ icon: 'i-plane', source: 'Telegram', title: 'Аня', body: 'Скинула макеты, глянь, когда будет минутка' });
  }, 2600);
})();
