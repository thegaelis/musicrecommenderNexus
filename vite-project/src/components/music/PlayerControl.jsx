import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePause,
    faCirclePlay,
    faForwardStep,
    faBackwardStep,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import PropTypes from "prop-types";

const PlayerControl = (props) => {
    // console.log(props.data);
    const [isPlay, setIsPlay] = useState(true);
    const handleTogglePlay = () => {
        setIsPlay(!isPlay);
    };

    const handleNext = () => {
        console.log("Next");
    };

    const handleBack = () => {
        console.log("Back");
    };

    return (
        <div className="fixed w-screen h-[90px] bg-[#f9c6c5] px-[20px] py-[10px] bottom-0 flex ">
            {/* //*Block info */}
            <div className="flex gap-[10px] w-[50%] h-[100%]">
                {/* <div className="w-[70px] h-[70px] overflow-hidden cursor-default">
                    <img
                        className="w-full object-cover "
                        src="https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/f/9/3/9/f9390ab7a26adbe59739fe2ba9470ee1.jpg"
                        alt="Avatar"
                    />
                </div> */}

                <div className="flex flex-col justify-center ">
                    {/* //* Name */}
                    {/* <p className="text-primary font-semibold  transition-all cursor-default">
                        Ngày Mai Người Ta Lấy Chồng
                    </p> */}

                    {/* //* Artists */}
                    {/* <p className="cursor-default">Thành Đạt</p> */}
                </div>
            </div>

            {/* //* Controller */}
            {/* npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core
             */}
            {/* <div className="flex gap-5 text-primary text-3xl items-center">
                <FontAwesomeIcon
                    icon={faBackwardStep}
                    className="cursor-pointer"
                    onClick={handleBack}
                />

                {isPlay ? (
                    <FontAwesomeIcon
                        icon={faCirclePause}
                        className="cursor-pointer"
                        onClick={handleTogglePlay}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faCirclePlay}
                        className="cursor-pointer"
                        onClick={handleTogglePlay}
                    />
                )}

                <FontAwesomeIcon
                    icon={faForwardStep}
                    className="cursor-pointer"
                    onClick={handleNext}
                />
            </div> */}
        </div>
    );
};

PlayerControl.propTypes = {
    data: PropTypes.array,
};

export default PlayerControl;
