import React from "react";
import { Wheel } from "react-custom-roulette";
const data = [
  { option: "player" },
  { option: "player" },
  { option: "player" },
  { option: "player" },
  { option: "player" },
  { option: "player" },
  { option: "player" },
];
export default function Roulette() {
  return (
    <div>
      <Wheel
        mustStartSpinning={true}
        prizeNumber={3}
        data={data}
        backgroundColors={["black", "red"]}
        textColors={["white"]}
        radiusLineColor="white"
        perpendicularText={true}
      />
    </div>
  );
}
