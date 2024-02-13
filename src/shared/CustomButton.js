import classes from "./CustomButtons.module.css";
const CustomButton = ({ render, ...props }) => {
   return (
      <button {...props} className={classes.container}>
         <div className={classes.darkshade} />
         <div className={classes.inner}>{render()}</div>
      </button>
   );
};

export default CustomButton;
