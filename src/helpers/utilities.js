const setInnerHeightCSSVariable = (breakpoints = {}) => {
   function adjustHeight() {
      const height = window.innerHeight;
      const doc = document.documentElement;
      var vh = height * 0.01;
      document.documentElement.style.setProperty("--ivh", `${vh}px`);

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
   // Listen for resize events
   window.addEventListener("resize", adjustHeight);
   window.addEventListener("orientationchange", adjustHeight);
   adjustHeight();
};

export { setInnerHeightCSSVariable };
