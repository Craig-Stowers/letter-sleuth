import { useState, useEffect } from "react";

function useScreenSize() {
    const [screenSize, setScreenSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        // Add event listener to track window resize
        window.addEventListener("resize", handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return screenSize;
}

export default useScreenSize;
