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
            <Col className="center" xs={12} md={5}>
              <button
                id="truth"
                className="todBtn"
                onClick={(e) => handleSelect(e)}
              >
                TRUTH
              </button>
            </Col>
            <Col className="center" xs={12} id="orTxt" md={2}>
              OR
            </Col>
            <Col className="center" xs={12} md={5}>
              <button
                className="todBtn"
                id="dare"
                onClick={(e) => handleSelect(e)}
              >
                DARE
              </button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </div>
  );
}
