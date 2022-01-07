function initModal() {
    // https://bulma.io/documentation/components/modal/

    // Functions to open and close a modal
    function openModal(el: Element) {
        el.classList.add("is-active");
    }

    function closeModal(el: Element) {
        el.classList.remove("is-active");
    }

    function closeAllModals() {
        (document.querySelectorAll(".modal") || []).forEach((modal) => {
            closeModal(modal);
        });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll(".js-modal-trigger") || [])
        .forEach((trigger_) => {
            const trigger = trigger_ as HTMLElement;
            const modal = trigger.dataset.target!;
            const target = document.getElementById(modal)!;
            trigger.addEventListener("click", () => {
                openModal(target);
            });
        });

    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll(".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button") || [])
        .forEach((close) => {
            const target = close.closest(".modal")!;
            close.addEventListener("click", () => {
                closeModal(target);
            });
        });

    // Add a keyboard event to close all modals
    document.addEventListener("keydown", (event) => {
        const e = event || window.event;
        if (e.key === "Escape") {
            closeAllModals();
        }
    });
}

function initNavbar() {
    // https://bulma.io/documentation/components/navbar/

    // Get all "navbar-burger" elements
    const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll(".navbar-burger"), 0);

    // Check if there are any navbar burgers
    if (navbarBurgers.length > 0) {

        // Add a click event on each of them
        navbarBurgers.forEach(el => {
            el.addEventListener("click", () => {

                // Get the target from the "data-target" attribute
                const target = document.getElementById(el.dataset.target)!;

                // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
                el.classList.toggle("is-active");
                target.classList.toggle("is-active");

            });
        });
    }
}

export function initFramework() {
    initModal();
    initNavbar();
}
