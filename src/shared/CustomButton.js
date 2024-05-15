import classes from "./CustomButtons.module.css";
const CustomButton = ({ render, className, ...props }) => {
   return (
      <button {...props} className={`${className} ${classes.container}`}>
         {/* <div className={classes.darkshade} /> */}
         <div className={classes.inner}>{render()}</div>
      </button>
   );
};

export default CustomButton;
