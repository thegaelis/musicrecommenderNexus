import SongItem from "./SongItem";
import PropTypes from "prop-types";

const ListSongs = (props) => {
    return (
        <div className="max-h-[calc(100vh-90px)] w-[70%] p-[20px] relative  ">
            <div className="font-semibold text-primary flex justify-between items-center p-[10px]">
                <p className="w-[50%] cursor-default">Bài hát</p>
                <p className="flex-grow cursor-default">Thể loại</p>
                <p className="cursor-default">Phổ biến/Tương đồng</p>
            </div>

            {props.data?.map((item, index) => {
                return (
                    <SongItem
                        data={item}
                        key={index}
                        handleSelectSong={props.handleSelectSong}
                    ></SongItem>
                );
            })}
        </div>
    );
};

ListSongs.propTypes = {
    data: PropTypes.array,
    handleSelectSong: PropTypes.func,
};

export default ListSongs;
