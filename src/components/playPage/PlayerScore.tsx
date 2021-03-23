import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { IPlayerScoreProp } from "./types";
import { socket } from "../../utils/socket";
import WouldYouRatherScore from "./WouldYouRatherScore";
import { updateScore } from "./../../utils/api";
export default function PlayerScore(props: IPlayerScoreProp) {
  const [selections, setSelections] = useState<Array<string>>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);
  const [left, setLeft] = useState<Array<string>>([]);
  const [right, setRight] = useState<Array<string>>([]);
  gsap.registerPlugin(TextPlugin);

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
      gsap.to("#left", { duration: 1, ease: "expo.out", height: 0 });
      gsap.to("#right", { duration: 1, ease: "expo.out", height: 0 });
      gsap.to("#wyrScore", {
        duration: 2,
        ease: "expo.out",
        autoAlpha: 1,
      });
    });
  }

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
                height: "+=" + 20,
                ease: "expo.out",
              });
              const newArray = [...left, userId];
              setLeft(newArray);
            } else if (selection === selections[1]) {
              gsap.to("#right", {
                duration: 2,
                height: "+=" + 20,
                ease: "expo.out",
              });
              const newArray = [...right, userId];
              setRight(newArray);
            }
          }
        }
      );
  }, [totalAnswered, left.length, right.length, selections.length]);

  useEffect(() => {
    if (
      left.length + right.length === totalAnswered &&
      totalAnswered === props.room.users.length
    ) {
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
  }, [totalAnswered, left.length, right.length]);

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
          {props.room.users.length > 0 && (
            <>
              {props.room.users.map((user) => (
                <tr id="tableRows">
                  <td>{user.name}</td>
                  <td id={`selection${user._id}`}></td>
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
