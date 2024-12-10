import { useEffect, useState } from "react";
import "./App.css";
import Form from "./components/form/Form";
import ListSongs from "./components/music/ListSongs";
import PlayerControl from "./components/music/PlayerControl";

function App() {
    const [response1, setResponse1] = useState([]);
    const [response2, setResponse2] = useState([]);
    const [selected, setSelected] = useState([]);

    const handleSelectSong = (id) => {
        setSelected((prevSelectedSongs) => {
            const newSelectedSongs = [...prevSelectedSongs];

            if (newSelectedSongs.length === 3) {
                newSelectedSongs.shift(); // Remove the first element
            }

            newSelectedSongs.push(id); // Add the new song ID

            return newSelectedSongs;
        });
    };
    console.log(selected);

    // Initialize response1 and response2 once after the first render
    useEffect(() => {
        setResponse1([
            {
                "Unnamed: 0": 4019,
                track_id: "0u4rkpmNtgcFxYHepnVF4v",
                artists: "Novo Amor",
                track_name: "Carry You",
                popularity: 0.68,
                track_genre: "ambient",
                artists_encoded: 20196,
            },
            {
                "Unnamed: 0": 4007,
                track_id: "1XZPtZVqcOzzxbYIR7MjQw",
                artists: "Novo Amor;Ed Tullett;Lowswimmer",
                track_name: "Ontario",
                popularity: 0.6900000000000001,
                track_genre: "ambient",
                artists_encoded: 20197,
            },
        ]);

        setResponse2([
            {
                track: "Let's Nacho",
                artist: "Nucleya",
                similarity_score: 90.67,
                genre: "desi hip hop, hindi hip hop, indian edm, indian indie",
                preview:
                    "https://p.scdn.co/mp3-preview/0522b931a66c598c8ae6f349269e9c2638e92447?cid=69641ecc10424a6ca2da963ea415765d",
            },
            {
                track: "Let's Nacho",
                artist: "Nucleya",
                similarity_score: 90.66,
                genre: "desi hip hop, hindi hip hop, indian edm, indian indie",
                preview:
                    "https://p.scdn.co/mp3-preview/e77704a667bddc0f749d05a304bcc68133fc20a8?cid=69641ecc10424a6ca2da963ea415765d",
            },
        ]);
    }, []);

    const endpoint1 = async (joinedValues) => {
        // Tạo URL với các giá trị đã nối
        const url = `http://127.0.0.1:8000/endpoint1/${joinedValues}`;
        console.log(url);

        try {
            // Fetch với method GET
            const response = await fetch(url, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setResponse1(data);
            console.log(data);
        } catch (error) {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        }
    };

    const endpoint2 = async (id) => {
        // Tạo URL với các giá trị đã nối
        const url = `http://127.0.0.1:8000/endpoint2/${id}`;
        console.log(url);

        try {
            // Fetch với method GET
            const response = await fetch(url, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            setResponse2(data);
            console.log(data);
        } catch (error) {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        }
    };

    const handleSubmit = (e, submissionValue, type) => {
        e.preventDefault();
        console.log("Submit");
        console.log(submissionValue);

        if (type == "link") {
            console.log("link");
            endpoint2(submissionValue.link);
        } else if (type == "trackName") {
            console.log("trackName");

            // Kiểm tra nếu submissionValue.trackIds là một mảng
            const valuesArray = Array.isArray(submissionValue.trackIds)
                ? submissionValue.trackIds
                : [submissionValue.trackIds];

            // Join các giá trị trong mảng submissionValue.trackIds bằng dấu phẩy
            const joinedValues = valuesArray.join(",");

            console.log("join");
            console.log(joinedValues);

            endpoint1(joinedValues);
        }

        console.log("Type: " + type);
        console.log(submissionValue);
    };

    return (
        <div className="bg-bgr font-roboto text-secondary flex  h-screen overflow-hidden">
            {/* //* 30% screen's width */}
            <Form handleSubmit={handleSubmit}></Form>

            {/* //* 70% screen's width */}
            <ListSongs
                data={response1}
                handleSelectSong={handleSelectSong}
            ></ListSongs>

            {/* //* Cái này có vẻ không cần nữa */}
            <PlayerControl></PlayerControl>
        </div>
    );
}

export default App;
