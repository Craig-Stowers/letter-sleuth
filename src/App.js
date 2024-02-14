import React, { useState, useMemo } from "react";

import "./App.css";

import RepeatBackground from "./shared/RepeatBackground";
import whiteSquare from "./assets/white-square.png";

import HomeScreen from "./screens/HomeScreen/HomeScreen";
import GameScreen from "./screens/GameScreen/GameScreen";

import Header from "./shared/Header";
import InfoScreen from "./screens/InfoScreen/InfoScreen";

import ScoreScreen from "./screens/ScoreScreen/ScoreScreen";

function App() {
   const [currScreen, setCurrScreen] = useState("home");
   const [devMode, setDevMode] = useState(false);
   const [hint, setHint] = useState(null);

   const headerButtons = useMemo(() => {
      if (currScreen === "home") return [];
      if (currScreen === "game-info" || currScreen === "main-info" || currScreen === "scoreboard") return ["close"];
      return ["home", "info", "close"];
   }, [currScreen]);

   console.log("CURR SCREEN", currScreen);

   const getScreen = (buttonName) => {
      console.log("BUTTON HIT", buttonName, currScreen);
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
            <div className={"container-inner"}>
               <Header buttons={headerButtons} onButtonHit={handleButtonHit} hint={hint} />
               <div className={"screen-area"}>
                  {currScreen === "home" && <HomeScreen onButtonHit={handleButtonHit} devMode={devMode} />}
                  {currScreen === "game" && <GameScreen devMode={devMode} onCurrWord={handleCurrWord} />}
                  {(currScreen === "main-info" || currScreen === "game-info") && <InfoScreen />}

                  {currScreen === "scoreboard" && <ScoreScreen />}
               </div>

               {/* <div className={"tiled-background"}>background here</div> */}

               {/* <Container />; */}
            </div>
         </div>
      </div>
   );
}

export default App;
