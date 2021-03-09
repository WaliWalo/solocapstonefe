import React from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import "./playPage.css";
export default function Message() {
  return (
    <div>
      <Container className="messageContainer">
        <Row>
          <h3 className="ml-3 pt-3">Chatbox</h3>
        </Row>
        <hr></hr>
        <Row className="messageContent display-block">
          <div></div>
        </Row>
        <Row>
          <Form className="sendMessageForm">
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Message here..."
                aria-label="Message here"
              />
              <InputGroup.Append>
                <Button variant="outline-secondary" type="submit">
                  Send
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form>
        </Row>
      </Container>
    </div>
  );
}
