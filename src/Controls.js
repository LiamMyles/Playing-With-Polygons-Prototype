import React, { Component } from "react"

class Controls extends Component {
  static defaultProps = {
    controls: [
      {
        title: "Spin Speed",
        inputType: "range",
        inputAttributes: {
          min: 0.001,
          max: 0.1,
          step: 0.001,
          defaultValue: 0.01
        },
        updates: "spinSpeed",
        group: "spin"
      },
      {
        title: "Scale Speed",
        inputType: "range",
        inputAttributes: { min: 0.1, max: 5, step: 0.1, defaultValue: 2 },
        updates: "scaleSpeed"
      },
      {
        title: "Spin Clockwise",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "spinDirection",
        group: "spin"
      },
      {
        title: "Scale Max",
        inputType: "range",
        inputAttributes: { min: 200, max: 500, step: 1, defaultValue: 200 },
        updates: "scaleRangeMax"
      },
      {
        title: "Spinning",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "spinningStatus"
      },
      {
        title: "Scale Min",
        inputType: "range",
        inputAttributes: { min: 0, max: 200, step: 1, defaultValue: 50 },
        updates: "scaleRangeMin"
      },

      {
        title: "Points Amount",
        inputType: "range",
        inputAttributes: { min: 2, max: 12, step: 1, defaultValue: 6 },
        updates: "pointsAmount"
      },
      {
        title: "Scaling",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "scalingStatus"
      },
      {
        title: "Dots Enabled",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "dotsStatus"
      },
      {
        title: "Shape Y",
        inputType: "range",
        inputAttributes: { min: -400, max: 400, step: 1, defaultValue: 0 },
        updates: "shapeCentreY"
      },
      {
        title: "Dots Size",
        inputType: "range",
        inputAttributes: { min: 1, max: 20, step: 0.5, defaultValue: 3 },
        updates: "dotsSize"
      },
      {
        title: "Shape X",
        inputType: "range",
        inputAttributes: { min: -400, max: 400, step: 1, defaultValue: 0 },
        updates: "shapeCentreX"
      },
      {
        title: "Dots Stroke",
        inputType: "range",
        inputAttributes: { min: 0, max: 10, step: 0.5, defaultValue: 0.5 },
        updates: "dotsStroke"
      },
      {
        title: "Sides Enabled",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "sidesStatus"
      },
      {
        title: "Dots Fill Colour",
        inputType: "text",
        inputAttributes: { defaultValue: "DarkOrange, DarkSeaGreen" },
        updates: "dotsFillColours"
      },
      {
        title: "Sides Stroke",
        inputType: "range",
        inputAttributes: { min: 0.1, max: 10, step: 0.1, defaultValue: 0.1 },
        updates: "sidesStroke"
      },
      {
        title: "Dots Stroke Colour",
        inputType: "text",
        inputAttributes: { defaultValue: "DarkViolet" },
        updates: "dotsStrokeColours"
      },
      {
        title: "Side Stroke Colour",
        inputType: "text",
        inputAttributes: { defaultValue: "Indigo, Khaki, LawnGreen" },
        updates: "sidesStrokeColours"
      },
      {
        title: "Active",
        inputType: "checkbox",
        inputAttributes: { defaultChecked: true },
        updates: "activeStatus"
      }
    ]
  }
  inputUpdate = e => {
    const updates = e.currentTarget.dataset.updates
    let value

    switch (e.currentTarget.type) {
      case "checkbox":
        value = e.currentTarget.checked
        break
      case "text": {
        const textValue = e.currentTarget.value
        value = textValue
          .split(",")
          .map(colour => colour.trim())
          .filter(colour => {
            let isLongEnough = true
            if (colour.length <= 3) {
              isLongEnough = false
            }
            return isLongEnough
          })
        if (value.length <= 0) {
          value = ["white"]
        }
        break
      }
      default:
        value = e.currentTarget.value
    }

    switch (updates) {
      case "spinSpeed":
        this.setSpinSpeed(value)
        break
      case "scaleSpeed":
        this.setScaleSpeed(value)
        break
      case "pointsAmount":
        this.setPointsAmount(value)
        break
      case "activeStatus":
        this.setActiveStatus(value)
        break
      case "pausedStatus":
        this.setPausedStatus(value)
        break
      case "spinningStatus":
        this.setSpinningStatus(value)
        break
      case "scalingStatus":
        this.setScalingStatus(value)
        break
      case "dotsStatus":
        this.setDotsStatus(value)
        break
      case "sidesStatus":
        this.setSidesStatus(value)
        break
      case "spinDirection":
        this.setSpinDirection(value)
        break
      case "scaleRangeMax":
        this.setScaleRangeMax(value)
        break
      case "scaleRangeMin":
        this.setScaleRangeMin(value)
        break
      case "dotsStroke":
        this.setDotsStroke(value)
        break
      case "dotsSize":
        this.setDotsSize(value)
        break
      case "sidesStroke":
        this.setSidesStroke(value)
        break
      case "dotsFillColours":
        this.setDotsFillColours(value)
        break
      case "dotsStrokeColours":
        this.setDotsStrokeColours(value)
        break
      case "sidesStrokeColours":
        this.setSidesStrokeColours(value)
        break
      case "shapeCentreX":
        this.setShapeCentreX(value)
        break
      case "shapeCentreY":
        this.setShapeCentreY(value)
        break
      default:
        return
    }
  }

  setSpinSpeed(value) {
    this.props.polygon.setSpin({ speed: parseFloat(value) })
  }
  setShapeCentreX(value) {
    this.props.polygon.setShapeCentre({ x: parseFloat(value) })
  }
  setShapeCentreY(value) {
    this.props.polygon.setShapeCentre({ y: parseFloat(value) })
  }
  setSpinDirection(value) {
    this.props.polygon.setSpin({ isClockwise: value })
  }
  setScaleSpeed(value) {
    this.props.polygon.setScale({ speed: parseFloat(value) })
  }
  setScaleRangeMax(value) {
    this.props.polygon.setScaleRange({ max: parseFloat(value) })
  }
  setScaleRangeMin(value) {
    this.props.polygon.setScaleRange({ min: parseFloat(value) })
  }
  setPointsAmount(value) {
    this.props.polygon.setShape({ points: parseFloat(value) })
  }
  setDotsSize(value) {
    this.props.polygon.setDots({ size: parseFloat(value) })
  }
  setDotsFillColours(value) {
    this.props.polygon.setDots({ fillColours: value })
  }
  setDotsStrokeColours(value) {
    this.props.polygon.setDots({ stokeColours: value })
  }
  setSidesStrokeColours(value) {
    this.props.polygon.setSides({ stokeColours: value })
  }
  setDotsStroke(value) {
    this.props.polygon.setDots({ strokeWeight: parseFloat(value) })
  }
  setActiveStatus(value) {
    this.props.polygon.setStatus({ active: value })
  }
  setPausedStatus(value) {
    this.props.polygon.setStatus({ paused: value })
  }
  setSpinningStatus(value) {
    this.props.polygon.setStatus({ spinning: value })
  }
  setScalingStatus(value) {
    this.props.polygon.setStatus({ scaling: value })
  }
  setDotsStatus(value) {
    this.props.polygon.setStatus({ dotsEnabled: value })
  }
  setSidesStatus(value) {
    this.props.polygon.setStatus({ sidesEnabled: value })
  }

  setSidesStroke(value) {
    this.props.polygon.setSides({ strokeWeight: parseFloat(value) })
  }

  render() {
    return (
      <div className="controls">
        <h1>Playing with Polygons You Control!</h1>
        <HelpText />
        <fieldset>
          <div>
            {this.props.controls.map((control, index) => {
              return (
                <InputField
                  options={control}
                  index={index}
                  onChangeFn={this.inputUpdate}
                  key={`control${index + 1}`}
                />
              )
            })}
          </div>
        </fieldset>
      </div>
    )
  }
}

const InputField = ({ options, index, onChangeFn }) => {
  const { title, inputAttributes, updates, inputType, group } = options
  const id = `controlLabel${index + 1}`
  return (
    <>
      <label htmlFor={id} className={`label-${group}`}>
        {title}
      </label>
      <input
        {...inputAttributes}
        id={id}
        type={inputType}
        onChange={onChangeFn}
        data-updates={updates}
        className={`input-${group}`}
      />
    </>
  )
}

const HelpText = ({ hide }) => (
  <>
    {hide ? null : (
      <>
        <p>Thanks for Checking out my little demo!</p>
        <p>This is a mid way prototype but I hope you have fun all the same</p>
        <p>Tweak around with the sliders and see what shapes you can make</p>
        <p>
          <strong>Click the Display Area to wipe it clean</strong>
        </p>
        <p>
          Try Adding colour, you can use HEX or words{" "}
          <a href="https://www.w3schools.com/colors/colors_hex.asp">
            CSS's Named Colours
          </a>{" "}
          be sure to separate each colour by (<strong>,</strong>)
        </p>
        <p>
          Some colours to start you off are{" "}
          <strong>Gold, Maroon, Azure, MidnightBlue, DarkOrchid </strong>
        </p>
      </>
    )}
  </>
)

export default Controls
