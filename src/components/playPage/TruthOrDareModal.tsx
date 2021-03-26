import React from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { ITodModalProp } from "./types";
import { socket } from "../../utils/socket";

export default function TruthOrDareModal(props: ITodModalProp) {
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
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ color: "black" }}
          >
            TRUTH OR DARE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col className="center" xs={5}>
              <Button
                variant="outline-dark"
                id="truth"
                onClick={(e) => handleSelect(e)}
              >
                TRUTH
              </Button>
            </Col>
            <Col className="center" xs={2}>
              OR
            </Col>
            <Col className="center" xs={5}>
              <Button
                variant="outline-dark"
                id="dare"
                onClick={(e) => handleSelect(e)}
              >
                DARE
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
