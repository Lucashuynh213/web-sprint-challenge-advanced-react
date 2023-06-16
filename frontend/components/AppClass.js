import React from 'react'

// Suggested initial states
const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default class AppClass extends React.Component {
  state = {
    message: initialMessage,
    email: initialEmail,
    index: initialIndex,
    steps: initialSteps,
  };

  getXY = () => {
    const { index } = this.state;
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  };

  getXYMessage = () => {
    const { x, y } = this.getXY();
    return `Coordinates (${x}, ${y})`;
  };

  reset = () => {
    this.setState({
      message: initialMessage,
      email: initialEmail,
      index: initialIndex,
      steps: initialSteps,
    });
  };

  setErrorMessage(errorMessage) {
    this.setState({ message: errorMessage });
    setTimeout(() => this.setState({ message: initialMessage }), 2000); // Clear the error message after 2 seconds
  }

  getNextIndex = (direction) => {
    const { index } = this.state;
    let nextIndex = index;

    switch (direction) {
      case 'left':
        if (index % 3 !== 0) {
          nextIndex = index - 1;
        } else {
          this.setErrorMessage("You can't go left");
        }
        break;
      case 'up':
        if (index >= 3) {
          nextIndex = index - 3;
        } else {
          this.setErrorMessage("You can't go up");
        }
        break;
      case 'right':
        if (index % 3 !== 2) {
          nextIndex = index + 1;
        } else {
          this.setErrorMessage("You can't go right");
        }
        break;
      case 'down':
        if (index <= 5) {
          nextIndex = index + 3;
        } else {
          this.setErrorMessage("You can't go down");
        }
        break;
      default:
        break;
    }

    return nextIndex;
  };

  move = (direction) => {
    const nextIndex = this.getNextIndex(direction);

    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        index: nextIndex,
        steps: prevState.steps + 1,
      }));
    }
  };

  onChange = (evt) => {
    this.setState({
      email: evt.target.value,
    });
  };

  onSubmit = (evt) => {
    evt.preventDefault();
    const { x, y } = this.getXY();
    const { steps, email } = this.state;
    const payload = {
      x,
      y,
      steps,
      email,
    };

    // Make the POST request with the payload
    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
   .then((response) => response.json())
    .then((data) => {
      this.setState({ message: data.message, email: '' });

      const { direction, email } = this.state;
      if (direction === 'left' && email !== '') {
        this.setState({ message: 'lady win #29' });
      } else if (
        (direction === 'up' || direction === 'right') &&
        email !== ''
      ) {
        this.setState({ message: 'lady win #49' });
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

  render() {
    const { className } = this.props;
    const { index, steps } = this.state;
    const coordinates = this.getXYMessage();

    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{coordinates}</h3>
          <h3 id="steps">You moved {steps} time</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div
              key={idx}
              className={`square${idx === index ? ' active' : ''}`}
            >
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={() => this.move('left')}>
            LEFT
          </button>
          <button id="up" onClick={() => this.move('up')}>
            UP
          </button>
          <button id="right" onClick={() => this.move('right')}>
            RIGHT
          </button>
          <button id="down" onClick={() => this.move('down')}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={this.state.email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}
