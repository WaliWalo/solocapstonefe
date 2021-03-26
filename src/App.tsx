import React, { useEffect } from "react";
import "./App.css";
import { Route, useHistory } from "react-router-dom";
import Home from "./components/startPage/Home";
import Lobby from "./components/lobbyPage/Lobby";
import Play from "./components/playPage/Play";
import { socket } from "./utils/socket";
import { getRoomByUserId } from "./utils/api";
import { gsap } from "gsap";

function App() {
  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        if (socket) {
          console.log(socket.id);
        }
      });
    }
    const userId = localStorage.getItem("userId");
    if (userId) {
      checkIfUserBelongToAnyRoom(userId);
    }
  }, []);

  const history = useHistory();

  const checkIfUserBelongToAnyRoom = async (userId: string) => {
    try {
      const res = await getRoomByUserId(userId);
      if (res !== undefined && res.ok) {
        history.push("/play");
      } else {
        history.push("/");
        localStorage.removeItem("userId");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="App ripple-background circle">
        <Route path="/" exact render={(props) => <Home />} />
        <Route path="/lobby" exact render={(props) => <Lobby />} />
        <Route path="/play" exact render={(props) => <Play />} />
      </div>
    </>
  );
}

export default App;
