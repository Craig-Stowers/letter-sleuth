import { useEffect, useState, useRef } from "react";

const textFileCache = {};

function useTextFileLoader(filePath) {
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        if (!filePath) return;
        if (textFileCache[filePath]) {
            setFileContent(textFileCache[filePath]);
            return;
        }
        fetch("." + filePath)
            .then((response) => response.text())
            .then((contents) => {
                setFileContent(contents);
                textFileCache[filePath] = contents;
            })
            .catch((error) => console.error("Error:", error));
    }, [filePath]);

    return fileContent;
}

export default useTextFileLoader;
