document.addEventListener("DOMContentLoaded", () => {
    const mobileNavBreakpoint = 1180;
    const schoolLatitude = "9.349510272715147";
    const schoolLongitude = "-0.8015474556775141";
    const schoolCoordinates = `${schoolLatitude}, ${schoolLongitude}`;
    const schoolLocationText = "Tamale, Northern Region, Ghana";
    const mapQueryUrl = `https://www.google.com/maps?q=${schoolLatitude},${schoolLongitude}`;
    const mapEmbedUrl = `${mapQueryUrl}&z=16&output=embed`;
    const aboutPageNames = new Set(["history.html", "vision.html", "principal.html", "administration.html"]);

    if (window.top !== window.self) {
        try {
            window.top.location = window.self.location.href;
        } catch (error) {
            window.self.location.replace("about:blank");
        }
        return;
    }

    const header = document.querySelector(".header");
    const navMenu = document.querySelector(".nav-menu");
    const mobileMenuButton = document.querySelector(".mobile-menu");
    const dropdowns = document.querySelectorAll(".dropdown");
    const yearNodes = document.querySelectorAll("[data-current-year]");
    const hashIdPattern = /^[A-Za-z][A-Za-z0-9:_-]*$/;
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    const sanitizeSingleLine = (value) => value
        .replace(/[\u0000-\u001F\u007F]/g, "")
        .replace(/[<>`]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const sanitizeMultiLine = (value) => value
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
        .replace(/[<>`]/g, "")
        .replace(/\r\n?/g, "\n")
        .replace(/[ \t]+\n/g, "\n")
        .trim();

    const sanitizePhone = (value) => value
        .replace(/[^0-9+() -]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const sanitizeFieldValue = (field) => {
        if (field instanceof HTMLTextAreaElement) {
            return sanitizeMultiLine(field.value);
        }

        if (!(field instanceof HTMLInputElement)) {
            return "";
        }

        switch (field.type) {
            case "email":
                return sanitizeSingleLine(field.value).toLowerCase();
            case "tel":
                return sanitizePhone(field.value);
            default:
                return sanitizeSingleLine(field.value);
        }
    };

    const resolveHashTarget = (href) => {
        try {
            const rawId = decodeURIComponent(href.slice(1));
            if (!hashIdPattern.test(rawId)) {
                return null;
            }

            return document.getElementById(rawId);
        } catch (error) {
            return null;
        }
    };

    const createElement = (tagName, options = {}) => {
        const element = document.createElement(tagName);

        if (options.className) {
            element.className = options.className;
        }

        if (options.text) {
            element.textContent = options.text;
        }

        if (options.attributes) {
            Object.entries(options.attributes).forEach(([name, value]) => {
                element.setAttribute(name, value);
            });
        }

        return element;
    };

    const appendIconText = (parent, iconClass, text) => {
        const icon = createElement("i", { className: iconClass });
        const label = createElement("span", { text });
        parent.append(icon, label);
    };

    const createMapFrame = (title) => {
        const frame = createElement("div", { className: "map-frame" });
        const badge = createElement("div", { className: "map-pin-badge" });
        appendIconText(badge, "fas fa-location-dot", "Pinned School Location");

        const iframe = createElement("iframe", {
            attributes: {
                src: mapEmbedUrl,
                title,
                loading: "lazy",
                allowfullscreen: "",
                referrerpolicy: "no-referrer-when-downgrade"
            }
        });

        frame.append(badge, iframe);
        return frame;
    };

    const createMapLink = (labelText, extraClass = "text-link") => {
        const link = createElement("a", {
            className: extraClass,
            attributes: {
                href: mapQueryUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                referrerpolicy: "no-referrer"
            }
        });

        const label = createElement("span", { text: labelText });
        const icon = createElement("i", { className: "fas fa-arrow-up-right-from-square" });
        link.append(label, icon);
        return link;
    };

    const injectFooterMap = () => {
        const footerAbout = document.querySelector(".footer-about");
        if (!footerAbout || footerAbout.querySelector(".footer-map-card")) {
            return;
        }

        const mapCard = createElement("div", { className: "footer-map-card" });
        const meta = createElement("div", { className: "footer-map-meta" });
        const title = createElement("h4", { text: "Find The Campus" });
        const location = createElement("p", { text: schoolLocationText });
        const coordinates = createElement("p", { text: `Coordinates: ${schoolCoordinates}` });

        meta.append(title, location, coordinates, createMapLink("Open in Google Maps"));
        mapCard.append(createMapFrame("Google Map showing Nuriya Islamic Senior High School"), meta);
        footerAbout.append(mapCard);
    };

    const injectAboutLocationSection = () => {
        if (!aboutPageNames.has(currentPage)) {
            return;
        }

        const main = document.querySelector("main");
        if (!main || main.querySelector(".location-section")) {
            return;
        }

        const section = createElement("section", { className: "content-section location-section" });
        const container = createElement("div", { className: "container" });
        const showcase = createElement("div", { className: "location-showcase" });
        const copy = createElement("div", { className: "location-copy" });
        const pill = createElement("span", { className: "pill", text: "Visit The Campus" });
        const header = createElement("div", { className: "section-header" });
        const title = createElement("h2", { text: "Use the pinned school location to plan your visit" });
        const body = createElement("p", {
            text: "Families, visitors, and prospective students can use this map preview to locate Nuriya Islamic Senior High School quickly before travelling to campus."
        });
        const band = createElement("div", { className: "info-band" });

        const locationPill = createElement("span", { className: "info-pill" });
        appendIconText(locationPill, "fas fa-location-dot", schoolLocationText);

        const coordinatesPill = createElement("span", { className: "info-pill" });
        appendIconText(coordinatesPill, "fas fa-crosshairs", schoolCoordinates);

        const mapsPill = createElement("a", {
            className: "info-pill",
            attributes: {
                href: mapQueryUrl,
                target: "_blank",
                rel: "noopener noreferrer",
                referrerpolicy: "no-referrer"
            }
        });
        appendIconText(mapsPill, "fas fa-map", "Open in Google Maps");

        header.append(title, body);
        band.append(locationPill, coordinatesPill, mapsPill);
        copy.append(pill, header, band);

        const mapCard = createElement("div", { className: "map-card" });
        const mapCardCopy = createElement("div", { className: "map-card-copy" });
        const mapTitle = createElement("h3", { text: "Nuriya Islamic Senior High School" });
        const mapCopy = createElement("p", {
            text: "The map is pinned to the coordinates you provided so the location preview and directions stay consistent across the site."
        });

        mapCardCopy.append(mapTitle, mapCopy, createMapLink("Launch full directions"));
        mapCard.append(createMapFrame("Pinned map preview for Nuriya Islamic Senior High School"), mapCardCopy);

        showcase.append(copy, mapCard);
        container.append(showcase);
        section.append(container);

        const compactSection = main.querySelector(".content-section.compact");
        if (compactSection) {
            main.insertBefore(section, compactSection);
        } else {
            main.append(section);
        }
    };

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
            const target = resolveHashTarget(href);
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
        const successMessage = sanitizeSingleLine(form.getAttribute("data-success-message") || "");
        const fields = Array.from(form.elements).filter((element) => element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement);

        fields.forEach((field) => {
            field.addEventListener("input", () => {
                if (status) {
                    status.textContent = "";
                }
            });

            field.addEventListener("blur", () => {
                field.value = sanitizeFieldValue(field);
            });
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();

            fields.forEach((field) => {
                field.value = sanitizeFieldValue(field);
            });

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            form.reset();
            if (status) {
                status.textContent = successMessage;
            }
        });
    });

    injectFooterMap();
    injectAboutLocationSection();

    window.addEventListener("scroll", () => {
        if (!header) {
            return;
        }

        header.classList.toggle("scrolled", window.scrollY > 16);
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > mobileNavBreakpoint) {
            closeNavigation();
        }
    });

    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 16);
    }

    yearNodes.forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });
});
