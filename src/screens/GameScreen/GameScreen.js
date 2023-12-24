import React, { useState, useEffect, useMemo, useRef } from "react";
import classes from "./GameScreen.module.css";
import InputRow from "./InputRow";
import KeyboardController from "../../KeyboardController";

const wordCharLength = 5;
const maxLines = 6;

const GameScreen = ({ currentWord: currWord, allowedWords }) => {
   const [currentLine, setCurrentLine] = useState(0);
   const [answers, setAnswers] = useState(["", "", "", "", "", ""]);
   const rowRefs = useRef([]);

   useEffect(() => {
      console.log("currWord changed", currWord);
      setCurrentLine(0);
      setAnswers(["", "", "", "", "", ""]);
   }, [currWord]);

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
      if (boxValues[currentLine - 1]) {
         const wordIsCorrect = boxValues[currentLine - 1].every((obj) => obj.boxState === "correct");
      }
   }, [currentLine]);

   function removeLastChar(str) {
      if (str.length > 0) {
         return str.slice(0, -1); // Remove the last character
      } else {
         return str; // Return the original string if it's empty
      }
   }

   const handleKeyboard = (key) => {
      if (!currWord) return;

      const lowerKey = key.toLowerCase();

      setAnswers((oldValue) => {
         const newAnswers = [...oldValue];

         if (lowerKey === "enter") {
            if (currentLine < newAnswers.length && allowedWords.includes(newAnswers[currentLine])) {
               setCurrentLine(currentLine + 1);
            } else {
               setTimeout(() => {
                  console.log(newAnswers.length);
                  rowRefs.current[currentLine].shake(newAnswers[currentLine].length < currWord.length);
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

   return (
      <div className={classes.main}>
         <h4>currentline: {currentLine}</h4>

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
            <KeyboardController onKeyEvent={(e) => handleKeyboard(e)} deps={[currWord, currentLine]} />
         </div>
      </div>
   );
};

export default GameScreen;
