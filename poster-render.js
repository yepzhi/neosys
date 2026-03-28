/**
 * NEOSYS AEON — Principles of the Cosmos HD Poster Engine v1.0.0
 * Renders a high-definition A4 @ 300DPI (3508x4961px) poster.
 */

window.NeosysPoster = (function() {
    const CANVAS_WIDTH = 3508;
    const CANVAS_HEIGHT = 4961;

    async function generate(lang = 'en') {
        const canvas = document.createElement('canvas');
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        const ctx = canvas.getContext('2d');
        const t = (typeof translations !== 'undefined') ? (translations[lang] || translations.en) : {};
        const version = 'v5.1.7';

        // Wait for fonts to be ready
        await document.fonts.ready;

        // 1. Background (Deep Cosmic Gradient)
        const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
        bg.addColorStop(0, '#050510');
        bg.addColorStop(0.5, '#0a0a1a');
        bg.addColorStop(1, '#050510');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Nebula Glows
        const glows = [
            { x: 500, y: 800, r: 1500, c: 'rgba(167, 139, 250, 0.08)' },
            { x: 3000, y: 4000, r: 2000, c: 'rgba(125, 211, 252, 0.05)' },
            { x: 1750, y: 2500, r: 1800, c: 'rgba(251, 191, 36, 0.03)' }
        ];
        glows.forEach(g => {
            const rad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r);
            rad.addColorStop(0, g.c);
            rad.addColorStop(1, 'transparent');
            ctx.fillStyle = rad;
            ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        });

        // 3. Subtle Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 2;
        for (let x = 0; x <= CANVAS_WIDTH; x += 300) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_HEIGHT); ctx.stroke();
        }
        for (let y = 0; y <= CANVAS_HEIGHT; y += 300) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_WIDTH, y); ctx.stroke();
        }

        // 4. Header Section
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Sparkle ✨
        ctx.fillStyle = '#ffef33';
        ctx.font = '240px serif';
        ctx.fillText('✨', CANVAS_WIDTH / 2, 350);

        // Title: NEOSYS AEON (Large & Central)
        ctx.font = '900 280px Inter, sans-serif'; 
        ctx.letterSpacing = '-12px'; // Matched to Hero -0.04em (280 * -0.04 ≈ -11)
        
        const titleGrad = ctx.createLinearGradient(0, 500, 0, 800);
        titleGrad.addColorStop(0, '#ffffff');
        titleGrad.addColorStop(1, 'rgba(255, 255, 255, 0.6)');
        ctx.fillStyle = titleGrad;
        
        ctx.fillText('NEOSYS AEON', CANVAS_WIDTH / 2, 650);

        // Tagline: Below the main title (Split into two lines)
        ctx.fillStyle = '#a78bfa';
        ctx.font = '600 80px Inter, sans-serif';
        ctx.letterSpacing = '6px';
        
        const line1 = "Without science there is no clarity.";
        const line2 = "Without validation there is no progress.";
        
        ctx.fillText(line1.toUpperCase(), CANVAS_WIDTH / 2, 820);
        ctx.fillText(line2.toUpperCase(), CANVAS_WIDTH / 2, 920);

        // Divider
        const gradLine = ctx.createLinearGradient(CANVAS_WIDTH/2 - 900, 0, CANVAS_WIDTH/2 + 900, 0);
        gradLine.addColorStop(0, 'transparent');
        gradLine.addColorStop(0.5, 'rgba(167, 139, 250, 0.6)');
        gradLine.addColorStop(1, 'transparent');
        ctx.fillStyle = gradLine;
        ctx.fillRect(CANVAS_WIDTH/2 - 900, 1050, 1800, 5);

        // 5. The 10 Principles (Two Columns)
        const startY = 1350;
        const spacingY = 660; // Extra breathing room
        const col1X = 580;
        const col2X = 1980;
        const colMaxWidth = 1000;
        const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

        function wrapText(text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            let currentY = y;
            for (let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    ctx.fillText(line, x, currentY);
                    line = words[n] + ' ';
                    currentY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            ctx.fillText(line, x, currentY);
            return currentY;
        }

        for (let i = 1; i <= 10; i++) {
            const isSecondCol = i > 5;
            const rowIndex = isSecondCol ? (i - 6) : (i - 1);
            const currentX = isSecondCol ? col2X : col1X;
            const currentY = startY + rowIndex * spacingY;
            
            // Handle multi-line titles by splitting by \n
            const titleLines = (t[`m${i}_title`] || '').toUpperCase().split('\n');
            const body = (t[`m${i}_body`] || '');

            // Roman Numeral (Large Subtle Background)
            ctx.fillStyle = 'rgba(167, 139, 250, 0.08)';
            ctx.font = '800 380px Outfit, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(romanNumerals[i-1], currentX - 250, currentY + 120);

            // Principle Title (Wrapped if \n present)
            ctx.textAlign = 'left';
            ctx.fillStyle = '#ffffff';
            ctx.font = '800 82px Outfit, sans-serif'; // Slightly smaller for fit
            let titleY = currentY;
            titleLines.forEach((line, idx) => {
                ctx.fillText(line, currentX, titleY + (idx * 90));
            });

            // Principle Body (Wrapped)
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.font = '400 54px Outfit, sans-serif';
            const bodyStartY = titleY + (titleLines.length * 90) + 15;
            wrapText(body, currentX, bodyStartY, colMaxWidth, 70);
        }

        // 6. Footer Section
        const footerY = CANVAS_HEIGHT - 350;
        
        // Symbol & Domain
        ctx.textAlign = 'center';
        ctx.fillStyle = '#a78bfa';
        ctx.font = '700 90px Outfit, sans-serif';
        ctx.fillText('#ThinkWithEvidence  #NeosysAeon', CANVAS_WIDTH / 2, footerY);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '500 50px Outfit, sans-serif';
        ctx.fillText('OPEN CONCEPTUAL FRAMEWORK — YEPZHI.COM/NEOSYS', CANVAS_WIDTH / 2, footerY + 120);

        // Version & Date
        ctx.font = '500 40px monospace';
        ctx.fillText(`${version} — MARCH 2026`, CANVAS_WIDTH / 2, footerY + 220);

        return canvas.toDataURL('image/png');
    }

    async function download(lang = 'en') {
        const dataUrl = await generate(lang);
        const link = document.createElement('a');
        link.download = `Neosys-Aeon-Poster-10-Principles-${lang.toUpperCase()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return { generate, download };
})();
