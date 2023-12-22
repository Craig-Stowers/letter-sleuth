import { useState } from "react"
import classes from "./GameScreen.module.css"

const Letter = ({value, boxState}) => {

    const [result, setResult] = useState("partial")

    return <div className={[classes.letter, classes[boxState]].join(" ")}>
        <label>
            {value}
        </label>
    </div>
}

export default Letter;