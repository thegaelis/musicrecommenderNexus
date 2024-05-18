import { useState } from "react";
import InputItem from "../music/InputItem";

const Form = () => {
    const data = {
        name: [
            "Lạc Trôi",
            "Em Gái Mưa",
            "Có Chắc Yêu Là Đây",
            "Nơi Này Có Anh",
            "Chạy Ngay Đi",
            "Cơn Mưa Ngang Qua",
            "Hãy Trao Cho Anh",
            "Thái Bình Mồ Hôi Rơi",
            "Chúng Ta Không Thuộc Về Nhau",
            "Anh Cứ Đi Đi",
            "Người Lạ Ơi",
            "Ánh Nắng Của Anh",
            "Bống Bống Bang Bang",
            "Phía Sau Một Cô Gái",
            "Đâu Chỉ Riêng Em",
            "Yêu 5",
            "Một Nhà",
            "Lemon Tree",
            "Shape of You",
            "Despacito",
            "See You Again",
            "Closer",
            "Let Me Love You",
            "Havana",
            "Something Just Like This",
            "Faded",
            "Rockabye",
            "Perfect",
            "Cheap Thrills",
            "Stay",
            "Stitches",
            "Love Yourself",
            "Sorry",
            "Blank Space",
            "Thinking Out Loud",
            "Photograph",
            "Sugar",
            "Uptown Funk",
            "Happy",
            "Royals",
            "Radioactive",
            "Demons",
            "Counting Stars",
            "All of Me",
            "Dark Horse",
            "Roar",
            "Wrecking Ball",
            "We Can't Stop",
            "Applause",
            "Do What U Want",
            "Venus",
        ],
        artist: [
            "Sơn Tùng M-TP",
            "Hương Tràm",
            "Mỹ Tâm",
            "Noo Phước Thịnh",
            "Bích Phương",
            "Đức Phúc",
            "Min",
            "JustaTee",
            "Phương Ly",
            "Isaac",
            "Hari Won",
            "Hồ Ngọc Hà",
            "Khởi My",
            "Chi Pu",
            "ERIK",
            "Suni Hạ Linh",
            "Đông Nhi",
            "Hoàng Thùy Linh",
            "Vũ Cát Tường",
            "Tiên Tiên",
            "Trúc Nhân",
            "Soobin Hoàng Sơn",
            "Ngô Kiến Huy",
            "Trịnh Thăng Bình",
            "Trung Quân Idol",
            "Bùi Anh Tuấn",
            "Ali Hoàng Dương",
            "Tóc Tiên",
            "Hoàng Dũng",
            "Quang Hùng MasterD",
            "AMEE",
            "B Ray",
            "K-ICM",
            "Jack",
            "Mr. Siro",
            "OnlyC",
            "Karik",
            "Binz",
            "Đen",
            "Rhymastic",
            "Sơn Tùng M-TP",
            "Taylor Swift",
            "Ed Sheeran",
            "Justin Bieber",
            "Shawn Mendes",
            "Charlie Puth",
            "Camila Cabello",
            "Selena Gomez",
            "Ariana Grande",
            "Billie Eilish",
            "The Weeknd",
        ],
        genre: [
            "Pop",
            "Ballad",
            "Rock",
            "Hip-hop",
            "R&B",
            "Electronic",
            "Dance",
            "Country",
            "Jazz",
            "Classical",
            "Blues",
            "Reggae",
            "Latin",
            "Metal",
            "Folk",
            "Soul",
            "Funk",
            "Disco",
            "Indie",
            "Punk",
            "Ska",
            "Gospel",
            "Opera",
            "K-pop",
            "J-pop",
            "C-pop",
            "Alternative",
            "Ambient",
            "Dubstep",
            "Techno",
            "House",
            "Trance",
            "Drum & Bass",
            "Garage",
            "Grime",
            "Trap",
            "Emo",
            "Synth-pop",
            "New Wave",
            "Post-punk",
            "Shoegaze",
            "Dream Pop",
        ],
    };

    const [input, setInput] = useState({
        name: "",
        artist: "",
        genre: "",
    });
    const [selectedInput, setSelectedInput] = useState({
        name: [],
        artist: [],
        genre: [],
    });
    const [filteredInput, setFilteredInput] = useState(data);

    const handleInputChange = (e, type) => {
        const value = e.target.value;

        // Update the specific field in the input state
        setInput({ ...input, [type]: value });

        // Filter the data based on the input value
        const filtered = value
            ? data[type].filter((item) =>
                  item.toLowerCase().includes(value.toLowerCase())
              )
            : data[type];

        // Update the specific field in the filteredInput state
        setFilteredInput({ ...filteredInput, [type]: filtered });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit");
        console.log(selectedInput);
    };

    const handleItemSelect = (item, type) => {
        const alreadySelected = selectedInput[type].includes(item);

        setSelectedInput({
            ...selectedInput,
            [type]: alreadySelected
                ? selectedInput[type].filter((i) => i !== item)
                : [...selectedInput[type], item],
        });
    };

    return (
        <div className=" max-h-[calc(100vh-90px)] w-[40%] p-[20px] border-r border-gray-300 shadow-lg overflow-auto">
            <form
                className="flex flex-col  justify-start space-y-4 pt-[10px]"
                onSubmit={handleSubmit}
            >
                {/* //*Input 1 */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="name"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
                    >
                        Name of song:
                        {selectedInput.name?.map((item, index) => (
                            <span className="font-normal" key={index}>
                                {item + ", "}
                            </span>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="name"
                        value={input.name}
                        onChange={(e) => {
                            handleInputChange(e, "name");
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter name here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.name.map((item, index) => (
                            <InputItem
                                data={item}
                                type="name"
                                onClick={handleItemSelect}
                                key={index}
                            ></InputItem>
                        ))}
                    </div>
                </div>

                {/* //*Input 2 */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="artist"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
                    >
                        Artists:
                        {selectedInput.artist?.map((item, index) => (
                            <span className="font-normal" key={index}>
                                {item + ", "}
                            </span>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="artist"
                        value={input.artist}
                        onChange={(e) => {
                            handleInputChange(e, "artist");
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter artist here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.artist.map((item, index) => (
                            <InputItem
                                data={item}
                                type="artist"
                                onClick={handleItemSelect}
                                key={index}
                            ></InputItem>
                        ))}
                    </div>
                </div>

                {/* //*Input 3 */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="genre"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
                    >
                        Genres:
                        {selectedInput.genre?.map((item, index) => (
                            <span className="font-normal" key={index}>
                                {item + ", "}
                            </span>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="genre"
                        value={input.genre}
                        onChange={(e) => {
                            handleInputChange(e, "genre");
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter genre here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.genre.map((item, index) => (
                            <InputItem
                                data={item}
                                type="genre"
                                onClick={handleItemSelect}
                                key={index}
                            ></InputItem>
                        ))}
                    </div>
                </div>

                {/* //* Submit Button */}
                <div className="flex-shrink-0">
                    <button
                        type="submit"
                        className="w-full p-2 bg-primary text-white rounded-md shadow-sm hover:bg-hover-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
