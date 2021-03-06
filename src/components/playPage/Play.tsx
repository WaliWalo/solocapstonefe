import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { socket } from "../../utils/socket";
import { IPlayer, IRoom, IUserJoin } from "../lobbyPage/types";
import Message from "../message/Message";
import Roulette from "./Roulette";
import { IUser } from "./../../utils/types";
import { getRoomByUserId, getUsersByRoomId } from "../../utils/api";
import TruthOrDareModal from "./TruthOrDareModal";
import QuestionsModal from "./QuestionsModal";
import { useHistory } from "react-router";
import PlayersModal from "./PlayersModal";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import "./playPage.css";
import {
  ChatSquareText,
  DoorOpenFill,
  PersonXFill,
} from "react-bootstrap-icons";
import PlayerScore from "./PlayerScore";
import WouldYouRatherModal from "./WouldYouRatherModal";

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
  const [playersModal, setPlayersModal] = useState<boolean>(false);
  const [playersDetails, setPlayersDetails] = useState([]);
  const [messagePopOut, setMessagePopOut] = useState(false);
  const [alerts, setAlerts] = useState("");
  const [wyrModal, setWyrModal] = useState(false);

  const history = useHistory();

  useEffect(() => {
    gsap.to("#overlay", {
      delay: 2,
      duration: 5,
      left: "-200vw",
      ease: "power2",
      onComplete: () =>
        gsap.to("#overlay", { clearProps: "all", className: "#overlay" }),
    });

    const userId = localStorage.getItem("userId");
    if (userId && socket) {
      socket.emit("userConnected", { userId });
      socket.on("userJoined", (userId: IUserJoin) => {
        fetchRoom(userId.userId);
        if (room) {
          fetchPlayers(room._id);
          console.log(room);
        }
      });

      socket.on(
        "onQuestionSelect",
        ({ question, nextUser }: { question: string; nextUser: IUser }) => {
          setAlerts(question);
          gsap.set(".questionAlerts", { clearProps: "x" });
          gsap.to(".questionAlerts", {
            duration: 3,
            ease: "power2.out",
            y: -400,
            opacity: 1,
          });

          setTimeout(() => {
            gsap.to(".questionAlerts", {
              duration: 3,
              ease: "power2.out",
              x: 500,
              rotation: 50,
              opacity: 0,
            });
          }, 3000);

          if (question.slice(0, 16) === "Would you rather") {
            setWyrModal(true);
          }
          fetchRoom(userId);
          room && fetchPlayers(room._id);
        }
      );
      socket.on("userLeft", ({ userId }: { userId: string }) => {
        const currentUserId = localStorage.getItem("userId");
        if (userId === currentUserId) {
          localStorage.removeItem("userId");
          history.push("/");
        } else {
          currentUserId && fetchRoom(currentUserId);
          room && fetchPlayers(room._id);
        }
      });
      fetchRoom(userId);
      room && fetchPlayers(room._id);
    }
    if (userId === null) {
      history.push("/");
    }
  }, []);

  useEffect(() => {
    if (room) {
      fetchPlayers(room._id);
    }
  }, [room]);

  useEffect(() => {
    if (currentUser !== null) {
      if (socket) {
        socket.once("onSelect", ({ selection }: { selection: string }) => {
          setSelection(selection);
          if (room && room.roomType === "Truth or Dare") {
            if (currentUser && currentUser.turn) {
              setQuestionsModal(true);
            } else {
              setAlerts(selection);
              gsap.set(".optionAlerts", { clearProps: "x" });
              gsap.to(".optionAlerts", {
                duration: 3,
                ease: "power2.out",
                y: -400,
                opacity: 1,
              });

              setTimeout(() => {
                gsap.to(".optionAlerts", {
                  duration: 3,
                  ease: "power2.out",
                  x: 500,
                  rotation: 50,
                  opacity: 0,
                });
              }, 3000);
            }
          }
        });
        socket.on("gameEnded", () => {
          localStorage.removeItem("userId");
          history.push("/");
        });
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (socket) {
      socket.once("selectedUser", (user: IUser) => {
        if (players.length > 1) {
          const selectedPlayerIndex = players.findIndex(
            (player) => player.option === user.name
          );
          setPrizeNumber(selectedPlayerIndex);
          setMustSpin(true);
          setTimeout(function () {
            if (currentUser !== null) {
              if (user._id === currentUser._id) {
                setShowModal(true);
              } else {
                // gsap.set("#spin", { clearProps: "x,y" });
                gsap.set(".nameAlerts", { clearProps: "x" });
                gsap.to(".nameAlerts", {
                  duration: 3,
                  ease: "power2.out",
                  y: -400,
                  opacity: 1,
                });
                setAlerts(`${user.name}`);
                // alert(user.name);
                setTimeout(() => {
                  gsap.to(".nameAlerts", {
                    duration: 3,
                    ease: "power2.out",
                    x: 500,
                    rotation: 50,
                    opacity: 0,
                  });
                }, 3000);
              }
            }
          }, 12000);
        }
      });
    }
  }, [currentUser, players.length]);

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
          return players.push({
            option: user.name,
          });
        });
        setPlayersDetails(users);
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
    socket &&
      currentUser &&
      room &&
      socket.emit("leaveRoom", {
        userId: currentUser._id,
        roomName: room.roomName,
      });
    localStorage.removeItem("userId");
    history.push("/");
  };

  gsap.registerPlugin(Draggable);

  Draggable.create("#spin", {
    type: "x,y",
    bounds: document.getElementById("root"),
    onRelease: function () {
      gsap.to("#spin", {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1,0.3)",
      });
      handleSpin();
    },
  });

  Draggable.create("#startToggle", {
    type: "x",
    bounds: document.getElementById("start"),
    onRelease: function () {
      gsap.to("#startToggle", {
        x: 0,
        duration: 1,
        ease: "power2.out(1,0.3)",
      });
      setSelection("wyr");
      setQuestionsModal(true);
    },
  });

  const handleMessageBubble = () => {
    let width = "300px";
    let height = "295px";
    if (window.innerWidth >= 768) {
      width = "400px";
      height = "395px";
    }
    setMessagePopOut(!messagePopOut);
    !messagePopOut
      ? gsap.to("#msgBubble", {
          duration: 1,
          ease: "expoScale(1, 2)",
          height,
          width,
          borderRadius: "10%",
        })
      : gsap.to("#msgBubble", {
          duration: 1,
          ease: "expoScale(1, 2)",
          height: "50px",
          width: "50px",
          borderRadius: "100%",
        });
  };

  return (
    <>
      <div className="display-flex">
        <Row className="playHeader">
          <h2>{room && room.roomName}</h2>
        </Row>
        <Row>
          <Col>
            <div className="gameContainer">
              {room && room.roomType === "Truth or Dare" && (
                <Roulette
                  prizeNumber={prizeNumber}
                  mustSpin={mustSpin}
                  stopSpin={() => setMustSpin(false)}
                  players={players}
                />
              )}
              {room && room.roomType === "Would You Rather" && currentUser && (
                <PlayerScore room={room} user={currentUser} />
              )}
            </div>
          </Col>
        </Row>
        <Row>
          <div className="center">
            {currentUser && currentUser.turn ? (
              <>
                {room &&
                  room.roomType === "Truth or Dare" &&
                  room.users.length > 1 && <div id="spin"></div>}
                {room && room.roomType === "Would You Rather" && (
                  <div id="start">
                    <div id="startToggle"></div>
                    <span id="startLabel">Drag to start</span>
                  </div>
                )}
              </>
            ) : (
              <div className="userTurn">
                <h3>{userTurn && userTurn.name}'s turn</h3>
              </div>
            )}
          </div>
        </Row>
        <div className="options mt-2">
          {currentUser && currentUser.creator ? (
            <>
              <Button
                variant="outline-dark"
                onClick={handleEndGame}
                className="mr-3"
              >
                <DoorOpenFill className="icons" />
              </Button>
              {room && room.users.length > 1 && (
                <Button
                  variant="outline-dark"
                  onClick={() => setPlayersModal(true)}
                >
                  <PersonXFill className="icons" />
                </Button>
              )}
            </>
          ) : (
            <Button variant="outline-dark" onClick={handleLeaveGame}>
              <DoorOpenFill className="icons" />
            </Button>
          )}
        </div>

        {room && (
          <>
            {currentUser && currentUser._id !== undefined && (
              <>
                <QuestionsModal
                  selection={selection}
                  show={questionsModal}
                  onHide={() => setQuestionsModal(false)}
                  roomName={room.roomName}
                  userId={currentUser._id}
                />
                <TruthOrDareModal
                  roomName={room.roomName}
                  show={showModal}
                  onHide={() => setShowModal(false)}
                  userId={currentUser._id}
                />
                <WouldYouRatherModal
                  show={wyrModal}
                  onHide={() => setWyrModal(false)}
                  question={alerts}
                  roomName={room.roomName}
                  userId={currentUser._id}
                />
              </>
            )}
            <PlayersModal
              show={playersModal}
              onHide={() => setPlayersModal(false)}
              players={playersDetails}
              roomName={room.roomName}
            />
          </>
        )}
      </div>
      <div id="currentUsername">{currentUser && currentUser.name}</div>
      <div id="msgBubble">
        <ChatSquareText
          style={{ display: messagePopOut ? "none" : "" }}
          onClick={handleMessageBubble}
          id="chatLogo"
        />
        <div style={{ display: !messagePopOut ? "none" : "initial" }}>
          {room && currentUser && (
            <Message
              room={room}
              userId={currentUser._id}
              minimize={handleMessageBubble}
            />
          )}
        </div>
      </div>
      <div id="alertsContainer">
        <div className="d-flex justify-content-center">
          <h1 className="nameAlerts">{alerts}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <h1 className="optionAlerts">{alerts}</h1>
        </div>
        <div className="d-flex justify-content-center">
          <h1 className="questionAlerts">{alerts}</h1>
        </div>
      </div>
    </>
  );
}
