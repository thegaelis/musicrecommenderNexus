import React from "react";

const Form = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submit");
    };
    return (
        <div className="w-[30%]  p-[20px] border-r border-gray-300 shadow-lg">
            <form className="space-y-4 pt-[10px]">
                {/* //*Input 1 */}
                <div>
                    <label
                        htmlFor="input1"
                        className="block text-base font-semibold text-gray-700 "
                    >
                        Label 1
                    </label>
                    <input
                        type="text"
                        id="input1"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter text here"
                    />
                </div>

                {/* //*Input 2 */}
                <div>
                    <label
                        htmlFor="input2"
                        className="block text-sm font-semibold text-gray-700"
                    >
                        Label 2
                    </label>
                    <input
                        type="text"
                        id="input2"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter text here"
                    />
                </div>

                {/* //*Input 3 */}
                <div>
                    <label
                        htmlFor="input3"
                        className="block text-sm font-semibold text-gray-700"
                    >
                        Label 3
                    </label>
                    <input
                        type="text"
                        id="input3"
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Enter text here"
                    />
                </div>

                {/* //* Submit Button */}
                <div>
                    <button
                        type="submit"
                        className="w-full p-2 bg-primary text-white rounded-md shadow-sm hover:bg-hover-color focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Form;
