// ==UserScript==
// @name         CatWar Energy Percent (Overlay)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Процент энергии кота — оверлеем снизу, без влияния CSS CatWar
// @author       Ты
// @match        https://catwar.su/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let overlayLayer = null;

    function ensureOverlay() {
        if (overlayLayer) return overlayLayer;

        overlayLayer = document.createElement('div');
        overlayLayer.id = 'cw-energy-overlay';
        overlayLayer.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(overlayLayer);
        return overlayLayer;
    }

    function updateEnergyPercent() {
        const overlay = ensureOverlay();
        overlay.innerHTML = '';

        document.querySelectorAll('.catWithArrow').forEach(wrapper => {
            const arrow = wrapper.querySelector('.arrow');
            if (!arrow) return;

            const green = arrow.querySelector('.arrow_green');
            const red   = arrow.querySelector('.arrow_red');
            if (!green || !red) return;

            const totalWidth = green.offsetWidth + red.offsetWidth;
            const percent = totalWidth > 0
                ? Math.round((green.offsetWidth / totalWidth) * 100)
                : 0;

            const rect = wrapper.getBoundingClientRect();

            const el = document.createElement('div');
            el.textContent = percent + '%';

            el.style.cssText = `
                position: fixed;
                left: ${rect.left}px;
                top: ${rect.bottom - 20}px; /* ⬅️ низ + 4px вверх */
                width: ${rect.width}px;

                text-align: center;
                font-weight: bold;
                font-size: 13px;
                color: white;
                text-shadow: 0 0 3px black;
                pointer-events: none;
            `;

            overlay.appendChild(el);
        });
    }

    setInterval(updateEnergyPercent, 200);
})();
