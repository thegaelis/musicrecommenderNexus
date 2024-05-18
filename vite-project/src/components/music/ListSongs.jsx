import SongItem from "./SongItem";

const ListSongs = () => {
    return (
        <div className="max-h-[calc(100vh-90px)] w-[60%] p-[20px] relative  ">
            <div className="font-semibold text-primary flex justify-between items-center p-[10px]">
                <p className="w-[50%] cursor-default">Bài hát</p>
                <p className="flex-grow cursor-default">Album</p>
                <p className="cursor-default">Thời gian</p>
            </div>

            <SongItem></SongItem>
            <SongItem></SongItem>
            <SongItem></SongItem>
            <SongItem></SongItem>
            <SongItem></SongItem>
        </div>
    );
};

export default ListSongs;
