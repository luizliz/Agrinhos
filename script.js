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

    // Função para aplicar tradução nos elementos com data-key
    function applyTranslation(translations) {
        Object.keys(translations).forEach(function(key) {
            var els = document.querySelectorAll('[data-key="' + key + '"]');
            els.forEach(function(el) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.setAttribute('placeholder', translations[key]);
                } else {
                    el.textContent = translations[key];
                }
            });
        });
    }

    // ===================== LOADER =====================
    // Esconde o preloader quando a página termina de carregar
    function initPreloader() {
        var preloader = document.getElementById("preloader");
        if (!preloader) return;
        function hide() {
            preloader.classList.add("fade-out");
            preloader.setAttribute("hidden", "");
            // Forçar display: none após transição
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
        // Clique no indicador "⌵" do hero
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

    // ===================== IDIOMA (PT / EN) =====================
    var dictEn = {
        nav_home: "Home", nav_concepts: "Concepts", nav_motors: "Drivers", nav_benefits: "Benefits",
        nav_challenges: "Challenges", nav_trends: "Trends",
        hero_tag: "Research 2026",
        hero_desc: "An in-depth analysis for the sustainable development of the countryside, balancing economy, environmental preservation, and social well-being.",
        hero_btn: "Explore research", hero_form: "Receive by email",
        conc_tag: "Fundamentals", conc_title: "Integrated Concepts",
        conc_sub: "Rural Tourism, Agrotourism and Ecotourism form what we call Integrated Rural Tourism (IRT).",
        conc1_h: "Rural Tourism", conc1_p: "All tourist activities in rural areas: stays, gastronomy, cultural events and countryside experiences.",
        conc2_h: "Agrotourism", conc2_p: "Active experience on the agricultural property. The visitor participates in the farm routine, harvest and production.",
        conc3_h: "Ecotourism", conc3_p: "Focus on nature and environmental conservation, with education and sustainability in protected areas.",
        conc_accent: "✦ Ecological Agrotourism",
        conc_destaque: "At the intersection of the three practices: sustainable agriculture (organic/agroecology) + tourism offer that regenerates ecosystems and values local knowledge.",
        mot_tag: "Why this model?", mot_title: "Integration Drivers",
        mot1_h: "Market Demand", mot1_p: "Consumers seek authenticity, health and contact with nature.",
        mot2_h: "Internal Needs", mot2_p: "Income diversification and reduction of dependence on volatile crops.",
        mot3_h: "Endogenous Resources", mot3_p: "Landscapes, biodiversity and cultural heritage as the basis of the offer.",
        mot4_h: "Resource Integration", mot4_p: "Combination of agricultural products with hospitality services.",
        mot5_h: "Technical Support", mot5_p: "Technological innovation and sustainable management practices.",
        mot6_h: "Economic Level", mot6_p: "Infrastructure and purchasing power of the host region.",
        ben_tag: "Real impacts", ben_title: "Proven Benefits", ben_sub: "Beyond the Triple Bottom Line — economic, social and environmental",
        ben1_h: "Economic Sustainability", ben1_l1: "Family income diversification", ben1_l2: "Buffer against harvest breaks", ben1_l3: "Local job creation",
        ben2_h: "Social Sustainability", ben2_l1: "Combating rural exodus", ben2_l2: "Keeping youth and women", ben2_l3: "Preserving ancestral knowledge",
        ben3_h: "Environmental Sustainability", ben3_l1: "Biodiversity conservation", ben3_l2: "Soil regenerative practices", ben3_l3: "Reduced ecological footprint",
        ben_stat1: "% exodus reduction", ben_stat2: "active communities", ben_stat3: "countries with cases",
        des_tag: "Barriers", des_title: "Implementation Challenges",
        des1_h: "🏗️ Infrastructure", des1_p: "Precarious rural roads, lack of high-speed internet and deficient basic sanitation.",
        des2_h: "💰 Financial and Legal", des2_p: "Limited access to credit, excessive bureaucracy and lack of integrated public policies.",
        des3_h: "🏛️ Governance", des3_p: "Institutional fragmentation (agriculture vs. tourism vs. environment) and little community participation.",
        des4_h: "📚 Management Capacity", des4_p: "Lack of training in hospitality, digital marketing and waste management.",
        ten_tag: "Future", ten_title: "Trends and Innovation",
        ten1_h: "Smart Villages", ten1_p: "IoT and Big Data for resource management and visitor experience",
        ten2_h: "Augmented Reality", ten2_p: "Natural heritage interpretation with immersive technology",
        ten3_h: "Wellness Tourism", ten3_p: "Yoga, meditation and forest baths in ecological farms",
        ten4_h: "Carbon Monitoring", ten4_p: "Digital tools to calculate and offset the ecological footprint",
        form_title: "Receive the full research", form_desc: "Enter your details to receive the content by email.",
        form_label_name: "Name", form_label_email: "Email",
        form_ph_name: "Your name", form_ph_email: "Your email", form_submit: "Send",
        form_success: "Thank you! We received your request.",
        foot1: "Project developed for the Agrinho 2026 Contest"
    };

    function toggleLanguage() {
        var langBtn = document.getElementById("langToggle");
        var isPt = !document.body.classList.contains("lang-en");
        if (isPt) {
            document.body.classList.add("lang-en");
            applyTranslation(dictEn);
            if (langBtn) {
                langBtn.textContent = "EN";
                langBtn.setAttribute("aria-pressed", "true");
            }
            safeSet("agroLang", "en");
        } else {
            document.body.classList.remove("lang-en");
            location.reload();
        }
    }

    function initLanguage() {
        var langBtn = document.getElementById("langToggle");
        var savedLang = safeGet("agroLang");
        if (savedLang === "en") {
            document.body.classList.add("lang-en");
            applyTranslation(dictEn);
            if (langBtn) {
                langBtn.textContent = "EN";
                langBtn.setAttribute("aria-pressed", "true");
            }
        } else if (langBtn) {
            langBtn.addEventListener("click", toggleLanguage);
        }
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

        // Move o track do slider horizontalmente
        function updateSlider() {
            track.style.transform = "translateX(-" + (current * 100) + "%)";
            dotsContainer.querySelectorAll(".dot").forEach(function(dot, i) {
                dot.classList.toggle("active", i === current);
            });
        }

        // Cria os dots dinamicamente
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

        // Auto-advance a cada 6s, pausa no hover
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
        initLanguage();
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