import classes from "./HomeScreen.module.css";
import CustomButton from "../../shared/CustomButton";
import iconStats from "../../icons/icon-stats.svg";
import iconInfo from "../../icons/icon-info.svg";
import iconClose from "../../icons/icon-close.svg";
import logo from "../../assets/wordiful-logo.png";
const HomeScreen = ({ onButtonHit }) => {
   return (
      <div className={classes.container}>
         <div className={classes.header}>
            <CustomButton
               render={() => {
                  return <img src={iconClose} />;
               }}
               onClick={() => {
                  onButtonHit("scoreboard");
               }}
            />
         </div>

         <div className={classes.title}>
            <img src={logo} />
         </div>
         <div className={classes.footer}>
            <div className={classes.buttons}>
               <CustomButton
                  render={() => {
                     return <img src={iconInfo} />;
                  }}
                  onClick={() => {
                     onButtonHit("info");
                  }}
               />
               <CustomButton
                  render={() => {
                     return <span style={{ paddingLeft: "7px", paddingRight: "7px" }}>PLAY</span>;
                  }}
                  onClick={() => {
                     onButtonHit("play");
                  }}
               />

               <CustomButton
                  render={() => {
                     return <img src={iconStats} />;
                  }}
                  onClick={() => {
                     onButtonHit("scoreboard");
                  }}
               />
            </div>
         </div>
      </div>
   );
};

export default HomeScreen;
