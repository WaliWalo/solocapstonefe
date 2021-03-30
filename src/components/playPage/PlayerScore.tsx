import React, { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import { IPlayerScoreProp } from "./types";
import { socket } from "../../utils/socket";
import WouldYouRatherScore from "./WouldYouRatherScore";
import { getRoomByUserId, updateScore } from "./../../utils/api";
import { IUser } from "../../utils/types";
import { IUserJoin } from "./../lobbyPage/types";

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
    gsap.to(".tableRows", {
      duration: 2,
      ease: "expo.out",
      stagger: 0.5,
      autoAlpha: 1,
      delay: 1,
    });
  });

  useEffect(() => {
    sortUsers(props.room.users);
    if (socket) {
      socket.on("onQuestionSelect", ({ question }: { question: string }) => {
        const options = question
          .slice(16)
          .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "")
          .split(/\bor\b/g);
        setSelections(options);
        sortUsers(props.room.users);
        gsap.to("#left", { clearProps: "all" });
        gsap.to("#right", { clearProps: "all" });
        setLeft([]);
        setRight([]);
        setTotalAnswered(0);
        const currentUser = props.user._id;
        currentUser !== undefined && fetchRoom(currentUser);
        // gsap.to("#rightLine", { clearProps: "all" });
        // gsap.to("#leftLine", { clearProps: "all" });
        gsap.to("#wyrScore", { clearProps: "all" });
        gsap.to("#wyrScore", {
          duration: 2,
          ease: "expo.out",
          autoAlpha: 1,
          display: "initial",
        });
      });

      socket.on("userJoined", (userId: IUserJoin) => {
        fetchRoom(userId.userId);
      });

      socket.on("userLeft", () => {
        props.user._id !== undefined && fetchRoom(props.user._id);
      });
    }
  }, []);

  useEffect(() => {
    if (socket) {
      socket.once(
        "onSelect",
        ({ selection, userId }: { selection: string; userId: string }) => {
          setTotalAnswered(totalAnswered + 1);

          if (selection === selections[0]) {
            gsap.to("#left", {
              duration: 2,
              height: "+=" + 30 / props.room.users.length + "vh",
              onStart: () => {
                // gsap.to("#leftLine", {
                //   ease: "sine.inOut",
                //   y: -5,
                //   repeat: -1,
                //   yoyo: true,
                //   autoAlpha: 1,
                // });
                gsap.fromTo(
                  `#username${userId}`,
                  { color: "#7ae75b" },
                  {
                    duration: 4,
                    color: "#f3ff00",
                    ease: "Linear.easeNone",
                    repeat: -1,
                    yoyo: true,
                  }
                );
              },
            });

            const newArray = [...left, userId];
            setLeft(newArray);
          } else if (selection === selections[1]) {
            gsap.to("#right", {
              duration: 2,
              height: "+=" + 30 / props.room.users.length + "vh",
              onStart: () => {
                // gsap.to("#rightLine", {
                //   delay: 0.5,
                //   ease: "sine.inOut",
                //   y: -5,
                //   repeat: -1,
                //   yoyo: true,
                //   autoAlpha: 1,
                // });
                gsap.fromTo(
                  `#username${userId}`,
                  { color: "#ff0000" },
                  {
                    duration: 4,
                    color: "#e786c8",
                    ease: "Linear.easeNone",
                    repeat: -1,
                    yoyo: true,
                  }
                );
              },
            });

            const newArray = [...right, userId];
            setRight(newArray);
          }
        }
      );
    }
    if (
      totalAnswered === props.room.users.length &&
      totalAnswered === left.length + right.length
    ) {
      if (left.length > right.length) {
        left.forEach(async (user) => {
          fetchRoom(user);
          props.user.creator && (await updateScore(user));
        });
      } else if (left.length < right.length) {
        right.forEach(async (user) => {
          fetchRoom(user);
          props.user.creator && (await updateScore(user));
        });
      }
      sortUsers(props.room.users);
    }
  }, [totalAnswered, left.length, right.length, selections.length]);

  const fetchRoom = async (userId: string) => {
    try {
      const res = await getRoomByUserId(userId);
      if (res !== undefined && res.ok) {
        const room = await res.json();
        sortUsers(room.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="wyrWrapper">
      <WouldYouRatherScore selections={selections} />
      <div className="tableContainer">
        <Table borderless size="sm" id="wyrTable">
          <thead>
            <tr>
              <th>Players</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 && (
              <>
                {users.map((user) => (
                  <tr className="tableRows" id={`row${user._id}`}>
                    <td className="wyrUsername">
                      <span id={`username${user._id}`}>{user.name}</span>
                    </td>
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
    </div>
  );
}
