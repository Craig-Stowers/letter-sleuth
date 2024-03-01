import React, { useState, useMemo, useEffect } from "react";

import "./App.css";

import RepeatBackground from "./shared/RepeatBackground";
import whiteSquare from "./assets/white-square.png";

import HomeScreen from "./screens/HomeScreen/HomeScreen";
import GameScreen from "./screens/GameScreen/GameScreen";

import Header from "./shared/Header";
import InfoScreen from "./screens/InfoScreen/InfoScreen";

import ScoreScreen from "./screens/ScoreScreen/ScoreScreen";
import Modal from "./shared/Modal";
import useGameData from "./screens/GameScreen/useGameData";

import generateRandomSequenceFromSeed from "./helpers/generateRandomSequenceFromSeed";

let startingDate = "2024-02-20";

function daysBetween(startingDate) {
   // Create a Date object for the starting date
   let startDate = new Date(startingDate);
   startDate.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ensure day ticks over at midnight

   // Create a Date object for today's date
   let today = new Date();
   today.setHours(0, 0, 0, 0); // Set time to 00:00:00 to ensure comparison is date-only

   // Calculate the difference in milliseconds
   let differenceInMilliseconds = today - startDate;

   // Convert milliseconds to days
   let differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);

   return differenceInDays;
}

function addDaysToDate(startingDate, daysToAdd) {
   // Create a Date object from the starting date
   let date = new Date(startingDate);

   // Add the days to the date
   date.setDate(date.getDate() + daysToAdd);

   // Format the day and month with leading zeros
   let day = String(date.getDate()).padStart(2, "0");
   let month = String(date.getMonth() + 1).padStart(2, "0"); // +1 because getMonth() returns 0-11
   let year = date.getFullYear();

   // Combine the parts into a formatted date string
   let newDate = `${day}/${month}/${year}`;

   // Return the new date
   return newDate;
}

function formatDate(dateString) {
   // Split the date string into its components
   let parts = dateString.split("-"); // parts[0] = year, parts[1] = month, parts[2] = day

   // Pad the day and month with leading zeros if necessary
   let day = parts[2].padStart(2, "0");
   let month = parts[1].padStart(2, "0");
   let year = parts[0];

   // Combine the parts into the new format
   return `${day}/${month}/${year}`;
}

function App() {
   const [currScreen, setCurrScreen] = useState("home");
   const [devMode, setDevMode] = useState(false);
   const [hint, setHint] = useState(null);
   const [showTools, setShowTools] = useState(false);

   const [dayIncrement, setDayIncrement] = useState(0);
   const [daysElapsed, setDaysElapsed] = useState(daysBetween(startingDate));

   const headerButtons = useMemo(() => {
      if (currScreen === "home") return [];
      if (currScreen === "game-info" || currScreen === "main-info" || currScreen === "scoreboard") return ["close"];
      return ["home", "info", "close"];
   }, [currScreen]);

   const todaysDate = addDaysToDate(startingDate, daysElapsed);

   const { currentWord: currWord, getWordByDay } = useGameData(daysElapsed);

   useEffect(() => {
      if (dayIncrement === 0) return;
      setDaysElapsed((oldState) => {
         const newValue = oldState + dayIncrement;
         return newValue < 0 ? 0 : newValue;
      });

      let interval = null;

      const delay = setTimeout(() => {
         interval = setInterval(() => {
            setDaysElapsed((oldState) => {
               const newValue = oldState + dayIncrement;
               return newValue < 0 ? 0 : newValue;
            });
         }, 20);
      }, 500);

      return () => {
         clearTimeout(delay);
         interval && clearTimeout(interval);
      };
   }, [dayIncrement]);

   const getScreen = (buttonName) => {
      console.log("BUTTON HIT", currScreen);
      if (currScreen === "home") {
         if (buttonName === "play") return "game";
         if (buttonName === "info") return "main-info";
         if (buttonName === "close") return "home";
         if (buttonName === "scoreboard") return "scoreboard";
         if (buttonName === "devmode") {
            setDevMode((value) => {
               return !value;
            });
         }
      }

      if (currScreen === "game") {
         if (buttonName === "home") return "home";
         if (buttonName === "close") return "home";
         if (buttonName === "info") return "game-info";
      }

      if (currScreen === "game-info" && buttonName === "close") return "game";

      return "home";
   };

   const handleButtonHit = (buttonName) => {
      if (buttonName === "devmode") {
         setShowTools(!showTools);
         return;
      }

      setCurrScreen(getScreen(buttonName));
   };

   const handleCurrWord = (word) => {
      // if (devMode) {
      setHint(word);
      // }
   };

   return (
      <div className={"App"}>
         <RepeatBackground
            image={whiteSquare}
            style={{ zIndex: -1 }}
            repeatImageStyle={{ opacity: 0.1, display: currScreen === "home" ? "block" : "none" }}
         />

         <div className={"container"}>
            <Header buttons={headerButtons} onButtonHit={handleButtonHit} hint={hint} />
            <div className={"container-inner"}>
               <div className={"screen-area"}>
                  {currScreen === "home" && <HomeScreen onButtonHit={handleButtonHit} devMode={devMode} />}
                  {currScreen === "game" && (
                     <GameScreen
                        devMode={devMode}
                        onCurrWord={handleCurrWord}
                        currWord={currWord}
                        daysElapsed={daysElapsed}
                     />
                  )}
                  {(currScreen === "main-info" || currScreen === "game-info") && (
                     <InfoScreen onButtonHit={handleButtonHit} />
                  )}

                  {currScreen === "scoreboard" && <ScoreScreen />}
               </div>

               {/* <div className={"tiled-background"}>background here</div> */}

               {/* <Container />; */}
            </div>
         </div>

         {showTools && (
            <Modal onClose={() => setShowTools(false)}>
               <div
                  className="dayPicker"
                  onClick={(e) => {
                     e.preventDefault();
                  }}
                  onMouseLeave={() => {
                     setDayIncrement(0);
                  }}
                  onMouseUp={() => {
                     setDayIncrement(0);
                  }}
               >
                  <ul className="data">
                     <li>version: 0.5</li>
                     <li>start date: {formatDate(startingDate)}</li>
                     <li>date: {todaysDate} </li>
                     <li>days elapsed: {daysElapsed}</li>
                     <li>dates score: no attempt</li>
                     <li>best streak to date: 0</li>
                     <li>todays temp data:</li>
                     <li>curr word: {currWord}</li>
                  </ul>

                  <div className="buttonRow">
                     <button
                        onMouseDown={() => {
                           setDayIncrement(-1);
                        }}
                     >
                        -1 day
                     </button>
                     <button
                        onMouseDown={() => {
                           setDayIncrement(1);
                        }}
                     >
                        +1 day
                     </button>
                  </div>

                  <div className="buttonRow">
                     <button
                        onMouseDown={() => {
                           setDayIncrement(-10);
                        }}
                     >
                        -10 days
                     </button>
                     <button
                        onMouseDown={() => {
                           setDayIncrement(10);
                        }}
                     >
                        +10 days
                     </button>
                  </div>
                  <div>
                     <button
                        onMouseDown={() => {
                           setDaysElapsed(daysBetween(startingDate));
                        }}
                     >
                        go to today
                     </button>
                  </div>

                  {/* <div>
                     <button
                        onMouseDown={() => {
                           setDaysElapsed(daysBetween(startingDate));
                        }}
                     >
                        Reset all attempts
                     </button>
                  </div>
                  <div>
                     <button
                        onMouseDown={() => {
                           setDaysElapsed(daysBetween(startingDate));
                        }}
                     >
                        Reset todays attempts
                     </button>
                  </div> */}
               </div>
            </Modal>
         )}
      </div>
   );
}

export default App;
