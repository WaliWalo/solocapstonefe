import React from "react";
import { Wheel } from "react-custom-roulette";
import { IRouletteProp } from "./types";

export default function Roulette(props: IRouletteProp) {
  const data = props.players;
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
