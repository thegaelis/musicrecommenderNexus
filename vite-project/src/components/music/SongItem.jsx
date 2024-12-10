import { faChampagneGlasses } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const SongItem = (props) => {
    // console.log("SongItem");
    // console.log(props.data.track_id);
    return (
        <div
            className="flex justify-between items-center h-[65px] p-[10px] border-t border-gray-[100] transition-all hover:bg-alpha cursor-pointer"
            onClick={(e) => {
                if (props.data.preview) {
                    console.log("link");
                    const url = props.data.preview;
                    window.open(url, "_blank");
                } else if (props.data.track_id) {
                    console.log("name");
                    const url =
                        "https://open.spotify.com/track/" + props.data.track_id;
                    window.open(url, "_blank");
                    props.handleSelectSong(props.data.track_id);
                }
            }}
        >
            {/* //*Block info */}
            <div className="flex gap-[10px] w-[50%] h-[100%]">
                <div className="flex flex-col justify-between">
                    {/* //* Name */}
                    <p className="text-primary font-semibold cursor-pointer transition-all hover:text-hover">
                        {props.data.track_name || props.data.track}
                    </p>

                    {/* //* Artists */}
                    <p className="cursor-default">
                        {props.data.artists || props.data.artist}
                    </p>
                </div>
            </div>

            {/* //*Track_genre  */}
            <p className="flex-grow cursor-default">
                {props.data.track_genre || props.data.genre}
            </p>

            {/* //*Đánh giá  */}
            <p className="cursor-default">
                {props.data.popularity || props.data.similarity_score}
            </p>
        </div>
    );
};

SongItem.propTypes = {
    data: PropTypes.object,
    handleSelectSong: PropTypes.func,
};

export default SongItem;
