import useElementWidth from "../../hooks/useElementWidth";
import useElementSize from "../../hooks/useElementSize";
import classes from "./ScoreScreen.module.css";
import React, { useState, useRef, useMemo, useEffect } from "react";

function estimateLocalStorageSize(obj) {
   const serializedObject = JSON.stringify(obj);
   const sizeInBytes = new Blob([serializedObject]).size; // More accurate size calculation
   return sizeInBytes;
}

const ScoreScreen = ({ saveData, params, daysElapsed, stats }) => {
   const barRefs = useRef([]);
   const barContainerRefs = useRef([]);
   const digitRefs = useRef([]);
   const [animate, setAnimate] = useState(false);
   const [barDigitClass, setBarDigitClass] = useState([]);
   const [revealDigit, setRevealDigit] = useState([]);
   const revealTimers = useRef([]);

   const [barSize] = useElementSize(barContainerRefs.current[0]);

   console.log("barClasses", barDigitClass);

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

   const maxDistributionValue = Math.max(Math.max(...Object.values(stats.distribution)), 6);

   const startRevealTimer = (index) => {
      if (!barRefs.current[index]) return;
      if (barDigitClass[index]) return;

      const height = barRefs.current[index].offsetHeight;
      const digitHeight = digitRefs.current[index].offsetHeight;

      index === 0 && console.log("HEIGHT", index, height, "digitheight", digitHeight);

      setBarDigitClass((oldValue) => {
         const newValue = [...oldValue];
         newValue[index] = height - 12 > digitHeight ? "inside" : "outside";
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

   const renderStatBox = (label, value, className) => {
      return (
         <div className={`${classes.statBox} ${classes[className]}`} key={"stat-box-" + label}>
            <div className={classes.value}>{value}</div>
            <div className={classes.label}>{label}</div>
         </div>
      );
   };

   const renderBar = (index, value) => {
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

      const minHeight = barSize.width;

      let barHeight;
      if (barSize.height / maxDistributionValue < minHeight) {
         // console.log("barSize.height / maxDistributionValue", barSize.height / maxDistributionValue);
         const percOfMax = animate ? (value - 1) / (maxDistributionValue - 1) : 0;
         const remainingSpace = barSize.height - minHeight;
         barHeight = minHeight + (percOfMax ? remainingSpace * percOfMax : 0);
      } else {
         const percOfMax = animate ? value / maxDistributionValue : 0;
         const remainingSpace = barSize.height;
         barHeight = remainingSpace * percOfMax;
      }

      console.log("barheight", barHeight);

      //if(maxDistributionValue)

      const animationTime = 1; //percOfMax / 100;

      const highlight = params.highlight == index + 1;
      console.log("highlight?", highlight, params.highlight);

      return (
         <div className={classes.barItem} key={"bar-item-" + index}>
            <div
               className={classes.barRectContainer}
               style={{ opacity: value === 0 ? 0 : 1 }}
               ref={(ref) => {
                  barContainerRefs.current[index] = ref;
               }}
            >
               <div
                  ref={(ref) => {
                     barRefs.current[index] = ref;
                  }}
                  onTransitionEnd={(e) => {
                     if (e.propertyName !== "height") return;
                     if (value > 0) startRevealTimer(index);
                  }}
                  className={`${classes.rectangle} ${highlight ? classes.highlight : null}`}
                  style={{ height: barHeight ? barHeight + "px" : "0px", transition: `height ${animationTime}s` }}
               >
                  <div
                     ref={(ref) => (digitRefs.current[index] = ref)}
                     style={{ bottom: minHeight * 0.5 + "px" }}
                     className={`${classes.digit} ${digitClass} ${revealDigit[index] ? classes.opacity1 : null}`}
                  >
                     {value !== 0 && value}
                  </div>
               </div>
            </div>
            <div className={classes.barLabelContainer}>
               <div className={classes.barLabel}>{index + 1}</div>
            </div>
         </div>
      );
   };

   const statArray = Object.entries(stats.totals).map(([key, value]) => {
      return { key, value };
   });

   return (
      <div className={classes.root}>
         <div className={classes.container}>
            <div className={classes.top}>
               <h1>Statistics</h1>

               <div className={classes.statGrid}>
                  {renderStatBox(statArray[0].key, statArray[0].value, "top-left")}
                  {renderStatBox(statArray[1].key, statArray[1].value, "top-right")}
                  {renderStatBox(statArray[2].key, statArray[2].value, "bottom-left")}
                  {renderStatBox(statArray[3].key, statArray[3].value, "bottom-right")}
               </div>
            </div>

            <div className={classes.bottom}>
               <h2 style={{ textAlign: "center" }}>Guessed in</h2>
               <div className={classes.distribution}>
                  {Object.entries(stats.distribution).map(([key, value], index) => {
                     return renderBar(index, value);
                  })}
               </div>
            </div>
         </div>
         {/* <img src={scoreboardImage} /> */}
      </div>
   );
};

export default ScoreScreen;
