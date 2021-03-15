import React, { useEffect } from "react";
import { Button, Carousel } from "react-bootstrap";

export default function Cards() {
  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://place-hold.it/800x400"
            alt="Second slide"
          />

          <Carousel.Caption>
            <h3>WOULD YOU RATHER</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="https://place-hold.it/800x400"
            alt="Third slide"
          />

          <Carousel.Caption>
            <h3>TRUTH OR DARE</h3>
            <p>
              Praesent commodo cursus magna, vel scelerisque nisl consectetur.
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
}
