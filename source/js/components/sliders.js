import Swiper from "swiper";

import { Navigation, Autoplay } from "swiper/modules";
import vars from "../_vars.js";

document.addEventListener("DOMContentLoaded", function () {
  const { teamSliders, infoSliders, gallerySliders, giftSliders } = vars;

  const chargingSlider = document.querySelector(".charging-slider");

  if (chargingSlider) {
    const nav = chargingSlider.closest(".charging-section")
        .querySelector(".charging-section__nav");

    const nextBtn = nav.querySelector(".next");
    const prevBtn = nav.querySelector(".prev");

    const slider = new Swiper(chargingSlider, {
      modules: [Navigation],
      slidesPerView: 'auto',
      spaceBetween: 16,
      speed: 600,
      watchSlidesProgress: true,
      loop: true,
      navigation: {
        nextEl: nextBtn,
        prevEl: prevBtn,
      },
    });

  }


  // gallerySliders.forEach(function (slider) {
  //   const container = slider.querySelector(".swiper-container");
  //   const nextBtn = slider.querySelector(".next");
  //   const prevBtn = slider.querySelector(".prev");
  //
  //   const mainSwiper = new Swiper(slider, {
  //     modules: [Navigation, Autoplay],
  //     spaceBetween: 10,
  //     slidesPerView: 1,
  //     loop: true,
  //     speed: 800,
  //     autoplay: {
  //       delay: 5000,
  //     },
  //     navigation: {
  //       nextEl: nextBtn,
  //       prevEl: prevBtn,
  //     },
  //   });
  // });
  //
  // teamSliders.forEach(function (slider) {
  //   const container = slider.querySelector(".swiper-container");
  //   const nextBtn = slider.querySelector(".next");
  //   const prevBtn = slider.querySelector(".prev");
  //
  //   const mainSwiper = new Swiper(slider, {
  //     modules: [Navigation],
  //     spaceBetween: 0,
  //     slidesPerView: 1,
  //     loop: true,
  //     speed: 800,
  //     navigation: {
  //       nextEl: nextBtn,
  //       prevEl: prevBtn,
  //     },
  //
  //     breakpoints: {
  //       320: {
  //         spaceBetween: 20,
  //       },
  //       768: {
  //         spaceBetween: 0,
  //       },
  //     },
  //   });
  // });
  //
  // giftSliders.forEach(function (slider) {
  //   const container = slider.querySelector(".swiper-container");
  //   const nextBtn = slider.querySelector(".next");
  //   const prevBtn = slider.querySelector(".prev");
  //
  //   const mainSwiper = new Swiper(slider, {
  //     modules: [Navigation],
  //     spaceBetween: 0,
  //     slidesPerView: 1,
  //     loop: true,
  //     speed: 800,
  //
  //     navigation: {
  //       nextEl: nextBtn,
  //       prevEl: prevBtn,
  //     }
  //   });
  // });
  //
  // infoSliders.forEach(function (slider) {
  //   const container = slider.querySelector(".swiper-container");
  //   const nextBtn = slider.querySelector(".next");
  //   const prevBtn = slider.querySelector(".prev");
  //
  //   const infoSwiper = new Swiper(slider, {
  //     modules: [Navigation],
  //     spaceBetween: 0,
  //     slidesPerView: 4,
  //     speed: 800,
  //
  //     navigation: {
  //       nextEl: nextBtn,
  //       prevEl: prevBtn,
  //     },
  //
  //     breakpoints: {
  //       320: {
  //         spaceBetween: 15,
  //         slidesPerView: "auto",
  //       },
  //       768: {
  //         slidesPerView: 3,
  //         spaceBetween: 0,
  //       },
  //       1024: {
  //         slidesPerView: 2,
  //       },
  //       1100: {
  //         slidesPerView: 3,
  //       },
  //       1350: {
  //         slidesPerView: 4,
  //         spaceBetween: 0,
  //       },
  //     },
  //     on: {
  //       init(swiper) {
  //         swiper.slides.forEach((slide, index) => {
  //           const pagination = slide.querySelector(".info-slider__pagination");
  //           if (pagination) {
  //             pagination.textContent = `${index + 1}–${swiper.slides.length}`;
  //           }
  //         });
  //       },
  //     },
  //   });
  // });
});
class HistorySlider {
  constructor() {
    this.currentSlide = 0;
    this.totalSlides = 0;
    this.isAnimating = false;

    this.init();
  }

  init() {
    // Элементы
    this.historyItems = document.querySelectorAll('.history-list__item');
    this.slideImages = document.querySelectorAll('.history-slide-image');
    this.slideContents = document.querySelectorAll('.history-section__wrapp');
    this.prevBtn = document.querySelector('.history-prev');
    this.nextBtn = document.querySelector('.history-next');
    this.historyList = document.querySelector('.history-list');

    this.totalSlides = this.historyItems.length;

    if (!this.totalSlides) return;

    this.setListMinWidth();
    this.addEventListeners();

    // первый запуск
    this.updateSlider(0);
    this.updateOpacity();
    this.scrollToActive();

    window.addEventListener('resize', () => {
      this.setListMinWidth();
    });
  }

  addEventListeners() {
    this.historyItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (!this.isAnimating && this.currentSlide !== index) {
          this.goToSlide(index);
        }
      });
    });

    this.prevBtn?.addEventListener('click', () => {
      if (!this.isAnimating) this.prevSlide();
    });

    this.nextBtn?.addEventListener('click', () => {
      if (!this.isAnimating) this.nextSlide();
    });

    document.addEventListener('keydown', (e) => {
      if (this.isAnimating) return;

      if (e.key === 'ArrowLeft') this.prevSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });
  }

  scrollToActive() {
    const activeItem = this.historyItems[this.currentSlide];
    if (!activeItem || !this.historyList) return;

    const listRect = this.historyList.getBoundingClientRect();
    const itemRect = activeItem.getBoundingClientRect();

    const styles = getComputedStyle(this.historyList);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;

    const offset = itemRect.left - listRect.left - paddingLeft;

    this.historyList.scrollBy({
      left: offset,
      behavior: 'smooth'
    });
  }

  // 🔥 opacity логика (с учетом конца)
  updateOpacity() {
    const isEnd =
        this.historyList.scrollLeft + this.historyList.clientWidth >=
        this.historyList.scrollWidth - 1;

    this.historyItems.forEach((item, index) => {
      if (index === this.currentSlide) {
        item.style.opacity = 1;
        return;
      }

      if (index > this.currentSlide) {
        const diff = index - this.currentSlide;
        item.style.opacity = Math.max(1 - diff * 0.2, 0.1);
        return;
      }

      if (index < this.currentSlide) {
        const diff = this.currentSlide - index;

        item.style.opacity = Math.max(1 - diff * 0.2, 0.1);
      }
    });
  }

  setListMinWidth() {
    if (!this.historyItems.length || !this.historyList) return;

    const styles = getComputedStyle(this.historyList);
    const gap = parseFloat(styles.columnGap || styles.gap || 0);

    let totalWidth = 0;

    this.historyItems.forEach(item => {
      totalWidth += item.offsetWidth;
    });

    totalWidth += gap * (this.historyItems.length - 1);

    this.historyList.parentNode.style.Width = `${totalWidth}px`;
  }

  goToSlide(index) {
    if (index < 0 || index >= this.totalSlides) return;

    this.isAnimating = true;

    this.removeActiveClasses();
    this.currentSlide = index;

    this.updateSlider(index);
    this.updateOpacity();
    this.scrollToActive();

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  prevSlide() {
    const index =
        this.currentSlide > 0
            ? this.currentSlide - 1
            : this.totalSlides - 1;

    this.goToSlide(index);
  }

  nextSlide() {
    const index =
        this.currentSlide < this.totalSlides - 1
            ? this.currentSlide + 1
            : 0;

    this.goToSlide(index);
  }

  removeActiveClasses() {
    this.historyItems.forEach(item => item.classList.remove('active'));
    this.slideImages.forEach(el => el.classList.remove('active'));
    this.slideContents.forEach(el => el.classList.remove('active'));

    this.historyItems.forEach(item => {
      const line = item.querySelector('.line');
      if (line) {
        line.classList.remove('active', 'active-current');
      }
    });
  }

  updateSlider(index) {
    this.historyItems[index]?.classList.add('active');
    this.slideImages[index]?.classList.add('active');
    this.slideContents[index]?.classList.add('active');

    this.updateLines(index);
    this.updateNavigationButtons();
  }

  updateLines(index) {
    this.historyItems.forEach((item, i) => {
      const line = item.querySelector('.line');
      if (!line) return;

      if (i < index) {
        line.classList.add('active');
        line.classList.remove('active-current');
      } else if (i === index) {
        line.classList.add('active-current');
        line.classList.remove('active');
      } else {
        line.classList.remove('active', 'active-current');
      }
    });
  }

  updateNavigationButtons() {
    if (this.prevBtn) {
      this.prevBtn.disabled = this.currentSlide === 0;
    }

    if (this.nextBtn) {
      this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    }
  }

  startAutoPlay(interval = 5000) {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, interval);
  }

  stopAutoPlay() {
    clearInterval(this.autoPlayInterval);
  }
}

// init
document.addEventListener('DOMContentLoaded', () => {
  new HistorySlider();
});