import { useState, useEffect, forwardRef, useRef } from "react";
import classes from "./GameScreen.module.css";
import useElementWidth from "../../hooks/useElementWidth";
import useElementSize from "../../hooks/useElementSize";

const Letter = ({
    value,
    boxState,
    disableExpand = false,
    showHighlight = false,
    gridWidth,
    style = {},
}) => {
    const [filled, setFilled] = useState(false);
    const [showLetter, setShowLetter] = useState(false);

    const ref = useRef(null);
    // const [letterWidth, ref] = useElementWidth(
    //    (newWidth, oldWidth) => {
    //       return newWidth > 0 ? newWidth : oldWidth;
    //    },
    //    [gridWidth]
    // );

    const [size] = useElementSize(ref.current, null, null);
    const letterWidth = size.width;

    useEffect(() => {
        setFilled(value !== undefined);
    }, [value]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLetter(true);
        }, 100);
        return () => {
            clearTimeout(timer);
        };
    }, []);

    return (
        <div
            className={classes["letter-container"]}
            style={{
                ...style,
                height: letterWidth + 4 + "px",
                opacity: showLetter ? 1 : 0,
                transition: "opacity 0.5s",
            }}
        >
            <div
                ref={ref}
                style={{ height: letterWidth + "px" }}
                className={[
                    classes.letter,
                    classes[boxState],
                    filled ? classes.filled : "",
                    showHighlight ? "letter-highlight" : "",
                ].join(" ")}
                onAnimationEnd={(event) => {
                    event.stopPropagation();
                }}
            >
                <label>{value}</label>
            </div>
        </div>
    );
};

export default Letter;
