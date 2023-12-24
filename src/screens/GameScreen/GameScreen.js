import React, {useState, useEffect, useMemo} from "react";
import classes from "./GameScreen.module.css"
import InputRow from "./InputRow";
import KeyboardController from "../../KeyboardController";

const wordCharLength = 5;
const maxLines = 6

const GameScreen = ({currentWord:currWord, allowedWords}) => {
   
    const [currentLine, setCurrentLine] = useState(0)
    const [answers, setAnswers] = useState(["", "", "", "", "", ""])


    useEffect(()=>{
        console.log("currWord changed", currWord)
        setCurrentLine(0);
        setAnswers(["", "", "", "", "", ""]);
    }, [currWord])
    
    const getBoxState = (testLetter, correctLetter, rowIndex) => {
        if(rowIndex > currentLine)return "default";
        if(rowIndex === currentLine)return "current";

        if(testLetter === correctLetter)return "correct";
        if(currWord.includes(testLetter))return "partial";
        return "incorrect";
    }


    //update: check for correct answers first so appropriate double letter inputs can be marked incorrect rather than partial
    const boxValues = useMemo(()=>{
        if(!currWord)return [];
        return answers.map((answer, rowIndex)=>{
            let letters = []
            for(let i = 0; i < wordCharLength; i++){

                const boxState = getBoxState(answer[i], currWord[i], rowIndex);
               letters[i] = {
                    value:answer[i] || "",
                    boxState

               }
            }
            return letters;
        })

    }, [answers, currentLine]);

   
    useEffect(()=>{
        if(boxValues[currentLine - 1]) {
            const wordIsCorrect = boxValues[currentLine - 1].every(obj => obj.boxState === "correct");
            console.log("wordIsCorrect", wordIsCorrect);
        }
    },[currentLine]);

    function removeLastChar(str) {
        if (str.length > 0) {
          return str.slice(0, -1); // Remove the last character
        } else {
          return str; // Return the original string if it's empty
        }
        
      }


    const handleKeyboard = (key) => {

        if(!currWord)return;
     
        const lowerKey = key.toLowerCase();

       

        setAnswers( (oldValue)=>{


            const newAnswers = [...oldValue];

            if( lowerKey === "enter"){
                if (currentLine < newAnswers.length && allowedWords.includes(newAnswers[currentLine]) ) {
                    setCurrentLine(currentLine + 1);
                }
                return oldValue
            }

            if (lowerKey === 'delete' || lowerKey === 'backspace') {
                newAnswers[currentLine] = removeLastChar(newAnswers[currentLine]);
                return newAnswers;
            }

            if(newAnswers[currentLine].length >= currWord.length) return oldValue;

            console.log("add", key)

            newAnswers[currentLine] += key;
            return newAnswers

         })

    }

    return <div className={classes.main}>

        <h4>currentline: {currentLine}</h4>

        <div className='input-container'>
            {boxValues.map((boxes, i)=>{
                return <InputRow boxes={boxes} key={'answer-row-'+i}/>
            })}
        </div>
        <KeyboardController onKeyEvent={ (e)=> handleKeyboard(e)} deps={[currWord, currentLine]}/>
      
    </div>
}

export default GameScreen