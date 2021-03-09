import React, { useState } from "react";
import {
  Button,
  Col,
  Dropdown,
  DropdownButton,
  Modal,
  Row,
} from "react-bootstrap";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import "./home.css";

export default function Home() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <div className="homeContainer">
      <Form>
        <InputGroup className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Room ID</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="APVME" aria-label="Room Id" />
          <Button variant="outline-dark" type="submit" className="ml-3">
            Join Room
          </Button>
        </InputGroup>
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
          <Form>
            <Row>
              <InputGroup>
                <Col xs={7}>
                  <FormControl
                    required
                    placeholder="Your name"
                    aria-label="Your name"
                    aria-describedby="basic-addon2"
                  />
                </Col>
                <Col xs={5}>
                  {/* <DropdownButton
                    as={InputGroup.Append}
                    variant="outline-secondary"
                    title="Select Game"
                  >
                    <Dropdown.Item href="#">Truth or Dare</Dropdown.Item>
                    <Dropdown.Item href="#">Would You Rather</Dropdown.Item>
                  </DropdownButton> */}
                  <Form.Group>
                    <Form.Control as="select" required>
                      <option>Truth or Dare</option>
                      <option>Would You Rather</option>
                    </Form.Control>
                  </Form.Group>
                </Col>
              </InputGroup>
            </Row>
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
