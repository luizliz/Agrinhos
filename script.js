(function() {
    "use strict";

    // Função segura para leitura do localStorage
    function safeGet(key, fallback) {
        try {
            var v = localStorage.getItem(key);
            return v == null ? fallback : v;
        } catch (e) {
            return fallback;
        }
    }

    // Função segura para escrita no localStorage
    function safeSet(key, value) {
        try { localStorage.setItem(key, value); } catch (e) { /* silencioso */ }
    }

    // ===================== LOADER =====================
    // Esconde o preloader quando a página termina de carregar
    function initPreloader() {
        var preloader = document.getElementById("preloader");
        if (!preloader) return;
        function hide() {
            preloader.classList.add("fade-out");
            preloader.setAttribute("hidden", "");
            setTimeout(function() { preloader.style.display = "none"; }, 700);
        }
        if (document.readyState === "complete") {
            setTimeout(hide, 600);
        } else {
            window.addEventListener("load", function() { setTimeout(hide, 600); });
        }
    }

    // ===================== HEADER (auto-hide no scroll) =====================
    // Some ao rolar para baixo, reaparece ao voltar
    function initHeader() {
        var header = document.getElementById("header");
        if (!header) return;
        var lastScroll = 0;
        window.addEventListener("scroll", function() {
            var current = window.scrollY;
            if (current > 100) {
                if (current > lastScroll && header.classList.contains("visible")) {
                    header.classList.remove("visible");
                } else if (current < lastScroll && !header.classList.contains("visible")) {
                    header.classList.add("visible");
                }
            } else {
                header.classList.add("visible");
            }
            lastScroll = current;
        });
        header.classList.add("visible");

        // Destaca link ativo conforme a seção visível
        var navLinks = document.querySelectorAll(".nav-link");
        window.addEventListener("scroll", function() {
            var pos = window.scrollY + 120;
            var current = "home";
            document.querySelectorAll("section[id]").forEach(function(sec) {
                if (sec.offsetTop <= pos) current = sec.id;
            });
            navLinks.forEach(function(link) {
                var active = link.getAttribute("href") === "#" + current;
                link.classList.toggle("active", active);
            });
        });
    }

    // ===================== SMOOTH SCROLL =====================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
            anchor.addEventListener("click", function(e) {
                var href = this.getAttribute("href");
                if (href === "#") return;
                var target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
            });
        });
        var scrollCue = document.querySelector(".hero-scroll");
        if (scrollCue) {
            scrollCue.addEventListener("click", function() {
                var next = document.getElementById("conceitos");
                if (next) next.scrollIntoView({ behavior: "smooth" });
            });
        }
    }

    // ===================== TEMA (DARK / LIGHT) =====================
    function setTheme(theme) {
        var themeBtn = document.getElementById("themeToggle");
        if (theme === "dark") {
            document.body.classList.add("dark");
            if (themeBtn) {
                themeBtn.textContent = "☀️";
                themeBtn.setAttribute("aria-pressed", "true");
            }
        } else {
            document.body.classList.remove("dark");
            if (themeBtn) {
                themeBtn.textContent = "🌙";
                themeBtn.setAttribute("aria-pressed", "false");
            }
        }
        safeSet("agroTheme", theme);
    }

    function initTheme() {
        var themeBtn = document.getElementById("themeToggle");
        var saved = safeGet("agroTheme", "light");
        setTheme(saved === "dark" ? "dark" : "light");
        if (themeBtn) {
            themeBtn.addEventListener("click", function() {
                var isDark = document.body.classList.contains("dark");
                setTheme(isDark ? "light" : "dark");
            });
        }
    }

    // ===================== ALTO CONTRASTE =====================
    function setContrast(active) {
        var contrastBtn = document.getElementById("contrastToggle");
        if (active) {
            document.body.classList.add("high-contrast");
            if (contrastBtn) {
                contrastBtn.textContent = "◑";
                contrastBtn.setAttribute("aria-pressed", "true");
            }
        } else {
            document.body.classList.remove("high-contrast");
            if (contrastBtn) {
                contrastBtn.textContent = "◐";
                contrastBtn.setAttribute("aria-pressed", "false");
            }
        }
        safeSet("agroHighContrast", active ? "true" : "false");
    }

    function initContrast() {
        var contrastBtn = document.getElementById("contrastToggle");
        var saved = safeGet("agroHighContrast", "false");
        setContrast(saved === "true");
        if (contrastBtn) {
            contrastBtn.addEventListener("click", function() {
                var active = document.body.classList.contains("high-contrast");
                setContrast(!active);
            });
        }
    }

    // ===================== TAMANHO DE FONTE =====================
    function setFontSize(size) {
        document.documentElement.style.fontSize = size + "%";
        safeSet("agroFontSize", size);
    }

    function initFont() {
        var fontBtn = document.getElementById("fontToggle");
        if (!fontBtn) return;
        var fontSize = parseInt(safeGet("agroFontSize", "100"), 10);
        if (isNaN(fontSize)) fontSize = 100;
        setFontSize(fontSize);

        function updateButtonLabel() {
            if (fontSize >= 130) fontBtn.textContent = "A+";
            else if (fontSize <= 80) fontBtn.textContent = "A-";
            else fontBtn.textContent = "A↺";
            fontBtn.setAttribute("aria-pressed", fontSize !== 100);
        }
        updateButtonLabel();

        fontBtn.addEventListener("click", function() {
            if (fontSize >= 130) fontSize = 100;
            else if (fontSize === 100) fontSize = 110;
            else if (fontSize === 110) fontSize = 130;
            else fontSize = 100;
            setFontSize(fontSize);
            updateButtonLabel();
        });
    }

    // ===================== SCROLL REVEAL =====================
    function initReveal() {
        var els = document.querySelectorAll(".conceito-card, .beneficio-card, .tendencia-item, .desafio-cat, .stat-item");
        if (!els.length || !("IntersectionObserver" in window)) return;
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        els.forEach(function(el) {
            el.classList.add("reveal");
            obs.observe(el);
        });
    }

    // ===================== SLIDER DE MOTORES =====================
    function initSlider() {
        var track = document.getElementById("motorTrack");
        var slides = document.querySelectorAll(".motor-slide");
        var prevBtn = document.getElementById("prevMotor");
        var nextBtn = document.getElementById("nextMotor");
        var dotsContainer = document.getElementById("motorDots");
        if (!track || slides.length === 0) return;
        var current = 0;
        var total = slides.length;

        function updateSlider() {
            track.style.transform = "translateX(-" + (current * 100) + "%)";
            dotsContainer.querySelectorAll(".dot").forEach(function(dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }

        function buildDots() {
            dotsContainer.innerHTML = "";
            for (var i = 0; i < total; i++) {
                var dot = document.createElement("button");
                dot.className = "dot" + (i === 0 ? " active" : "");
                dot.setAttribute("aria-label", "Slide " + (i + 1));
                dot.addEventListener("click", function(idx) {
                    return function() { current = idx; updateSlider(); };
                }(i));
                dotsContainer.appendChild(dot);
            }
        }

        buildDots();
        if (prevBtn) prevBtn.addEventListener("click", function() { current = (current - 1 + total) % total; updateSlider(); });
        if (nextBtn) nextBtn.addEventListener("click", function() { current = (current + 1) % total; updateSlider(); });
        updateSlider();

        var auto = setInterval(function() { current = (current + 1) % total; updateSlider(); }, 6000);
        var sliderEl = document.getElementById("motorSlider");
        if (sliderEl) {
            sliderEl.addEventListener("mouseenter", function() { clearInterval(auto); });
            sliderEl.addEventListener("mouseleave", function() {
                auto = setInterval(function() { current = (current + 1) % total; updateSlider(); }, 6000);
            });
        }
    }

    // ===================== CONTADORES ANIMADOS =====================
    function initCounters() {
        var counters = document.querySelectorAll(".stat-number");
        if (!counters.length || !("IntersectionObserver" in window)) return;
        var obs = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (!entry.isIntersecting) return;
                var el = entry.target;
                var target = parseInt(el.getAttribute("data-target"), 10);
                if (isNaN(target)) { obs.unobserve(el); return; }
                var current = 0;
                var increment = target / 60;
                function tick() {
                    current += increment;
                    if (current < target) {
                        el.textContent = Math.floor(current);
                        requestAnimationFrame(tick);
                    } else {
                        el.textContent = target;
                    }
                }
                tick();
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(function(c) { obs.observe(c); });
    }

    // ===================== CARDS 3D TILT =====================
    function init3DTilt() {
        if (window.innerWidth < 768) return;
        var cards = document.querySelectorAll(".conceito-card, .beneficio-card, .tendencia-item, .desafio-cat");
        cards.forEach(function(card) {
            card.addEventListener("mousemove", function(e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var cx = rect.width / 2;
                var cy = rect.height / 2;
                var rx = (y - cy) / 20;
                var ry = (cx - x) / 20;
                card.style.transform = "perspective(1000px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-5px)";
            });
            card.addEventListener("mouseleave", function() { card.style.transform = ""; });
        });
    }

    // ===================== INICIALIZAÇÃO =====================
    function init() {
        initPreloader();
        initHeader();
        initSmoothScroll();
        initTheme();
        initContrast();
        initFont();
        initReveal();
        initSlider();
        initCounters();
        init3DTilt();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
