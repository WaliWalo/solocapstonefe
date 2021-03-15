import React, { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import "./home.css";
import { createUser, getRoomByUserId } from "./../../utils/api";
import { useHistory } from "react-router";
import { socket } from "../../utils/socket";
import { IHomeJoinMessage } from "./types";
import { useSprings, animated, interpolate } from "react-spring";
import { useGesture } from "react-use-gesture";
import Cards from "./Cards";
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
          <Col md={8} xs={12}>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon2">Name</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Ubeyt"
                aria-label="Name"
                required
              />
            </InputGroup>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon1">Room ID</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="APVME"
                aria-label="Room Id"
                required
              />
            </InputGroup>
          </Col>
          <Col
            md={4}
            xs={12}
            className="d-flex justify-content-center mt-3 mt-sm-0"
          >
            <Button variant="outline-dark" type="submit" className="ml-3">
              Join Room
            </Button>
          </Col>
        </Row>
      </Form>
      <hr className="my-5"></hr>
      <div className="createRoomBtn">
        <Button variant="outline-dark" onClick={handleShow}>
          Create Room
        </Button>
      </div>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={(e) => handleSubmit(e)}>
            <Row>
              <InputGroup>
                <Col xs={7}>
                  <FormControl
                    required
                    placeholder="Your name"
                    aria-label="Your name"
                    aria-describedby="basic-addon2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Col>
                <Col xs={5}>
                  <Form.Group>
                    <Form.Control
                      as="select"
                      required
                      onChange={(e) => setGame(e.target.value)}
                    >
                      <option>Truth or Dare</option>
                      <option>Would You Rather</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </InputGroup>
            </Row>
            {/* <Container id="cardContainer">
              <Cards />
            </Container> */}
            <Row className="mt-3 createBtn">
              <Button variant="outline-dark" type="submit">
                Start Game
              </Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
