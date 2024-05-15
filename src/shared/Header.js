import classes from "./Header.module.css";
import CustomButton from "./CustomButton";
import iconHome from "../icons/icon-home.svg";
import iconInfo from "../icons/icon-info.svg";
import iconClose from "../icons/icon-close.svg";
import logo from "../assets/wordiful-logo.png";
import { useLayoutEffect, useState } from "react";
const Header = ({ buttons, onButtonHit, hint, showGameTitle }) => {
   const [showHint, setShowHint] = useState(false);
   useLayoutEffect(() => {
      if (hint) setShowHint(false);
   }, [hint]);

   if (!buttons.length) return null;

   return (
      <div className={`global-header ${classes.header}`}>
         <div className={classes.inner}>
            {showGameTitle && (
               <div className={classes.logo} onClick={() => setShowHint((value) => !value)}>
                  <div>Letter Sleuth</div>
               </div>
            )}
            {hint && showHint && <span className={classes.hint}>answer: {hint}</span>}
            <div className={classes.buttons}>
               <div className={classes.buttonsWrap}>
                  {buttons.includes("home") && (
                     <CustomButton
                        render={() => {
                           return <img src={iconHome} />;
                        }}
                        onClick={() => {
                           onButtonHit("home");
                        }}
                     />
                  )}
                  {buttons.includes("info") && (
                     <CustomButton
                        render={() => {
                           return <img src={iconInfo} />;
                        }}
                        onClick={() => {
                           onButtonHit("info");
                        }}
                     />
                  )}
                  {buttons.includes("close") && (
                     <CustomButton
                        render={() => {
                           return <img src={iconClose} />;
                        }}
                        onClick={() => {
                           setShowHint(false);
                           onButtonHit("close");
                        }}
                     />
                  )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default Header;
