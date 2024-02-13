// Defining the Button component with a render prop
const CustomButton = ({ render }) => {
   return <button style={{ padding: "10px 20px", fontSize: "16px" }}>{render()}</button>;
};
