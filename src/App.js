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
   const [currScreen, setCurrScreen] = useState({ type: "home", params: {} });
   const [devMode, setDevMode] = useState(false);
   const [hint, setHint] = useState(null);
   const [showTools, setShowTools] = useState(false);
   const [dayIncrement, setDayIncrement] = useState(0);
   const [daysElapsed, setDaysElapsed] = useState(daysBetween(startingDate));
   const [saveData, setSaveData] = useState(null);

   const screenType = currScreen.type;

   const headerButtons = useMemo(() => {
      if (screenType === "home") return [];
      if (screenType === "game-info" || screenType === "main-info" || screenType === "scoreboard") return ["close"];
      return ["home", "info", "close"];
   }, [screenType]);

   const todaysDate = addDaysToDate(startingDate, daysElapsed);

   const { currentWord: currWord, getWordByDay } = useGameData(daysElapsed);

   const isCompleted = saveData && (!!saveData.success[daysElapsed] || !!saveData.failure[daysElapsed]);

   const initLocalData = () => {
      localStorage.setItem(
         "wordiful-data",
         JSON.stringify({
            version: 0.5,
            success: {},
            failure: {},
            incomplete: {},
         })
      );
   };

   useEffect(() => {
      const data = localStorage.getItem("wordiful-data");
      const parseData = data ? JSON.parse(data) : null;

      //test data is formatted.
      if (!data || data === "null" || (parseData && !parseData.version)) {
         initLocalData();
      }

      setSaveData(JSON.parse(data));
      //const parsedData = JSON.parse(data);
   }, []);

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
      if (screenType === "home") {
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

      if (screenType === "game") {
         if (buttonName === "home") return "home";
         if (buttonName === "close") return "home";
         if (buttonName === "info") return "game-info";
      }

      if (screenType === "game-info" && buttonName === "close") return "game";

      return "home";
   };

   const handleButtonHit = (buttonName) => {
      if (buttonName === "devmode") {
         setShowTools(!showTools);
         return;
      }

      setCurrScreen({ type: getScreen(buttonName), params: {} });
   };

   useEffect(() => {
      console.log("prelocalsave");
      if (!saveData) return;
      console.log("saveData", saveData);
      localStorage.setItem("wordiful-data", JSON.stringify(saveData));
   }, [saveData]);

   const handleAnswerChanged = (answer) => {
      console.log("answer changed", answer);
      setSaveData((oldData) => {
         console.log("set save", answer);
         const newSaveData = { ...oldData, incomplete: { ...oldData.incomplete, [daysElapsed]: answer } };
         return newSaveData;
      });
   };

   const handleCompleted = (status) => {
      console.log("handleCompleted", status);
      setSaveData((oldData) => {
         //  if (oldData[status][daysElapsed]) return oldData;
         const copy = !!oldData.incomplete[daysElapsed] && [...oldData.incomplete[daysElapsed]];

         if (!copy) return oldData;

         console.log("copy data for day", daysElapsed, copy);

         const newSaveData = {
            ...oldData,
            incomplete: { ...oldData.incomplete },
            [status]: { ...oldData[status], [daysElapsed]: copy },
         };
         delete newSaveData.incomplete[daysElapsed];
         return newSaveData;
      });
   };

   const handleChangeScreen = ({ type, params = {} }) => {
      setCurrScreen({ type, params });
   };

   const handleCurrWord = (word) => {
      // if (devMode) {
      setHint(word);
      // }
   };

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

      return [longestRun, currentRun, distribution];
   }

   const stats = useMemo(() => {
      if (!saveData) return null;
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
            "Win percentage": totalComplete > 0 ? Math.round((totalSuccesses / totalComplete) * 1000) / 10 : "/",
            "Current streak": currentStreak,
            "Longest streak": longestStreak,
         },
         distribution: filteredDistribution,
      };
   }, [saveData]);

   if (!saveData) return;

   const getTodaysStatus = () => {
      if (saveData.incomplete[daysElapsed]) return { status: "incomplete", value: saveData.incomplete[daysElapsed] };
      if (saveData.success[daysElapsed]) return { status: "success", value: saveData.success[daysElapsed] };
      if (saveData.failure[daysElapsed]) return { status: "failure", value: saveData.failure[daysElapsed] };
      return { status: "not started", value: [""] };
   };

   const adminData = {
      version: 0.5,
      "start date": formatDate(startingDate),
      "simulated date": todaysDate,
      "day index": daysElapsed,
      "todays word": currWord,
      "todays status": getTodaysStatus().status,
      "todays save data": JSON.stringify(getTodaysStatus().value),
      ...stats.totals,
   };

   return (
      <div className={"App"}>
         <RepeatBackground
            image={whiteSquare}
            style={{ zIndex: -1 }}
            repeatImageStyle={{ opacity: 0.1, display: screenType === "home" ? "block" : "none" }}
         />

         <div className={"container"}>
            <Header buttons={headerButtons} onButtonHit={handleButtonHit} hint={hint} />
            <div className={"container-inner"}>
               <div className={"screen-area"}>
                  {screenType === "home" && <HomeScreen onButtonHit={handleButtonHit} devMode={devMode} />}
                  {screenType === "game" && (
                     <GameScreen
                        devMode={devMode}
                        onCurrWord={handleCurrWord}
                        currWord={currWord}
                        daysElapsed={daysElapsed}
                        saveData={saveData}
                        onAnswerChange={handleAnswerChanged}
                        onCompleted={handleCompleted}
                        changeScreen={handleChangeScreen}
                        isCompleted={!!saveData.success[daysElapsed] || !!saveData.failure[daysElapsed]}
                     />
                  )}
                  {(screenType === "main-info" || screenType === "game-info") && (
                     <InfoScreen onButtonHit={handleButtonHit} />
                  )}

                  {screenType === "scoreboard" && (
                     <ScoreScreen params={currScreen.params} saveData={saveData} daysElapsed={daysElapsed} />
                  )}
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
                  <h4>ADMIN PANEL</h4>
                  <p>
                     Use this panel to simulate date changes. Scores will only be calculated up until the simulated
                     date. Hold +/- day buttons for continuous seeking. "Start date" can be edited in the apps config.
                  </p>
                  <ul className="data">
                     {Object.entries(adminData).map(([key, value], index) => {
                        return (
                           <li>
                              <strong>{key}:</strong> {value}
                           </li>
                        );
                     })}
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
                  <div className="buttonRow" style={{ marginBottom: "14px" }}>
                     <button
                        onMouseDown={() => {
                           setDaysElapsed(daysBetween(startingDate));
                        }}
                     >
                        go to today
                     </button>
                  </div>
                  <div className="buttonRow">
                     <button
                        className="warning"
                        onMouseDown={() => {
                           setSaveData((oldData) => {
                              const newData = {
                                 ...oldData,
                                 incomplete: { ...oldData.incomplete },
                                 success: { ...oldData.success },
                                 failure: { ...oldData.failure },
                              };

                              if (newData.incomplete[daysElapsed]) delete newData.incomplete[daysElapsed];
                              if (newData.success[daysElapsed]) delete newData.success[daysElapsed];
                              if (newData.failure[daysElapsed]) delete newData.failure[daysElapsed];

                              return newData;
                           });
                        }}
                     >
                        clear todays data
                     </button>
                  </div>
                  <div className="buttonRow">
                     <button
                        className="warning"
                        onMouseDown={() => {
                           setSaveData({
                              version: 0.5,
                              success: {},
                              failure: {},
                              incomplete: {},
                           });
                        }}
                     >
                        clear all data
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
