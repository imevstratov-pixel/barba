/*!
 * Barba mascot — усы с глазами и бровями.
 * Без зависимостей. window.BarbaMascot = { markup(opts), mount(el, opts), poses }.
 * Размеры: size 'full' (от 40 px), 'optical' (24–32 px), 'micro' (16–20 px).
 * Стили и позы — в mascot.css (без него рисунок не собирается в позу).
 * Никаких id, масок и <use>: на странице может жить сколько угодно экземпляров.
 */
(function (root) {
  'use strict';

  /* GEOMETRY:BEGIN — сгенерировано tools/geometry.py, руками не править */
  var G = {
    HALF: 'M1.2 1L0 0C-3 -2.5 -8 -4.5 -14 -5C-23 -5.5 -30 -1.5 -30 6.5C-30 11 -26.5 12.5 -23 11C-20 13.5 -15.5 13.5 -13 11C-10.5 13.5 -6 13.5 -3.5 11C-2 12.3 -0.6 12.6 0 12.5C0.8 12.4 1.2 11.6 1.2 10.2Z',
    TIP_CURL: 'M-0.51 -4.77C-0.84 -4.67 -1.86 -4.35 -2.51 -4.17C-3.17 -3.99 -3.81 -3.83 -4.43 -3.68C-5.05 -3.54 -5.65 -3.42 -6.23 -3.32C-6.8 -3.22 -7.36 -3.15 -7.88 -3.1C-8.41 -3.05 -8.91 -3.02 -9.37 -3.02C-9.84 -3.03 -10.27 -3.05 -10.68 -3.11C-11.08 -3.16 -11.46 -3.24 -11.8 -3.36C-12.15 -3.47 -12.47 -3.61 -12.76 -3.8C-13.05 -4 -13.33 -4.22 -13.56 -4.51C-13.79 -4.81 -14.05 -5.4 -14.15 -5.58A1.5 1.5 0 0 0 -17.05 -4.82C-16.96 -4.51 -16.74 -3.53 -16.49 -2.93C-16.24 -2.33 -15.93 -1.75 -15.56 -1.21C-15.19 -0.68 -14.74 -0.18 -14.26 0.27C-13.77 0.72 -13.22 1.13 -12.65 1.49C-12.07 1.86 -11.45 2.18 -10.8 2.47C-10.16 2.76 -9.47 3.01 -8.77 3.24C-8.07 3.46 -7.34 3.65 -6.6 3.82C-5.86 3.99 -5.09 4.13 -4.31 4.25C-3.53 4.38 -2.73 4.48 -1.93 4.56C-1.13 4.65 0.1 4.74 0.51 4.77A4.8 4.8 0 0 0 -0.51 -4.77Z',
    TIP_POINT: 'M-0.21 -4.8C-0.51 -4.7 -1.42 -4.4 -2.03 -4.24C-2.64 -4.08 -3.25 -3.94 -3.86 -3.82C-4.48 -3.7 -5.09 -3.6 -5.7 -3.53C-6.32 -3.46 -6.93 -3.41 -7.55 -3.39C-8.16 -3.36 -8.78 -3.36 -9.39 -3.39C-10 -3.42 -10.61 -3.48 -11.22 -3.56C-11.83 -3.64 -12.44 -3.75 -13.04 -3.89C-13.64 -4.03 -14.24 -4.2 -14.82 -4.4C-15.41 -4.6 -16 -4.82 -16.57 -5.09C-17.13 -5.36 -17.95 -5.84 -18.23 -6A1.2 1.2 0 0 0 -19.57 -4C-19.29 -3.81 -18.45 -3.21 -17.88 -2.82C-17.31 -2.43 -16.75 -2.04 -16.16 -1.66C-15.58 -1.29 -14.99 -0.93 -14.39 -0.57C-13.79 -0.22 -13.18 0.12 -12.55 0.45C-11.93 0.78 -11.29 1.09 -10.64 1.39C-9.98 1.69 -9.32 1.98 -8.64 2.26C-7.96 2.53 -7.26 2.79 -6.56 3.03C-5.85 3.28 -5.12 3.51 -4.39 3.72C-3.65 3.93 -2.9 4.13 -2.13 4.31C-1.37 4.49 -0.18 4.71 0.21 4.8A4.8 4.8 0 0 0 -0.21 -4.8Z',
    TIP_DROOP: 'M-0.37 -4.79C-0.61 -4.71 -1.33 -4.49 -1.81 -4.34C-2.29 -4.2 -2.77 -4.06 -3.23 -3.91C-3.7 -3.77 -4.16 -3.63 -4.61 -3.48C-5.05 -3.33 -5.49 -3.18 -5.91 -3.02C-6.34 -2.85 -6.75 -2.68 -7.16 -2.48C-7.56 -2.27 -7.96 -2.07 -8.36 -1.77C-8.76 -1.47 -9.23 -1.14 -9.54 -0.65C-9.86 -0.17 -10.19 0.55 -10.26 1.13C-10.33 1.71 -10.14 2.35 -9.97 2.83C-9.79 3.31 -9.33 3.83 -9.2 4.03A1.9 1.9 0 0 0 -6 1.97C-6 1.92 -6.01 1.63 -5.96 1.66C-5.92 1.7 -5.74 1.94 -5.74 2.17C-5.73 2.4 -5.88 2.82 -5.93 3.04C-5.98 3.25 -6.08 3.36 -6.04 3.47C-6 3.58 -5.87 3.61 -5.69 3.68C-5.52 3.74 -5.26 3.8 -4.97 3.86C-4.67 3.93 -4.32 4 -3.94 4.07C-3.56 4.15 -3.14 4.23 -2.69 4.31C-2.24 4.39 -1.75 4.47 -1.24 4.55C-0.73 4.63 0.1 4.75 0.37 4.79A4.8 4.8 0 0 0 -0.37 -4.79Z',
    BROW: 'M-4.3 2.1C-4.12 2.01 -3.61 1.69 -3.23 1.54C-2.85 1.38 -2.43 1.25 -2 1.15C-1.58 1.06 -1.13 0.99 -0.68 0.96C-0.23 0.93 0.24 0.93 0.69 0.96C1.14 0.99 1.59 1.06 2.02 1.15C2.44 1.24 2.86 1.37 3.24 1.51C3.62 1.66 4.11 1.94 4.28 2.02A1.95 1.95 0 0 0 6.12 -1.42C5.83 -1.53 5 -1.9 4.41 -2.07C3.83 -2.24 3.22 -2.36 2.61 -2.44C2.01 -2.52 1.38 -2.56 0.77 -2.55C0.16 -2.55 -0.47 -2.5 -1.08 -2.4C-1.68 -2.31 -2.29 -2.17 -2.87 -1.99C-3.45 -1.8 -4.03 -1.57 -4.57 -1.29C-5.11 -1.01 -5.84 -0.47 -6.1 -0.3A1.5 1.5 0 0 0 -4.3 2.1Z',
    EYE_HAPPY: 'M-2.4 2.19C-2.27 2.01 -1.87 1.4 -1.63 1.11C-1.38 0.81 -1.14 0.59 -0.94 0.42C-0.73 0.24 -0.55 0.15 -0.39 0.08C-0.24 0.01 -0.13 0 0 0C0.13 0 0.24 0.01 0.39 0.08C0.55 0.15 0.73 0.24 0.94 0.42C1.14 0.59 1.38 0.81 1.63 1.11C1.87 1.4 2.27 2.01 2.4 2.19A1.3 1.3 0 0 0 4.6 0.81C4.44 0.58 3.96 -0.15 3.62 -0.56C3.28 -0.96 2.94 -1.32 2.56 -1.62C2.18 -1.91 1.78 -2.17 1.36 -2.33C0.93 -2.5 0.45 -2.6 0 -2.6C-0.45 -2.6 -0.93 -2.5 -1.36 -2.33C-1.78 -2.17 -2.18 -1.91 -2.56 -1.62C-2.94 -1.32 -3.28 -0.96 -3.62 -0.56C-3.96 -0.15 -4.44 0.58 -4.6 0.81A1.3 1.3 0 0 0 -2.4 2.19Z',
    EYE_SLEEP: 'M-4.45 0.03C-4.29 0.22 -3.81 0.83 -3.47 1.16C-3.13 1.49 -2.78 1.79 -2.41 2.03C-2.04 2.27 -1.65 2.47 -1.25 2.6C-0.85 2.72 -0.42 2.8 0 2.8C0.42 2.8 0.85 2.72 1.25 2.6C1.65 2.47 2.04 2.27 2.41 2.03C2.78 1.79 3.13 1.49 3.47 1.16C3.81 0.83 4.29 0.22 4.45 0.03A1.2 1.2 0 0 0 2.55 -1.43C2.42 -1.28 2.02 -0.79 1.78 -0.55C1.54 -0.31 1.3 -0.12 1.09 0.02C0.88 0.17 0.68 0.25 0.5 0.32C0.32 0.38 0.17 0.4 0 0.4C-0.17 0.4 -0.32 0.38 -0.5 0.32C-0.68 0.25 -0.88 0.17 -1.09 0.02C-1.3 -0.12 -1.54 -0.31 -1.78 -0.55C-2.02 -0.79 -2.42 -1.28 -2.55 -1.43A1.2 1.2 0 0 0 -4.45 0.03Z',
    LID: 'M-5.4 -9H5.4V-0.4C3.2 0.35 -3.2 0.35 -5.4 -0.4Z',
    OPT_HALF: 'M1.2 1L0 0C-3 -2.5 -8 -4.5 -14 -5C-23 -5.5 -30 -1.5 -30 6.5C-30 11.2 -26.8 12.8 -23.2 10.4C-20.6 14.3 -15.6 14.3 -13 10.2C-10.6 14.2 -6.6 14.3 -4.6 10.8C-3.6 14 -2.2 15.6 0 15.6C0.8 15.6 1.2 15 1.2 13.8Z',
    OPT_BROW: 'M-3.11 2.62C-2.96 2.54 -2.54 2.28 -2.2 2.15C-1.87 2.02 -1.48 1.9 -1.09 1.83C-0.7 1.75 -0.27 1.71 0.14 1.7C0.55 1.68 0.98 1.71 1.37 1.75C1.76 1.8 2.15 1.89 2.48 1.99C2.8 2.09 3.18 2.29 3.33 2.35A2.4 2.4 0 0 0 5.47 -1.95C5.18 -2.05 4.3 -2.42 3.69 -2.57C3.07 -2.72 2.44 -2.81 1.8 -2.86C1.16 -2.9 0.51 -2.9 -0.14 -2.85C-0.79 -2.79 -1.45 -2.69 -2.08 -2.53C-2.72 -2.36 -3.36 -2.15 -3.96 -1.87C-4.56 -1.58 -5.4 -0.99 -5.69 -0.82A2.15 2.15 0 0 0 -3.11 2.62Z',
    OPT_EYE_HAPPY: 'M-2.44 2.55C-2.26 2.3 -1.69 1.46 -1.36 1.1C-1.04 0.74 -0.74 0.54 -0.51 0.4C-0.28 0.26 -0.17 0.25 0 0.25C0.17 0.25 0.28 0.26 0.51 0.4C0.74 0.54 1.04 0.74 1.36 1.1C1.69 1.46 2.26 2.3 2.44 2.55A1.6 1.6 0 0 0 5.16 0.85C4.92 0.53 4.23 -0.54 3.7 -1.09C3.18 -1.63 2.64 -2.11 2.02 -2.42C1.4 -2.73 0.67 -2.95 0 -2.95C-0.67 -2.95 -1.4 -2.73 -2.02 -2.42C-2.64 -2.11 -3.18 -1.63 -3.7 -1.09C-4.23 -0.54 -4.92 0.53 -5.16 0.85A1.6 1.6 0 0 0 -2.44 2.55Z',
    OPT_EYE_SLEEP: 'M-4.99 0.11C-4.75 0.38 -4.04 1.27 -3.52 1.72C-3 2.16 -2.46 2.55 -1.87 2.8C-1.28 3.04 -0.62 3.2 0 3.2C0.62 3.2 1.28 3.04 1.87 2.8C2.46 2.55 3 2.16 3.52 1.72C4.04 1.27 4.75 0.38 4.99 0.11A1.5 1.5 0 0 0 2.61 -1.71C2.43 -1.51 1.87 -0.83 1.54 -0.54C1.22 -0.25 0.92 -0.07 0.66 0.05C0.41 0.17 0.22 0.2 0 0.2C-0.22 0.2 -0.41 0.17 -0.66 0.05C-0.92 -0.07 -1.22 -0.25 -1.54 -0.54C-1.87 -0.83 -2.43 -1.51 -2.61 -1.71A1.5 1.5 0 0 0 -4.99 0.11Z',
    SPARK: 'M0 -5C0.6 -1.2 1.2 -0.6 5 0C1.2 0.6 0.6 1.2 0 5C-0.6 1.2 -1.2 0.6 -5 0C-1.2 -0.6 -0.6 -1.2 0 -5Z',
    DROP: 'M0 -4.6C1.2 -2.4 3 -0.6 3 1.4C3 3.2 1.7 4.4 0 4.4C-1.7 4.4 -3 3.2 -3 1.4C-3 -0.6 -1.2 -2.4 0 -4.6Z',
    ZED: 'M-2.3 -2.3H2.3L-2.3 2.3H2.3',
    WAVE_1: 'M-22.62 -1.11A22.65 22.65 0 0 1 -20.21 -10.22',
    WAVE_2: 'M-25.92 -2.64A26.05 26.05 0 0 1 -23.83 -10.52',
    TIP_PIVOT: [-24.2, 5.4],
    TIP_CURL_END: [-15.6, -5.2],
    TIP_POINT_END: [-18.9, -5]
  };
  /* GEOMETRY:END */

  var POSES = ['calm', 'happy', 'approve', 'surprised', 'thinking', 'stern',
    'guilty', 'dozing', 'lookup', 'point', 'wave'];
  // позы с закрытыми глазами: автоморгание в них не нужно
  var EYES_CLOSED = { happy: 1, dozing: 1, wave: 1 };

  // Опорные точки (система координат: 0,0 = ложбинка между половинками)
  var FULL = { eyeX: 9.4, eyeY: -6.9, browX: 9.4, browY: -15.4 };
  var OPT = { eyeX: 9.2, eyeY: -11, browX: 9.4, browY: -19.6 };
  // micro (≤ 20 px): без бровей и с глазами крупнее — иначе пары «бровь + глаз» сливаются
  // в палочки-стебельки над тушкой. Зазор между глазом и кромкой оставлен нарочно: при 1x
  // глаза, касающиеся усов, превращаются в два бугорка и силуэт читается как летучая мышь
  var MICRO = { eyeX: 9.3, eyeY: -11.2, rx: 4.1, ry: 4.5 };
  // [minX, minY, width, height]
  var CROPS = {
    stage: [-48, -34.5, 96, 54],   // запас под кончики, прыжки и мелочи
    icon: [-37, -20.8, 74, 35.6],  // плотная рамка спокойной позы
    optical: [-31.5, -23, 63, 40.5],
    micro: [-31.5, -17.5, 63, 35]
  };
  // глаз основного рисунка: точка, лунка вокруг неё (цвет фона) и ход точки в лунке
  var DOT = { rx: 3.3, ry: 3.95 };
  var SOCKET = 1.35;                 // ширина лунки вокруг точки

  function n(v) { return String(Math.round(v * 100) / 100); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function g(cls, inner, tr) {
    return '<g' + (cls ? ' class="' + cls + '"' : '') + (tr ? ' transform="' + tr + '"' : '') + '>' + inner + '</g>';
  }
  function at(x, y, inner, extra) {
    return g('', inner, 'translate(' + n(x) + ' ' + n(y) + ')' + (extra ? ' ' + extra : ''));
  }
  function path(cls, d, attrs) {
    return '<path class="' + cls + '" d="' + d + '"' + (attrs || '') + '/>';
  }
  var HALO = ' paint-order="stroke" stroke-linejoin="round"';

  // ---------------------------------------------------------------- детали

  function tip(side) {
    var fx = '';
    var fxOut = '';
    if (side === 'r') {
      // искра на самом кончике-«пальце» и дуги взмаха (правый кончик жестикулирует)
      var e = G.TIP_POINT_END;
      fx = at(e[0] - 1.6, e[1] - 5.2, g('fx fx-tipspark', path('fx-amber', G.SPARK) +
        at(-5.4, 3.2, path('fx-amber-d', G.SPARK), 'scale(.5)')));
      // дуги взмаха — концентричны шарниру кончика, чуть дальше его конца
      fxOut = g('fx fx-waves',
        path('fx-line', G.WAVE_1) + path('fx-line', G.WAVE_2));
    }
    var shapes = path('tip-curl', G.TIP_CURL) + path('tip-point', G.TIP_POINT) + path('tip-droop', G.TIP_DROOP);
    return at(G.TIP_PIVOT[0], G.TIP_PIVOT[1],
      g('tip tip-' + side, g('tip-tw', g('tip-wave', shapes + fx) + fxOut)));
  }

  function half(side, optical) {
    var body = optical ? path('m-half', G.OPT_HALF) : path('m-half', G.HALF) + tip(side);
    return g('m-half-g m-' + (side === 'l' ? 'left' : 'right'), g('m-tw', body));
  }

  /* Глаз основного рисунка:
       .eye        поза: сдвиг и масштаб
       .eye-look   взгляд: лунка чуть едет вдоль кромки
       .eye-blink  моргание
       .eye-open   форма «точка» (схлопывается при смене формы)
         .eye-socket  лунка цвета фона: стоит в кромке усов
         .eye-ball    точка: ходит внутри лунки (look, поза)
           .eye-glint   блик (светлая тема)
           .eye-pupil   зрачок цвета фона (тёмная тема)
       .eye-happy / .eye-sleep  формы ^ и ‿ с ореолом
       .lid        веко цвета фона (вне моргания)                         */
  function eye(side, kind) {
    var P = kind === 'full' ? FULL : kind === 'micro' ? MICRO : OPT;
    var x = side === 'l' ? -P.eyeX : P.eyeX;
    var mirror = side === 'r' ? 'scale(-1 1)' : '';
    var inner;
    var lid = '';
    if (kind === 'full') {
      // у правого глаза блик в отражённой системе ставим с минусом: свет с одной стороны
      var gx = side === 'r' ? -1.1 : 1.1;
      inner = g('eye-open',
          '<ellipse class="eye-socket" rx="' + n(DOT.rx + SOCKET) + '" ry="' + n(DOT.ry + SOCKET) + '"/>' +
          g('eye-ball',
            '<ellipse class="eye-dot" rx="' + DOT.rx + '" ry="' + DOT.ry + '"/>' +
            '<circle class="eye-glint" cx="' + gx + '" cy="-1.3" r="1"/>' +
            '<circle class="eye-pupil" cy=".1" r="2.15"/>')) +
        path('eye-happy halo', G.EYE_HAPPY, HALO) + path('eye-sleep halo', G.EYE_SLEEP, HALO);
      lid = path('lid lid-' + side, G.LID);
    } else {
      var rx = P.rx || 3.8, ry = P.ry || 4.3;
      inner = g('eye-open', g('eye-ball', '<ellipse class="eye-dot" rx="' + rx + '" ry="' + ry + '"/>')) +
        path('eye-happy', G.OPT_EYE_HAPPY) + path('eye-sleep', G.OPT_EYE_SLEEP);
    }
    return at(x, P.eyeY, g('eye eye-' + side, g('eye-look', g('eye-blink', inner) + lid)), mirror);
  }

  function brow(side, kind) {
    var P = kind === 'full' ? FULL : OPT;
    var x = side === 'l' ? -P.browX : P.browX;
    var mirror = side === 'r' ? 'scale(-1 1)' : '';
    return at(x, P.browY, g('brow brow-' + side, g('brow-look', path('brow-shape', kind === 'full' ? G.BROW : G.OPT_BROW))), mirror);
  }

  // У каждой мелочи своя обёртка at(): она появляется (scale .4 → 1) из своего центра, а не из центра усов
  function fxLayer() {
    // точки мысли вокруг средней, (-24.4, -24.6)
    var dots = at(4.9, 5.1, g('fx-dot fx-dot1', '<circle r="1.2"/>')) +
      at(0.2, 0, g('fx-dot fx-dot2', '<circle r="1.6"/>')) +
      at(-5.4, -5.2, g('fx-dot fx-dot3', '<circle r="2.1"/>'));
    // z z вокруг (25.2, -23.5)
    var zz = at(-3.7, 4, g('fx-z fx-z1', path('fx-zed', G.ZED)), 'scale(.8)') +
      at(3.8, -4, g('fx-z fx-z2', path('fx-zed', G.ZED)), 'scale(1.1)');
    // румянец: три штриха вокруг (0,0); каждая сторона едет вместе со своим глазом (.fx-blush-l/-r)
    var blushOne = function () {
      var s = '';
      for (var i = 0; i < 3; i++) s += path('fx-stroke', 'M' + n(-3.05 + i * 2.3) + ' 1.4l1.5 -2.8');
      return s;
    };
    var blush = function (side, x) {
      return at(x, -1.6, g('fx-blush-at fx-blush-' + side, g('fx fx-blush', blushOne())));
    };
    var bang = path('fx-line', 'M-15.5 -1.5L-17.6 -4.6') + path('fx-line', 'M0 -2.4V-6.4') + path('fx-line', 'M15.5 -1.5L17.6 -4.6');
    return g('fx-layer',
      at(-24.4, -24.6, g('fx fx-think', dots)) +
      at(25.2, -23.5, g('fx fx-zz', zz)) +
      blush('l', -18) + blush('r', 18) +
      at(-21.5, -12.5, g('fx fx-drop', path('fx-amber', G.DROP))) +
      at(21.6, -18.2, g('fx fx-spark', path('fx-amber', G.SPARK) + at(5.6, 5.2, path('fx-amber-d', G.SPARK), 'scale(.52)'))) +
      at(0, -21.5, g('fx fx-bang', bang)));
  }

  // ---------------------------------------------------------------- разметка

  function normPose(p) { return POSES.indexOf(p) >= 0 ? p : 'calm'; }
  // 'full' | 'optical' | 'micro'. optical уже 20 px сам становится micro
  function kindOf(opts) {
    if (opts.size === 'micro') return 'micro';
    if (opts.size === 'optical') return opts.width && +opts.width <= 20 ? 'micro' : 'optical';
    return 'full';
  }

  function markup(opts) {
    opts = opts || {};
    var kind = kindOf(opts);
    var full = kind === 'full';
    var crop = CROPS[full ? (opts.crop === 'icon' ? 'icon' : 'stage') : kind];
    var pose = normPose(opts.pose);
    var cls = ['barba-m', 'is-' + pose];
    if (!full) cls.push('is-optical');
    if (kind === 'micro') cls.push('is-micro');
    if (opts.idle !== false) cls.push('is-idle');
    if (opts.theme === 'dark') cls.push('is-dark');
    if (opts.className) cls.push(String(opts.className));

    var stache = g('m-stache',
      half('l', !full) +
      g('', half('r', !full), 'scale(-1 1)') +
      (full ? '<ellipse class="m-mid" cx="0" cy="6.8" rx="5" ry="5.9"/>'
            : '<ellipse class="m-mid" cx="0" cy="10" rx="4.2" ry="5.6"/>'));
    var face = eye('l', kind) + eye('r', kind) +
      (kind === 'micro' ? '' : brow('l', kind) + brow('r', kind));
    var rig = g('m-rig', g('m-breathe', stache + face) + (full ? fxLayer() : ''));

    var w = opts.width || crop[2] * 2;
    var h = Math.round(w * crop[3] / crop[2] * 100) / 100;
    var a11y = opts.label
      ? ' role="img" aria-label="' + esc(opts.label) + '"'
      : ' aria-hidden="true" focusable="false"';
    return '<svg class="' + esc(cls.join(' ')) + '" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' +
      n(crop[2]) + ' ' + n(crop[3]) + '" width="' + n(w) + '" height="' + n(h) + '" fill="currentColor"' + a11y +
      ' data-pose="' + pose + '">' + g('', rig, 'translate(' + n(-crop[0]) + ' ' + n(-crop[1]) + ')') + '</svg>';
  }

  // ---------------------------------------------------------------- контроллер

  var reduceMotion = function () {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  };
  function clamp(v) { v = +v || 0; return v < -1 ? -1 : v > 1 ? 1 : v; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Живые контроллеры: svg → { stop(keepMarkup), owned, host }. owned — разметку вставил mount
  // (тогда destroy её уберёт); повторный mount на тот же рисунок гасит прежний и наследует owned/host
  var LIVE = typeof WeakMap === 'function' ? new WeakMap() : null;

  function isRootSvg(el) {
    return !!(el.tagName && el.tagName.toLowerCase() === 'svg' && el.classList && el.classList.contains('barba-m'));
  }
  function svgFrom(html) {
    var box = document.createElement('div');
    box.innerHTML = html;                  // строка собрана из констант, label экранирован
    return box.firstChild;
  }

  function mount(el, opts) {
    if (!el || !el.nodeType) throw new Error('BarbaMascot.mount: нужен DOM-элемент');
    opts = opts || {};
    var isRoot = isRootSvg(el);
    var svg = isRoot ? el : el.querySelector('svg.barba-m');
    var prev = svg && LIVE ? LIVE.get(svg) : null;
    if (prev) prev.stop(true);             // прежний контроллер: таймеры и слушатели долой

    // чья разметка: по умолчанию наследуем от прежнего контроллера этого рисунка
    var owned = prev ? prev.owned : false;
    var host = prev ? prev.host : null;
    var fresh = false;                     // разметку только что собрали из opts: поза уже в ней
    if (!svg || opts.render) {
      if (!isRoot) {
        el.innerHTML = markup(opts);
        svg = el.querySelector('svg.barba-m');
        owned = true;
        host = el;
        fresh = true;
      } else if (el.parentNode) {
        svg = svgFrom(markup(opts));       // el — сам <svg>: меняем его целиком, а не кладём svg в svg
        el.parentNode.replaceChild(svg, el);
        fresh = true;
      } else if (root.console) {
        root.console.warn('BarbaMascot.mount: render для <svg> без родителя невозможен, беру как есть');
      }
    } else if (opts.idle === false) {
      svg.classList.remove('is-idle');     // уже готовая разметка (например, из markup на сервере)
    }

    var pose = normPose(svg.getAttribute('data-pose'));
    var dead = false;
    var asleep = false;
    var beforeSleep = null;
    var visible = true;
    var timers = [];
    var pulses = {};
    var raf = 0;
    var io = null;
    var rec = null;

    function later(fn, ms) {
      var id = setTimeout(function () {
        forget(id);
        if (!dead) fn();
      }, ms);
      timers.push(id);
      return id;
    }
    function forget(id) {
      var i = timers.indexOf(id);
      if (i >= 0) timers.splice(i, 1);
    }
    // угол качающегося кончика позы wave прямо сейчас (deg) или null
    function waveAngle() {
      var w = svg.querySelector('.tip-r .tip-wave');
      if (!w || !w.animate || reduceMotion()) return null;
      var m = /matrix\(([^)]+)\)/.exec(root.getComputedStyle(w).transform || '');
      if (!m) return null;
      var v = m[1].split(',').map(parseFloat);
      var deg = Math.atan2(v[1], v[0]) * 180 / Math.PI;
      return Math.abs(deg) < 0.3 ? null : { el: w, deg: deg };
    }
    function swapPose(name) {
      // уходим из wave: keyframes снимутся мгновенно, поэтому кончик доводим до нуля сами
      var swing = pose === 'wave' && name !== 'wave' ? waveAngle() : null;
      svg.classList.remove('is-' + pose);
      pose = name;
      svg.classList.add('is-' + pose);
      svg.setAttribute('data-pose', pose);
      if (swing) {
        swing.el.animate([{ transform: 'rotate(' + swing.deg.toFixed(2) + 'deg)' }, { transform: 'rotate(0deg)' }],
          { duration: 320, easing: 'cubic-bezier(.22, .8, .3, 1)' });
      }
    }
    // перезапуск разовой CSS-анимации (моргание, подёргивание)
    function pulse(cls, ms) {
      if (pulses[cls]) { clearTimeout(pulses[cls]); forget(pulses[cls]); }
      svg.classList.remove(cls);
      svg.getBoundingClientRect();         // пересчёт стиля: иначе анимация не стартует заново
      svg.classList.add(cls);
      pulses[cls] = later(function () { pulses[cls] = 0; svg.classList.remove(cls); }, ms);
    }
    function teardown(keepMarkup) {
      if (dead) return;
      dead = true;
      timers.forEach(clearTimeout);
      timers = [];
      if (raf) root.cancelAnimationFrame(raf);
      if (onMove) {
        root.removeEventListener('pointermove', onMove);
        document.documentElement.removeEventListener('mouseleave', onLeave);
      }
      if (io) io.disconnect();
      svg.classList.remove('is-offscreen', 'is-blinking', 'is-twitching');
      if (LIVE && LIVE.get(svg) === rec) LIVE['delete'](svg);
      if (!keepMarkup && owned && host && svg.parentNode === host) host.removeChild(svg);
    }

    var ctl = {
      el: svg,
      get pose() { return pose; },
      get asleep() { return asleep; },
      setPose: function (name) {
        if (dead) return ctl;
        if (POSES.indexOf(name) < 0) {
          if (root.console) root.console.warn('BarbaMascot: неизвестная поза «' + name + '»');
          return ctl;
        }
        if (asleep && name !== 'dozing') { asleep = false; svg.classList.remove('is-asleep'); }
        if (name !== pose) swapPose(name);
        return ctl;
      },
      blink: function () {
        if (!dead) pulse('is-blinking', 220);
        return ctl;
      },
      twitch: function () {
        if (!dead) pulse('is-twitching', 760);
        return ctl;
      },
      // взгляд: dx, dy в -1..1 (вправо, вниз). look() без аргументов — прямо.
      look: function (dx, dy) {
        if (dead) return ctl;
        svg.style.setProperty('--bm-gx', String(Math.round(clamp(dx) * 1000) / 1000));
        svg.style.setProperty('--bm-gy', String(Math.round(clamp(dy) * 1000) / 1000));
        return ctl;
      },
      // sleep(true) — задремать (поза dozing, без автоморгания), sleep(false) — проснуться в прежней позе
      sleep: function (on) {
        if (dead) return ctl;
        on = on !== false;
        if (on && !asleep) {
          beforeSleep = pose === 'dozing' ? 'calm' : pose;
          asleep = true;
          svg.classList.add('is-asleep');
          swapPose('dozing');
        } else if (!on && asleep) {
          asleep = false;
          svg.classList.remove('is-asleep');
          swapPose(beforeSleep || 'calm');
          later(ctl.blink, 260);
        }
        return ctl;
      },
      // снять таймеры и слушатели; рисунок, который вставил mount (этот или прежний на том же svg), убрать
      destroy: function () { teardown(false); }
    };
    rec = { stop: teardown, owned: owned, host: host };
    if (LIVE) LIVE.set(svg, rec);

    // вне экрана: бесконечные анимации на паузе (.is-offscreen), автоморгание пропускается
    if (opts.idle !== false && root.IntersectionObserver) {
      io = new root.IntersectionObserver(function (entries) {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible) svg.classList.remove('is-offscreen');
        else svg.classList.add('is-offscreen');
      });
      io.observe(svg);
    }

    // автоморгание: раз в 2.5–6 с, иногда дважды; не моргает с закрытыми глазами, во сне, в фоне и вне экрана
    function scheduleBlink() {
      later(function () {
        if (visible && !asleep && !EYES_CLOSED[pose] && !document.hidden && !reduceMotion()) {
          ctl.blink();
          if (Math.random() < 0.18) later(ctl.blink, 320);
        }
        scheduleBlink();
      }, rnd(2500, 6000));
    }
    if (opts.blink !== false && opts.idle !== false) scheduleBlink();

    // необязательно: глаза следят за курсором (opts.follow = true)
    var onMove = null, onLeave = null;
    if (opts.follow) {
      onMove = function (e) {
        if (raf || !visible) return;
        var x = e.clientX, y = e.clientY;
        raf = root.requestAnimationFrame(function () {
          raf = 0;
          if (dead) return;
          var r = svg.getBoundingClientRect();
          var k = Math.max(r.width, 240) * 1.6;
          ctl.look((x - r.left - r.width / 2) / k, (y - r.top - r.height * 0.45) / k);
        });
      };
      onLeave = function () { ctl.look(0, 0); };
      root.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('mouseleave', onLeave);
    }

    if (!fresh && opts.pose) ctl.setPose(opts.pose);
    if (opts.look) ctl.look(opts.look[0], opts.look[1]);
    return ctl;
  }

  root.BarbaMascot = { markup: markup, mount: mount, poses: POSES.slice() };
})(typeof window !== 'undefined' ? window : this);
