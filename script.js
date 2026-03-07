document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".header");
    const navMenu = document.querySelector(".nav-menu");
    const mobileMenuButton = document.querySelector(".mobile-menu");
    const dropdowns = document.querySelectorAll(".dropdown");
    const yearNodes = document.querySelectorAll("[data-current-year]");

    const setExpanded = (element, isExpanded) => {
        if (element) {
            element.setAttribute("aria-expanded", String(isExpanded));
        }
    };

    const closeDropdowns = () => {
        dropdowns.forEach((dropdown) => {
            dropdown.classList.remove("open");
            setExpanded(dropdown.querySelector(".nav-trigger"), false);
        });
    };

    const closeNavigation = () => {
        navMenu?.classList.remove("open");
        setExpanded(mobileMenuButton, false);
        closeDropdowns();
    };

    mobileMenuButton?.addEventListener("click", () => {
        const isOpen = navMenu?.classList.toggle("open");
        setExpanded(mobileMenuButton, Boolean(isOpen));
        if (!isOpen) {
            closeDropdowns();
        }
    });

    dropdowns.forEach((dropdown) => {
        const trigger = dropdown.querySelector(".nav-trigger");
        trigger?.addEventListener("click", (event) => {
            event.preventDefault();
            const shouldOpen = !dropdown.classList.contains("open");
            closeDropdowns();
            if (shouldOpen) {
                dropdown.classList.add("open");
            }
            setExpanded(trigger, shouldOpen);
        });
    });

    document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) {
            return;
        }

        if (!target.closest(".dropdown")) {
            closeDropdowns();
        }

        if (!target.closest(".header")) {
            closeNavigation();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        const href = anchor.getAttribute("href");
        if (!href || href.length <= 1) {
            return;
        }

        anchor.addEventListener("click", (event) => {
            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            closeNavigation();
        });
    });

    document.querySelectorAll("[data-gallery-section]").forEach((section) => {
        const button = section.querySelector("[data-gallery-toggle]");
        const extraItems = section.querySelectorAll("[data-gallery-extra]");

        if (!button || !extraItems.length) {
            return;
        }

        button.addEventListener("click", () => {
            const isExpanded = button.getAttribute("aria-expanded") === "true";
            const nextExpanded = !isExpanded;

            extraItems.forEach((item) => {
                item.hidden = !nextExpanded;
            });

            button.setAttribute("aria-expanded", String(nextExpanded));
            button.textContent = nextExpanded
                ? (button.getAttribute("data-less-label") || "Show less")
                : (button.getAttribute("data-more-label") || "See more");
        });
    });

    document.querySelectorAll("form[data-success-message]").forEach((form) => {
        const status = form.parentElement?.querySelector("[data-form-status]");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            form.reset();
            if (status) {
                status.textContent = form.getAttribute("data-success-message") || "";
            }
        });
    });

    window.addEventListener("scroll", () => {
        if (!header) {
            return;
        }
        header.style.boxShadow = window.scrollY > 16
            ? "0 14px 30px rgba(18, 57, 91, 0.12)"
            : "0 10px 30px rgba(18, 57, 91, 0.08)";
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 880) {
            closeNavigation();
        }
    });

    yearNodes.forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });
});
