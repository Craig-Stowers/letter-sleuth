import classes from "./ScoreScreen.module.css";
import React, { useState, useRef, useMemo, useEffect } from "react";
import useElementWidth from "../../hooks/useElementWidth";

import scoreboardImage from "../../assets/scoreboard-demo.png";
import useWidthsObserver from "../../hooks/useWidthsObserver";

function estimateLocalStorageSize(obj) {
   const serializedObject = JSON.stringify(obj);
   const sizeInBytes = new Blob([serializedObject]).size; // More accurate size calculation
   return sizeInBytes;
}

// Example usage:
const myObject = {
   key: "This is some test",
};
const sizeInBytes = estimateLocalStorageSize(myObject);
console.log(`Size in bytes: ${sizeInBytes}`);

function longestConsecutiveRun(successData, successKeys, failKeys, daysElapsed) {
   // Extract keys and convert them to integers

   // Initialize variables to track the longest run
   let longestRun = 0;
   let currentRun = 0;
   const distribution = {};

   for (let j = 1; j <= 6; j++) {
      if (!distribution[j]) distribution[j] = 0;
   }

   // Iterate through keys to find longest consecutive run
   for (let i = 0; i <= daysElapsed; i++) {
      if (successKeys.includes(i)) {
         currentRun++;
         longestRun = Math.max(longestRun, currentRun);
         const attempts = successData[i].length;
         distribution[attempts]++;
      }
      if (failKeys.includes(i)) {
         currentRun = 0;
      }
   }

   // if (Math.max(...failKeys) > Math.max(...successKeys)) currentRun = 0;

   // Ensure the longest run is updated if the run includes the last element
   // longestRun = Math.max(longestRun, currentRun);

   return [longestRun, currentRun, distribution];
}

const ScoreScreen = ({ saveData, params, daysElapsed }) => {
   const barRefs = useRef([]);
   const digitRefs = useRef([]);
   const [animate, setAnimate] = useState(false);
   const [barDigitClass, setBarDigitClass] = useState([]);
   const [revealDigit, setRevealDigit] = useState([]);

   const revealTimers = useRef([]);

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

   const stats = useMemo(() => {
      const successKeys = Object.keys(saveData.success)
         .map(Number)
         .sort((a, b) => a - b)
         .filter((day) => day <= daysElapsed);

      const failKeys = Object.keys(saveData.failure)
         .map(Number)
         .sort((a, b) => a - b)
         .filter((day) => day <= daysElapsed);

      const totalSuccesses = successKeys.length;
      const totalComplete = totalSuccesses + failKeys.length;

      const [longestStreak, currentStreak, distribution] = longestConsecutiveRun(
         saveData.success,
         successKeys,
         failKeys,
         daysElapsed
      );

      const filteredDistribution = { ...distribution };
      //delete filteredDistribution["-1"];

      return {
         totals: {
            "Games played": totalComplete,
            "Win percentage": Math.round((totalSuccesses / totalComplete) * 1000) / 10,
            "Current streak": currentStreak,
            "Longest streak": longestStreak,
         },
         distribution: filteredDistribution,
      };
   }, [saveData]);

   const maxDistributionValue = Math.max(...Object.values(stats.distribution));

   const renderStatBox = (label, value) => {
      return (
         <div className={classes.statBox}>
            <div className={classes.value}>{value}</div>
            <div className={classes.label}>{label}</div>
         </div>
      );
   };

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
         <div className={classes.barItem}>
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
