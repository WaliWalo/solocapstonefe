import React from "react";
import { Wheel } from "react-custom-roulette";
import { IRouletteProp } from "./types";

export default function Roulette(props: IRouletteProp) {
  const data = props.players;

  return (
    <div id="rouletteContainer">
      <Wheel
        mustStartSpinning={props.mustSpin}
        prizeNumber={props.prizeNumber}
        data={data}
        backgroundColors={["#5FFBF1"]}
        textColors={["#3d2d89"]}
        radiusLineColor="black"
        perpendicularText={true}
        onStopSpinning={() => props.stopSpin !== undefined && props.stopSpin()}
      />
    </div>
  );
}
