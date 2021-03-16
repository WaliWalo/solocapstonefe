import React from "react";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { socket } from "../../utils/socket";
import { IPlayersModalProp } from "./types";

export default function PlayersModal(props: IPlayersModalProp) {
  const handleKick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(e.currentTarget.id);
    socket &&
      socket.emit("leaveRoom", {
        userId: e.currentTarget.id,
        roomName: props.roomName,
      });
  };
  const userId = localStorage.getItem("userId");
  return (
    <div>
      <Modal centered size="sm" show={props.show} onHide={props.onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Players</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup>
            {props.players.map((player) => {
              if (player._id !== userId) {
                return (
                  <ListGroup.Item
                    key={player._id}
                    className="d-flex justify-content-between"
                  >
                    {player.name}
                    <Button
                      variant="outline-dark"
                      id={player._id}
                      onClick={(e: React.MouseEvent<HTMLElement, MouseEvent>) =>
                        handleKick(e)
                      }
                    >
                      Kick
                    </Button>
                  </ListGroup.Item>
                );
              }
            })}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
