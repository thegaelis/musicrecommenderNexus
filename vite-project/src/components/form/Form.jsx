import { useEffect, useState } from "react";
import Papa from "papaparse";
import InputItem from "./../music/InputItem";

const Form = () => {
    const [data, setData] = useState({ artists: [], trackName: [] });

    const handleFileUpload = async () => {
        try {
            const filePath = "/dataset.csv"; // Ensure this path is correct
            const response = await fetch(filePath);
            const csvText = await response.text();
            Papa.parse(csvText, {
                header: true,
                complete: (results) => {
                    const artists = results.data
                        .map((row) => row.artists)
                        .flat();
                    const trackName = results.data
                        .map((row) => row.track_name)
                        .flat();

                    setData({ artists, trackName });
                    // console.log("1"); //! chỗ này check
                    // console.log({ artists });
                },
            });
        } catch (error) {
            console.error("Error loading CSV file:", error);
        }
    };

    useEffect(() => {
        handleFileUpload();
    }, []);

    const [filteredInput, setFilteredInput] = useState(data);

    useEffect(() => {
        if (data.artists.length > 0 && data.trackName.length > 0) {
            setFilteredInput(data); //! Chổ này là set source để load, set thì UI lag
            // console.log(filteredInput);
            console.log("Fetched ok");
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit");

        // Get the value to be submitted
        let submissionValue = null;

        if (input.link) {
            submissionValue = { link: input.link };
        } else if (selectedInput.trackName.length > 0) {
            submissionValue = { trackName: selectedInput.trackName };
        } else if (selectedInput.artists.length > 0) {
            submissionValue = { artists: selectedInput.artists };
        }

        console.log(submissionValue);
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

    return (
        <div className="max-h-[calc(100vh-90px)] w-[30%] p-[20px] border-r border-gray-300 shadow-lg overflow-auto">
            <form
                className="flex flex-col justify-start space-y-4 pt-[10px]"
                onSubmit={handleSubmit}
            >
                {/* //*Input 1 */}
                {/* <span className="font-normal" key={index}>
                                {item + ", "}
                            </span> */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="trackName"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
                    >
                        Track name:
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
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter track name here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.trackName
                            ?.slice(0, 20)
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

                {/* //*Input 2 */}
                {/* <span className="font-normal" key={index}>
                                {item + ", "}
                            </span> */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="artists"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
                    >
                        Artists:
                        {selectedInput.artists?.map((item, index) => (
                            <InputItem
                                data={item}
                                type="artists"
                                onClick={handleItemSelect}
                                key={index}
                                tag="span"
                            ></InputItem>
                        ))}
                    </label>
                    <input
                        autoComplete="off"
                        type="text"
                        id="artists"
                        value={input.artists}
                        onChange={(e) => {
                            handleInputChange(e, "artists");
                        }}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter artists here"
                    />
                    <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.artists
                            ?.slice(0, 20)
                            .map((item, index) => (
                                <InputItem
                                    data={item}
                                    type="artists"
                                    onClick={handleItemSelect}
                                    key={index}
                                    tag="div"
                                ></InputItem>
                            ))}
                    </div>
                </div>

                {/* //*Input 3 */}
                <div className="flex flex-col flex-1">
                    <label
                        htmlFor="link"
                        className="block text-base font-semibold text-gray-700 h-[50px] max-h-[50px] overflow-auto"
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
                    {/* <div className="mt-2 p-2 border border-gray-300 rounded-md shadow-sm h-[110px] max-h-[110px] overflow-auto">
                        {filteredInput.link?.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleItemSelect(item, "link")}
                            >
                                {item}
                            </div>
                        ))}
                    </div> */}
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
