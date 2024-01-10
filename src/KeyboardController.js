import OnscreenKeyboard from "./OnscreenKeyboard";
import useKeyDown from "./hooks/useKeyDown";

const FILTER = [
   "backspace",
   "enter",
   "q",
   "w",
   "e",
   "r",
   "t",
   "y",
   "u",
   "i",
   "o",
   "p",
   "a",
   "s",
   "d",
   "f",
   "g",
   "h",
   "j",
   "k",
   "l",
   "z",
   "x",
   "c",
   "v",
   "b",
   "n",
   "m",
];

const KeyboardController = ({ onKeyEvent, deps = [], ...props }) => {
   const handleKeyboard = (key) => {
      onKeyEvent(key);
   };

   useKeyDown((key) => {
      //  const lowerCase = key.toLowerC
      if (!FILTER.includes(key.toLowerCase())) return;
      onKeyEvent(key);
   }, deps);

   return <OnscreenKeyboard onKeyDown={handleKeyboard} {...props} />;
};

export default KeyboardController;
