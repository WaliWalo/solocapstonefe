import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { IPlayerScoreProp } from "./types";
import { socket } from "../../utils/socket";
import WouldYouRatherScore from "./WouldYouRatherScore";
import { updateScore } from "./../../utils/api";
import { IUser } from "../../utils/types";

export default function PlayerScore(props: IPlayerScoreProp) {
  const [selections, setSelections] = useState<Array<string>>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [left, setLeft] = useState<Array<string>>([]);
  const [right, setRight] = useState<Array<string>>([]);
  const [users, setUsers] = useState<Array<IUser>>([]);
  gsap.registerPlugin(TextPlugin);

  const sortUsers = (users: Array<IUser>) => {
    users.sort((a, b) =>
      a.score !== undefined && b.score !== undefined && a.score > b.score
        ? -1
        : 1
    );
    setUsers(users);
  };

  useEffect(() => {
    sortUsers(props.room.users);
    if (socket) {
      socket.on("onQuestionSelect", ({ question }: { question: string }) => {
        const options = question
          .slice(16)
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
          .split(/\bor\b/g);
        setSelections(options);
        setTotalAnswered(0);
        setLeft([]);
        setRight([]);
        sortUsers(props.room.users);
        gsap.to("#left", { height: "0px" });
        gsap.to("#right", { height: "0px" });
        gsap.to("#rightLine", { clearProps: "all" });
        gsap.to("#leftLine", { clearProps: "all" });
        gsap.to("#wyrScore", {
          duration: 2,
          ease: "expo.out",
          autoAlpha: 1,
          display: "initial",
        });
      });
    }
  }, []);

  useEffect(() => {
    socket &&
      socket.once(
        "onSelect",
        ({ selection, userId }: { selection: string; userId: string }) => {
          gsap.to(`#selection${userId}`, {
            duration: 2,
            text: selection,
          });
          const newTotal = totalAnswered + 1;
          setTotalAnswered(newTotal);

          if (selections.length > 0) {
            if (selection === selections[0]) {
              gsap.to("#left", {
                duration: 2,
                height: "+=" + 200 / props.room.users.length + "px",
                onStart: () => {
                  gsap.to("#leftLine", {
                    ease: "sine.inOut",
                    y: -5,
                    repeat: -1,
                    yoyo: true,
                    autoAlpha: 1,
                  });
                },
              });

              const newArray = [...left, userId];
              setLeft(newArray);
            } else if (selection === selections[1]) {
              gsap.to("#right", {
                duration: 2,
                height: "+=" + 200 / props.room.users.length + "px",
                onStart: () => {
                  gsap.to("#rightLine", {
                    delay: 0.5,
                    ease: "sine.inOut",
                    y: -5,
                    repeat: -1,
                    yoyo: true,
                    autoAlpha: 1,
                  });
                },
              });

              const newArray = [...right, userId];
              setRight(newArray);
            }
          }
        }
      );
    if (totalAnswered === props.room.users.length) {
      if (left.length > right.length) {
        left.forEach(async (user) => {
          const score = document.querySelector(`#score${user}`);
          if (score) {
            gsap.to(`#score${user}`, {
              duration: 2,
              text: `${parseInt(score.innerHTML) + 1}`,
            });
          }
          props.user.creator && (await updateScore(user));
        });
      } else if (left.length < right.length) {
        right.forEach(async (user) => {
          const score = document.querySelector(`#score${user}`);
          if (score) {
            gsap.to(`#score${user}`, {
              duration: 2,
              text: `${parseInt(score.innerHTML) + 1}`,
            });
          }
          props.user.creator && (await updateScore(user));
        });
      }
    }
  }, [totalAnswered, left.length, right.length, selections.length]);

  gsap.to("#tableRows", {
    duration: 2,
    ease: "expo.out",
    stagger: 0.5,
    autoAlpha: 1,
    delay: 1,
  });

  return (
    <div>
      <WouldYouRatherScore selections={selections} />
      <Table striped borderless hover size="sm">
        <thead>
          <tr>
            <th>Players</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 && (
            <>
              {users.map((user) => (
                <tr id="tableRows">
                  <td className="wyrUsername">{user.name}</td>
                  <td
                    id={`selection${user._id}`}
                    className="userSelection"
                  ></td>
                  <td id={`score${user._id}`}>{user.score}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
}
