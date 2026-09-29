const themeToggle = document.querySelector("#theme-toggle");

const root = document.documentElement;

let isAnimating = false;


function getThemeRadius(x, y) {
    const distances = [
        Math.hypot(x, y),
        Math.hypot(window.innerWidth - x, y),
        Math.hypot(x, window.innerHeight - y),
        Math.hypot(
            window.innerWidth - x,
            window.innerHeight - y
        )
    ];

    return Math.max(...distances);
}


function updateThemeButton() {
    const isDark = root.classList.contains("dark");

    themeToggle.setAttribute(
        "aria-pressed",
        String(isDark)
    );

    themeToggle.setAttribute(
        "aria-label",
        isDark
            ? "فعال کردن حالت روشن"
            : "فعال کردن حالت تاریک"
    );
}


function applyTheme(theme) {
    const isDark = theme === "dark";

    root.classList.toggle(
        "dark",
        isDark
    );

    localStorage.setItem(
        "theme",
        theme
    );

    updateThemeButton();
}


function toggleTheme() {
    if (isAnimating) {
        return;
    }

    const isDark = root.classList.contains("dark");

    const nextTheme = isDark
        ? "light"
        : "dark";


    /* Reduced motion / unsupported browser */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        !document.startViewTransition ||
        reducedMotion
    ) {
        applyTheme(nextTheme);
        return;
    }


    /* Button position */

    const buttonRect =
        themeToggle.getBoundingClientRect();

    const x =
        buttonRect.left +
        buttonRect.width / 2;

    const y =
        buttonRect.top +
        buttonRect.height / 2;


    /* Circle size */

    const radius =
        getThemeRadius(x, y);


    isAnimating = true;


    /* Create page transition */

    const transition =
        document.startViewTransition(() => {
            applyTheme(nextTheme);
        });


    /* Circular reveal */

    transition.ready.then(() => {

        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${radius}px at ${x}px ${y}px)`
                ]
            },
            {
                duration: 500,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                fill: "both",
                pseudoElement:
                    "::view-transition-new(root)"
            }
        );

    });


    /* Unlock button */

    transition.finished.then(
        () => {
            isAnimating = false;
        },
        () => {
            isAnimating = false;
        }
    );
}


themeToggle.addEventListener(
    "click",
    toggleTheme
);


updateThemeButton();