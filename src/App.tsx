import React, { useEffect } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Home from "./components/startPage/Home";
import Lobby from "./components/lobbyPage/Lobby";
import Play from "./components/playPage/Play";
import { socket } from "./utils/socket";

function App() {
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        if (socket) {
          console.log(socket.id);
        }
      });
    }
  }, []);
  return (
    <div className="App">
      <Route path="/" exact render={(props) => <Home />} />
      <Route path="/lobby" exact render={(props) => <Lobby />} />
      <Route path="/play" exact render={(props) => <Play />} />
    </div>
  );
}

export default App;
