import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Roulette from "../playPage/Roulette";
import "./lobby.css";
import { socket } from "../../utils/socket";
import { IPlayer, IRoom, IUserJoin } from "./types";
import { useHistory } from "react-router";
import { getRoomByUserId, getUsersByRoomId } from "./../../utils/api";
import { IUser } from "./../../utils/types";

export default function Lobby() {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [players, setPlayers] = useState<Array<IPlayer>>([]);
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
  }

  const history = useHistory();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && socket) {
      socket.emit("userConnected", { userId });
      fetchRoom(userId);
      room && fetchPlayers(room._id);
    } else {
      history.push("/");
    }
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
        users.map((user: IUser) => players.push({ option: user.name }));
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStart = () => {
    history.push("/play");
  };

  return (
    <div>
      <div className="center">
        <h1 className="lobbyTitle">{room && room.roomName}</h1>
      </div>
      {players.length > 0 && <Roulette players={players} />}
      <div className="center">
        <Button
          variant="outline-dark"
          onClick={handleStart}
          className="mt-3 startBtn"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
