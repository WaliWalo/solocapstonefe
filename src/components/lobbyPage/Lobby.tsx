import React from "react";
import { Button } from "react-bootstrap";
import Roulette from "../playPage/Roulette";
import "./lobby.css";

export default function Lobby() {
  return (
    <div>
      <div className="center">
        <h1 className="lobbyTitle">WNVOS</h1>
      </div>
      <Roulette />
      <div className="center">
        <Button variant="outline-dark" className="mt-3 startBtn">
          Start
        </Button>
      </div>
    </div>
  );
}
