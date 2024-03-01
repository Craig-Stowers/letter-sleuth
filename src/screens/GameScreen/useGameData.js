import React, { useState, useEffect, useRef } from "react";
import useTextFileLoader from "../../hooks/useTextFileLoader";
import generateRandomSequenceFromSeed from "../../helpers/generateRandomSequenceFromSeed";

const useGameData = (day) => {
   const answersData = useTextFileLoader("/answers.txt");
   const allowedGuessesData = useTextFileLoader("/allowed-guesses.txt");
   const blacklistData = useTextFileLoader("/blacklist.txt");
   const whitelistData = useTextFileLoader("/whitelist.txt");
   const [currentWord, setCurrentWord] = useState(null);
   const buttonRef = useRef(null);
   const [showWord, setShowWord] = useState(false);
   const [gameComplete, setGameComplete] = useState(false);

   const blacklist = React.useMemo(() => {
      if (!blacklistData) return null;
      return blacklistData.split("\n").filter((word) => word.trim() !== "");
   }, [blacklistData]);

   const whitelist = React.useMemo(() => {
      if (!whitelistData) return null;
      return whitelistData.split("\n").filter((word) => word.trim() !== "");
   }, [whitelistData]);

   const answers = React.useMemo(() => {
      // console.log("answerData", answersData);
      if (!answersData) return null;
      if (!blacklist) return null;
      const filtered = answersData
         .split("\n")
         .filter((word) => word.trim() !== "")
         .filter((word) => {
            return !blacklist.includes(word);
         })
         .filter((word) => word[word.length - 1] !== "s");
      return filtered;
   }, [answersData, blacklist]);

   const randomSequence = React.useMemo(() => {
      if (!answers) return;
      const sequence = generateRandomSequenceFromSeed(answers.length);
      console.log("seq", sequence);
      return sequence;
   }, [answers]);

   const allowedGuesses = React.useMemo(() => {
      if (!allowedGuessesData || !blacklist || !whitelist) return null;

      const filtered = allowedGuessesData
         .split("\n")
         .filter((word) => word.trim() !== "")
         .filter((word) => {
            return !blacklist.includes(word);
         })
         .filter((word) => word[word.length - 1] !== "s");

      console.log("whitelist", whitelist);
      return [...filtered, ...whitelist];
   }, [allowedGuessesData, blacklist, whitelist]);

   const loadWordByDate = () => {
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

   useEffect(() => {
      if (!answers || !randomSequence) return;
      console.log("length", answers.length, randomSequence.length);

      const index = day % answers.length;
      const randomIndex = randomSequence[index];
      setCurrentWord(answers[randomIndex]);
   }, [day, answers, randomSequence]);

   const allAllowedGuesses = allowedGuesses && answers ? [...allowedGuesses, ...answers] : [];

   return { loadRandomWord, currentWord, allAllowedGuesses };
};

export default useGameData;
