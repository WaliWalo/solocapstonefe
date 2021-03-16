import React from "react";
import { useSpring, animated } from "react-spring";
import range from "lodash-es/range";
import "./lobby.css";
import { ILobbyPlayersProps } from "./types";

export default function Players(props: ILobbyPlayersProps) {
  const items = range(props.players.length);
  const interp = (i: number) => (r: number) =>
    `translate3d(0, ${15 * Math.sin(r + (i * 2 * Math.PI) / 1.6)}px, 0)`;
  const sprintProps: any = useSpring<any>({
    to: { radians: 2 * Math.PI },
    from: { radians: 0 },
    loop: true,
    config: { duration: 3500 },
  });
  return (
    <div className="script-bf-main my-3">
      {sprintProps.radians.to !== undefined && (
        <>
          {items.map((i: number) => (
            <animated.div
              key={i}
              className="script-bf-box py-1"
              style={{ transform: sprintProps.radians.to(interp(i)) }}
            >
              <span>{props.players[i].option}</span>
            </animated.div>
          ))}
        </>
      )}
    </div>
  );
}
