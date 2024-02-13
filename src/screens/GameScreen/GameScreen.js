import React, { useState, useEffect, useMemo, useRef } from "react";
import classes from "./GameScreen.module.css";
import InputRow from "./InputRow";
import KeyboardController from "../../KeyboardController";
import useGameData from "./useGameData";

const wordCharLength = 5;
const maxLines = 6;

const GameScreen = ({ disabled, onCurrWord }) => {
   const [currentLine, setCurrentLine] = useState(0);
   const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
   const rowRefs = useRef([]);
   const [showWord, setShowWord] = useState(false);
   const buttonRef = useRef(null);
   const [gameComplete, setGameComplete] = useState(false);
   const [feedback, setFeedback] = useState("");

   const { currentWord: currWord, loadRandomWord, allAllowedGuesses } = useGameData();

   useEffect(() => {
      onCurrWord(currWord);
      setCurrentLine(0);
      setAnswers(["", "", "", "", "", ""]);
   }, [currWord]);

   useEffect(() => {
      if (feedback) {
         const timer = setTimeout(() => {
            setFeedback(null);
         }, 3000);
      }
   }, [feedback]);

   const boxValues = useMemo(() => {
      if (!currWord) return [];
      return answers.map((answer, rowIndex) => {
         let boxes = [...currWord].map((letter, index) => {
            return {
               value: answer[index],
               boxState: rowIndex === currentLine ? "current" : "default",
            };
         });

         const answerLetters = [...answer];
         const correctLetters = [...currWord];

         if (rowIndex < currentLine) {
            for (let i = 0; i < answerLetters.length; i++) {
               if (answerLetters[i] === correctLetters[i]) {
                  boxes[i].boxState = "correct";
                  correctLetters[i] = null;
                  answerLetters[i] = null;
               }
            }

            for (let i = 0; i < answerLetters.length; i++) {
               if (answerLetters[i]) {
                  let firstIndex = correctLetters.indexOf(answerLetters[i]);
                  if (firstIndex >= 0) {
                     boxes[i].boxState = "partial";
                     correctLetters[firstIndex] = null;
                     answerLetters[i] = null;
                  } else {
                     boxes[i].boxState = "incorrect";
                  }
               }
            }
         }

         return boxes;
      });
   }, [answers, currentLine]);

   useEffect(() => {
      //console.log("boxValues", boxValues);

      const correctFeedback = ["Genius!", "Impressive!", "Happy days!", "Good effort", "Nice one!", "Made it!"];

      if (boxValues[currentLine - 1]) {
         const wordIsCorrect = boxValues[currentLine - 1].every((obj) => obj.boxState === "correct");
         if (wordIsCorrect) {
            setGameComplete(true);
            setFeedback(`Answer: ${correctFeedback[currentLine - 1]}`);
            return;
            //  onEndGame();
         }

         if (currWord && currentLine === 6) {
            setFeedback(`Answer: ${currWord.toUpperCase()}`);
         }
      }
   }, [currentLine, currWord]);

   function removeLastChar(str) {
      if (str.length > 0) {
         return str.slice(0, -1); // Remove the last character
      } else {
         return str; // Return the original string if it's empty
      }
   }

   const handleKeyboard = (key) => {
      setFeedback(null);
      if (disabled) return;
      if (!currWord) return;

      const lowerKey = key.toLowerCase();

      setAnswers((oldValue) => {
         const newAnswers = [...oldValue];

         // console.log("currentLine", currentLine);
         //  console.log("length", newAnswers.length);
         if (currentLine >= newAnswers.length) return oldValue;

         if (lowerKey === "enter") {
            if (currentLine < newAnswers.length && allAllowedGuesses.includes(newAnswers[currentLine])) {
               setCurrentLine(currentLine + 1);
            } else {
               setTimeout(() => {
                  if (newAnswers[currentLine].length < currWord.length) {
                     setFeedback("not enough letters");
                  } else {
                     setFeedback("word not in list");
                  }

                  //rowRefs.current[currentLine].shake(newAnswers[currentLine].length < currWord.length);
               }, 100);
            }
            return oldValue;
         }

         if (lowerKey === "delete" || lowerKey === "backspace") {
            newAnswers[currentLine] = removeLastChar(newAnswers[currentLine]);
            return newAnswers;
         }

         if (newAnswers[currentLine].length >= currWord.length) return oldValue;

         newAnswers[currentLine] += key;
         return newAnswers;
      });
   };

   // console.log("bxoes", boxValues);

   const keyColours = React.useMemo(() => {
      const letters = {};

      for (let i = 0; i < boxValues.length; i++) {
         const row = boxValues[i];

         for (let j = 0; j < row.length; j++) {
            const value = row[j].value;
            if (letters[value] === "correct") {
               continue;
            }

            if (letters[value] === "partial" && row[j].boxState !== "correct") {
               continue;
            }
            letters[value] = row[j].boxState;
         }
      }

      return letters;
   }, [currentLine]);

   return (
      <div className={classes.main}>
         {/* <div className="control-panel " onMouseDown={(e) => e.preventDefault()}>
            <button ref={buttonRef} onClick={loadRandomWord} onMouseDown={(e) => e.preventDefault()}>
               fetch random word
            </button>
            <button
               ref={buttonRef}
               onClick={() => {
                  setShowWord(!showWord);
               }}
            >
               {showWord ? "hide word" : "reveal word"}
            </button>
            <div className="hint">
               <span>current word: </span>
               {currWord && (showWord ? <span>{currWord}</span> : <span>&#9679;&#9679;&#9679;&#9679;&#9679;</span>)}
            </div>
         </div> */}
         <div style={{ visibility: feedback ? "visible" : "hidden", height: "24px" }} className={classes.feedback}>
            {feedback}
         </div>
         <div className={classes["input-container"]}>
            {boxValues.map((boxes, i) => {
               return (
                  <InputRow
                     boxes={boxes}
                     rowNumber={i}
                     key={"answer-row-" + i}
                     ref={(el) => (rowRefs.current[i] = el)}
                  />
               );
            })}
         </div>
         <div className={classes.keyboardWrapper}>
            <KeyboardController
               onKeyEvent={(e) => handleKeyboard(e)}
               deps={[currWord, currentLine, disabled]}
               keyColours={keyColours}
            />
         </div>
         {/* {gameComplete && (
            <div className="modal">
               <div className="background">
                  <div className="box">
                     <div className="content">CONGRATS!!</div>
                  </div>
               </div>
            </div>
         )} */}
      </div>
   );
};

export default GameScreen;
