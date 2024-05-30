import classes from "./InfoScreen.module.css";
import React, { useState, useRef } from "react";
import InputRow from "../GameScreen/InputRow";
import Letter from "../GameScreen/Letter";
import CustomButton from "../../shared/CustomButton";

const instructions = [
   {
      text: (
         <span>
            You have six tries to guess a five-letter word. Proper nouns and words that are, or can be interpreted as,
            plurals are not accepted. A new Wordiful puzzle is releaed every day.
            <br />
            Good luck!
         </span>
      ),
   },
   {
      text: (
         <span>
            Use the keyboard to type your letters and the <strong>Delete</strong> key to remove letters and try again.
         </span>
      ),
      boxes: [{ value: "S" }, { value: "N" }, { value: "A" }, {}, {}],
   },
   {
      text: (
         <span>
            Press the <strong>Enter</strong> key to submit your word. The colour of each letter will show how close your
            guess is to the hidden word.
         </span>
      ),
      boxes: [
         { value: "S", boxState: "correct" },
         { value: "N", boxState: "incorrect" },
         { value: "A", boxState: "incorrect" },
         { value: "I", boxState: "partial" },
         { value: "L", boxState: "incorrect" },
      ],
   },
   {
      text: (
         <span>
            Green means a letter is in the correct spot in the word. The letter may be used more than once in the word.
         </span>
      ),
      boxes: [
         { value: "S", boxState: "correct", showHighlight: true },
         { value: "N", boxState: "incorrect" },
         { value: "A", boxState: "incorrect" },
         { value: "I", boxState: "partial" },
         { value: "L", boxState: "incorrect" },
      ],
   },
   {
      text: (
         <span>
            Pink means a letter is in the word, but in the wrong spot. The letter may be used more than once in the
            word.
         </span>
      ),
      boxes: [
         { value: "S", boxState: "correct" },
         { value: "N", boxState: "incorrect" },
         { value: "A", boxState: "incorrect" },
         { value: "I", boxState: "partial", showHighlight: true },
         { value: "L", boxState: "incorrect" },
      ],
   },
   {
      text: <span>Light grey means a letter is not in the word.</span>,
      boxes: [
         { value: "S", boxState: "correct" },
         {
            type: "group",
            boxes: [
               { value: "N", boxState: "incorrect" },
               { value: "A", boxState: "incorrect" },
            ],
         },

         { value: "I", boxState: "partial" },
         { value: "L", boxState: "incorrect", showHighlight: true },
      ],
   },
   {
      text: <span>All used letters will be highlighted on the keyboard and can be included in future guesses.</span>,
   },
   {
      text: (
         <span>
            The game is over when you have guessed the correct word and all letters are green, or you have used your six
            guesses.
         </span>
      ),
      boxes: [
         { value: "S", boxState: "correct" },
         { value: "P", boxState: "correct" },
         { value: "I", boxState: "correct" },
         { value: "K", boxState: "correct" },
         { value: "E", boxState: "correct" },
      ],
   },
];

const InfoScreen = ({ onButtonHit }) => {
   const rowRef = useRef(null);
   const [currIndex, setCurrIndex] = useState(0);

   const handleButtonHit = () => {
      if (currIndex === instructions.length - 1) {
         onButtonHit("close");
      }

      setCurrIndex((oldValue) => {
         return oldValue === instructions.length - 1 ? 0 : oldValue + 1;
      });
   };

   const boxes = instructions[currIndex].boxes ? instructions[currIndex].boxes : [];

   return (
      <div className={classes.container}>
         <div className={classes.panel}>
            <h3>
               {currIndex + 1}/{instructions.length}
            </h3>
            <h2>How to play</h2>
            <p>{instructions[currIndex].text}</p>
         </div>

         <div className={classes.letters}>
            {boxes.map((box, i) => {
               if (!box.type) return <Letter {...box} key={"help-letter-" + i} />;
               if (box.type === "group") {
                  return (
                     <div style={{ width: "40%", display: "flex" }} className={"letter-highlight-group"}>
                        {box.boxes.map((groupedBox, j) => {
                           return (
                              <Letter {...groupedBox} key={"help-letter-" + i + "-" + j} style={{ width: "50%" }} />
                           );
                        })}
                     </div>
                  );
               }
            })}

            {/* <Letter value={"X"} boxState={"correct"} key={"letter-X"} />
            <div style={{ display: "flex", width: "40%" }} className={"letter-highlight"}>
               <Letter value={"X"} boxState={"correct"} key={"letter-X"} style={{ width: "50%" }} />
               <Letter value={"X"} boxState={"correct"} key={"letter-X"} style={{ width: "50%" }} />
            </div> */}
         </div>

         <div className={classes.nextWrapper}>
            <CustomButton
               render={() => {
                  return (
                     <span style={{ padding: "0px", paddingLeft: "7px", paddingRight: "7px" }}>
                        {currIndex === instructions.length - 1 ? "CLOSE" : "NEXT"}
                     </span>
                  );
               }}
               onClick={handleButtonHit}
            />
         </div>
      </div>
   );
};

export default InfoScreen;
