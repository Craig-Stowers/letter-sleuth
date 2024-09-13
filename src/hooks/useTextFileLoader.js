import { useEffect, useState } from "react";

function useTextFileLoader(filePath) {
    const [fileContent, setFileContent] = useState(null);

    useEffect(() => {
        fetch("." + filePath)
            .then((response) => response.text())
            .then((contents) => {
                setFileContent(contents);
            })
            .catch((error) => console.error("Error:", error));
    }, [filePath]);

    return fileContent;
}

export default useTextFileLoader;
