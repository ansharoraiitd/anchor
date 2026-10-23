/**
 * ANCHOR — Charts Engine (Futuristic HUD Visuals)
 * Vanilla SVG & Canvas charts with zero external libraries.
 *
 * 1. DriftRing  — HUD canvas ring with tick marks, glow, and timeline scrubbing
 * 2. RadarChart — SVG radar with domain labels, no clipping, toggleable view
 * 3. EchoChart  — Interactive 8-week divergence bar chart with labels >= 10px
 * 4. Sparkline  — Compact neon HUD polylines
 */

window.Anchor = window.Anchor || {};

(function () {
  'use strict';

  // ═══════════════════════════════════════════════════════════
  // 1. DRIFT RING (HUD Command Deck Hero)
  // ═══════════════════════════════════════════════════════════

  function drawDriftRing(canvas, scores, opts) {
    if (!canvas) return;
    opts = opts || {};
    var parentW = canvas.parentElement ? canvas.parentElement.clientWidth : 0;
    var size = opts.size || (parentW > 0 ? parentW : (window.innerHeight < 700 ? 170 : 210));
    var dpr  = window.devicePixelRatio || 1;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width  = size + 'px';
    canvas.style.height = size + 'px';

    var ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    var cx = size / 2;
    var cy = size / 2;
    var outerR = size * 0.41;
    var innerR = size * 0.32;
    var lineW  = size * 0.055;

    var agencyScore = scores.agency || 71;
    var siaScore    = Math.min(agencyScore + (scores.preference ? (100 - scores.preference) * 0.35 : 10), 98);

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || opts.instant) {
      _renderRing(ctx, cx, cy, outerR, innerR, lineW, agencyScore, siaScore, 1, size);
    } else {
      var duration = 850;
      var startTime = null;

      function animate(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out

        ctx.clearRect(0, 0, size, size);
        _renderRing(ctx, cx, cy, outerR, innerR, lineW, agencyScore, siaScore, ease, size);

        if (progress < 1) requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
    }
  }

  function _renderRing(ctx, cx, cy, outerR, innerR, lineW, agencyScore, siaScore, progress, size) {
    var startAngle = -Math.PI / 2;
    var full = 2 * Math.PI;

    var agencyFrac = (agencyScore / 100) * progress;
    var siaFrac    = (siaScore / 100) * progress;

    // --- 1. Draw HUD Radial Tick Marks (Outer Perimeter) ---
    var tickCount = 40;
    var tickOuter = size * 0.48;
    var tickInner = size * 0.45;
    ctx.save();
    for (var i = 0; i < tickCount; i++) {
      var angle = (i / tickCount) * full;
      var isMajor = i % 5 === 0;
      var tIn = isMajor ? tickInner - 2 : tickInner;

      ctx.beginPath();
      ctx.moveTo(cx + tIn * Math.cos(angle), cy + tIn * Math.sin(angle));
      ctx.lineTo(cx + tickOuter * Math.cos(angle), cy + tickOuter * Math.sin(angle));
      ctx.strokeStyle = isMajor ? 'rgba(25, 227, 255, 0.4)' : 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = isMajor ? 1.5 : 1;
      ctx.stroke();
    }
    ctx.restore();

    // --- 2. Background Track Circles (Dark Hairlines) ---
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, full);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
    ctx.lineWidth = lineW;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, full);
    ctx.strokeStyle = 'rgba(139, 92, 255, 0.09)';
    ctx.lineWidth = lineW;
    ctx.stroke();

    // --- 3. Healthy Band Track Indicator (55–80%) ---
    var bandStart = startAngle + (55 / 100) * full;
    var bandEnd   = startAngle + (80 / 100) * full;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, bandStart, bandEnd);
    ctx.strokeStyle = 'rgba(46, 242, 160, 0.22)';
    ctx.lineWidth = lineW + 3;
    ctx.stroke();

    // --- 4. Drift Gap Glow Fill (Amber Gold between Arcs) ---
    var gapStart = startAngle + Math.min(agencyFrac, siaFrac) * full;
    var gapEnd   = startAngle + Math.max(agencyFrac, siaFrac) * full;
    if (Math.abs(agencyFrac - siaFrac) > 0.015) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, (outerR + innerR) / 2, gapStart, gapEnd);
      ctx.strokeStyle = 'rgba(255, 200, 61, 0.4)';
      ctx.lineWidth = (outerR - innerR) + lineW * 0.8;
      ctx.stroke();

      // Soft blur glow on gap
      ctx.beginPath();
      ctx.arc(cx, cy, (outerR + innerR) / 2, gapStart, gapEnd);
      ctx.strokeStyle = 'rgba(255, 200, 61, 0.25)';
      ctx.lineWidth = (outerR - innerR) + lineW * 1.6;
      ctx.stroke();
      ctx.restore();
    }

    // --- 5. Sia's Arc (Violet to Magenta Glow) ---
    ctx.save();
    ctx.shadowColor = 'rgba(139, 92, 255, 0.5)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, startAngle, startAngle + siaFrac * full);
    ctx.strokeStyle = '#8B5CFF';
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();

    // --- 6. Meera / You Arc (Electric Cyan to Blue Glow) ---
    ctx.save();
    ctx.shadowColor = 'rgba(25, 227, 255, 0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, startAngle, startAngle + agencyFrac * full);
    ctx.strokeStyle = '#19E3FF';
    ctx.lineWidth = lineW;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.restore();
  }

  // ═══════════════════════════════════════════════════════════
  // 2. RADAR CHART — SVG (Morphable & No Label Clipping)
  // ═══════════════════════════════════════════════════════════

  function drawRadarChart(svgEl, domains, siaValues, meeraValues, opts) {
    if (!svgEl) return;
    opts = opts || {};
    var size   = opts.size || 280; // enlarged to prevent text clip
    var cx     = size / 2;
    var cy     = size / 2;
    var r      = size * 0.32; // safe interior radius
    var n      = domains.length;
    var levels = 4;
    var mode   = opts.mode || 'both'; // 'both' | 'you' | 'sia'

    svgEl.setAttribute('viewBox', '0 0 ' + size + ' ' + size);
    svgEl.setAttribute('width',  '100%');
    svgEl.setAttribute('height', size);
    svgEl.setAttribute('role', 'img');
    svgEl.setAttribute('aria-label', 'Radar map comparing Sia prediction vs Meera stated self across 8 life domains');
    svgEl.innerHTML = '';

    function angleFor(i) {
      return (i / n) * 2 * Math.PI - Math.PI / 2;
    }

    function point(val, idx) {
      var angle = angleFor(idx);
      var rr = (val / 100) * r;
      return {
        x: cx + rr * Math.cos(angle),
        y: cy + rr * Math.sin(angle)
      };
    }

    function polygonPoints(values) {
      return values.map(function (v, i) {
        var p = point(v, i);
        return p.x.toFixed(1) + ',' + p.y.toFixed(1);
      }).join(' ');
    }

    // Grid webs
    for (var lv = 1; lv <= levels; lv++) {
      var rr = (lv / levels) * r;
      var pts = [];
      for (var i = 0; i < n; i++) {
        var a = angleFor(i);
        pts.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
      }
      var poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      poly.setAttribute('points', pts.join(' '));
      poly.setAttribute('fill', 'none');
      poly.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
      poly.setAttribute('stroke-width', '1');
      svgEl.appendChild(poly);
    }

    // Axis lines
    for (var i = 0; i < n; i++) {
      var a = angleFor(i);
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', (cx + r * Math.cos(a)).toFixed(1));
      line.setAttribute('y2', (cy + r * Math.sin(a)).toFixed(1));
      line.setAttribute('stroke', 'rgba(255, 255, 255, 0.08)');
      line.setAttribute('stroke-width', '1');
      svgEl.appendChild(line);
    }

    // Sia Polygon (Violet)
    if (mode === 'both' || mode === 'sia') {
      var siaPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      siaPoly.setAttribute('points', polygonPoints(siaValues));
      siaPoly.setAttribute('fill', 'rgba(139, 92, 255, 0.2)');
      siaPoly.setAttribute('stroke', '#8B5CFF');
      siaPoly.setAttribute('stroke-width', '2');
      siaPoly.setAttribute('stroke-linejoin', 'round');
      svgEl.appendChild(siaPoly);

      siaValues.forEach(function (v, i) {
        var p = point(v, i);
        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('r', '3');
        dot.setAttribute('fill', '#8B5CFF');
        svgEl.appendChild(dot);
      });
    }

    // Meera Polygon (Cyan)
    if (mode === 'both' || mode === 'you') {
      var meeraPoly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      meeraPoly.setAttribute('points', polygonPoints(meeraValues));
      meeraPoly.setAttribute('fill', 'rgba(25, 227, 255, 0.22)');
      meeraPoly.setAttribute('stroke', '#19E3FF');
      meeraPoly.setAttribute('stroke-width', '2');
      meeraPoly.setAttribute('stroke-linejoin', 'round');
      svgEl.appendChild(meeraPoly);

      meeraValues.forEach(function (v, i) {
        var p = point(v, i);
        var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y); dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', '#19E3FF');
        svgEl.appendChild(dot);
      });
    }

    // Domain Labels (Positioned safely without clipping)
    var labelDist = 1.26;
    domains.forEach(function (domain, i) {
      var a = angleFor(i);
      var lx = cx + r * labelDist * Math.cos(a);
      var ly = cy + r * labelDist * Math.sin(a);

      var txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      txt.setAttribute('x', lx.toFixed(1));
      txt.setAttribute('y', (ly + 3).toFixed(1));
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('font-size', '10');
      txt.setAttribute('font-family', 'var(--font-hud)');
      txt.setAttribute('font-weight', '600');
      txt.setAttribute('letter-spacing', '0.04em');
      txt.setAttribute('fill', '#94A3B8');
      txt.textContent = domain;
      svgEl.appendChild(txt);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 3. ECHO INDEX TIMELINE (Enlarged & Tappable with >=10px labels)
  // ═══════════════════════════════════════════════════════════

  function drawEchoChart(svgEl, snapshots, opts) {
    if (!svgEl) return;
    opts = opts || {};
    var w = opts.width || 340;
    var h = opts.height || 110;
    var n = snapshots.length;
    var barW = (w / n) * 0.6;
    var gapW = (w / n) * 0.4;
    var maxDiv = 32;

    svgEl.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', h);
    svgEl.setAttribute('role', 'img');
    svgEl.setAttribute('aria-label', 'Echo Index 8-week timeline');
    svgEl.innerHTML = '';

    var onSelect = opts.onSelect || function () {};

    snapshots.forEach(function (snap, i) {
      var x = i * (w / n) + gapW / 2;
      var totalH = Math.max(6, (snap.divergence / maxDiv) * (h - 32));
      var meeraH  = Math.max(0, (snap.meeraClosedGap / maxDiv) * (h - 32));
      var isCurrent = (i === n - 1);

      var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      group.style.cursor = 'pointer';
      group.addEventListener('click', function () { onSelect(snap, i); });

      // Background Divergence Bar (Violet/Muted)
      var bgBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgBar.setAttribute('x', x);
      bgBar.setAttribute('y', h - 22 - totalH);
      bgBar.setAttribute('width', barW);
      bgBar.setAttribute('height', totalH);
      bgBar.setAttribute('fill', 'rgba(139, 92, 255, 0.25)');
      bgBar.setAttribute('stroke', isCurrent ? 'rgba(25, 227, 255, 0.6)' : 'transparent');
      bgBar.setAttribute('rx', '3');
      group.appendChild(bgBar);

      // Echo Closed Gap Portion (Amber Gold Glow)
      if (meeraH > 0) {
        var echoBar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        echoBar.setAttribute('x', x);
        echoBar.setAttribute('y', h - 22 - meeraH);
        echoBar.setAttribute('width', barW);
        echoBar.setAttribute('height', meeraH);
        echoBar.setAttribute('fill', '#FFC83D');
        echoBar.setAttribute('rx', '2');
        group.appendChild(echoBar);
      }

      // Week Label (Strictly >= 10px, W1..W8)
      var lbl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      lbl.setAttribute('x', x + barW / 2);
      lbl.setAttribute('y', h - 6);
      lbl.setAttribute('text-anchor', 'middle');
      lbl.setAttribute('font-size', '10');
      lbl.setAttribute('font-family', 'var(--font-hud)');
      lbl.setAttribute('fill', isCurrent ? '#19E3FF' : '#94A3B8');
      lbl.setAttribute('font-weight', isCurrent ? '700' : '500');
      lbl.textContent = 'W' + (i + 1);
      group.appendChild(lbl);

      svgEl.appendChild(group);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // 4. SPARKLINE — SVG Polyline
  // ═══════════════════════════════════════════════════════════

  function drawSparkline(svgEl, values, color, opts) {
    if (!svgEl) return;
    opts = opts || {};
    var w = opts.width || 70;
    var h = opts.height || 26;

    svgEl.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    svgEl.setAttribute('width', w);
    svgEl.setAttribute('height', h);
    svgEl.innerHTML = '';

    if (!values || values.length < 2) return;

    var min = Math.min.apply(null, values);
    var max = Math.max.apply(null, values);
    var range = max - min || 1;
    var pad = 2;

    function scaleX(i) { return pad + (i / (values.length - 1)) * (w - pad * 2); }
    function scaleY(v) { return h - pad - ((v - min) / range) * (h - pad * 2); }

    var pts = values.map(function (v, i) { return scaleX(i).toFixed(1) + ',' + scaleY(v).toFixed(1); }).join(' ');

    var line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    line.setAttribute('points', pts);
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', color);
    line.setAttribute('stroke-width', '1.6');
    line.setAttribute('stroke-linejoin', 'round');
    line.setAttribute('stroke-linecap', 'round');
    svgEl.appendChild(line);

    var lastX = scaleX(values.length - 1);
    var lastY = scaleY(values[values.length - 1]);
    var dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dot.setAttribute('cx', lastX.toFixed(1));
    dot.setAttribute('cy', lastY.toFixed(1));
    dot.setAttribute('r', '2.5');
    dot.setAttribute('fill', color);
    svgEl.appendChild(dot);
  }

  Anchor.charts = {
    drawDriftRing: drawDriftRing,
    drawRadarChart: drawRadarChart,
    drawEchoChart: drawEchoChart,
    drawSparkline: drawSparkline
  };
})();
