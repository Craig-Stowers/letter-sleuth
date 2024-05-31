import React, { useState, useMemo } from "react";
import "./App.css";
import RepeatBackground from "./shared/RepeatBackground";
import whiteCircle from "./assets/white-circle.png";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import GameScreen from "./screens/GameScreen/GameScreen";
import Header from "./shared/Header";
import InfoScreen from "./screens/InfoScreen/InfoScreen";
import ScoreScreen from "./screens/ScoreScreen/ScoreScreen";
import Modal from "./shared/Modal";
import useGameData from "./screens/GameScreen/useGameData";
import generateRandomSequenceFromSeed from "./helpers/generateRandomSequenceFromSeed";
import useLocalData from "./hooks/useLocalData";
import useGameStats from "./hooks/useGameStats";
import AdminPanel from "./shared/AdminPanel";
import { setInnerHeightCSSVariable } from "./helpers/utilities";

import { daysBetween, addDaysToDate, formatDate } from "./helpers/dateMethods";

let startingDate = "2024-02-20";
const defaultData = {
   version: 0.6,
   success: {},
   failure: {},
   incomplete: {},
};

const customInnerHeightBreakPoints = {
   560: "short-inner-view",
   450: "shorter-inner-view",
};
setInnerHeightCSSVariable(customInnerHeightBreakPoints);

function App() {
   const [currScreen, setCurrScreen] = useState({ type: "home", params: {} });
   const [devMode, setDevMode] = useState(false);
   const [hint, setHint] = useState(null);
   const [showTools, setShowTools] = useState(false);
   const [daysElapsed, setDaysElapsed] = useState(Math.floor(daysBetween(startingDate)));
   const screenType = currScreen.type;

   const [localData, setLocalData] = useLocalData("wordiful-data", defaultData);

   const headerButtons = useMemo(() => {
      if (screenType === "home") return [];
      if (screenType === "game-info" || screenType === "main-info" || screenType === "scoreboard") return ["close"];
      return ["home", "info", "close"];
   }, [screenType]);

   const todaysDate = addDaysToDate(startingDate, daysElapsed);

   const { currentWord: currWord, getWordByDay } = useGameData(daysElapsed);

   const stats = useGameStats(localData, daysElapsed);

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

   const handleAnswerChanged = (answer) => {
      setLocalData((oldData) => {
         const newSaveData = { ...oldData, incomplete: { ...oldData.incomplete, [daysElapsed]: answer } };
         return newSaveData;
      });
   };

   const handleCompleted = (status) => {
      setLocalData((oldData) => {
         const copy = !!oldData.incomplete[daysElapsed] && [...oldData.incomplete[daysElapsed]];
         if (!copy) return oldData;
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
      setHint(word);
   };

   if (!localData) return;

   const getTodaysStatus = () => {
      if (localData.incomplete[daysElapsed]) return { status: "incomplete", value: localData.incomplete[daysElapsed] };
      if (localData.success[daysElapsed]) return { status: "success", value: localData.success[daysElapsed] };
      if (localData.failure[daysElapsed]) return { status: "failure", value: localData.failure[daysElapsed] };
      return { status: "not started", value: [""] };
   };

   const adminData = {
      version: 0.8,
      "start date": formatDate(startingDate),
      "simulated date": todaysDate,
      "day index": daysElapsed,
      "todays word": currWord,
      "todays status": getTodaysStatus().status,
      "todays save data": JSON.stringify(getTodaysStatus().value),
      ...stats.totals,
   };

   const handleAdminEvent = (event) => {
      if (event.type === "gototoday") {
         setDaysElapsed(Math.floor(daysBetween(startingDate)));
      }
      if (event.type === "cleartoday") {
         setLocalData((oldData) => {
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
      }
      if (event.type === "clearall") {
         setLocalData(defaultData);
      }
      if (event.type === "changedays") {
         const amount = event.days;
         setDaysElapsed((oldState) => {
            const newValue = oldState + amount;
            return newValue < 0 ? 0 : newValue;
         });
      }
   };

   return (
      <div className={"App"}>
         <RepeatBackground
            image={whiteCircle}
            style={{ zIndex: -1 }}
            className={screenType === "game" ? "light-bg" : "dark-bg"}
            repeatImageStyle={{ opacity: 0.1, display: screenType === "home" ? "block" : "none" }}
         />

         <div className={"container"}>
            <Header
               buttons={headerButtons}
               onButtonHit={handleButtonHit}
               hint={hint}
               showGameTitle={screenType === "game"}
            />
            <div className={"container-inner"}>
               <div className={"screen-area"}>
                  {screenType === "home" && <HomeScreen onButtonHit={handleButtonHit} devMode={devMode} />}
                  {screenType === "game" && (
                     <GameScreen
                        devMode={devMode}
                        onCurrWord={handleCurrWord}
                        currWord={currWord}
                        daysElapsed={daysElapsed}
                        saveData={localData}
                        onAnswerChange={handleAnswerChanged}
                        onCompleted={handleCompleted}
                        changeScreen={handleChangeScreen}
                        isCompleted={!!localData.success[daysElapsed] || !!localData.failure[daysElapsed]}
                     />
                  )}
                  {(screenType === "main-info" || screenType === "game-info") && (
                     <InfoScreen onButtonHit={handleButtonHit} />
                  )}

                  {screenType === "scoreboard" && (
                     <ScoreScreen
                        params={currScreen.params}
                        saveData={localData}
                        daysElapsed={daysElapsed}
                        stats={stats}
                     />
                  )}
               </div>
            </div>
         </div>

         {showTools && (
            <Modal onClose={() => setShowTools(false)}>
               <AdminPanel adminData={adminData} onAdminEvent={handleAdminEvent} />
            </Modal>
         )}
      </div>
   );
}

export default App;
