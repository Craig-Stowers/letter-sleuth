import BackgroundSquare from "./BackgroundSquare";

const TitleBackground = () => {
   return (
      <div style={{ width: "100vw", height: "100vh", backgroundColor: "black", position: "relative" }}>
         <div style={{ display: "flex", position: "absolute", left: "-50px", transform: "rotate(-10)" }}>
            <BackgroundSquare />
            <BackgroundSquare />
            <BackgroundSquare />
            <BackgroundSquare />
            <BackgroundSquare />
            <BackgroundSquare />
         </div>
      </div>
   );
};

export default TitleBackground;
