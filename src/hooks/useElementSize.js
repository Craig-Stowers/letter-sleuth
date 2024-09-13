import { useState, useEffect, useRef } from "react";

// Custom hook to track the content width of an element only on window resize
function useElementSize(ref, initWidth = 0, initHeight = 0) {
    // State to store the element's content width
    const [size, setSize] = useState({ width: initWidth, height: initHeight });

    //console.log("useeELementWidth", width);

    useEffect(() => {
        const timers = [];
        // Function to update the element's width
        const updateWidth = () => {
            if (ref) {
                const computedStyle = window.getComputedStyle(ref);
                const paddingLeft = parseFloat(computedStyle.paddingLeft);
                const paddingRight = parseFloat(computedStyle.paddingRight);
                const paddingTop = parseFloat(computedStyle.paddingTop);
                const paddingBottom = parseFloat(computedStyle.paddingBottom);
                const contentWidth =
                    ref.clientWidth - paddingLeft - paddingRight;
                const contentHeight =
                    ref.clientHeight - paddingTop - paddingBottom;
                setSize({
                    width: contentWidth,
                    height: contentHeight,
                });
            }
        };

        // Update width once after the component mounts

        // Function to handle resize event
        const handleResize = () => {
            for (let i = 0; i < 6; i++) {
                timers.push(
                    setTimeout(() => {
                        updateWidth();
                    }, i * 250)
                );
            }
        };

        handleResize();

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Cleanup function to remove the event listener
        return () => {
            for (let timer of timers) {
                clearTimeout(timer);
            }

            window.removeEventListener("resize", handleResize);
        };
    }, [ref]); // Empty dependency array ensures this runs once on mount

    // Return the content width and the ref to be attached to the element
    return [size];
}

export default useElementSize;
