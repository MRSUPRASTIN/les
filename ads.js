/*
  РЕКЛАМНЫЕ БЛОКИ
  =================
  Как заработать:
  1) Зарегистрируйтесь в рекламной сети:
     - AdSense      https://adsense.google.com  (платит больше, но строго проверяет сайт;
       нужно чтобы у сайта был обычный домен и трафик, github.io часто НЕ пропускают)
     - Adsterra     https://adsterra.com        (легче подключить, подходит для малого трафика)
     - РСЯ (Яндекс) https://yandex.ru/adv/      (нужна регистрация сайта у Яндекса)
  2) Скопируйте код баннера/блока из своего кабинета и вставьте его в поле "code"
     нужного слота ниже.
  3) Откройте сайт, код подставится сам.

  Слоты:
    top        - широкий баннер над видео (728x90 / adaptive)
    afterVideo - квадратный блок после видео (300x300 / 336x280)
    footer     - широкий баннер в конце страницы

  Пока в "code" пусто, показывается заглушка-место.
*/

window.ADS = {
  slots: {
    top: {
      enabled: true,
      // Adsterra баннер 468x60
      code: `
<script>
atOptions = {
  'key' : '5c29266a01f3bf463d1dbe5f2472f678',
  'format' : 'iframe',
  'height' : 60,
  'width' : 468,
  'params' : {}
};
<\/script>
<script src="https://eliminatedfertilizer.com/5c29266a01f3bf463d1dbe5f2472f678/invoke.js"><\/script>`
    },
    afterVideo: {
      enabled: true,
      code: ""
    },
    footer: {
      enabled: true,
      code: ""
    }
  },

  init: function () {
    var self = this;
    document.querySelectorAll("[data-ad-slot]").forEach(function (el) {
      var key = el.getAttribute("data-ad-slot");
      var cfg = self.slots[key];
      if (!cfg || !cfg.enabled) return;

      var holder = document.createElement("div");
      holder.className = "ad-holder";

      if (cfg.code && cfg.code.trim()) {
        holder.innerHTML = cfg.code;
        self._execScripts(holder);
      } else {
        holder.innerHTML =
          '<div class="ad-placeholder">Реклама<span>Подключите код в ads.js</span></div>';
      }
      el.appendChild(holder);
    });
  },

  // innerHTML не запускает <script>, поэтому выполняем их вручную (в том же порядке).
  _execScripts: function (holder) {
    var scripts = holder.querySelectorAll("script");
    scripts.forEach(function (s) {
      var ns = document.createElement("script");
      if (s.src) {
        ns.src = s.src;
      } else {
        ns.text = s.textContent;
      }
      s.parentNode.replaceChild(ns, s);
    });
  }
};

window.addEventListener("load", function () {
  setTimeout(function () { window.ADS.init(); }, 1200);
});