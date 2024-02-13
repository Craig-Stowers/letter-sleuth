import classes from "./ScoreScreen.module.css";
import React, { useState, useRef } from "react";

import scoreboardImage from "../../assets/scoreboard-demo.png";

const ScoreScreen = ({ onButtonHit }) => {
   return (
      <div className={classes.container}>
         <img src={scoreboardImage} />
      </div>
   );
};

export default ScoreScreen;
