import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, useHistory } from "react-router-dom";
import Home from "./components/startPage/Home";
import Lobby from "./components/lobbyPage/Lobby";
import Play from "./components/playPage/Play";
import { socket } from "./utils/socket";
import { getRoomByUserId } from "./utils/api";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { Row } from "react-bootstrap";
import Overlay from "./components/overlay/Overlay";

function App() {
  gsap.registerPlugin(TextPlugin);

  const history = useHistory();

  useEffect(() => {
    // if (socket) {
    //   socket.on("connect", () => {
    //     if (socket) {
    //       console.log(socket.id);
    //     }
    //   });
    // }
    const userId = localStorage.getItem("userId");
    if (userId) {
      checkIfUserBelongToAnyRoom(userId);
    }
    history.location.pathname === "/" &&
      gsap.to("#party", {
        delay: 1,
        duration: 2,
        left: "10vw",
        ease: "elastic",
        onComplete: () => {
          gsap.to("#games", {
            duration: 2,
            left: "50vw",
            ease: "bounce",
            onComplete: () => gsap.to("#loader", { duration: 2, autoAlpha: 0 }),
          });
        },
      });
  }, []);

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
      <div id="background">
        <video autoPlay muted loop id="myVideo">
          <source
            src="https://res.cloudinary.com/waliwalo/video/upload/v1617028507/solocap/Abstract_animation_pipelines_back_ground_kqhszo.mp4"
            type="video/mp4"
          />
        </video>
        <div className="App">
          <Route path="/" exact render={(props) => <Home />} />
          <Route path="/lobby" exact render={(props) => <Lobby />} />
          <Route path="/play" exact render={(props) => <Play />} />
          <Overlay />
        </div>
        {history.location.pathname === "/" && (
          <div id="loader">
            {/* <img src="/assets/logo.png" id="logo" alt="logo" /> */}
            <img src="/assets/party.png" id="party" alt="party" />
            <img src="/assets/games.png" id="games" alt="games" />
          </div>
        )}
      </div>
    </>
  );
}

export default App;
