import classes from "./Keyboard.module.css";
import deleteIcon from "./icons/key-delete.svg";
const keyRow1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
const keyRow2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
const keyRow3 = ["z", "x", "c", "v", "b", "n", "m"];

const Keyboard = ({ onKeyDown, keyColours }) => {
   const renderKey = (value, extraClasses, customRender) => {
      const colourClass = keyColours[value] || "";

      return (
         <button
            type="button"
            key={"key-" + value}
            aria-disabled={false}
            aria-label={"add " + value}
            data-key={value}
            className={`${classes.key} ${colourClass ? classes[colourClass] : ""} ${extraClasses ? extraClasses : ""}`}
            onMouseDown={(e) => {
               // setTimeout(() => {
               //     e.target.blur();
               // }, 0);
               // e.target.blur();
            }}
            onClick={() => {
               onKeyDown(value);
            }}
         >
            {customRender ? customRender : value}
         </button>
      );
   };

   //prevent default on parent seems to stop auto focus when mousedown chidlren
   return (
      <div className={classes.keyboard} onMouseDown={(e) => e.preventDefault()}>
         <div className={classes.keyRow}>{keyRow1.map((el) => renderKey(el))}</div>
         <div className={classes.keyRow}>
            <div className={classes.spacer} />
            {keyRow2.map((el) => renderKey(el))}
            <div className={classes.spacer} />
         </div>
         <div className={classes.keyRow}>
            {renderKey("enter", `${classes.large} ${classes.enterKey}`)}
            {keyRow3.map((el) => renderKey(el))}
            {renderKey("Delete", classes.large, <img src={deleteIcon} />)}
         </div>
      </div>
   );
};

export default Keyboard;
