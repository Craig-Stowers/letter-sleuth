const setInnerHeightCSSVariable = () => {
   function adjustHeight() {
      var vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--ivh", `${vh}px`);
   }
   // Listen for resize events
   window.addEventListener("resize", adjustHeight);
   window.addEventListener("orientationchange", adjustHeight);
   adjustHeight();
};

export { setInnerHeightCSSVariable };
