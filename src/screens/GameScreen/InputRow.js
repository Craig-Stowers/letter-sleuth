import Letter from "./Letter";

import classes from "./GameScreen.module.css";

const alphabet = ["a", "b", "c", "d", "e", "f", "g", "h" , "u", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s" , "t", "u", "v", "w", "x", "y", "z"]
const InputRow = ({boxes}) => {

   // const splitAnswerArr = answer.split("");
  
    return <div className={classes["input-row"]}>

        {
            boxes.map((el, i)=>{
                const val = "1" //splitAnswerArr[i] || ""
                //console.log("value", val);
               
               return <Letter key={'letter-'+i} value={el.value} boxState={el.boxState}/>
            })
        }

    
     </div>
}

export default InputRow