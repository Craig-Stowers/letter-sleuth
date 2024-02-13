import classes from "./HomeScreen.module.css";

const HomeScreen = ({ onButtonHit }) => {
   return (
      <div className={classes.container}>
         <div className={classes.header}>
            <button>CLOSE</button>
         </div>

         <div className={classes.title}>
            <h1>Wordiful</h1>
         </div>
         <div className={classes.footer}>
            <div className={classes.buttons}>
               <button
                  onClick={() => {
                     onButtonHit("info");
                  }}
               >
                  info
               </button>
               <button
                  onClick={() => {
                     onButtonHit("play");
                  }}
               >
                  Play
               </button>
               <button
                  onClick={() => {
                     onButtonHit("scoreboard");
                  }}
               >
                  Scores
               </button>
            </div>
         </div>
      </div>
   );
};

export default HomeScreen;
