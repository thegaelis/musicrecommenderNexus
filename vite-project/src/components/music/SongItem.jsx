const SongItem = () => {
    return (
        <div className="flex justify-between items-center h-[65px] p-[10px] border-t border-gray-[100] transition-all hover:bg-alpha">
            {/* //*Block info */}
            <div className="flex gap-[10px] w-[50%] h-[100%]">
                <div className="w-[45px] h-[45px] overflow-hidden cursor-pointer">
                    {/* //* Image */}
                    <img
                        className="w-full object-cover transition-transform duration-300 ease-in-out transform hover:scale-125"
                        src="https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/f/9/3/9/f9390ab7a26adbe59739fe2ba9470ee1.jpg"
                        alt="Avatar"
                    />
                </div>

                <div className="flex flex-col justify-between">
                    {/* //* Name */}
                    <p className="text-primary font-semibold cursor-pointer transition-all hover:text-hover">
                        Ngày Mai Người Ta Lấy Chồng
                    </p>

                    {/* //* Artists */}
                    <p className="cursor-default">Thành Đạt</p>
                </div>
            </div>

            {/* //*Album  */}
            <p className="flex-grow cursor-default">
                Ngày Mai Người Ta Lấy Chồng
            </p>

            {/* //*Duration  */}
            <p className="cursor-default">06:02</p>
        </div>
    );
};

export default SongItem;
