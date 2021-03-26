import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { IWyrScoreProp } from "./types";

export default function WouldYouRatherScore(props: IWyrScoreProp) {
  return (
    <div id="wyrScore">
      <div className="wyrInnerContainer">
        <Row className="wyrRow">
          <Col id="leftContainer">
            <div id="left">
              <div id="leftLine"></div>
            </div>
          </Col>
          <Col id="rightContainer">
            <div id="right">
              <div id="rightLine"></div>
            </div>
          </Col>
        </Row>
        <Row className="wyrRow selectionLabel">
          <Col xs={6}>{props.selections[0]}</Col>
          <Col xs={6}>{props.selections[1]}</Col>
        </Row>
      </div>
    </div>
  );
}
