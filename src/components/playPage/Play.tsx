import React, { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { socket } from "../../utils/socket";
import { IPlayer, IRoom, IUserJoin } from "../lobbyPage/types";
import Message from "./Message";
import Roulette from "./Roulette";
import { IUser } from "./../../utils/types";
import { getRoomByUserId, getUsersByRoomId } from "../../utils/api";
import TruthOrDareModal from "./TruthOrDareModal";
import QuestionsModal from "./QuestionsModal";
import { useHistory } from "react-router";

export default function Play() {
  const [room, setRoom] = useState<IRoom | null>(null);
  const [players, setPlayers] = useState<Array<IPlayer>>([]);
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [userTurn, setUserTurn] = useState<IUser | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [mustSpin, setMustSpin] = useState(false);
  const [questionsModal, setQuestionsModal] = useState<boolean>(false);
  const [selection, setSelection] = useState<string>("");
  const history = useHistory();
  if (socket) {
    socket.on("userJoined", (userId: IUserJoin) => {
      fetchRoom(userId.userId);
      room && fetchPlayers(room._id);
    });
  }

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId && socket) {
      socket.emit("userConnected", { userId });
      socket.on(
        "onQuestionSelect",
        ({ question, nextUser }: { question: string; nextUser: IUser }) => {
          alert(question);
          fetchRoom(userId);
          room && fetchPlayers(room._id);
        }
      );
      fetchRoom(userId);
      room && fetchPlayers(room._id);
    }
    if (userId === null) {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    room && fetchPlayers(room._id);
  }, [room]);

  useEffect(() => {
    if (currentUser !== null) {
      socket &&
        socket.on("onSelect", (selection: string) => {
          setSelection(selection);
          if (currentUser && currentUser.turn) {
            setQuestionsModal(true);
          } else {
            alert(selection);
          }
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.on("selectedUser", (user: IUser) => {
        if (players.length !== 0) {
          const selectedPlayerIndex = players.findIndex(
            (player) => player.option === user.name
          );
          setPrizeNumber(selectedPlayerIndex);
          setMustSpin(true);
          setTimeout(function () {
            if (currentUser) {
              if (user._id === currentUser._id) {
                setShowModal(true);
              } else {
                alert(user.name);
              }
            }
          }, 12000);
        }
      });
    }
  }, [currentUser, players]);

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
          if (user.turn) {
            setUserTurn(user);
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
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSpin = () => {
    socket &&
      currentUser &&
      room &&
      socket.emit("spinWheel", {
        userId: currentUser._id,
        roomName: room.roomName,
      });
  };

  const handleEndGame = () => {
    socket &&
      currentUser &&
      room &&
      socket.emit("endGame", {
        userId: currentUser._id,
        roomName: room.roomName,
      });
    localStorage.removeItem("userId");
    history.push("/");
  };

  const handleLeaveGame = () => {
    localStorage.removeItem("userId");
    history.push("/");
  };

  return (
    <div className="display-flex">
      <Row>
        <Col style={{ width: "30rem" }}>
          <Message />
        </Col>
        <Col>
          <Roulette
            prizeNumber={prizeNumber}
            mustSpin={mustSpin}
            stopSpin={() => setMustSpin(false)}
            players={players}
          />
          <div className="center">
            {currentUser && currentUser.turn ? (
              <Button onClick={handleSpin}>Spin</Button>
            ) : (
              <h3>{userTurn && userTurn.name}'s turn</h3>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {currentUser && currentUser.creator ? (
          <Button onClick={handleEndGame}>END GAME</Button>
        ) : (
          <Button onClick={handleLeaveGame}>LEAVE GAME</Button>
        )}
      </Row>
      {room && (
        <>
          <TruthOrDareModal
            roomName={room.roomName}
            show={showModal}
            onHide={() => setShowModal(false)}
          />{" "}
          {currentUser && currentUser._id !== undefined && (
            <QuestionsModal
              selection={selection}
              show={questionsModal}
              onHide={() => setQuestionsModal(false)}
              roomName={room.roomName}
              userId={currentUser._id}
            />
          )}
        </>
      )}
    </div>
  );
}
