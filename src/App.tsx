import React from "react";
import "./App.css";
import { Route } from "react-router-dom";
import Home from "./components/startPage/Home";
import Lobby from "./components/lobbyPage/Lobby";
import Play from "./components/playPage/Play";

function App() {
  return (
    <div className="App">
      <Route path="/" exact render={(props) => <Home />} />
      <Route path="/lobby" exact render={(props) => <Lobby />} />
      <Route path="/play" exact render={(props) => <Play />} />
    </div>
  );
}

export default App;
