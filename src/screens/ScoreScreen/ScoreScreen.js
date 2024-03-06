import classes from "./ScoreScreen.module.css";
import React, { useState, useRef, useMemo, useEffect } from "react";
import useElementWidth from "../../hooks/useElementWidth";

import scoreboardImage from "../../assets/scoreboard-demo.png";
import useWidthsObserver from "../../hooks/useWidthsObserver";

import testImage1 from "../../assets/testimage1.png";
import testImage2 from "../../assets/testimage2.png";
import testImage3 from "../../assets/testimage3.png";
import testImage4 from "../../assets/testimage4.png";
import testImage5 from "../../assets/testimage5.png";
import testImage6 from "../../assets/testimage6.png";
import testImage7 from "../../assets/testimage7.png";
import testImage8 from "../../assets/testimage8.png";
import testImage9 from "../../assets/testimage9.png";

import { globalImagePreloader, useImagePreloader } from "../../helpers/ImageLoader";

const promises = globalImagePreloader.preloadImages([
   testImage1,
   testImage2,
   testImage3,
   testImage4,
   testImage5,
   testImage6,
   testImage7,
   testImage8,
   testImage9,
   scoreboardImage,
]);

promises.then(() => {
   console.log("images all loaded outside component");
});

function estimateLocalStorageSize(obj) {
   const serializedObject = JSON.stringify(obj);
   const sizeInBytes = new Blob([serializedObject]).size; // More accurate size calculation
   return sizeInBytes;
}

const ScoreScreen = ({ saveData, params, daysElapsed, stats }) => {
   const barRefs = useRef([]);
   const digitRefs = useRef([]);
   const [animate, setAnimate] = useState(false);
   const [barDigitClass, setBarDigitClass] = useState([]);
   const [revealDigit, setRevealDigit] = useState([]);

   const revealTimers = useRef([]);

   const isImagesLoaded = useImagePreloader(promises);

   console.log("images loaded in component", isImagesLoaded);

   useEffect(() => {
      return () => {
         revealTimers.current.forEach((timer) => {
            if (timer) clearTimeout(timer);
         });
      };
   }, []);

   useEffect(() => {
      const startTimer = setTimeout(() => {
         setAnimate(true);
      }, 500);
      return () => clearTimeout(startTimer);
   });

   const maxDistributionValue = Math.max(...Object.values(stats.distribution));

   const startRevealTimer = (index) => {
      if (!barRefs.current[index]) return;
      if (barDigitClass[index]) return;

      const width = barRefs.current[index].offsetWidth;
      const digitWidth = digitRefs.current[index].offsetWidth;

      setBarDigitClass((oldValue) => {
         const newValue = [...oldValue];
         newValue[index] = width - 12 > digitWidth ? "inside" : "outside";
         return newValue;
      });

      if (revealTimers[index]) clearTimeout(revealTimers[index]);
      revealTimers[index] = setTimeout(() => {
         setRevealDigit((oldValue) => {
            const newValue = [...oldValue];
            newValue[index] = true;
            return newValue;
         });
      }, 200);
   };

   const renderStatBox = (label, value) => {
      return (
         <div className={classes.statBox} key={"stat-box-" + label}>
            <div className={classes.value}>{value}</div>
            <div className={classes.label}>{label}</div>
         </div>
      );
   };

   const renderBar = (index, value) => {
      const percOfMax = animate ? (value / maxDistributionValue) * 100 : 0;
      const animationTime = percOfMax / 100;

      const digitClass = animate
         ? barDigitClass[index] === "inside"
            ? classes.rectangleValueInside
            : barDigitClass[index] === "outside" || value === 0
            ? classes.rectangleValueOutside
            : null
         : null;

      if (value === 0) {
         startRevealTimer(index);
      }

      const renderedPerc = Math.max(percOfMax, 0.8);

      const highlight = params.highlight == index;

      return (
         <div className={classes.barItem} key={"bar-item-" + index}>
            <div className={classes.barLabelContainer}>
               <div className={classes.barLabel}>{index}</div>
            </div>
            <div className={classes.barRectContainer}>
               <div
                  ref={(ref) => (barRefs.current[index] = ref)}
                  onTransitionEnd={(e) => {
                     if (e.propertyName !== "width") return;
                     if (value > 0) startRevealTimer(index);
                  }}
                  className={`${classes.rectangle} ${highlight ? classes.highlight : null}`}
                  style={{ width: renderedPerc + "%", transition: `width ${animationTime}s` }}
               >
                  <div
                     ref={(ref) => (digitRefs.current[index] = ref)}
                     className={`${classes.digit} ${digitClass} ${revealDigit[index] ? classes.opacity1 : null}`}
                  >
                     {value !== 0 && value}
                  </div>
               </div>
            </div>
         </div>
      );
   };

   return (
      <div className={classes.root}>
         <div className={classes.container}>
            <h1>Wordiful statistics</h1>
            <div className={classes.statRow}>
               {Object.entries(stats.totals).map(([key, value], index) => renderStatBox(key, value))}
            </div>
            <h2>Guess Distribution</h2>
            <div className={classes.distribution}>
               {Object.entries(stats.distribution).map(([key, value], index) => {
                  return renderBar(key, value);
               })}
            </div>
         </div>
         {/* <img src={scoreboardImage} /> */}
      </div>
   );
};

export default ScoreScreen;
