import React, { useState, useEffect, useMemo, useRef } from "react";
import classes from "./GameScreen.module.css";
import InputRow from "./InputRow";
import KeyboardController from "../../KeyboardController";
import useGameData from "./useGameData";
import useElementSize from "../../hooks/useElementSize";

const wordCharLength = 5;
const maxLines = 6;

function countUntilCondition(arr, conditionFunc) {
   let count = 0;
   for (let item of arr) {
      if (conditionFunc(item)) {
         break; // Exit the loop if the condition is false
      }
      count++;
   }
   return count;
}

const GameScreen = ({
   onCurrWord,
   currWord,
   daysElapsed,
   onCompleted,
   saveData,
   onAnswerChange,
   isCompleted = false,
   changeScreen,
}) => {
   const [answers, setAnswers] = useState(() => {
      if (isCompleted) {
         if (saveData.success[daysElapsed]) return saveData.success[daysElapsed];
         if (saveData.failure[daysElapsed]) return saveData.failure[daysElapsed];
      } else {
         return saveData.incomplete[daysElapsed] || [""];
      }
   });

   const [currentLine, setCurrentLine] = useState(() => {
      if (isCompleted) return answers.length;
      const line = countUntilCondition(answers, (item) => {
         return !item && item !== "";
      });

      return line - 1;

      //return isCompleted ? line + 1 : line;
   });

   // console.log("currentLine", currentLine, isCompleted);
   const rowRefs = useRef([]);
   const [showWord, setShowWord] = useState(false);
   const buttonRef = useRef(null);
   const keyboardContainerRef = useRef(null);
   const inputAreaRef = useRef(null);
   const [gameComplete, setGameComplete] = useState(false);
   const [feedback, setFeedback] = useState("");
   const [localDataLoaded, setLocalDataLoaded] = useState(false);

   const [disabled, setDisabled] = useState(false);
   const [showFeedback, setShowFeedback] = useState(false);

   const { allAllowedGuesses } = useGameData();

   const [inputAreaSize] = useElementSize(inputAreaRef.current);

   useEffect(() => {
      onCurrWord(currWord);
      // setCurrentLine(0);
      // setAnswers(["", "", "", "", "", ""]);
      setDisabled(false);
   }, [currWord]);

   const boxValues = useMemo(() => {
      if (!currWord || !answers) return [];

      const extendedAnswers = [...answers];
      extendedAnswers.length = 6; // Extend array
      extendedAnswers.fill("", answers.length); // Fill new elements starting from index 3

      return extendedAnswers.map((answer, rowIndex) => {
         let boxes = [...currWord].map((letter, index) => {
            return {
               value: answer[index],
               boxState: rowIndex === currentLine ? "current" : "default",
            };
         });

         const answerLetters = [...answer];
         const correctLetters = [...currWord];

         if (rowIndex < currentLine || isCompleted) {
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
   }, [answers, currentLine, isCompleted, currWord]);

   useEffect(() => {
      if (!isCompleted) return;

      const timer = setTimeout(() => {
         changeScreen({ type: "scoreboard", params: { highlight: answers.length } });
      }, 2500);
      return () => clearTimeout(timer);
   }, [isCompleted]);

   // useEffect(() => {
   //    const correctFeedback = ["Genius!", "Impressive!", "Happy days!", "Good effort", "Nice one!", "Made it!"];

   //    if (boxValues[currentLine - 1]) {
   //       const wordIsCorrect = boxValues[currentLine - 1].every((obj) => obj.boxState === "correct");
   //       if (wordIsCorrect) {
   //          setGameComplete(true);
   //          setFeedback(`${correctFeedback[currentLine - 1]}`);
   //          setDisabled(true);
   //          onCompleted("successful", currentLine);
   //          return;
   //       }

   //       if (currWord && currentLine === 6) {
   //          setDisabled(true);
   //          setFeedback(`Answer: ${currWord.toUpperCase()}`);
   //          onCompleted("failed", currentLine);
   //       }
   //    }
   // }, [currentLine, currWord]);

   const changeFeedback = (feedback) => {
      setFeedback(feedback);
      setShowFeedback(true);
   };
   useEffect(() => {
      if (showFeedback) {
         const timer = setTimeout(() => {
            setShowFeedback(false);
         }, 4500);
         return () => clearTimeout(timer);
      }
   }, [showFeedback]);

   function removeLastChar(str) {
      if (str.length > 0) {
         return str.slice(0, -1); // Remove the last character
      } else {
         return str; // Return the original string if it's empty
      }
   }

   const handleKeyboard = (key) => {
      setShowFeedback(false);
      if (disabled) return;
      if (!currWord) return;
      if (isCompleted) return;

      const lowerKey = key.toLowerCase();

      if (lowerKey === "enter") {
         const correctFeedback = ["Genius!", "Impressive!", "Happy days!", "Good effort", "Nice one!", "Made it!"];
         //  const wordIsCorrect = answers[currentLine - 1].every((obj) => obj.boxState === "correct");
         const submittedAnswer = answers[answers.length - 1].toLocaleLowerCase();
         if (submittedAnswer === currWord) {
            onCompleted("success");
            changeFeedback(`${correctFeedback[currentLine]}`);

            return;
         }

         if (allAllowedGuesses.includes(submittedAnswer)) {
            const newLine = currentLine + 1;
            const newAnswers = [...answers];
            if (!newAnswers[newLine] && newAnswers[newLine] !== "") {
               newAnswers[newLine] = "";
            }
            setCurrentLine(newLine);
            if (newLine < 6) {
               setAnswers(newAnswers);
            } else {
               onCompleted("failure");
               changeFeedback(`Answer: ${currWord.toUpperCase()}`);

               return;
            }
         } else {
            setTimeout(() => {
               if (answers[answers.length - 1].length < currWord.length) {
                  changeFeedback("Not enough letters");
               } else {
                  changeFeedback("Word not in list");
               }
               rowRefs.current[currentLine].shake(answers[answers.length - 1].length < currWord.length);
            }, 100);
         }

         return;
      }

      setAnswers((oldValue) => {
         const newAnswers = [...oldValue];
         if (currentLine >= 6) return oldValue;

         if (lowerKey === "delete" || lowerKey === "backspace") {
            newAnswers[currentLine] = removeLastChar(newAnswers[currentLine]);
            return newAnswers;
         }

         // disable any possible line overflow
         if (newAnswers[currentLine].length >= currWord.length) return oldValue;

         newAnswers[currentLine] += key;
         return newAnswers;
      });
   };

   useEffect(() => {
      if (isCompleted) return;
      onAnswerChange(answers, currentLine);
      // console.log("answers changed", answers);
   }, [answers, currentLine]);

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

   const negativeFeedback = feedback === "Not enough letters" || feedback === "Word not in list";

   const inputGridWidth = Math.min(inputAreaSize.height * 0.8, 420);

   return (
      <div className={classes.main}>
         <div className={classes.feedbackAndInputs} ref={inputAreaRef}>
            <div className={classes.feedbackWrapper}>
               <div
                  style={{ opacity: showFeedback ? 1 : 0, top: showFeedback ? "0px" : "15px" }}
                  className={`${classes.feedback} ${
                     negativeFeedback ? classes.negativeFeedback : classes.positiveFeedback
                  }`}
               >
                  {feedback.length ? feedback : "none"}
               </div>
            </div>

            <div className={classes["input-container"]} style={{ width: inputGridWidth + "px" }}>
               {boxValues.map((boxes, i) => {
                  return (
                     <InputRow
                        gridWidth={inputGridWidth}
                        boxes={boxes}
                        rowNumber={i}
                        key={"answer-row-" + i}
                        ref={(el) => (rowRefs.current[i] = el)}
                     />
                  );
               })}
            </div>
         </div>

         <div className={classes.keyboardWrapper} ref={keyboardContainerRef}>
            <KeyboardController
               onKeyEvent={(e) => handleKeyboard(e)}
               deps={[currWord, currentLine, disabled, allAllowedGuesses]}
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
