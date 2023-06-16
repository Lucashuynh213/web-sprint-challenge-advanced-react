import React, { useState } from 'react';

const initialMessage = '';
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4;

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setIndex(initialIndex);
    setSteps(initialSteps);
  }

  function setErrorMessage(errorMessage) {
    setMessage(errorMessage);
    setTimeout(() => setMessage(initialMessage), 2000); // Clear the error message after 2 seconds
  }

  function getNextIndex(direction) {
    let nextIndex = index;

    switch (direction) {
      case 'left':
        if (index % 3 !== 0) {
          nextIndex = index - 1;
        } else {
          setErrorMessage("You can't go left");
        }
        break;
      case 'up':
        if (index >= 3) {
          nextIndex = index - 3;
        } else {
          setErrorMessage("You can't go up");
        }
        break;
      case 'right':
        if (index % 3 !== 2) {
          nextIndex = index + 1;
        } else {
          setErrorMessage("You can't go right");
        }
        break;
      case 'down':
        if (index <= 5) {
          nextIndex = index + 3;
        } else {
          setErrorMessage("You can't go down");
        }
        break;
      default:
        break;
    }

    return nextIndex;
  }

  function move(direction) {
    const nextIndex = getNextIndex(direction);

    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps((prevSteps) => prevSteps + 1);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const { x, y } = getXY();
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
        setMessage(data.message);
        setEmail(initialEmail);
    
        if (direction === 'left' && email !== '') {
          setMessage("lady win #29");
        } else if ((direction === 'up' || direction === 'right') && email !== '') {
          setMessage("lady win #49");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
    </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
            {idx === index ? 'B' : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move('left')}>
          LEFT
        </button>
        <button id="up" onClick={() => move('up')}>
          UP
        </button>
        <button id="right" onClick={() => move('right')}>
          RIGHT
        </button>
        <button id="down" onClick={() => move('down')}>
          DOWN
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          id="email"
          type="email"
          placeholder="type email"
          value={email}
          onChange={onChange}
        />
        <input id="submit" type="submit" value="Submit" />
      </form>
    </div>
  );
}