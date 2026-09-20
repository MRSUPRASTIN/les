(function () {
  "use strict";

  // ---------- Светлячки ----------
  const canvas = document.getElementById("fireflies");
  const ctx = canvas.getContext("2d");
  let fireflies = [];
  let last = 0;

  function resize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  }

  function makeFly() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      r: 1 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2
    };
  }

  function init() {
    resize();
    const count = Math.min(60, Math.floor(window.innerWidth / 22));
    fireflies = Array.from({ length: count }, makeFly);
  }

  function tick(t) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const f of fireflies) {
      f.x += f.vx + Math.sin(t * 0.001 * f.speed + f.phase) * 0.2;
      f.y += f.vy + Math.cos(t * 0.001 * f.speed + f.phase) * 0.2;
      if (f.x < -10) f.x = window.innerWidth + 10;
      if (f.x > window.innerWidth + 10) f.x = -10;
      if (f.y < -10) f.y = window.innerHeight + 10;
      if (f.y > window.innerHeight + 10) f.y = -10;

      const glow = 0.45 + 0.55 * Math.sin(t * 0.004 * f.speed + f.phase);
      const a = 0.25 + 0.55 * glow;

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235, 250, 170, " + a * 0.28 + ")";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250, 255, 200, " + (0.55 + 0.45 * glow) + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  init();
  requestAnimationFrame(tick);

  // ---------- Видео: мягкая попытка автостарта ----------
  const video = document.getElementById("forestVideo");
  const play = () => video.play().catch(function () {});
  window.addEventListener("load", function () {
    setTimeout(play, 800);
  });
  video.addEventListener("click", function () {
    if (video.paused) video.play();
    else video.pause();
  });
})();