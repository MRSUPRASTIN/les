(function () {
  "use strict";

  // ---------- Мышь / параллакс ----------
  const mouse = { x: 0, y: 0, sx: 0, sy: 0, tx: 0, ty: 0 };
  window.addEventListener("mousemove", function (e) {
    mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // ---------- Светлячки ----------
  const canvas = document.getElementById("fireflies");
  const ctx = canvas.getContext("2d");
  let fireflies = [];

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
      z: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2
    };
  }

  function init() {
    resize();
    const count = Math.min(70, Math.floor(window.innerWidth / 18));
    fireflies = Array.from({ length: count }, makeFly);
  }

  function tick(t) {
    // плавно догоняем цель мыши
    mouse.sx += (mouse.tx - mouse.sx) * 0.05;
    mouse.sy += (mouse.ty - mouse.sy) * 0.05;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const f of fireflies) {
      f.x += f.vx + Math.sin(t * 0.001 * f.speed + f.phase) * 0.2;
      f.y += f.vy + Math.cos(t * 0.001 * f.speed + f.phase) * 0.2;
      if (f.x < -10) f.x = window.innerWidth + 10;
      if (f.x > window.innerWidth + 10) f.x = -10;
      if (f.y < -10) f.y = window.innerHeight + 10;
      if (f.y > window.innerHeight + 10) f.y = -10;

      const px = f.x - mouse.sx * 40 * f.z;
      const py = f.y - mouse.sy * 30 * f.z;
      const r = (1 + f.z * 3) * 0.55;

      const glow = 0.45 + 0.55 * Math.sin(t * 0.004 * f.speed + f.phase);
      const a = 0.3 + 0.55 * glow;

      ctx.beginPath();
      ctx.arc(px, py, r * 6, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(235, 250, 170, " + a * 0.28 * f.z + ")";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250, 255, 200, " + (0.55 + 0.45 * glow) * f.z + ")";
      ctx.fill();
    }

    apply3D(t);
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", resize);
  init();

  // ---------- 3D: рамка видео, параллакс ----------
  const videoFrame = document.querySelector(".video-frame");
  const treesBack = document.querySelector(".trees-back");
  const treesFront = document.querySelector(".trees-front");
  const moon = document.querySelector(".moon");

  function apply3D(t) {
    const bobX = Math.sin(t * 0.00035) * 1.6;
    const bobY = Math.cos(t * 0.00028) * 2.2;
    const rx = -mouse.sy * 7 + bobX;
    const ry = mouse.sx * 10 + bobY;
    if (videoFrame) {
      videoFrame.style.transform = "rotateX(" + rx.toFixed(2) + "deg) rotateY(" + ry.toFixed(2) + "deg)";
    }
    if (treesBack) treesBack.style.transform = "translate3d(" + (-mouse.sx * 14).toFixed(1) + "px, " + (-mouse.sy * 6).toFixed(1) + "px, 0)";
    if (treesFront) treesFront.style.transform = "translate3d(" + (-mouse.sx * 34).toFixed(1) + "px, " + (-mouse.sy * 14).toFixed(1) + "px, 0)";
    if (moon) moon.style.transform = "translate3d(" + (-mouse.sx * 20).toFixed(1) + "px, " + (-mouse.sy * 12).toFixed(1) + "px, 0)";
  }

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

  // ---------- Галерея (3D-наклон карточек) ----------
  const gallery = document.getElementById("gallery");
  if (gallery && window.PHOTOS && window.PHOTOS.length) {
    window.PHOTOS.forEach(function (src) {
      const img = document.createElement("img");
      img.loading = "lazy";
      img.src = src;
      img.alt = "Кадр из леса";
      img.addEventListener("click", function () {
        openLightbox(src);
      });
      img.addEventListener("mousemove", function (e) {
        const r = img.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform =
          "rotateY(" + (px * 18).toFixed(1) + "deg) rotateX(" + (-py * 18).toFixed(1) + "deg) translateZ(26px)";
      });
      img.addEventListener("mouseleave", function () {
        img.style.transform = "translateZ(0)";
      });
      gallery.appendChild(img);
    });
  }

  const lightbox = document.getElementById("lightbox");

  function openLightbox(src) {
    lightbox.innerHTML = "";
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Кадр из леса";
    const btn = document.createElement("button");
    btn.className = "close";
    btn.textContent = "\u2715";
    btn.addEventListener("click", closeLightbox);
    lightbox.appendChild(img);
    lightbox.appendChild(btn);
    lightbox.classList.add("open");
    document.addEventListener("keydown", onKey);
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.innerHTML = "";
    document.removeEventListener("keydown", onKey);
  }

  function onKey(e) {
    if (e.key === "Escape") closeLightbox();
  }

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
})();