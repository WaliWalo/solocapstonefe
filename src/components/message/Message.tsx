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
import { IUser } from "../../utils/types";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

export default function Message(props: IMessageProp) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<IMessage>>([]);
  const [url, setUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  const divRef = useRef<HTMLDivElement>(null);
  gsap.registerPlugin(ScrollToPlugin);
  gsap.to(".messageContent", {
    duration: 2,
    scrollTo: { y: "max", autoKill: true },
  });

  useEffect(() => {
    getMessages();
    // if (message.length > 0) {
    //   gsap.to(".messageContent", { duration: 2, scrollTo: 500 });
    // }
    // if (divRef && divRef.current) {
    //   divRef.current.scrollIntoView({ behavior: "smooth" });
    // }
  }, []);

  if (socket) {
    socket.on("sendMessage", (message: IMessage) => {
      const newMessages = messages.concat(message);
      setMessages(newMessages);

      // gsap.to(".messageContent", {
      //   duration: 2,
      //   scrollTo: { y: "max", autoKill: false },
      // });
      // if (divRef && divRef.current) {
      //   divRef.current.scrollIntoView({ behavior: "smooth" });
      // }
    });
    socket.on("selectedUser", (user: IUser) => {
      const adminMsg = {
        content: `${user.name} selected`,
        roomId: props.room._id,
        sender: user,
        admin: true,
      };
      const newMessages = messages.concat(adminMsg);
      gsap.delayedCall(13, () => {
        setMessages(newMessages);
        gsap.to(".messageContent", {
          duration: 2,
          scrollTo: { y: "max", autoKill: true },
        });
      });
    });
    socket.on(
      "onQuestionSelect",
      ({ question, nextUser }: { question: string; nextUser: IUser }) => {
        const adminMsg = {
          content: question,
          roomId: props.room._id,
          sender: nextUser,
          admin: true,
        };
        const newMessages = messages.concat(adminMsg);
        setMessages(newMessages);

        gsap.to(".messageContent", {
          duration: 2,
          scrollTo: { y: "max", autoKill: true },
        });
      }
    );
  }

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
              <>
                {!message.admin ? (
                  <div className="messageBlock" key={message._id}>
                    {message.sender._id !== props.userId && (
                      <div className="messageUsername">
                        {message.sender.name}
                      </div>
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
                ) : (
                  <div className="adminMsg">
                    <p>{message.content}</p>
                  </div>
                )}
              </>
            ))}
          <div ref={divRef} className="msgBottom" />
        </Row>
        <Row>
          {imageLoading ? (
            <div className="msgLoader">
              <Spinner animation="grow" />
            </div>
          ) : (
            <Form className="sendMessageForm" onSubmit={(e) => handleSubmit(e)}>
              <Row style={{ width: "100%" }}>
                <Col xs={10} className="pr-0">
                  <InputGroup className="mb-3">
                    <FormControl
                      placeholder="Message here..."
                      aria-label="Message here"
                      value={message}
                      onChange={(e) => setMessage(e.currentTarget.value)}
                    />
                  </InputGroup>
                </Col>
                <Col xs={2} className="pr-3">
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
