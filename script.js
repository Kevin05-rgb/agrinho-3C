/**
 * ARRAYS DE OBJETOS PARA RENDERIZAÇÃO DE COMPONENTES (MANUTENÇÃO FACILITADA)
 */
const featuresData = [
    {
        title: "Sensoriamento IoT de Solo",
        desc: "Monitore umidade, temperatura e níveis de NPK em tempo real diretamente de seu smartphone."
    },
    {
        title: "Previsão Agro-Climática",
        desc: "Algoritmos avançados calculam microclimas exatos da sua propriedade com precisão de metros."
    },
    {
        title: "Automação de Manejo",
        desc: "Calendários dinâmicos integrados que alertam o momento ideal para plantio, pulverização e colheita."
    }
];

const faqData = [
    {
        question: "Como os dados climáticos são coletados?",
        answer: "Utilizamos uma combinação de dados de satélites meteorológicos de alta precisão e sensores IoT instalados localmente na sua propriedade para cruzar informações e gerar previsões microclimáticas assertivas."
    },
    {
        question: "Preciso de internet em toda a fazenda?",
        answer: "Não. Nossos sensores operam via redes de longo alcance (LoRaWAN) que cobrem quilômetros com uma única antena, sincronizando os dados com o sistema assim que houver conexão."
    },
    {
        question: "O calendário se adapta se o clima mudar?",
        answer: "Sim! Se o sistema detectar uma previsão de chuva torrencial não esperada, o calendário reagendará automaticamente os alertas de pulverização e avisará via notificação."
    }
];

// Dados simulados de eventos para a inteligência de calendário
const mockEvents = {
    "2026-06-12": [
        { title: "Janela de Plantio Ideal", desc: "Solo com umidade perfeita (72%). Iniciar plantio de milho safrinha.", alert: "normal" },
        { title: "Condição Climática Estável", desc: "Sem previsão de chuva para as próximas 48 horas.", alert: "normal" }
    ],
    "2026-06-15": [
        { title: "Alerta de Pulverização", desc: "Ventos abaixo de 10km/h entre as 06:00 e 10:00. Momento ideal.", alert: "normal" }
    ],
    "2026-06-18": [
        { title: "ALERTA: Chuva Forte Prevista", desc: "Previsão de 45mm. Suspender aplicações de fertilizantes e defensivos.", alert: "warning" }
    ]
};

// Dados simulados de clima por dia (para fins de interatividade)
const mockWeather = {
    "2026-06-12": { temp: "26°C", desc: "Ensolarado", humidity: "65%", wind: "8 km/h" },
    "2026-06-15": { temp: "24°C", desc: "Parcialmente Nublado", humidity: "70%", wind: "7 km/h" },
    "2026-06-18": { temp: "20°C", desc: "Tempestades Isoladas", humidity: "92%", wind: "22 km/h" },
    "default": { temp: "23°C", desc: "Instável", humidity: "75%", wind: "12 km/h" }
};

document.addEventListener("DOMContentLoaded", () => {
    
    // Configurações de Data Atual no sistema de 2026
    let currentYear = 2026;
    let currentMonth = 5; // Junho (0-indexed)
    let selectedDateStr = "2026-06-12";

    // Inicialização da interface temporal estática superior
    const systemDate = new Date(2026, 5, 12);
    document.getElementById("current-date").innerText = systemDate.toLocaleDateString('pt-BR');
    document.getElementById("current-day-name").innerText = systemDate.toLocaleDateString('pt-BR', { weekday: 'long' });

    /**
     * GERENCIADOR DE ACESSIBILIDADE
     */
    const btnContrast = document.getElementById("btn-contrast");
    const btnFontInc = document.getElementById("btn-font-inc");
    const btnFontDec = document.getElementById("btn-font-dec");
    let currentFontSize = 16;

    btnContrast.addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
    });

    function updateFontSize(action) {
        if (action === 'inc' && currentFontSize < 24) currentFontSize += 2;
        if (action === 'dec' && currentFontSize > 12) currentFontSize -= 2;
        document.documentElement.style.fontSize = `${currentFontSize}px`;
    }
    btnFontInc.addEventListener("click", () => updateFontSize('inc'));
    btnFontDec.addEventListener("click", () => updateFontSize('dec'));

    /**
     * RENDERIZAÇÃO DO CALENDÁRIO INTERATIVO
     */
    const monthYearLabels = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const daysContainer = document.getElementById("calendar-days");
    const monthYearTitle = document.getElementById("calendar-month-year");

    function renderCalendar(month, year) {
        daysContainer.innerHTML = "";
        monthYearTitle.innerText = `${monthYearLabels[month]} ${year}`;

        const firstDayIndex = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        // Dias vazios anteriores ao primeiro dia do mês
        for (let i = 0; i < firstDayIndex; i++) {
            const emptyDay = document.createElement("div");
            emptyDay.classList.add("calendar-day", "empty");
            daysContainer.appendChild(emptyDay);
        }

        // Preenchimento dos dias reais do mês
        for (let day = 1; day <= lastDay; day++) {
            const dayEl = document.createElement("div");
            dayEl.classList.add("calendar-day");
            dayEl.innerText = day;

            // Formata string de data para checagem ISO
            const monthStr = String(month + 1).padStart(2, '0');
            const dayStr = String(day).padStart(2, '0');
            const fullDateKey = `${year}-${monthStr}-${dayStr}`;

            if (mockEvents[fullDateKey]) {
                dayEl.classList.add("has-event");
            }

            if (fullDateKey === selectedDateStr) {
                dayEl.classList.add("active");
                updateDashboardDetails(fullDateKey);
            }

            dayEl.addEventListener("click", () => {
                document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("active"));
                dayEl.classList.add("active");
                selectedDateStr = fullDateKey;
                updateDashboardDetails(fullDateKey);
            });

            daysContainer.appendChild(dayEl);
        }
    }

    function updateDashboardDetails(dateKey) {
        // Atualiza Bloco de Clima conforme data selecionada
        const weather = mockWeather[dateKey] || mockWeather["default"];
        document.getElementById("weather-temp").innerText = weather.temp;
        document.getElementById("weather-desc").innerText = weather.desc;
        document.getElementById("weather-humidity").innerText = weather.humidity;
        document.getElementById("weather-wind").innerText = weather.wind;

        // Atualiza Bloco de Eventos/Manejos recomendados
        const eventContainer = document.getElementById("event-details-container");
        const events = mockEvents[dateKey];

        if (events && events.length > 0) {
            eventContainer.innerHTML = events.map(ev => `
                <div class="event-item">
                    <div class="event-title">${ev.title}</div>
                    <div class="event-desc">${ev.desc}</div>
                    <span class="alert-badge ${ev.alert}">${ev.alert === 'warning' ? '⚠️ Alerta Crítico' : '✓ Recomendado'}</span>
                </div>
            `).join('');
        } else {
            eventContainer.innerHTML = `<p class="placeholder-text">Nenhum evento ou alerta crítico registrado para este dia. Operação padrão de monitoramento contínuo.</p>`;
        }
    }

    document.getElementById("btn-prev-month").addEventListener("click", () => {
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        renderCalendar(currentMonth, currentYear);
    });

    document.getElementById("btn-next-month").addEventListener("click", () => {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        renderCalendar(currentMonth, currentYear);
    });

    // Inicia o calendário padrão em Junho de 2026
    renderCalendar(currentMonth, currentYear);


    /**
     * RENDERIZAÇÃO DO CARROSSEL VIA OBJETO
     */
    const carouselContainer = document.getElementById("carousel-container");
    if (carouselContainer) {
        let currentSlide = 0;
        
        const track = document.createElement("div");
        track.classList.add("carousel-track");
        
        featuresData.forEach(feat => {
            const card = document.createElement("div");
            card.classList.add("carousel-card");
            card.innerHTML = `
                <h3>${feat.title}</h3>
                <p>${feat.desc}</p>
            `;
            track.appendChild(card);
        });
        
        carouselContainer.appendChild(track);

        const navBox = document.createElement("div");
        navBox.classList.add("carousel-nav-buttons");
        
        const btnPrevC = document.createElement("button");
        btnPrevC.classList.add("btn-arrow");
        btnPrevC.innerHTML = "&lt;";
        
        const btnNextC = document.createElement("button");
        btnNextC.classList.add("btn-arrow");
        btnNextC.innerHTML = "&gt;";

        navBox.appendChild(btnPrevC);
        navBox.appendChild(btnNextC);
        carouselContainer.appendChild(navBox);

        function moveCarousel() {
            const cardsVisible = window.innerWidth > 1024 ? 3 : (window.innerWidth > 768 ? 2 : 1);
            const maxSlides = featuresData.length - cardsVisible;
            if (currentSlide > maxSlides) currentSlide = maxSlides;
            if (currentSlide < 0) currentSlide = 0;
            
            const cardWidth = document.querySelector(".carousel-card").offsetWidth;
            track.style.transform = `translateX(-${currentSlide * (cardWidth + 32)}px)`;
        }

        btnNextC.addEventListener("click", () => {
            if (currentSlide < featuresData.length - 1) { currentSlide++; moveCarousel(); }
        });
        btnPrevC.addEventListener("click", () => {
            if (currentSlide > 0) { currentSlide--; moveCarousel(); }
        });

        window.addEventListener("resize", moveCarousel);
    }


    /**
     * RENDERIZAÇÃO DO ACORDEÃO VIA OBJETO (FAQ)
     */
    const accordionContainer = document.getElementById("accordion-container");
    if (accordionContainer) {
        faqData.forEach((item, idx) => {
            const accItem = document.createElement("div");
            accItem.classList.add("accordion-item");
            
            accItem.innerHTML = `
                <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-answer-${idx}">
                    <span>${item.question}</span>
                    <span class="accordion-icon">+</span>
                </button>
                <div id="faq-answer-${idx}" class="accordion-content">
                    <p>${item.answer}</p>
                </div>
            `;
            
            const trigger = accItem.querySelector(".accordion-trigger");
            const content = accItem.querySelector(".accordion-content");
            
            trigger.addEventListener("click", () => {
                const isOpen = accItem.classList.contains("open");
                
                // Fecha todos antes de abrir o atual
                document.querySelectorAll(".accordion-item").forEach(el => {
                    el.classList.remove("open");
                    el.querySelector(".accordion-content").style.maxHeight = null;
                    el.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
                });

                if (!isOpen) {
                    accItem.classList.add("open");
                    trigger.setAttribute("aria-expanded", "true");
                    content.style.maxHeight = content.scrollHeight + "px";
                }
            });

            accordionContainer.appendChild(accItem);
        });
    }
});