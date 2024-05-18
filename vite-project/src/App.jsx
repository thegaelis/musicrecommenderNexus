import { useState } from "react";
import "./App.css";
import Form from "./components/form/Form";
import ListSongs from "./components/music/ListSongs";
import PlayerControl from "./components/music/PlayerControl";

function App() {
    const [data, setData] = useState([]);
    return (
        <div className="bg-bgr font-roboto text-secondary flex  h-screen overflow-hidden">
            {/* //* 30% screen's width */}
            <Form></Form>

            {/* //* 70% screen's width */}
            <ListSongs></ListSongs>

            <PlayerControl data={data}></PlayerControl>
        </div>
    );
}

export default App;
