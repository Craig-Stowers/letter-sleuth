import classes from "./Header.module.css";

const Header = ({ buttons, onButtonHit }) => {
   if (!buttons.length) return null;

   return (
      <div className={classes.header}>
         <div className={classes.logo}>LOGO</div>
         <div className={classes.buttons}>
            {buttons.includes("home") && (
               <button
                  onClick={() => {
                     onButtonHit("home");
                  }}
               >
                  home
               </button>
            )}
            {buttons.includes("info") && (
               <button
                  onClick={() => {
                     onButtonHit("info");
                  }}
               >
                  info
               </button>
            )}
            {buttons.includes("close") && (
               <button
                  onClick={() => {
                     onButtonHit("close");
                  }}
               >
                  close
               </button>
            )}
         </div>
      </div>
   );
};

export default Header;
