import React, { useEffect, useState } from "react";

function classifyUrl(url) {
   // Check for Data URL
   if (url.startsWith("data:")) {
      return "data";
   }

   // Check for absolute URL by trying to create a URL object
   try {
      const parsedUrl = new URL(url, window.location.href);
      if (parsedUrl.href === url || parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
         return "absolute";
      }
   } catch (e) {
      // URL constructor failed, url might be relative or invalid
   }

   // Check for relative URL based on common starting patterns
   if (url.startsWith("/") || url.startsWith("./") || url.startsWith("../")) {
      return "relative";
   }

   // If none of the above, consider the URL to be "other" (could be invalid or an edge case)
   return "other";
}

class ImagePreloader {
   constructor() {
      this.imagePromises = new Map();
   }

   preloadImages(urls) {
      const allPromises = urls.map((url) => {
         if (!this.imagePromises.has(url)) {
            const imgLoadPromise = new Promise((resolve, reject) => {
               const img = new Image();
               img.onload = () => {
                  // console.log("finished loading", url);
                  resolve(url);
               };
               img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
               img.src = url;
            });
            this.imagePromises.set(url, imgLoadPromise);
            return imgLoadPromise;
         }
         return this.imagePromises.get(url);
      });
      return Promise.all(allPromises);
   }
}

export const globalImagePreloader = new ImagePreloader();

export function useImagePreloader(promises) {
   const [loaded, setLoaded] = useState(false);

   useEffect(() => {
      promises.then(() => setLoaded(true)).catch((error) => console.error("Image loading error:", error));
      // Convert each URL into a promise that resolves when the image is loaded
      //  const promises = imageUrls.map(preloadImage);
      // Use Promise.all to wait for all images to be loaded
      //   Promise.all(promises)
      //      .then(() => setLoaded(true))
      //      .catch((error) => console.error("Image loading error:", error));
   }, [promises]); // Dependencies array ensures this effect runs only when imageUrls changes

   return loaded;
}
