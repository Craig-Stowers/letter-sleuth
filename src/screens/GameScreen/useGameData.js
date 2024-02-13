import React, { useState, useEffect, useRef } from "react";
import useTextFileLoader from "../../hooks/useTextFileLoader";

const useGameData = () => {
   const answersData = useTextFileLoader("/answers.txt");
   const allowedGuessesData = useTextFileLoader("/allowed-guesses.txt");
   const blacklistData = useTextFileLoader("/blacklist.txt");
   const [currentWord, setCurrentWord] = useState(null);
   const buttonRef = useRef(null);
   const [showWord, setShowWord] = useState(false);
   const [gameComplete, setGameComplete] = useState(false);

   const blacklist = React.useMemo(() => {
      if (!blacklistData) return null;
      return blacklistData.split("\n").filter((word) => word.trim() !== "");
   }, [blacklistData]);

   const answers = React.useMemo(() => {
      // console.log("answerData", answersData);
      if (!answersData) return null;
      if (!blacklist) return null;
      const filtered = answersData
         .split("\n")
         .filter((word) => word.trim() !== "")
         .filter((word) => {
            return !blacklist.includes(word);
         });
      return filtered;
   }, [answersData, blacklist]);

   const allowedGuesses = React.useMemo(() => {
      if (!allowedGuessesData) return null;
      if (!blacklist) return null;
      const filtered = allowedGuessesData
         .split("\n")
         .filter((word) => word.trim() !== "")
         .filter((word) => {
            return !blacklist.includes(word);
         });
      return filtered;
   }, [allowedGuessesData, blacklist]);

   useEffect(() => {
      if (answers && allAllowedGuesses) loadRandomWord();
      // console.log("allowedGuesses", allowedGuesses)
   }, [answers, allowedGuesses]);

   const loadRandomWord = () => {
      setCurrentWord(null);
      //buttonRef.current.blur();
      //  console.log("loadRandomWord");

      setTimeout(() => {
         if (answers) {
            setCurrentWord(answers[Math.floor(Math.random() * answers.length)]);
            setShowWord(false);
            setGameComplete(false);
            // buttonRef.current.blur();
         }
      }, 200);
   };

   const allAllowedGuesses = allowedGuesses && answers ? [...allowedGuesses, ...answers] : [];

   return { loadRandomWord, currentWord, allAllowedGuesses };
};

export default useGameData;
