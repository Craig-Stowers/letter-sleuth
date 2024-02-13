const RepeatBackground = ({ image, style = {}, repeatImageStyle = {} }) => {
   const containerStyle = {
      position: "absolute",
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      ...style,
   };

   const repeatStyle = {
      position: "absolute",
      width: "150vw",
      height: "150vh",
      left: "-25vw",
      top: "-25vh",
      backgroundRepeat: "repeat",
      backgroundImage: `url(${image})`,
      transform: "rotate(-10deg)",
      transformOrigin: "center",
      ...repeatImageStyle,
   };

   return (
      <div style={{ position: "relative" }}>
         <div style={containerStyle}>
            <div style={repeatStyle} />
         </div>
      </div>
   );
};

export default RepeatBackground;
