import classes from "./InfoScreen.module.css";
import React, { useRef } from "react";
import InputRow from "../GameScreen/InputRow";
import Letter from "../GameScreen/Letter";

const InfoScreen = ({ onButtonHit }) => {
   const rowRef = useRef(null);

   const boxes = [
      { value: "S", boxState: "correct" },
      { value: "N" },
      { value: "A" },
      { value: "Ix", boxState: "partial", showHighlight: true },
      { value: "L" },
   ];

   return (
      <div className={classes.container}>
         <div>instructions</div>
         <div style={{ display: "inline" }} className={"letter-highlight"}>
            <Letter value={"X"} boxState={"correct"} key={"letter-X"} />
            <Letter value={"X"} boxState={"correct"} key={"letter-X"} />
         </div>

         <InputRow boxes={boxes} rowNumber={0} key={"answer-row-training"} ref={rowRef} />
         <div className={classes.nextWrapper}>
            <button>NEXT</button>
         </div>
      </div>
   );
};

export default InfoScreen;
