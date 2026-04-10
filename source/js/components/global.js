document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.seoblock-btn');
    const btnBox = document.querySelector('.seoblock-section__bottom');
    const box = document.querySelector('.seoblock-section__box');
    const textEl = btn?.querySelector('[data-text]');

    if (!btn || !box || !btnBox) return;

    const originalText = textEl.textContent.trim();
    const activeText = textEl.dataset.text;

    btn.addEventListener('click', function () {
        const isActive = btn.classList.toggle('active');
        btnBox.classList.toggle('active');

        if (isActive) {
            // 👉 открытие
            box.style.maxHeight = box.scrollHeight + 'px';
            box.classList.add('active');

            if (activeText) {
                textEl.textContent = activeText;
            }
        } else {
            // 👉 закрытие (важно!)
            textEl.textContent = originalText;
            box.style.maxHeight = box.scrollHeight + 'px'; // фиксируем текущую высоту
            requestAnimationFrame(() => {
                box.style.maxHeight = '584px';
                box.classList.remove('active');
            });
        }
    });
});