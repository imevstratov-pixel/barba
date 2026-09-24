// Демо раскрытых усов: копия окна приложения с выдуманными данными.
// UsyDemo.create(host, { interactive, tab }) рисует остров в host и возвращает управление им.
(() => {
  const ICON = id => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const pad = n => String(n).padStart(2, '0');
  // Неразрывные пробелы после предлогов и союзов, перед тире и между числом и словом (правила как в scripts/nbsp.py).
  const NB_RE = /(^|[^А-Яа-яЁёA-Za-z0-9-])([А-Яа-яЁё]{1,2}|без|для|над|под|при|про|обо|изо|ото|вне|или|как|что|чем|где|через|перед|около|между|ради|вокруг|после|кроме|среди|возле|вместо|внутри|против|сквозь|вдоль|мимо|сверх) +(?=\S)/gi;
  const nb = t => {
    let s = String(t).replace(/ +(ли|же|бы|ль|ж|б)(?![А-Яа-яЁё])/g, '\u00A0$1');
    for (let i = 0; i < 2; i++) s = s.replace(NB_RE, (m, a, w) => a + w + '\u00A0');
    return s.replace(/(\d) +(?=[А-Яа-яЁёA-Za-z])/g, '$1\u00A0').replace(/([⌥⌘⇧⌃]) +(?=\S)/g, '$1\u00A0').replace(/ +— /g, '\u00A0— ');
  };
  const nbHtml = h => h.replace(/>([^<]+)</g, (m, t) => '>' + nb(t) + '<');
  const TABS = [
    ['tasks', 'Задачи', 'i-list'], ['time', 'Время', 'i-timer'], ['cal', 'Календарь', 'i-cal'],
    ['tr', 'Перевод', 'i-lang'], ['claude', 'Claude', 'i-claude'], ['gpt', 'ChatGPT', 'i-openai'], ['tg', 'Telegram', 'i-plane'],
    ['music', 'Музыка', 'i-note']
  ];

  function clock(sec) {
    const s = Math.max(0, Math.floor(sec)), h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60);
    return h ? `${h}:${pad(m)}:${pad(s % 60)}` : `${m}:${pad(s % 60)}`;
  }
  function fmt(mins) {
    if (mins < 1) return '< 1 мин';
    const h = Math.floor(mins / 60), m = Math.round(mins % 60);
    return h ? `${h} ч${m ? ` ${m} мин` : ''}` : `${m} мин`;
  }
  function plural(n, one, few, many) {
    const r10 = n % 10, r100 = n % 100;
    if (r10 === 1 && r100 !== 11) return one;
    return r10 >= 2 && r10 <= 4 && (r100 < 12 || r100 > 14) ? few : many;
  }

  // Длительность в конце строки, как в приложении: 45м, 1ч20, 1:30, 1.5ч, 0.45, 2,45.
  // Время суток после «в», «к», «до» длительностью не считается.
  const H = '(?:ч|час|часа|часов|h)', M = '(?:м|мин|минут|минуты|m)';
  const hm = (h, m) => (+m < 60 && +h <= 12 ? +h * 60 + +m : 0);
  const PATTERNS = [
    [new RegExp(`(\\d{1,2}):(\\d{2})\\s*$`, 'iu'), g => hm(g[1], g[2])],
    [new RegExp(`(\\d{1,2})\\s*${H}\\s*(\\d{1,2})\\s*${M}?\\s*$`, 'iu'), g => +g[1] * 60 + +g[2]],
    [new RegExp(`(\\d{1,2}(?:[.,]\\d+)?)\\s*${H}\\s*$`, 'iu'), g => Math.round(parseFloat(g[1].replace(',', '.')) * 60)],
    [new RegExp(`(\\d{1,3})\\s*${M}\\s*$`, 'iu'), g => +g[1]],
    [new RegExp(`(\\d{1,2})[.,](\\d{2})\\s*$`, 'iu'), g => hm(g[1], g[2])]
  ];
  const MARKERS = new Set(['в', 'к', 'до', 'с', 'на', 'at', 'by', 'from', 'to', 'until', 'till']);
  function parseDuration(text) {
    const t = text.trim();
    for (const [re, build] of PATTERNS) {
      const m = t.match(re);
      if (!m) continue;
      const mins = build(m);
      if (!mins || mins > 24 * 60) continue;
      const title = t.slice(0, m.index).trim();
      const last = (title.split(/\s+/).pop() || '').toLowerCase();
      if (MARKERS.has(last)) continue;
      return { title, mins };
    }
    return { title: t, mins: 0 };
  }

  const PHRASES = [
    ['Давай созвонимся после обеда', 'Let’s have a call after lunch'],
    ['Дедлайн сдвинулся на неделю', 'The deadline has moved by a week'],
    ['Отличная работа, спасибо', 'Great job, thank you']
  ];
  const TRACKS = [
    { t: 'Тёплый вечер', a: 'Демо-оркестр', al: 'Треки для примера', d: 214, c: '#E8B54D' },
    { t: 'Утренний созвон', a: 'Демо-оркестр', al: 'Треки для примера', d: 188, c: '#6C8FD6' },
    { t: 'Дедлайн в пятницу', a: 'Демо-оркестр', al: 'Треки для примера', d: 241, c: '#D9603B' }
  ];

  function create(host, opts = {}) {
    const interactive = opts.interactive !== false;
    const S = {
      tab: opts.tab || 'tasks',
      nextId: 5,
      tasks: [
        { id: 1, t: 'Подготовить слайды к пятнице', done: false, count: '1/3', mins: 0 },
        { id: 2, t: 'Ответить подрядчику про сроки', done: false, mins: 0 },
        { id: 3, t: 'Собрать отзывы по онбордингу', done: false, mins: 80 },
        { id: 4, t: 'Забронировать переговорку', done: true, mins: 0 }
      ],
      entries: [
        { t: 'Собрать отзывы по онбордингу', mins: 80 },
        { t: 'Дейли команды', mins: 30 },
        { t: 'Разбор почты', mins: 25 }
      ],
      timer: { running: false, paused: false, startedAt: 0, acc: 0, label: '' },
      tr: { text: '', out: '', muted: true },
      music: { i: 0, playing: true, pos: 62 }
    };
    const listeners = {};
    const emit = (e, d) => (listeners[e] || []).forEach(f => f(d));

    host.innerHTML = `<div class="isl" style="position:relative">
      <nav class="isl-side">${TABS.map((t, i) => `<button class="isl-tab" type="button" data-tab="${t[0]}">${ICON(t[2])}<span>${t[1]}</span><kbd>⌘${i + 1}</kbd></button>`).join('')}<div class="isl-timer" hidden></div></nav>
      <div class="isl-line"></div>
      <div class="isl-pane"></div>
      <div class="isl-toast" role="status"></div>
      <button class="isl-gear" type="button" data-act="settings" aria-label="Настройки">${ICON('i-gear')}<span>Настройки ⌘,</span></button>
      <a class="isl-fb" data-feedback target="_blank" rel="noopener" href="${(window.USY && window.USY.feedbackUrl) || '#'}" aria-label="Оставить отзыв"><svg viewBox="0 0 64 28" aria-hidden="true"><path transform="translate(0 4)" d="M2 15C2 7 9 3 18 3.5C24 4 29 6 32 8.5C35 6 40 4 46 3.5C55 3 62 7 62 15C62 19.5 58.5 21 55 19.5C52 22 47.5 22 45 19.5C42.5 22 38 22 35.5 19.5C34 21 30 21 28.5 19.5C26 22 21.5 22 19 19.5C16.5 22 12 22 9 19.5C5.5 21 2 19.5 2 15Z"/><circle cx="25.5" cy="3.4" r="2.7"/><circle cx="38.5" cy="3.4" r="2.7"/></svg><span>Фидбек</span></a>
    </div>`;
    const pane = host.querySelector('.isl-pane');
    const sideTimer = host.querySelector('.isl-timer');
    const toastEl = host.querySelector('.isl-toast');
    let toastT;
    function toast(msg) {
      toastEl.textContent = nb(msg);
      toastEl.classList.add('show');
      clearTimeout(toastT);
      toastT = setTimeout(() => toastEl.classList.remove('show'), 1900);
    }

    // Таймер
    const elapsed = () => S.timer.acc + (S.timer.running ? (Date.now() - S.timer.startedAt) / 1000 : 0);
    const timerState = () => ({ running: S.timer.running, paused: S.timer.paused, sec: elapsed(), label: S.timer.label });
    function startTimer(label) {
      S.timer = { running: true, paused: false, startedAt: Date.now(), acc: 0, label: label || 'Без подписи' };
      render();
      emit('timer', timerState());
    }
    function stopTimer() {
      const sec = elapsed();
      if (sec >= 5) S.entries.unshift({ t: S.timer.label, mins: sec / 60 });
      toast(sec >= 5 ? `Записал ${fmt(sec / 60)}` : 'Меньше пяти секунд не записываю');
      S.timer = { running: false, paused: false, startedAt: 0, acc: 0, label: '' };
      render();
      emit('timer', timerState());
    }

    // Вкладки
    function vTasks() {
      const list = [...S.tasks.filter(t => !t.done), ...S.tasks.filter(t => t.done)].slice(0, 6);
      const rows = list.map(t => `<div class="d-row${t.done ? ' done' : ''}${t.fresh ? ' new' : ''}" data-id="${t.id}">
        <button class="d-check" type="button" data-act="toggle" aria-label="${t.done ? 'Вернуть в работу' : 'Отметить выполненной'}">${ICON('i-check')}</button>
        <span class="d-title">${esc(t.t)}</span>${t.count ? `<span class="d-count">${t.count}</span>` : ''}
        <span class="d-dur">${t.mins ? fmt(t.mins) : ''}</span></div>`).join('');
      S.tasks.forEach(t => { t.fresh = false; });
      return `<label class="d-field">${ICON('i-plus')}<input class="d-input" data-in="task" placeholder="Новая задача… например, «созвон 45м»" autocomplete="off" aria-label="Новая задача"></label>
        <div class="d-list">${rows}</div>
        <p class="d-hint">Enter — задача · «45м», «1:30» или «0.45» в конце записывают время</p>`;
    }

    function vTime() {
      const tm = S.timer;
      const card = (tm.running || tm.paused)
        ? `<div class="d-timer"><span class="d-circle${tm.running ? ' on' : ''}">${ICON(tm.running ? 'i-play' : 'i-pause')}</span>
            <div class="d-timer-main"><div class="d-title">${esc(tm.label)}</div><div class="d-clock">${clock(elapsed())}</div></div>
            <button class="d-btn" type="button" data-act="${tm.running ? 'pause' : 'resume'}">${tm.running ? 'Пауза' : 'Продолжить'}</button>
            <button class="d-btn" type="button" data-act="stop">Стоп</button></div>`
        : `<div class="d-timer"><span class="d-circle">${ICON('i-timer')}</span>
            <input class="d-input" data-in="timer" placeholder="Что делаешь? Или «отчёт 0.45»" autocomplete="off" aria-label="Что делаешь">
            <button class="d-btn amber" type="button" data-act="start">Старт</button></div>`;
      const list = [...S.entries];
      if (tm.running || tm.paused) list.unshift({ t: tm.label, mins: elapsed() / 60, run: true });
      const total = list.reduce((a, e) => a + e.mins, 0);
      const max = Math.max(1, ...list.map(e => e.mins));
      const rows = list.slice(0, 3).map(e => `<div class="d-entry${e.run ? ' run' : ''}"><div class="d-entry-top"><span class="d-title">${esc(e.t)}</span>
          <span class="d-dur">${e.run ? clock(elapsed()) : fmt(e.mins)}</span></div><div class="d-bar"><i style="width:${Math.max(4, e.mins / max * 100)}%"></i></div></div>`).join('');
      return `${card}<div class="d-total"><b>${fmt(total)}</b><span class="d-muted">сегодня · ${list.length} ${plural(list.length, 'запись', 'записи', 'записей')}</span></div>
        <div class="d-entries">${rows}</div>`;
    }

    function vCal() {
      const join = prominent => `<button class="d-btn${prominent ? ' amber' : ''}" type="button" data-act="join">${ICON('i-video')}Подключиться</button>`;
      const ev = (time, title, loc, color, cls, btn) => `<div class="d-ev ${cls}"><span class="d-stripe" style="background:${color}"></span>
        <div><div class="d-ev-time">${time}</div><div class="d-title">${title}</div>${loc ? `<div class="d-muted">${loc}</div>` : ''}</div>${btn}</div>`;
      return `<div class="d-day">Сегодня</div>
        ${ev('10:00–10:30', 'Дейли команды', '', '#6C8FD6', 'past', '')}
        ${ev('15:00–16:00 · через 7 мин', 'Созвон с командой', 'Zoom', '#E8B54D', 'now', join(true))}
        <div class="d-day" style="margin-top:12px">Завтра</div>
        ${ev('11:00–11:45', 'Ревью макетов', 'Google Meet', '#73C780', '', join(false))}`;
    }

    function vTr() {
      return `<div class="d-langs"><span class="d-cap">Русский</span><span class="d-swap">⇄</span><span class="d-cap">English</span></div>
        <label class="d-field" style="margin-top:10px"><input class="d-input" data-in="tr" placeholder="Слово или фраза…" autocomplete="off" aria-label="Текст для перевода" value="${esc(S.tr.text)}"></label>
        <div class="d-chips">${PHRASES.map((p, i) => `<button class="d-chip" type="button" data-act="phrase" data-i="${i}">${p[0]}</button>`).join('')}</div>
        <div class="d-out${S.tr.muted ? ' muted' : ''}" data-out>${esc(S.tr.out || 'Перевод появится по мере ввода')}</div>
        <div class="d-tr-foot"><button class="d-btn" type="button" data-act="copy"${S.tr.muted ? ' disabled' : ''}>${ICON('i-copy')}Скопировать</button></div>`;
    }

    function vClaude() {
      const w = (label, pct, reset) => `<div class="d-w"><b>${label}</b><em>${pct}%</em><div class="d-w-bar"><i style="width:${pct}%"></i></div><div class="d-muted">${reset}</div></div>`;
      const s = (dot, title, meta, wait) => `<div class="d-sess${wait ? ' wait' : ''}"><span class="d-dot" style="background:${dot}"></span>
        <div style="min-width:0"><div class="d-title">${title}</div><div class="d-muted">${meta}</div></div></div>`;
      return `<div class="d-usage">${w('5 часов', 42, 'сброс в 18:30')}${w('Неделя', 14, 'сброс вс 04:00')}<span class="d-muted" style="margin-left:auto">только что</span></div>
        <div class="d-head" style="margin-top:10px"><span class="d-muted">2 активные сессии</span><button class="d-btn" type="button" data-act="newsession">${ICON('i-plus')}Новая сессия</button></div>
        ${s('#E8B54D', 'Рефакторинг API', 'backend · <span class="st">ждёт тебя · 3 мин назад</span>', true)}
        ${s('#73C780', 'Лендинг для Barba', 'site · работает · только что')}
        ${s('rgba(255,255,255,.25)', 'Разбор отзывов', 'research · 2 ч назад')}`;
    }

    function vGpt() {
      const r = (title, body, time, fresh) => `<div class="d-msg"><span class="d-dot${fresh ? '' : ' old'}"></span><div class="d-msg-main">
        <div class="d-msg-top"><b>${title}</b><span class="d-muted">${time}</span></div>
        <div class="d-msg-body">${body}</div></div></div>`;
      return `<label class="d-field">${ICON('i-openai')}<input class="d-input" data-in="gpt" placeholder="Спросить ChatGPT…" autocomplete="off" aria-label="Вопрос для ChatGPT"></label>
        <div class="d-muted d-gpt-hint">Enter — вопрос уйдёт в новый чат ChatGPT</div>
        <div class="d-head"><span class="d-muted">Готово в ChatGPT</span><button class="d-btn" type="button" data-act="newchat">${ICON('i-plus')}Новый чат</button></div>
        ${r('Логотип для кофейни', 'Картинка готова, можно смотреть', '2 мин', true)}
        ${r('Рынок онлайн-курсов', 'Deep Research готов', '1 ч', false)}`;
    }

    function vTg() {
      const m = (name, sub, body, time, fresh) => `<div class="d-msg"><span class="d-dot${fresh ? '' : ' old'}"></span><div class="d-msg-main">
        <div class="d-msg-top"><b>${name}</b>${sub ? `<span class="d-muted">${sub}</span>` : ''}<span class="d-muted">${time}</span></div>
        <div class="d-msg-body">${body}</div></div></div>`;
      return `<div class="d-head"><span class="d-muted">за 30 мин: 2</span><button class="d-btn" type="button" data-act="opentg">${ICON('i-plane')}Открыть Telegram</button></div>
        ${m('Аня', '', 'Скинула макеты, глянь, когда будет минутка', 'сейчас', true)}
        ${m('Игорь', 'Команда продукта', 'Созвон переносим на 15:30, всем удобно?', '4 мин', true)}
        ${m('Мама', '', 'Не забудь позвонить бабушке', '1 ч', false)}`;
    }

    function vMusic() {
      const tr = TRACKS[S.music.i];
      return `<div class="d-music"><div class="d-art" style="background:${tr.c}">${ICON('i-note')}</div>
        <div class="d-mus"><div class="d-mus-app"><i></i><span class="d-muted">Музыка</span></div>
          <div class="d-mus-title">${tr.t}</div><div class="d-mus-artist">${tr.a}</div><div class="d-muted">${tr.al}</div>
          <div class="d-prog"><div class="d-prog-bar"><i data-prog style="width:${S.music.pos / tr.d * 100}%"></i></div>
            <div class="d-prog-t"><span data-pos>${clock(S.music.pos)}</span><span>${clock(tr.d)}</span></div></div>
          <div class="d-ctrl"><button class="d-cb" type="button" data-act="prev" aria-label="Предыдущий трек">${ICON('i-back')}</button>
            <button class="d-cb main" type="button" data-act="play" aria-label="${S.music.playing ? 'Пауза' : 'Играть'}">${ICON(S.music.playing ? 'i-pause' : 'i-play')}</button>
            <button class="d-cb" type="button" data-act="next" aria-label="Следующий трек">${ICON('i-fwd')}</button></div></div></div>`;
    }

    const VIEWS = { tasks: vTasks, time: vTime, cal: vCal, tr: vTr, claude: vClaude, gpt: vGpt, tg: vTg, music: vMusic };

    function renderSideTimer() {
      const tm = S.timer;
      sideTimer.hidden = !(tm.running || tm.paused);
      if (sideTimer.hidden) return;
      sideTimer.title = tm.label;
      sideTimer.innerHTML = `${ICON(tm.running ? 'i-play' : 'i-pause')}<span class="num">${tm.running ? clock(elapsed()) : 'пауза'}</span>
        <button class="d-cb" type="button" data-act="stop" aria-label="Остановить таймер">${ICON('i-stop')}</button>`;
    }
    // Одна подсветка на список: переезжает к ближайшей вкладке и не мигает между ними.
    // Вторая такая же рисует выделение активной вкладки, чтобы оно не перескакивало, а ехало.
    function highlight(cls) {
      const layer = document.createElement('i');
      layer.className = cls;
      side.appendChild(layer);
      return target => {
        if (!target) { layer.style.opacity = '0'; return; }
        const h = side.getBoundingClientRect(), r = target.getBoundingClientRect();
        layer.style.width = `${r.width}px`;
        layer.style.height = `${r.height}px`;
        layer.style.transform = `translate(${r.left - h.left}px, ${r.top - h.top}px)`;
        layer.style.opacity = '1';
      };
    }
    const side = host.querySelector('.isl-side');
    const moveHover = highlight('fh'), moveSelection = highlight('fh-sel');

    if (interactive) {
      side.addEventListener('pointermove', e => {
        const tabs = [...side.querySelectorAll('.isl-tab')];
        let best = null, bestD = Infinity;
        for (const t of tabs) {
          const r = t.getBoundingClientRect();
          const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
          const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
          const d = dx * dx + dy * dy;
          if (d < bestD) { bestD = d; best = t; }
        }
        moveHover(best);
      });
      side.addEventListener('pointerleave', () => moveHover(null));
    }

    function render() {
      host.querySelectorAll('.isl-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === S.tab));
      pane.innerHTML = nbHtml(VIEWS[S.tab]());
      renderSideTimer();
      moveSelection(host.querySelector('.isl-tab.on'));
    }
    function focusInput() {
      const i = pane.querySelector('.d-input');
      if (i) i.focus({ preventScroll: true });
    }
    function setTab(t) {
      if (!VIEWS[t] || !interactive) return;
      S.tab = t;
      render();
      emit('tab', t);
      if (window.matchMedia('(hover: hover)').matches) focusInput();
    }

    function addTask(raw) {
      const p = parseDuration(raw);
      if (!p.title) { if (p.mins) toast('Добавь название перед временем'); return; }
      S.tasks.unshift({ id: S.nextId++, t: p.title, done: false, mins: p.mins, fresh: true });
      if (p.mins) S.entries.unshift({ t: p.title, mins: p.mins });
      render();
      focusInput();
      toast(p.mins ? `Записал задачу и ${fmt(p.mins)}` : 'Записал');
      emit('task', { mins: p.mins });
    }

    if (interactive) {
      host.addEventListener('click', e => {
        const tabBtn = e.target.closest('[data-tab]');
        if (tabBtn) { setTab(tabBtn.dataset.tab); return; }
        const a = e.target.closest('[data-act]');
        if (!a) return;
        const act = a.dataset.act;
        if (act === 'toggle') {
          const t = S.tasks.find(x => x.id === +a.closest('[data-id]').dataset.id);
          t.done = !t.done;
          render();
          if (t.done) toast('Готово');
        } else if (act === 'start') {
          const inp = pane.querySelector('[data-in="timer"]');
          const p = parseDuration(inp ? inp.value : '');
          if (p.mins) {
            S.entries.unshift({ t: p.title || 'Без подписи', mins: p.mins });
            render();
            toast(`Записал ${fmt(p.mins)} задним числом`);
            emit('timer', { manual: true });
          } else startTimer(p.title);
        } else if (act === 'pause') {
          S.timer.acc = elapsed(); S.timer.running = false; S.timer.paused = true; render(); emit('timer', timerState());
        } else if (act === 'resume') {
          S.timer.running = true; S.timer.paused = false; S.timer.startedAt = Date.now(); render(); emit('timer', timerState());
        } else if (act === 'stop') stopTimer();
        else if (act === 'join') toast('В приложении откроется ссылка на встречу');
        else if (act === 'settings') toast('В приложении откроются настройки');
        else if (act === 'newsession') toast('В приложении откроется новая сессия Claude');
        else if (act === 'opentg') toast('В приложении откроется Telegram');
        else if (act === 'newchat') toast('В приложении откроется новый чат ChatGPT');
        else if (act === 'phrase') {
          const p = PHRASES[+a.dataset.i];
          S.tr = { text: p[0], out: p[1], muted: false };
          render();
        } else if (act === 'copy' && !S.tr.muted) {
          (navigator.clipboard ? navigator.clipboard.writeText(S.tr.out) : Promise.reject()).then(() => toast('Скопировал'), () => toast('Не получилось скопировать'));
        } else if (act === 'prev' || act === 'next') {
          const n = TRACKS.length;
          S.music.i = (S.music.i + (act === 'next' ? 1 : n - 1)) % n;
          S.music.pos = 0;
          render();
        } else if (act === 'play') { S.music.playing = !S.music.playing; render(); }
      });

      host.addEventListener('keydown', e => {
        const inp = e.target.closest('[data-in]');
        if (!inp) return;
        emit('typed');
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (inp.dataset.in === 'task') addTask(inp.value);
        if (inp.dataset.in === 'timer') pane.querySelector('[data-act="start"]').click();
        if (inp.dataset.in === 'gpt' && inp.value.trim()) {
          inp.value = '';
          toast('В приложении вопрос уйдёт в новый чат ChatGPT');
        }
      });

      host.addEventListener('input', e => {
        const inp = e.target.closest('[data-in="tr"]');
        if (!inp) return;
        const text = inp.value;
        const hit = PHRASES.find(p => p[0].toLowerCase() === text.trim().toLowerCase());
        S.tr = hit ? { text, out: hit[1], muted: false }
          : text.trim() ? { text, out: 'Здесь переводятся три готовые фразы ниже. В приложении переводится любой текст прямо на Mac.', muted: true }
          : { text: '', out: '', muted: true };
        const out = pane.querySelector('[data-out]');
        out.textContent = nb(S.tr.out || 'Перевод появится по мере ввода');
        out.classList.toggle('muted', S.tr.muted);
        pane.querySelector('[data-act="copy"]').disabled = S.tr.muted;
      });

      setInterval(() => {
        if (S.timer.running) {
          renderSideTimer();
          if (S.tab === 'time') render();
          emit('tick', timerState());
        }
        if (S.music.playing) {
          const tr = TRACKS[S.music.i];
          S.music.pos += 1;
          if (S.music.pos >= tr.d) { S.music.i = (S.music.i + 1) % TRACKS.length; S.music.pos = 0; if (S.tab === 'music') render(); }
          else if (S.tab === 'music') {
            const bar = pane.querySelector('[data-prog]'), pos = pane.querySelector('[data-pos]');
            if (bar) bar.style.width = `${S.music.pos / tr.d * 100}%`;
            if (pos) pos.textContent = clock(S.music.pos);
          }
        }
      }, 1000);
    }

    render();
    return {
      on: (e, f) => (listeners[e] = listeners[e] || []).push(f),
      setTab, focusInput, timer: timerState,
      get tab() { return S.tab; }
    };
  }

  window.UsyDemo = { create, TABS, clock, fmt, parseDuration, nb };
})();
