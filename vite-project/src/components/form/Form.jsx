import { useEffect, useState } from "react";
import Papa from "papaparse";
import InputItem from "./../music/InputItem";
import PropTypes from "prop-types";

const Form = (props) => {
    const [data, setData] = useState({
        artists: [],
        trackName: [],
        trackId: [],
    });
    const [hashData, setHashData] = useState({});

    const handleFileUpload = async () => {
        try {
            const filePath = "/dataset.csv"; // Ensure this path is correct
            const response = await fetch(filePath);
            const csvText = await response.text();
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const artists = results.data.map((row) => row.artists);
                    const trackName = results.data.map((row) => row.track_name);
                    const trackId = results.data.map((row) => row.track_id);

                    const trackHashTable = {};
                    trackName.forEach((name, index) => {
                        trackHashTable[name] = trackId[index];
                    });

                    setData({ artists, trackName, trackId });
                    setHashData(trackHashTable);
                },
            });
        } catch (error) {
            console.error("Error loading CSV file:", error);
        }
    };

    const getTrackIdByTrackName = (trackName) => {
        return hashData[trackName] || null;
    };

    useEffect(() => {
        handleFileUpload();
    }, []);

    const [filteredInput, setFilteredInput] = useState(data);

    useEffect(() => {
        if (
            data.artists.length > 0 &&
            data.trackName.length > 0 &&
            data.trackId.length > 0
        ) {
            setFilteredInput(data);
            console.log("Data từ file .csv");
            console.log(data);
        }
    }, [data]);

    const [input, setInput] = useState({
        trackName: "",
        artists: "",
        link: "",
    });

    const [selectedInput, setSelectedInput] = useState({
        trackName: [],
        artists: [],
    });

    const handleInputChange = (e, type) => {
        const value = e.target.value;

        // If trackName or artists is selected, prevent input for link
        if (
            (selectedInput.trackName.length > 0 ||
                selectedInput.artists.length > 0) &&
            type === "link"
        ) {
            return;
        }

        // Update the specific field in the input state
        setInput({ ...input, [type]: value });
        if (type === "link") return;

        // Filter the data based on the input value
        const filtered = value
            ? data[type].filter(
                  (item) =>
                      item && item.toLowerCase().includes(value.toLowerCase())
              )
            : data[type];

        // Update the specific field in the filteredInput state
        setFilteredInput({ ...filteredInput, [type]: filtered });
    };

    const handleItemSelect = (item, type) => {
        // If either trackName or artists is selected, prevent selection of the other
        if (input.link) return;
        if (type === "trackName" && selectedInput.artists.length > 0) {
            return;
        }
        if (type === "artists" && selectedInput.trackName.length > 0) {
            return;
        }

        const alreadySelected = selectedInput[type].includes(item);

        setSelectedInput({
            ...selectedInput,
            [type]: alreadySelected
                ? selectedInput[type].filter((i) => i !== item)
                : [...selectedInput[type], item],
        });
    };

    const extractSpotifyId = (url) => {
        const match = url.match(/\/([^\/]+)$/);
        return match ? match[1] : null;
    };

    return (
        <div className="max-h-[calc(100vh-90px)] w-[30%] p-[20px] border-r border-gray-300 shadow-lg overflow-auto">
            <form
                className=" h-[100%] flex flex-col justify-between space-y-4 pt-[10px]"
                onSubmit={(e) => {
                    // Get the value to be submitted
                    let submissionValue = null;
                    let type = null;

                    //* Nếu là Link thì lấy ID ở cuối
                    if (input.link) {
                        submissionValue = {
                            link: extractSpotifyId(input.link),
                        };
                        type = "link";
                    }
                    //* Nếu là trackName thì lấy id của các trackName đã chọn
                    else if (selectedInput.trackName.length > 0) {
                        const trackIds = selectedInput.trackName
                            .map((name) => getTrackIdByTrackName(name))
                            .filter((id) => id !== null);

                        if (trackIds.length > 0) {
                            submissionValue = { trackIds };
                        }
                        type = "trackName";
                    } else if (selectedInput.artists.length > 0) {
                        submissionValue = { artists: selectedInput.artists };
                    }

                    props.handleSubmit(e, submissionValue, type);
                }}
            >
                {/* //*Input 1 */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="trackName"
                        className="block text-base font-semibold text-gray-700 h-[100px] m-h-[100px]   overflow-auto"
                    >
                        {"Track name: "}
                        {selectedInput.trackName?.map((item, index) => (
                            <InputItem
                                data={item}
                                type="trackName"
                                onClick={handleItemSelect}
                                key={index}
                                tag="span"
                            ></InputItem>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="trackName"
                        value={input.trackName}
                        onChange={(e) => {
                            handleInputChange(e, "trackName");
                        }}
                        className="mt-3 mb-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter track name here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[250px] m-h-[250px]  overflow-auto">
                        {filteredInput.trackName
                            ?.slice(0, 10)
                            .map((item, index) => (
                                <InputItem
                                    data={item}
                                    type="trackName"
                                    onClick={handleItemSelect}
                                    key={index}
                                    tag="div"
                                ></InputItem>
                            ))}
                    </div>
                </div>

                {/* //*Input 3 */}
                <div className="flex flex-col flex-shrink-0 ">
                    <label
                        htmlFor="link"
                        className="block text-base font-semibold text-gray-700 h-[30px] max-h-[30px] overflow-auto"
                    >
                        Link:
                        {selectedInput.link?.map((item, index) => (
                            <span className="font-normal" key={index}>
                                {item + ", "}
                            </span>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="link"
                        value={input.link}
                        onChange={(e) => {
                            handleInputChange(e, "link");
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter link here"
                    />
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

Form.propTypes = {
    handleSubmit: PropTypes.func,
};

export default Form;
