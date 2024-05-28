const setInnerHeightCSSVariable = (breakpoints = {}) => {
   let delayTimer = null;
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
      console.log("re-calc heights");
   }

   const onScreenChange = () => {
      if (delayTimer) clearTimeout(delayTimer);
      adjustHeight();
      delayTimer = setTimeout(() => {
         adjustHeight();
         clearTimeout(delayTimer);
         delayTimer = null;
      }, 1200);
   };
   // Listen for resize events
   window.addEventListener("resize", onScreenChange);
   window.addEventListener("orientationchange", onScreenChange);
   onScreenChange();
};

export { setInnerHeightCSSVariable };
