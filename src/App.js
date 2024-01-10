import logo from "./logo.svg";
import "./App.css";
import GameScreen from "./screens/GameScreen/GameScreen";
import React, { useEffect, useRef, useMemo, useState } from "react";
import useTextFileLoader from "./hooks/useTextFileLoader";

function App() {
   // const [words, setWords] = useState([]);
   const answersData = useTextFileLoader("/answers.txt");
   const allowedGuessesData = useTextFileLoader("/allowed-guesses.txt");
   const blacklistData = useTextFileLoader("/blacklist.txt");
   const [currentWord, setCurrentWord] = useState(null);
   const buttonRef = useRef(null);
   const [showWord, setShowWord] = useState(false);
   const [gameComplete, setGameComplete] = useState(false);

   const answers = React.useMemo(() => {
      if (answersData) return answersData.split("\n").filter((word) => word.trim() !== "");
      return null;
   }, [answersData]);

   const allowedGuesses = React.useMemo(() => {
      if (allowedGuessesData) return allowedGuessesData.split("\n").filter((word) => word.trim() !== "");
      return null;
   }, [allowedGuessesData]);

   useEffect(() => {
      if (answers && allAllowedGuesses) loadRandomWord();
      // console.log("allowedGuesses", allowedGuesses)
   }, [answers, allowedGuesses]);

   const loadRandomWord = () => {
      setCurrentWord(null);
      buttonRef.current.blur();
      //  console.log("loadRandomWord");

      setTimeout(() => {
         if (answers) {
            setCurrentWord(answers[Math.floor(Math.random() * answers.length)]);
            setShowWord(false);
            setGameComplete(false);
            buttonRef.current.blur();
         }
      }, 200);
   };

   const allAllowedGuesses = allowedGuesses && answers ? [...allowedGuesses, ...answers] : [];

   return (
      <>
         <div className="App">
            <div className="control-panel " onMouseDown={(e) => e.preventDefault()}>
               <button ref={buttonRef} onClick={loadRandomWord} onMouseDown={(e) => e.preventDefault()}>
                  fetch random word
               </button>
               <button
                  ref={buttonRef}
                  onClick={() => {
                     setShowWord(!showWord);
                  }}
               >
                  {showWord ? "hide word" : "show word"}
               </button>
               {currentWord && <span>WORD = {showWord ? currentWord : "XXXXXX"}</span>}
            </div>

            <div className="game-container">
               <GameScreen
                  currentWord={currentWord}
                  allowedWords={allAllowedGuesses}
                  blacklistWords={blacklistData}
                  disabled={gameComplete}
                  onEndGame={() => {
                     setGameComplete(true);
                  }}
               />
               {gameComplete && (
                  <div className="modal">
                     <div className="background">
                        <div className="box">
                           <div className="content">CONGRATS!! fetch a new word to restart</div>
                        </div>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </>
   );
}

export default App;
