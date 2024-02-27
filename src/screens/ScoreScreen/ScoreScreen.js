import classes from "./ScoreScreen.module.css";
import React, { useState, useRef } from "react";

import scoreboardImage from "../../assets/scoreboard-demo.png";

const ScoreScreen = ({ onButtonHit }) => {
   const renderStatBox = (value, label) => {
      return (
         <div className={classes.statBox}>
            <div className={classes.value}>{value}</div>
            <div className={classes.label}>{label}</div>
         </div>
      );
   };

   const renderBar = (label, value) => {
      return (
         <div className={classes.bar}>
            <div className={classes.label}>{label}</div>
            <div className={classes.value}>{value}</div>
         </div>
      );
   };

   return (
      <div className={classes.root}>
         {/* <div className={classes.container}>
            <h1>Wordiful statistics</h1>

            <div className={classes.statRow}>
               {renderStatBox("27", "Games played")}
               {renderStatBox("92", "Win percentage")}
               {renderStatBox("4", "Current streak")}
               {renderStatBox("12", "Longest streak")}
            </div>

            <h1>Guess distribution</h1>

            <div className={classes.distribution}>
               {renderBar("0", "Games played")}
               {renderBar("1", "Win percentage")}
               {renderBar("2", "Current streak")}
               {renderBar("3", "Longest streak")}
               {renderBar("4", "Longest streak")}
               {renderBar("5", "Longest streak")}
               {renderBar("6", "Longest streak")}
            </div>
         </div> */}
         <img src={scoreboardImage} />
      </div>
   );
};

export default ScoreScreen;
