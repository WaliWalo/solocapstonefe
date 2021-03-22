import React from "react";
import { Col, Row } from "react-bootstrap";
import { IWyrScoreProp } from "./types";

export default function WouldYouRatherScore(props: IWyrScoreProp) {
  return (
    <div id="wyrScore">
      <Row>
        {props.selections[0]}/{props.selections[1]}
      </Row>
      <Row>
        <Col>
          <div id="left"></div>
        </Col>
        <Col>
          {" "}
          <div id="right"></div>
        </Col>
      </Row>
    </div>
  );
}
