import React from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { socket } from "../../utils/socket";
import { IWyrProp } from "./types";

export default function WouldYouRatherModal(props: IWyrProp) {
  const options = props.question
    .slice(16)
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
    .split(/\bor\b/g);

  const handleSelect = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.onHide();
    socket &&
      socket.emit("onSelect", {
        selection: e.currentTarget.id,
        roomName: props.roomName,
        userId: props.userId,
      });
  };

  return (
    <div>
      <Modal
        {...props}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        backdropClassName="wyrModalBackdrop"
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Would You Rather
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col xs={12} md={5}>
                <Button
                  className="wyrOptions"
                  id={options[0]}
                  variant="outline-warning"
                  onClick={(e) => handleSelect(e)}
                >
                  {options[0]}
                </Button>
              </Col>
              <Col xs={12} md={2} className="or">
                OR
              </Col>
              <Col xs={12} md={5}>
                <Button
                  className="wyrOptions"
                  id={options[1]}
                  variant="outline-info"
                  onClick={(e) => handleSelect(e)}
                >
                  {options[1]}
                </Button>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </div>
  );
}
