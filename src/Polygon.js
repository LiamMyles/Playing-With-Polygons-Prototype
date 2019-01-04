class Polygon {
  //Used as the base options when building the polygon
  static defaultInitialPositions = {
    centre: { x: 0, y: 0 },
    size: 50,
    points: 6
  }
  //Used as the base option when building the polygon
  static defaultPolygon = {
    status: {
      active: true,
      paused: false,
      spinning: true,
      scaling: true,
      dotsEnabled: true,
      sidesEnabled: true
    },
    spin: {
      speed: 0.01,
      isClockwise: true
    },
    scale: {
      range: { max: 200, min: 50 },
      speed: 2
    },
    shape: {
      centre: { x: 0, y: 0 },
      points: 6
    },
    dots: {
      fillColours: ["DarkOrange", "DarkSeaGreen"],
      stokeColours: ["DarkViolet", "FloralWhite"],
      strokeWeight: 0.5,
      size: 3
    },
    sides: {
      stokeColours: ["Indigo", "Khaki", "LawnGreen"],
      strokeWeight: 0.1
    }
  }

  state = {
    pointsPositions: [{ x: 0, y: 0, cos: 0, sin: 0 }],
    currentRotation: 50,
    currentSize: 50,
    currentPoints: 6,
    scalingToMax: true
  }

  constructor(p5Instance, initialPosition, polygonOptions) {
    this.p5 = p5Instance
    this.polygon = this.generatePolygon(polygonOptions, initialPosition)
  }

  /**
   * Takes in an object of options for setting up the polygon and uses
   * them to generate the polygon
   *
   * @param {Object} polygonOptions Complex object similar to this.polygon
   */
  generatePolygon(polygonOptions, initialPositions) {
    const defaultOptions = Polygon.defaultPolygon

    //@ToDO This Needs to get put into global state because the center value is
    // being used elsewhere. This isn't ideal, but for now this will be okay
    const newInitialPositions = {
      ...Polygon.defaultInitialPositions,
      ...initialPositions,
      ...{
        centre: {
          ...Polygon.defaultInitialPositions.centre,
          ...initialPositions.centre
        }
      }
    }
    this.initialPositions = newInitialPositions
    const { size, points } = newInitialPositions

    const newPolygon = {
      ...{
        status: {
          ...defaultOptions.status,
          ...polygonOptions.status
        },
        spin: {
          ...defaultOptions.spin,
          ...polygonOptions.spin
        },
        scale: {
          ...defaultOptions.scale,
          ...polygonOptions.scale
        },
        shape: {
          ...defaultOptions.shape,
          ...polygonOptions.shape
        },
        dots: {
          ...defaultOptions.dots,
          ...polygonOptions.dots
        },
        sides: {
          ...defaultOptions.sides,
          ...polygonOptions.sides
        }
      }
    }

    this.setInitialPolygonPoints(points, size)
    return newPolygon
  }

  /**
   * generates the initial points for the polygon, including there cos and sin angles
   * which will be used in later calculations.
   *
   * Cos and Sin operations are quite intensive so caching these values helps performance
   */
  setInitialPolygonPoints(sides, startingSize) {
    const angleBetweenPoints = this.p5.TWO_PI / sides
    let polygonPoints = []
    let angle = angleBetweenPoints
    for (let index = 1; index <= sides; index++) {
      angle += angleBetweenPoints
      let cos = this.p5.cos(angle)
      let sin = this.p5.sin(angle)
      let x = this.p5.floor(cos * startingSize)
      let y = this.p5.floor(sin * startingSize)

      polygonPoints.push({ x, y, cos, sin })
    }

    this.state.pointsPositions = polygonPoints
    this.state.currentPoints = sides
  }

  /**
   * Applies all of the updates to the points of the polygon that would happen
   * in the next cycle
   *
   * @memberof Polygon
   */
  updatePolygonPoints() {
    const { spinning, scaling } = this.polygon.status
    // I'm going to need to do the rotate as part of the draw loop.
    let newPolygon = { ...this.polygon }

    if (spinning) {
      newPolygon = this.spinPolygon(newPolygon)
    }

    if (scaling) {
      newPolygon = this.scalePolygon(newPolygon)
    }

    this.polygon = newPolygon
  }

  /**
   * Controls the logic for spinning the polygon around.
   *
   * @param {Object} polygon
   * @returns new and updated polygon object derived from the one passed
   */
  spinPolygon(polygon) {
    const newPolygon = { ...polygon }
    const {
      spin: { speed, isClockwise }
    } = newPolygon
    const { currentRotation } = this.state

    let newRotation
    if (isClockwise) {
      newRotation = currentRotation + speed
    } else {
      newRotation = currentRotation - speed
    }
    // Smooths out the rotation by applying the amountOver to the new rotation
    if (newRotation >= 360 || newRotation <= -360) {
      const amountOver = currentRotation - 360
      newRotation = 0 + amountOver
    }
    //Round to 3 floating points
    newRotation = Math.round(newRotation * 1000) / 1000
    this.p5.rotate(newRotation)
    const newState = { ...this.state }
    newState.currentRotation = newRotation
    this.state = newState
    return newPolygon
  }

  /**
   * Deals with all the scaling calculations of the points. Including phasing between
   * moving towards Max and min scale
   *
   * @param {Object} polygon
   * @returns new and updated polygon object derived from the one passed
   */
  scalePolygon(polygon) {
    const newPolygon = { ...polygon }
    const {
      scale: {
        range: { max, min },
        speed
      }
    } = newPolygon

    const { pointsPositions, currentSize, scalingToMax } = this.state

    let newCurrentSize
    if (scalingToMax) {
      newCurrentSize = currentSize + speed
    } else {
      newCurrentSize = currentSize - speed
    }

    let newScalingToMax = scalingToMax
    if (newCurrentSize > max || newCurrentSize < min) {
      newScalingToMax = !scalingToMax
    }
    //If the size changes dramatically it will correct to the new max
    if (newCurrentSize > max + speed * 2) {
      newCurrentSize = max
    }
    //If the size changes dramatically it will correct to the new min
    if (newCurrentSize < min - speed * 2) {
      newCurrentSize = min
    }
    const newPoints = pointsPositions.map(point => {
      let newPoint = { ...point }
      newPoint.x = this.p5.floor(point.cos * newCurrentSize)
      newPoint.y = this.p5.floor(point.sin * newCurrentSize)
      return newPoint
    })

    const newState = { ...this.state }
    newState.currentSize = newCurrentSize
    newState.scalingToMax = newScalingToMax
    newState.pointsPositions = newPoints

    this.state = newState
    return newPolygon
  }
  /**
   * Draws the Polygon to the p5 canvas#
   *
   * Needs to run inside p5.push/p5.pop to generate the objects
   *
   * @memberof Polygon
   */
  drawPolygon() {
    const { dots, sides } = this.polygon
    const { dotsEnabled, sidesEnabled } = this.polygon.status
    const { pointsPositions } = this.state
    pointsPositions.forEach(({ x, y }, index) => {
      if (dotsEnabled) {
        const fillColourIndex = index % dots.fillColours.length
        const stokeColourIndex = index % dots.stokeColours.length
        this.p5.fill(dots.fillColours[fillColourIndex])
        this.p5.strokeWeight(dots.strokeWeight)
        this.p5.stroke(dots.stokeColours[stokeColourIndex])
        this.p5.ellipse(x, y, dots.size)
      }

      if (sidesEnabled) {
        const stokeColour = index % sides.stokeColours.length
        this.p5.stroke(sides.stokeColours[stokeColour])
        this.p5.strokeWeight(sides.strokeWeight)
        let pos1 = pointsPositions[index]
        let pos2 =
          pointsPositions[index + 1] === undefined
            ? pointsPositions[0]
            : pointsPositions[index + 1]
        this.p5.line(pos1.x, pos1.y, pos2.x, pos2.y)
      }
    })
  }
  /**
   * For use with draw function in the sketch
   */
  draw() {
    const {
      status: { active, paused },
      shape: { centre: shapeCentre, points }
    } = this.polygon
    const { currentPoints, currentSize } = this.state

    const { centre } = this.initialPositions
    if (active && currentPoints === points) {
      this.p5.push()
      //Translate needs to happen before draw
      this.p5.translate(centre.x, centre.y)
      this.p5.translate(shapeCentre.x, shapeCentre.y)
      if (!paused) {
        this.updatePolygonPoints()
      }
      this.drawPolygon()
      this.p5.pop()
    } else if (currentPoints !== points) {
      this.setInitialPolygonPoints(points, currentSize)
    }
  }
}

class InteractivePolygon extends Polygon {
  //Might be better to look at a reducer pattern that redux uses for this.
  //I could just use redux full stop, but I'm not sure its necessary yet.
  //I'm more just looking for a clean pattern to apply these changes.
  setStatus(status) {
    const updatedPolygon = {
      ...this.polygon,
      status: {
        ...this.polygon.status,
        ...status
      }
    }
    this.polygon = updatedPolygon
  }
  setSpin(spin) {
    const updatedPolygon = {
      ...this.polygon,
      spin: {
        ...this.polygon.spin,
        ...spin
      }
    }
    this.polygon = updatedPolygon
  }
  setScale(scale) {
    const updatedPolygon = {
      ...this.polygon,
      scale: {
        ...this.polygon.scale,
        ...scale
      }
    }
    this.polygon = updatedPolygon
  }
  setScaleRange(range) {
    const updatedPolygon = {
      ...this.polygon,
      scale: {
        ...this.polygon.scale,
        range: {
          ...this.polygon.scale.range,
          ...range
        }
      }
    }
    this.polygon = updatedPolygon
  }
  setShape(shape) {
    const updatedPolygon = {
      ...this.polygon,
      shape: {
        ...this.polygon.shape,
        ...shape
      }
    }
    this.polygon = updatedPolygon
  }
  setShapeCentre(centre) {
    const updatedPolygon = {
      ...this.polygon,
      shape: {
        ...this.polygon.shape,
        centre: {
          ...this.polygon.shape.centre,
          ...centre
        }
      }
    }
    this.polygon = updatedPolygon
  }
  setDots(dots) {
    const updatedPolygon = {
      ...this.polygon,
      dots: {
        ...this.polygon.dots,
        ...dots
      }
    }
    this.polygon = updatedPolygon
  }
  setSides(sides) {
    const updatedPolygon = {
      ...this.polygon,
      sides: {
        ...this.polygon.sides,
        ...sides
      }
    }
    this.polygon = updatedPolygon
  }
}

export { Polygon, InteractivePolygon }
