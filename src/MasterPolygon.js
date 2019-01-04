import React, { Component } from "react";
import { InteractivePolygon } from "./Polygon";

import Controls from "./Controls";

import p5 from "p5";

export default class MasterPolygon extends Component {
  state = {
    polygon: {},
    controls: {
      status: {
        active: true,
        paused: false,
        spinning: true,
        scaling: true,
        dotsEnabled: true,
        sidesEnabled: true
      },
      spin: {
        speed: 1,
        isClockwise: true
      },
      scale: {
        range: { max: 100, min: 50 },
        speed: 2
      },
      shape: {
        centre: { x: 0, y: 0 },
        points: 6
      },
      dots: {
        fillColours: ["#000", "#fff"],
        stokeColours: ["#000", "#fff"],
        strokeWeight: 0.5,
        size: 3
      },
      sides: {
        stokeColours: ["#000", "#fff"],
        strokeWeight: 0.1
      }
    },
    p5Sketch: {}
  };

  constructor(props) {
    super(props);
    this.sketchRef = React.createRef();
  }

  componentDidMount() {
    this.setState({
      p5Sketch: new p5(this.createP5Sketch, this.sketchRef.current)
    });
  }

  createP5Sketch = p5Instance => {
    let polygon = {};
    const {
      initialPositions,
      spin,
      scale,
      status,
      dots,
      sides,
      shape
    } = InteractivePolygon.defaultPolygon;

    const options = {
      spin,
      scale,
      status,
      dots,
      sides,
      shape
    };
    p5Instance.setup = () => {
      const canvas = p5Instance.createCanvas(
        p5Instance.windowWidth,
        p5Instance.windowHeight / 2
      );

      canvas.mouseClicked(() => {
        p5Instance.background(230);
      });

      const p5InitialPositions = {
        ...initialPositions,
        ...{
          centre: {
            x: p5Instance.width / 2,
            y: p5Instance.height / 2
          }
        }
      };

      polygon = new InteractivePolygon(p5Instance, p5InitialPositions, options);
      this.setState({ polygon });
      p5Instance.background(230);
    };
    p5Instance.draw = () => {
      polygon.draw();
    };
  };
  render() {
    const { polygon } = this.state;
    return (
      <>
        <Controls polygon={polygon} />
        <div ref={this.sketchRef} />
      </>
    );
  }
}
