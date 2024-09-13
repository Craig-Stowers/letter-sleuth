const screenAdjustTimers = [];

const setInnerHeightCSSVariable = (breakpoints = {}) => {
    let delayTimer = null;
    function adjustHeight() {
        const orientation =
            window.screen &&
            window.screen.orientation &&
            window.screen.orientation.type;

        const rotateDimensions = false; //orientation.includes("landscape");

        console.log("indow.visualViewport", window.visualViewport);
        const height = window.visualViewport
            ? window.visualViewport.height
            : window.innerHeight;
        const width = window.visualViewport
            ? window.visualViewport.width
            : window.innerWidth;

        const scale = window.visualViewport ? window.visualViewport.scale : 1;

        console.log("screen height", window.screen.height, height);

        const doc = document.documentElement;
        var vh = height * scale * 0.01;
        document.documentElement.style.setProperty("--ivh", `${vh}px`);

        console.log("vh", vh);

        Object.values(breakpoints).forEach((className) => {
            doc.classList.remove(className);
        });
        for (const [breakpoint, className] of Object.entries(breakpoints)) {
            if (height < breakpoint) {
                doc.classList.add(className);
                break;
            }
        }
    }

    const onScreenChange = () => {
        if (delayTimer) clearTimeout(delayTimer);
        adjustHeight();

        for (let timer of screenAdjustTimers) {
            clearTimeout(timer);
        }

        for (let i = 6; i > 0; i--) {
            screenAdjustTimers.push(
                setTimeout(() => {
                    adjustHeight();
                }, i * 250)
            );
        }
    };
    // Listen for resize events
    window.addEventListener("resize", onScreenChange);
    window.addEventListener("orientationchange", onScreenChange);
    if (window.visualViewport) {
        // window.visualViewport.addEventListener("resize", onScreenChange);
        // window.visualViewport.addEventListener("scroll", onScreenChange); // Handle zooming effect during scroll
    }

    onScreenChange();
};

export { setInnerHeightCSSVariable };
