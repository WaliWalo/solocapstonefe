import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import "./message.css";
import { IMessageProp, IMessage } from "./types";
import { socket } from "../../utils/socket";
import { fetchMessages } from "../../utils/api";

export default function Message(props: IMessageProp) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    getMessages();

    if (divRef && divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  socket &&
    socket.on("sendMessage", (message: IMessage) => {
      const newMessages = messages.concat(message);
      setMessages(newMessages);
      if (divRef && divRef.current) {
        divRef.current.scrollIntoView({ behavior: "smooth" });
      }
    });

  const getMessages = async () => {
    const res = await fetchMessages(props.room._id);
    if (res !== undefined && res.ok) {
      const messages = await res.json();
      setMessages(messages);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    socket &&
      socket.emit("sendMessage", {
        message,
        userId: props.userId,
        roomName: props.room.roomName,
      });
    setMessage("");
  };

  return (
    <div>
      <Container className="messageContainer">
        <Row>
          <h3 className="ml-3 pt-3">Chatbox</h3>
        </Row>
        <hr></hr>
        <Row className="messageContent display-block">
          {messages.length > 0 &&
            messages.map((message) => (
              <div className="messageBlock" key={message._id}>
                {message.sender._id !== props.userId && (
                  <div className="messageUsername">{message.sender.name}</div>
                )}
                <div
                  className={
                    message.sender._id === props.userId
                      ? "messageBox"
                      : "messageBox messageSender"
                  }
                >
                  {message.content}
                </div>
              </div>
            ))}
          <div ref={divRef} />
        </Row>
        <Row>
          <Form className="sendMessageForm" onSubmit={(e) => handleSubmit(e)}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="Message here..."
                aria-label="Message here"
                value={message}
                onChange={(e) => setMessage(e.currentTarget.value)}
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
