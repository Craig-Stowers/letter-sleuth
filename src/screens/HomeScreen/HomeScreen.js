import classes from "./HomeScreen.module.css";
import CustomButton from "../../shared/CustomButton";
import iconStats from "../../icons/icon-stats.svg";
import iconInfo from "../../icons/icon-info.svg";
import iconClose from "../../icons/icon-close.svg";
import logo from "../../assets/wordiful-logo.png";
import {
    globalImagePreloader,
    useImagePreloader,
} from "../../helpers/ImageLoader";
const imageLoadPromises = globalImagePreloader.preloadImages([
    logo,
    iconClose,
    iconInfo,
    iconStats,
]);

const HomeScreen = ({ onButtonHit, devMode = false }) => {
    const imagesLoaded = useImagePreloader(imageLoadPromises);
    if (!imagesLoaded) return null;
    return (
        <div className={`global-homescreen ${classes.container}`}>
            <div className={classes.header}>
                <CustomButton
                    moduleClasses={["home-button"]}
                    render={() => {
                        return <img src={iconClose} />;
                    }}
                    onClick={() => {
                        onButtonHit("close");
                    }}
                />
            </div>

            <div
                className={classes.title}
                onClick={() => onButtonHit("devmode")}
            >
                <h1>Letter Sleuth</h1>
                {/* <img src={logo} onClick={() => onButtonHit("devmode")} /> */}
            </div>
            <div className={classes.footer}>
                <div className={classes.buttonsWrapper}>
                    <div className={classes.buttons}>
                        <CustomButton
                            moduleClasses={["home-button"]}
                            render={() => {
                                return <img src={iconInfo} />;
                            }}
                            onClick={() => {
                                onButtonHit("info");
                            }}
                        />
                        <CustomButton
                            moduleClasses={["home-button", "text-button"]}
                            render={() => {
                                return <span>PLAY</span>;
                            }}
                            onClick={() => {
                                onButtonHit("play");
                            }}
                        />

                        <CustomButton
                            moduleClasses={["home-button"]}
                            render={() => {
                                return <img src={iconStats} />;
                            }}
                            onClick={() => {
                                onButtonHit("scoreboard");
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeScreen;
