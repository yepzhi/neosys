const currentLang = localStorage.getItem('neosys_lang') || 'es';

const translations = {
    es: {
        // Navegación
        nav_mandamientos: "Principios",
        nav_marco: "Marco Conceptual",
        nav_whitepaper: "Whitepaper",
        nav_acercate: "Divulgación",
        nav_comunidad: "Comunidad",
        nav_unete: "Únete",
        wp_link: "neosysaeon-whitepaper-v4.1.pdf",

        // Hero
        hero_tagline: "Sin ciencia no hay claridad. Sin validación no hay progreso.",
        hero_subtitle: "Un marco abierto para entender la realidad a través de evidencia verificable.",
        hero_btn_mandamientos: "Principios del Cosmos",
        hero_btn_whitepaper: "Leer Whitepaper",
        hero_explore: "Explorar",

        postulado_label: "De la Filosofía a la Ciencia",
        postulado_title_new: "El método científico es la herramienta más poderosa para distinguir lo que funciona de lo que creemos que funciona.",
        postulado_desc_new: "No protege ideas: las somete a prueba. No depende de creencias: depende de evidencia. Por eso es la base del conocimiento que realmente transforma.",

        // Whitepaper Conceptual (El Manifiesto)
        manifesto_label: "El Manifiesto",
        manifesto_title: "Entender no es suficiente.<br><span class=\"text-accent\">Debemos construir nuestro futuro.</span>",
        manifesto_p1: "✨ La ciencia permitió explicar el mundo. La ingeniería permitió transformarlo. La tecnología permitió escalar ese cambio. Sin embargo, la abundancia de información no ha resultado en una mejora proporcional en la comprensión ni en la capacidad de generar progreso.",
        manifesto_p2: "La comprensión sin aplicación no genera impacto. La acción sin comprensión genera error. Neosys Aeon propone integrar y mejorar ambos.",
        manifesto_p3: "No es un sistema de creencias. Es un sistema de entendimiento aplicado — los Principios Fundamentales del Cosmos — orientados a priorizar la verdad, validar mediante evidencia y transformar conocimiento en progreso tangible.",

        // 10 Principios Operativos
        mand_label: "Principios Operativos",
        mand_title: "<span class=\"text-magical-purple\">LOS 10 PRINCIPIOS FUNDAMENTALES DEL COSMOS.</span>",
        mand_desc: "Nuestra posición frente al universo es la base de nuestro comportamiento.",
        poster_download_btn: "Descargar Poster de Principios (v4.1) ✨",

        m1_title: "I. HONRARÁS LA VERDAD POR ENCIMA DE LA COMODIDAD.",
        m1_body: "Validarás toda afirmación mediante evidencia. El sesgo es inevitable; reconocerlo es el primer paso para minimizar su impacto.",
        m2_title: "II. CUESTIONARÁS LOS DOGMAS Y LAS AFIRMACIONES SIN EVIDENCIA.",
        m2_body: "No aceptarás una proposición como verdadera simplemente por la autoridad de quien la emite. La carga de la prueba recae en quien afirma.",
        m3_title: "III. PRIORIZARÁS EL MÉTODO CIENTÍFICO COMO HERRAMIENTA DE ENTENDIMIENTO.",
        m3_body: "Es el protocolo más fiable para separar lo que funciona de lo que creemos que funciona.",
        m4_title: "IV. RECONOCERÁS LA INCERTUMBRE COMO MOTOR DE PROGRESO.",
        m4_body: "No busques certezas absolutas; busca aproximaciones cada vez más precisas a la realidad.",
        m5_title: "V. VALORARÁS LA SIMPLICIDAD Y LA ELEGANCIA EN LAS SOLUCIONES.",
        m5_body: "No multipliques los entes sin necesidad. Entre dos explicaciones con el mismo poder predictivo, la más sencilla suele ser la correcta.",
        m6_title: "VI. BUSCARÁS LA APLICACIÓN PRÁCTICA DEL CONOCIMIENTO.",
        m6_body: "La teoría sin práctica es especulación; la práctica sin teoría es caos. El conocimiento debe traducirse en acción.",
        m7_title: "VII. ACTUARÁS CON RESPONSABILIDAD SISTÉMICA.",
        m7_body: "Entiende que tus acciones repercuten en el sistema. Minimiza el daño y optimiza el bienestar colectivo a largo plazo.",
        m8_title: "VIII. PROMOVERÁS LA DIVULGACIÓN Y EL ACCESO ABIERTO AL CONOCIMIENTO.",
        m8_body: "La información retenida pierde valor; el conocimiento distribuido se fortalece.",
        m9_title: "IX. ENTRENARÁS TU MENTE PARA BUSCAR LA REFUTACIÓN, NO LA VALIDACIÓN.",
        m9_body: "El sesgo de confirmación es el enemigo de la verdad. Busca pruebas que contradigan tus creencias.",
        m10_title: "X. INTEGRARÁS LA CIENCIA EN TU VIDA COTIDIANA.",
        m10_body: "No es una materia escolar; es una forma de estar en el mundo. Aplica el rigor científico a tus decisiones personales y profesionales.",

        // Nueva Sección: ¿POR QUÉ EXISTE?
        prob_label: "¿POR QUÉ EXISTE?",
        prob_title: "¿Por qué es necesario <br><span class=\"text-accent\">Neosys Aeon?</span>",
        prob1_title: "⚡ 1. Sustitución de evidencia por creencias",
        prob1_body: "Las ideas y juicios se forman con base en creencias, sin recurrir a evidencia verificable desde su origen.",
        prob2_title: "🔬 2. Ausencia de validación sistemática",
        prob2_body: "Las afirmaciones no se someten a procesos estructurados de comprobación, incluso después de ser formuladas.",
        prob3_title: "🔗 3. Ruptura entre conocimiento y aplicación",
        prob3_body: "El conocimiento no se traduce en acción efectiva ni en resultados medibles.",
        prob4_title: "📉 4. Desconexión entre conocimiento y valor",
        prob4_body: "El conocimiento validado no se integra en la toma de decisiones ni en la generación de valor.",

        // STEM Section
        stem_label: "CIENCIA, INGENIERÍA Y PROGRESO",
        stem_title: "De la curiosidad nace la ciencia.<br><span class='text-accent'>De la ciencia nace el progreso.</span>",
        stem_desc: "El método científico es la herramienta más poderosa creada por la humanidad. Pero el conocimiento por sí solo no genera impacto.",
        stem_s1_title: "Ciencia",
        stem_s1_body: "Genera conocimiento",
        stem_s2_title: "Ingeniería",
        stem_s2_body: "Transforma conocimiento",
        stem_s3_title: "Tecnología",
        stem_s3_body: "Aplica conocimiento",
        stem_s4_title: "Economía",
        stem_s4_body: "Escala valor generado",
        stem_p1: "Sin medición, no hay conocimiento.",
        stem_p2: "Sin experimentación, no hay progreso.",
        stem_p3: "Sin ingeniería, no hay aplicación.",
        stem_p4: "Sin escalabilidad, no hay impacto.",

        // Distinción y Alcance
        dist_label: "DISTINCIÓN Y ALCANCE",
        dist_title: "Qué es Neosys Aeon.<br><span class='text-accent'>Y qué no es.</span>",
        dist_is_header: "✨ Lo que ES",
        dist_is_1: "<strong>Abierto:</strong> no pertenece a ninguna entidad",
        dist_is_2: "<strong>No dogmático:</strong> sus principios pueden ser cuestionados",
        dist_is_3: "<strong>Basado en evidencia:</strong> prioriza validación empírica",
        dist_is_4: "<strong>Escalable:</strong> aplicable a nivel individual y colectivo",
        dist_is_5: "<strong>Voluntario:</strong> su adopción es libre",
        dist_is_6: "<strong>Orientado a resultados:</strong> su valor depende de su aplicación",
        dist_not_header: "✕ Lo que NO es",
        dist_not_1: "No es una <strong>religión</strong> — no requiere fe ni propone entidades sobrenaturales",
        dist_not_2: "No es un <strong>sistema de creencias</strong> — no exige aceptación sin validación",
        dist_not_3: "No es una <strong>organización</strong> — no tiene jerarquías ni liderazgo central",
        dist_not_4: "No es un <strong>producto</strong> — no tiene fines comerciales ni barreras de acceso",
        dist_not_5: "No <strong>reemplaza</strong> la ciencia — funciona como marco integrador para interpretarla y aplicarla",
        dist_quote: "La evidencia no solo explica el mundo. Permite transformarlo. El conocimiento que no construye futuro es incompleto.",

        // Whitepaper
        wp_label: "DOCUMENTO FUNDACIONAL",
        wp_title: "Whitepaper Neosys Aeon ✨",
        wp_desc: "Un marco abierto para entender la realidad a través de evidencia verificable.",
        wp_btn: "Descargar Whitepaper PDF",

        // Divulgación
        out_label: "DIVULGACIÓN",
        out_title: "Acércate a la Ciencia",
        out_desc: "Haz clic para conocer Series, Libros y Canales de YouTube que promueven activamente la ciencia y el método científico.",
        out_btn_explore: "Explorar Recursos →",

        // JovenesSTEM Link
        con_label: "DE LA FILOSOFÍA A LA ACCIÓN",
        con_title: "Neosys Aeon da el <em>por qué</em>.<br><span class='text-accent'>JovenesSTEM da el cómo.</span>",
        con_p1: "Neosys Aeon da el por qué.",
        con_p2: "JovenesSTEM da el cómo.",
        con_btn: "🚀 Conoce JovenesSTEM",
        con_node1: "Marco filosófico",
        con_node2: "Programa aplicado",
        con_node3: "Currículo STEM",

        // Comunidad & Footer
        comm_label: "Directorio Abierto",
        comm_tab_directory: "Directorio",
        comm_tab_map: "Mapa",
        comm_join_btn: "✨ Unirse al Movimiento",
        coll_title: "¿Te gustaría colaborar o mejorar esta iniciativa?",
        coll_desc: "Envíanos tus comentarios, ideas o escribe directo para unirte al esfuerzo de promover el pensamiento basado en evidencia.",
        coll_whatsapp: "💬 WhatsApp",
        coll_yepzhi: "🌐 yepzhi.com",
        footer_creator: "✨ Created by yepzhi",
        footer_quote: "Neosys Aeon es un marco abierto para alinear el pensamiento con la realidad mediante evidencia.<br><br>No es una autoridad. No es una doctrina cerrada. No es una estructura de poder.<br><br><strong>Es un sistema.</strong><br><br>Su valor depende de su aplicación.",
        footer_copy: "Marco Abierto. Sin Dueños. Sin Barreras."
    },
    en: {
        // ... (English logic follows the same verbatim pattern)
        wp_link: "neosysaeon-whitepaper-v4.1-EN.pdf",
        hero_tagline: "Without science there is no clarity. Without validation there is no progress.",
        hero_subtitle: "An open framework to understand reality through verifiable evidence.",
        hero_btn_whitepaper: "Read Whitepaper"
    },
    cn: {
        // ... (Chinese logic follows the same verbatim pattern)
        wp_link: "neosysaeon-whitepaper-v4.1-ZH.pdf",
        hero_tagline: "新系永恆是一個通過科學方法生成、驗證和應用知識的開放框架。",
        hero_subtitle: "一個透過可驗證證據理解現實的開放框架。"
    }
};

function applyLanguage(lang) {
    const t = translations[lang] || translations.es;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = t[key];
            } else {
                el.innerHTML = t[key];
            }
        }
    });
    const wpDownload = document.getElementById('whitepaper-download');
    if (wpDownload) wpDownload.href = t.wp_link;
    localStorage.setItem('neosys_lang', lang);
}

function setLanguage(lang) {
    location.reload();
    localStorage.setItem('neosys_lang', lang);
}

document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
});
