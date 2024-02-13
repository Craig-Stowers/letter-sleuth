const BackgroundSquare = () => {
   return (
      <div
         style={{
            width: "100px",
            height: "100px",
            padding: "10px",
            boxSizing: "border-box",
         }}
      >
         <div
            style={{
               border: "3px solid white",
               borderRadius: "6px",
               width: "100%",
               height: "100%",
               boxSizing: "border-box",
            }}
         />
      </div>
   );
};

export default BackgroundSquare;
