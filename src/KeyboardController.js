
import OnscreenKeyboard from "./OnscreenKeyboard";
import useKeyDown from "./hooks/useKeyDown";


const FILTER = ["backspace", "enter", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l","z", "x", "c", "v", "b", "n", "m"]

const KeyboardController = ({onKeyEvent, deps = []}) => {

    const handleKeyboard = (key) => {
        console.log("handle onscreen keyboard", key)
        onKeyEvent(key)
    }

    useKeyDown((key)=>{
       console.log("key", key)
      //  const lowerCase = key.toLowerC
        if(!FILTER.includes(key.toLowerCase()))return;
        console.log("handle keyboard", key)
        onKeyEvent(key)
    }, deps)

   return <OnscreenKeyboard onKeyDown={handleKeyboard}/>
}

export default KeyboardController