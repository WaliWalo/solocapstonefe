import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { IPlayerScoreProp } from "./types";
import { socket } from "../../utils/socket";
import WouldYouRatherScore from "./WouldYouRatherScore";
export default function PlayerScore(props: IPlayerScoreProp) {
  const [selections, setSelections] = useState<Array<string>>([]);

  gsap.registerPlugin(TextPlugin);

  if (socket) {
    socket.on("onQuestionSelect", ({ question }: { question: string }) => {
      const options = question
        .slice(16)
        .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
        .split(/\bor\b/g);
      setSelections(options);
      gsap.to("#wyrScore", {
        duration: 2,
        ease: "expo.out",
        autoAlpha: 1,
      });
    });
  }

  useEffect(() => {
    socket &&
      socket.on(
        "onSelect",
        ({ selection, userId }: { selection: string; userId: string }) => {
          gsap.to(`#selection${userId}`, {
            duration: 2,
            text: selection,
          });
          if (selections.length > 0) {
            if (selection === selections[0]) {
              gsap.to("#left", {
                duration: 2,
                height: "+=" + 10,
                ease: "expo.out",
              });
            } else {
              gsap.to("#right", {
                duration: 2,
                height: "+=" + 10,
                ease: "expo.out",
              });
            }
          }
        }
      );
  }, [selections.length]);

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
                  <td>{user.score}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
}
