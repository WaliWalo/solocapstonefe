import React from "react";
import { Col, Row } from "react-bootstrap";
import Message from "./Message";
import Roulette from "./Roulette";

export default function Play() {
  return (
    <div className="display-flex">
      {/* <h1>PLAY</h1> */}
      <Row>
        <Col style={{ width: "30rem" }}>
          <Message />
        </Col>
        <Col>{/* <Roulette /> */}</Col>
      </Row>
    </div>
  );
}
