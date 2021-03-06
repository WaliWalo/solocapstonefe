import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import "./home.css";
import { createUser, getRoomByUserId } from "./../../utils/api";
import { useHistory } from "react-router";
import { socket } from "../../utils/socket";
import { IHomeJoinMessage } from "./types";
import { gsap } from "gsap";

export default function Home() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [game, setGame] = useState("Truth or Dare");
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  let history = useHistory();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await createUser({ name, creator: true, turn: true });
    if (response !== undefined && response.ok) {
      //redirect and save id to local storage
      const data = await response.json();
      localStorage.setItem("userId", data);
      socket && socket.emit("createRoom", { userId: data, roomType: game });
      history.push("/lobby");
    }
  };

  useEffect(() => {
    socket &&
      socket.on("roomExist", (message: IHomeJoinMessage) => {
        if (message.status === "ok") {
          history.push("/lobby");
        } else {
          console.log(message.msg);
        }
      });

    return function componentUnmount() {
      gsap.to("#overlay", {
        duration: 3,
        left: "50vw",
        ease: "power2",
      });
    };
  }, []);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const checkUserRes = await getRoomByUserId(userId);
        if (checkUserRes !== undefined && checkUserRes.ok) {
          history.push("/lobby");
        } else {
          localStorage.removeItem("userId");
          history.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      const response = await createUser({
        name: userName,
        creator: false,
        turn: false,
      });
      if (response !== undefined && response.ok) {
        //redirect and save id to local storage
        const data = await response.json();
        localStorage.setItem("userId", data);
        socket &&
          socket.emit("joinRoom", {
            userId: data,
            roomName,
          });
      }
    }
  };

  return (
    <div className="homeContainer">
      <Form onSubmit={(e) => handleJoin(e)}>
        <Row>
          <Col md={8} sm={8} xs={12}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon2" className="homeForm">
                  Name
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Player 1"
                aria-label="Name"
                required
                className="homeForm"
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1" className="homeForm">
                  Room ID
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                className="homeForm"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value.toUpperCase())}
                placeholder="APVME"
                aria-label="Room Id"
                required
              />
            </InputGroup>
          </Col>
          <Col
            md={4}
            sm={4}
            xs={12}
            className="d-flex justify-content-center mt-3 mt-sm-0"
          >
            <div className="createRoomBtn">
              <button type="submit" className="ml-3">
                Join Room
              </button>
            </div>
          </Col>
        </Row>
      </Form>
      <hr className="my-5"></hr>
      <div className="createRoomBtn">
        <button onClick={handleShow}>Create Room</button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Row>
              <InputGroup>
                <Col md={7} sm={7} xs={12}>
                  <FormControl
                    required
                    placeholder="Your name"
                    aria-label="Your name"
                    aria-describedby="basic-addon2"
                    value={name}
                    className="createRoomForm"
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
                <Col md={4} sm={4} xs={12}>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      required
                      className="selectForm"
                      onChange={(e) => setGame(e.target.value)}
                    >
                      <option>Truth or Dare</option>
                      <option>Would You Rather</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </InputGroup>
            </Row>
            <Row className="mt-3 createRoomBtn">
              <button type="submit" className="startBtn">
                Start Game
              </button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
