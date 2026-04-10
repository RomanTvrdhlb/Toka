import vars from "../_vars.js";
import {
    elementHeight, addCustomClass, removeCustomClass
} from "../functions/customFunctions.js";

const {header} = vars;

const delay = 0;
let lastScroll = 0;
const defaultOffset = 20;

if (header) {
    function stickyHeaderFunction(breakpoint) {
        let containerWidth = document.documentElement.clientWidth;
        if (containerWidth > `${breakpoint}`) {
            const scrollPosition = () =>
                window.pageYOffset || document.documentElement.scrollTop;
            const containHide = () => header.classList.contains("sticky");

            window.addEventListener("scroll", () => {
                if (
                    scrollPosition() > lastScroll &&
                    !containHide() &&
                    scrollPosition() > defaultOffset
                ) {
                    addCustomClass(header, "sticky");
                } else if (scrollPosition() < defaultOffset) {
                    removeCustomClass(header, "sticky");
                }

                lastScroll = scrollPosition();
            });
        }
    }

    stickyHeaderFunction(320);
    elementHeight(header, "header-height");

    setTimeout(() => {
        const headerBox = document.querySelector('.header__box');
        const mobile = document.querySelector('.mobile');

        if (headerBox) headerBox.style.backdropFilter = 'blur(1.25rem)';
        if (mobile) mobile.style.backdropFilter = 'blur(2.5rem)';
    }, delay);

}