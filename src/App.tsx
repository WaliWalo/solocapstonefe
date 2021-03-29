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
  const [boxRow, setBoxRow] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

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

    // gsap.to("#background", {
    //   repeat: -1,
    //   duration: 40,
    //   backgroundPosition: "-2247px 0px",
    //   ease: "Linear.easeNone",
    // });

    gsap.to("#welcome", {
      duration: 2,
      text: "Welcome",
      ease: "none",
      onComplete: () => {
        gsap.to("#welcome", {
          duration: 1,
          text: "",
          ease: "none",
        });
        gsap.to(".boxes", {
          duration: 1,
          scale: 0.1,
          autoAlpha: 0,
          ease: "power1.inOut",
          rotate: 360,
          stagger: {
            each: 0.01,
            from: "center",
            grid: "auto",
          },
          onComplete: () => {
            gsap.to("#loader", { display: "none" });
          },
        });
      },
    });
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
      <div id="background">
        <div className="App">
          <Route path="/" exact render={(props) => <Home />} />
          <Route path="/lobby" exact render={(props) => <Lobby />} />
          <Route path="/play" exact render={(props) => <Play />} />
          <Overlay />
        </div>
        <div id="loader">
          <div id="boxesContainer">
            {boxRow.map((row) => (
              <div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
                <div className="boxes"></div>
              </div>
            ))}
          </div>
          <h1 id="welcome"></h1>
        </div>
      </div>
    </>
  );
}

export default App;
