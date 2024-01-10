import logo from "./logo.svg";
import "./App.css";
import GameScreen from "./screens/GameScreen/GameScreen";
import React, { useEffect, useRef, useMemo, useState } from "react";
import useTextFileLoader from "./hooks/useTextFileLoader";

function App() {
   // const [words, setWords] = useState([]);
   const answersData = useTextFileLoader("/answers.txt");
   const allowedGuessesData = useTextFileLoader("/allowed-guesses.txt");
   const [currentWord, setCurrentWord] = useState(null);
   const buttonRef = useRef(null);

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
      buttonRef.current.blur();
      console.log("loadRandomWord");
      if (answers) {
         setCurrentWord(answers[Math.floor(Math.random() * answers.length)]);
      }
   };

   const allAllowedGuesses = allowedGuesses && answers ? [...allowedGuesses, ...answers] : [];

   return (
      <div className="App">
         <button ref={buttonRef} onClick={loadRandomWord}>
            get random word
         </button>

         <GameScreen currentWord={currentWord} allowedWords={allAllowedGuesses} />
      </div>
   );
}

export default App;
