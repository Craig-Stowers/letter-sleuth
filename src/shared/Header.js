import classes from "./Header.module.css";
import CustomButton from "./CustomButton";
import iconHome from "../icons/icon-home.svg";
import iconInfo from "../icons/icon-info.svg";
import iconClose from "../icons/icon-close.svg";
import logo from "../assets/wordiful-logo.png";
const Header = ({ buttons, onButtonHit }) => {
   if (!buttons.length) return null;

   const buttonSize = "35px";

   return (
      <div className={classes.header}>
         <div className={classes.logo}>
            <img src={logo} />
         </div>
         <div className={classes.buttons}>
            {buttons.includes("home") && (
               <CustomButton
                  render={() => {
                     return <img style={{ height: buttonSize, width: buttonSize }} src={iconHome} />;
                  }}
                  onClick={() => {
                     onButtonHit("home");
                  }}
               />
            )}
            {buttons.includes("info") && (
               <CustomButton
                  render={() => {
                     return <img style={{ height: buttonSize, width: buttonSize }} src={iconInfo} />;
                  }}
                  onClick={() => {
                     onButtonHit("info");
                  }}
               />
            )}
            {buttons.includes("close") && (
               <CustomButton
                  render={() => {
                     return <img style={{ height: buttonSize, width: buttonSize }} src={iconClose} />;
                  }}
                  onClick={() => {
                     onButtonHit("close");
                  }}
               />
            )}
         </div>
      </div>
   );
};

export default Header;
