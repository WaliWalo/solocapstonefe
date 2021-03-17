import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  Image,
  InputGroup,
  Row,
  Spinner,
} from "react-bootstrap";
import "./message.css";
import { IMessageProp, IMessage } from "./types";
import { socket } from "../../utils/socket";
import { fetchImgUrl, fetchMessages } from "../../utils/api";

export default function Message(props: IMessageProp) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [url, setUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

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
        url,
      });
    setMessage("");
  };

  const handleFileSelected = async (e: React.FormEvent<HTMLInputElement>) => {
    setImageLoading(true);
    const target = e.target as HTMLInputElement;
    const files = target.files;
    // const files = Array.from(e.target.files);
    if (files) {
      console.log("files:", files[0]);
      const response = await fetchImgUrl(files, props.room.roomName);
      if (response) {
        let url = await response.json();
        setUrl(url.imageUrl);
        setImageLoading(false);
      } else {
        return response;
      }
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Container className="messageContainer">
        <Row>
          <h3 className="ml-3">Chatbox</h3>
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
                  {message.url !== "" && (
                    <Image className="msgImg" src={message.url} rounded />
                  )}
                </div>
              </div>
            ))}
          <div ref={divRef} />
        </Row>
        <Row>
          {imageLoading ? (
            <div className="msgLoader">
              <Spinner animation="grow" />
            </div>
          ) : (
            <Form className="sendMessageForm" onSubmit={(e) => handleSubmit(e)}>
              <Row>
                <Col xs={10} className="pr-0">
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Message here..."
                      aria-label="Message here"
                      value={message}
                      onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                    {/* <InputGroup.Append>
                <Button variant="outline-secondary" type="submit">
                  Send
                </Button>
              </InputGroup.Append> */}
                  </InputGroup>
                </Col>
                <Col xs={2} className="pl-0">
                  <Form.File id="formcheck-api-custom" custom>
                    <Form.File
                      id="custom-file-translate-scss"
                      label="Custom file input"
                      lang="en"
                      custom
                      accept="image/*"
                      onChange={(e: React.FormEvent<HTMLInputElement>) =>
                        handleFileSelected(e)
                      }
                    />
                  </Form.File>
                </Col>
              </Row>
            </Form>
          )}
        </Row>
      </Container>
    </div>
  );
}
