import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Roulette from "../playPage/Roulette";
import "./lobby.css";
import { socket } from "../../utils/socket";
import { IPlayer, IRoom, IUserJoin } from "./types";
import { useHistory } from "react-router";
import { getRoomByUserId, getUsersByRoomId } from "./../../utils/api";
import { IUser } from "./../../utils/types";
import Players from "./Players";
import { gsap } from "gsap";

export default function Lobby() {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [players, setPlayers] = useState<Array<IPlayer>>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const history = useHistory();

  if (socket) {
    socket.on("roomName", (room: IRoom) => {
      setRoom(room);
    });
    socket.on("userJoined", (userId: IUserJoin) => {
      // fetchPlayers()
      console.log(userId);
      fetchRoom(userId.userId);
      room && fetchPlayers(room._id);
    });
    socket.on("gameStarting", (msg: object) => {
      history.push("/play");
    });
  }

  useEffect(() => {
    gsap.to("#overlay", {
      delay: 1,
      duration: 2,
      left: "130vw",
      ease: "power2",
      onComplete: () => gsap.to("#overlay", { clearProps: "all" }),
    });
    const userId = localStorage.getItem("userId");
    if (userId && socket) {
      socket.emit("userConnected", { userId });
      fetchRoom(userId);
      room && fetchPlayers(room._id);
      if (room && room.started === true) {
        history.push("/play");
      }
    } else {
      history.push("/");
    }
    return function componentUnmount() {
      gsap.to("#overlay", {
        duration: 1,
        left: "50vw",
        ease: "power2",
      });
    };
  }, []);

  useEffect(() => {
    room && fetchPlayers(room._id);
  }, [room]);

  const fetchPlayers = async (roomId: string) => {
    try {
      const res = await getUsersByRoomId(roomId);
      if (res !== undefined && res.ok) {
        const users = await res.json();
        const players: Array<IPlayer> = [];
        users.map((user: IUser) => {
          if (user._id === localStorage.getItem("userId")) {
            setCurrentUser(user);
          }
          return players.push({ option: user.name });
        });
        setPlayers(players);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoom = async (userId: string) => {
    try {
      const res = await getRoomByUserId(userId);
      if (res !== undefined && res.ok) {
        const room = await res.json();
        setRoom(room);
        if (room.started) {
          history.push("/play");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStart = () => {
    socket &&
      room &&
      socket.emit("startGame", {
        userId: localStorage.getItem("userId"),
        roomName: room.roomName,
      });
    history.push("/play");
  };

  return (
    <div>
      <div className="center">
        <h1 className="lobbyTitle">{room && room.roomName}</h1>
      </div>
      {players.length > 0 && <Players players={players} />}
      {/* {players.length > 0 && (
        <Roulette mustSpin={false} prizeNumber={0} players={players} />
      )} */}
      <div className="center">
        {currentUser && currentUser.creator && (
          <Button
            variant="outline-dark"
            onClick={handleStart}
            className="mt-3 startBtn"
          >
            Start
          </Button>
        )}
      </div>
    </div>
  );
}
