import classes from "./CustomButtons.module.css";
const CustomButton = ({ render, moduleClasses, className, ...props }) => {
   let buttonClasses = moduleClasses ? moduleClasses.map((c) => classes[c]).join(" ") : "";
   buttonClasses = `${classes.container} ${buttonClasses} ${className ? className : ""}`;

   return (
      <button {...props} className={buttonClasses}>
         {/* <div className={classes.darkshade} /> */}
         <div className={classes.inner}>{render()}</div>
      </button>
   );
};

export default CustomButton;
