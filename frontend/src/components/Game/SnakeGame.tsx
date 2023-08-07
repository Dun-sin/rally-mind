import { useState, useEffect, useRef } from 'react';
import useInterval from '@use-it/interval';

import { Icon } from '@iconify/react';
import { checkStreak, getCurrentDate, getFromLocalStorage } from '@/lib/helper';
import logger from '@/lib/logger';

type Apple = {
  x: number;
  y: number;
};

type Velocity = {
  dx: number;
  dy: number;
};

export default function SnakeGame() {
  // Game Settings
  const minGameSpeed = 10;
  const maxGameSpeed = 20;

  // Game State
  const [gameDelay, setGameDelay] = useState<number>(1000 / minGameSpeed);
  const [countDown, setCountDown] = useState<number>(4);
  const [running, setRunning] = useState(false);
  const [isLost, setIsLost] = useState(false);
  const [highscore, setHighscore] = useState(0);
  const [newHighscore, setNewHighscore] = useState(false);
  const [score, setScore] = useState(0);
  const [snake, setSnake] = useState<{
    head: { x: number; y: number };
    trail: Array<any>;
  }>({
    head: { x: 12, y: 9 },
    trail: [],
  });
  const [apple, setApple] = useState<Apple>({ x: -1, y: -1 });
  const [velocity, setVelocity] = useState<Velocity>({ dx: 0, dy: 0 });
  const [previousVelocity, setPreviousVelocity] = useState<Velocity>({
    dx: 0,
    dy: 0,
  });
  const [canvasSize, setCanvasSize] = useState({
    canvasHeight: 0,
    canvasWidth: 0,
  });

  // Canvas Settings
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const canvasGridSize = 20;

  useEffect(() => {
    const width = Number(mainRef.current?.offsetWidth);
    setCanvasSize({ canvasWidth: width, canvasHeight: width * 0.76 });

    getHighScore();
  }, []);

  async function getHighScore() {
    const response = await fetch(
      `https://rally-mind.onrender.com/api/user/updateHighScore?email=${getFromLocalStorage(
        'email'
      )}`,
      {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${getFromLocalStorage('token')}`,
        },
      }
    );

    const data = await response.json();
    if (response.ok) {
      logger(data.message, 'highScore');
      setHighscore(data.message);
    } else {
      logger(data.message, 'error');
    }
  }

  const clearCanvas = (ctx: CanvasRenderingContext2D) => {
    return ctx.clearRect(
      -1,
      -1,
      canvasSize.canvasWidth + 2,
      canvasSize.canvasHeight + 2
    );
  };

  const generateApplePosition = (): Apple => {
    const x = Math.floor(
      Math.random() * (canvasSize.canvasWidth / canvasGridSize)
    );
    const y = Math.floor(
      Math.random() * (canvasSize.canvasHeight / canvasGridSize)
    );
    // Check if random position interferes with snake head or trail
    if (
      (snake.head.x === x && snake.head.y === y) ||
      snake.trail.some((snakePart) => snakePart.x === x && snakePart.y === y)
    ) {
      return generateApplePosition();
    }
    return { x, y };
  };

  // Initialise state and start countdown
  const startGame = () => {
    setGameDelay(1000 / minGameSpeed);
    setIsLost(false);
    setScore(0);
    setSnake({
      head: { x: 12, y: 9 },
      trail: [],
    });
    setApple(generateApplePosition());
    setVelocity({ dx: 0, dy: -1 });
    setRunning(true);
    setNewHighscore(false);
    setCountDown(3);
  };

  const updatePoint = async (score: number) => {
    if (score === 0) return;
    try {
      const response = await fetch(
        'https://rally-mind.onrender.com/api/user/updatePoints',
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
          body: JSON.stringify({
            email: getFromLocalStorage('email'),
            points: score,
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        logger(data.message);
        window.localStorage.setItem('GameDate', getCurrentDate());
        checkStreak();
      } else {
        logger(data.message);
      }
    } catch (error) {
      logger(`Couldn't add points`);
    }
  };

  // Reset state and check for highscore
  const gameOver = async () => {
    if (score > highscore) {
      setHighscore(score);
      const response = await fetch(
        'https://rally-mind.onrender.com/api/user/updateHighScore',
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getFromLocalStorage('token')}`,
          },
          body: JSON.stringify({
            email: getFromLocalStorage('email'),
            score,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        logger(data.message);
        localStorage.setItem('highscore', score.toString());
      } else {
        logger(`Couldn't update streak`);
      }
      setNewHighscore(true);
    }
    setIsLost(true);
    setRunning(false);
    setVelocity({ dx: 0, dy: 0 });
    setCountDown(4);

    if (getFromLocalStorage('GameDate') === getCurrentDate()) return;
    updatePoint(score);
  };

  const fillRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    ctx.fillRect(x, y, w, h);
  };

  const strokeRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) => {
    ctx.strokeRect(x + 0.5, y + 0.5, w, h);
  };

  const drawSnake = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0170F3';
    ctx.strokeStyle = '#003779';

    fillRect(
      ctx,
      snake.head.x * canvasGridSize,
      snake.head.y * canvasGridSize,
      canvasGridSize,
      canvasGridSize
    );

    strokeRect(
      ctx,
      snake.head.x * canvasGridSize,
      snake.head.y * canvasGridSize,
      canvasGridSize,
      canvasGridSize
    );

    snake.trail.forEach((snakePart) => {
      fillRect(
        ctx,
        snakePart.x * canvasGridSize,
        snakePart.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );

      strokeRect(
        ctx,
        snakePart.x * canvasGridSize,
        snakePart.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );
    });
  };

  const drawApple = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#DC3030'; // '#38C172' // '#F4CA64'
    ctx.strokeStyle = '#881A1B'; // '#187741' // '#8C6D1F

    if (
      apple &&
      typeof apple.x !== 'undefined' &&
      typeof apple.y !== 'undefined'
    ) {
      fillRect(
        ctx,
        apple.x * canvasGridSize,
        apple.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );

      strokeRect(
        ctx,
        apple.x * canvasGridSize,
        apple.y * canvasGridSize,
        canvasGridSize,
        canvasGridSize
      );
    }
  };

  // Update snake.head, snake.trail and apple positions. Check for collisions.
  const updateSnake = () => {
    // Check for collision with walls
    const nextHeadPosition = {
      x: snake.head.x + velocity.dx,
      y: snake.head.y + velocity.dy,
    };
    if (
      nextHeadPosition.x < 0 ||
      nextHeadPosition.y < 0 ||
      nextHeadPosition.x >= canvasSize.canvasWidth / canvasGridSize ||
      nextHeadPosition.y >= canvasSize.canvasHeight / canvasGridSize
    ) {
      gameOver();
    }

    // Check for collision with apple
    if (nextHeadPosition.x === apple.x && nextHeadPosition.y === apple.y) {
      setScore((prevScore) => prevScore + 1);
      setApple(generateApplePosition());
    }

    const updatedSnakeTrail = [...snake.trail, { ...snake.head }];
    // Remove trail history beyond snake trail length (score + 2)
    while (updatedSnakeTrail.length > score + 2) updatedSnakeTrail.shift();
    // Check for snake colliding with itsself
    if (
      updatedSnakeTrail.some(
        (snakePart) =>
          snakePart.x === nextHeadPosition.x &&
          snakePart.y === nextHeadPosition.y
      )
    )
      gameOver();

    // Update state
    setPreviousVelocity({ ...velocity });
    setSnake({
      head: { ...nextHeadPosition },
      trail: [...updatedSnakeTrail],
    });
  };

  // Game Hook
  useEffect(() => {
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');

    if (ctx && !isLost) {
      clearCanvas(ctx);
      drawApple(ctx);
      drawSnake(ctx);
    }
  }, [snake]);

  // Game Update Interval
  useInterval(
    () => {
      if (!isLost) {
        updateSnake();
      }
    },
    running && countDown === 0 ? gameDelay : null
  );

  // Countdown Interval
  useInterval(
    () => {
      setCountDown((prevCountDown) => prevCountDown - 1);
    },
    countDown > 0 && countDown < 4 ? 800 : null
  );

  // DidMount Hook for Highscore
  useEffect(() => {
    setHighscore(
      getFromLocalStorage('highscore')
        ? parseInt(getFromLocalStorage('highscore')!)
        : 0
    );
  }, []);

  // Score Hook: increase game speed starting at 16
  useEffect(() => {
    if (score > minGameSpeed && score <= maxGameSpeed) {
      setGameDelay(1000 / score);
    }
  }, [score]);

  // Event Listener: Key Presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        [
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'w',
          'a',
          's',
          'd',
        ].includes(e.key)
      ) {
        let velocity = { dx: 0, dy: 0 };

        switch (e.key) {
          case 'ArrowRight':
            velocity = { dx: 1, dy: 0 };
            break;
          case 'ArrowLeft':
            velocity = { dx: -1, dy: 0 };
            break;
          case 'ArrowDown':
            velocity = { dx: 0, dy: 1 };
            break;
          case 'ArrowUp':
            velocity = { dx: 0, dy: -1 };
            break;
          case 'd':
            velocity = { dx: 1, dy: 0 };
            break;
          case 'a':
            velocity = { dx: -1, dy: 0 };
            break;
          case 's':
            velocity = { dx: 0, dy: 1 };
            break;
          case 'w':
            velocity = { dx: 0, dy: -1 };
            break;
          default:
            throw Error('Error with handleKeyDown');
        }
        if (
          !(
            previousVelocity.dx + velocity.dx === 0 &&
            previousVelocity.dy + velocity.dy === 0
          )
        ) {
          setVelocity(velocity);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [previousVelocity]);

  const handleButton = (direction: string) => {
    let velocity = { dx: 0, dy: 0 };
    switch (direction) {
      case 'right':
        velocity = { dx: 1, dy: 0 };
        break;
      case 'left':
        velocity = { dx: -1, dy: 0 };
        break;
      case 'down':
        velocity = { dx: 0, dy: 1 };
        break;
      case 'up':
        velocity = { dx: 0, dy: -1 };
        break;
      default:
        throw Error('Error with handleKeyDown');
    }
    if (
      !(
        previousVelocity.dx + velocity.dx === 0 &&
        previousVelocity.dy + velocity.dy === 0
      )
    ) {
      setVelocity(velocity);
    }
  };

  return (
    <>
      <div className='border-brand relative w-full border-2' ref={mainRef}>
        <canvas
          ref={canvasRef}
          width={canvasSize.canvasWidth - 3}
          height={canvasSize.canvasHeight + 1}
        />
        <section className='border-brand flex justify-between border-t-2 px-2'>
          <div>
            <p className='flex items-center gap-3'>
              <Icon icon='tabler:star-filled' className='text-brand h-6 w-6' />
              Score: {score}
            </p>
            <p className='flex items-center gap-3'>
              <Icon
                icon='material-symbols:trophy'
                className='text-brand h-6 w-6'
              />
              Highscore: {highscore > score ? highscore : score}
            </p>
          </div>
          {!isLost && countDown > 0 ? (
            <button
              onClick={startGame}
              className='bg-brand text-primary rounded-lg px-6 py-3'
            >
              {countDown === 4 ? 'Start Game' : countDown}
            </button>
          ) : (
            <div className='flex flex-col items-center justify-center'>
              <p>How to Play?</p>
              <p className='flex gap-2'>
                <Icon icon='mingcute:arrow-up-fill' />
                <Icon icon='mingcute:arrow-right-fill' />
                <Icon icon='mingcute:arrow-down-fill' />
                <Icon icon='mingcute:arrow-left-fill' />
              </p>
            </div>
          )}
        </section>

        {isLost && (
          <div className='bg-primary absolute left-1/2 top-1/2 flex h-full w-full -translate-x-1/2 -translate-y-1/2 transform items-center justify-center'>
            <span className='flex flex-col items-center gap-4'>
              <p className='text-3xl font-bold'>Game Over</p>
              <p className=' font-light'>
                {newHighscore ? `🎉 New Highscore 🎉` : `You scored: ${score}`}
              </p>
              {!running && isLost && (
                <button
                  onClick={startGame}
                  className='bg-brand text-primary rounded-lg px-6 py-3'
                >
                  {countDown === 4 ? 'Restart Game' : countDown}
                </button>
              )}
            </span>
          </div>
        )}
      </div>

      <div className='mt-5 flex flex-col items-center gap-4'>
        <button
          className='bg-brand text-primary flex items-center rounded-lg px-4 py-2'
          onClick={() => handleButton('up')}
        >
          <Icon icon='mingcute:arrow-up-fill' />
          UP
        </button>
        <span className='flex gap-4'>
          <button
            className='bg-brand text-primary flex items-center rounded-lg px-4 py-2'
            onClick={() => handleButton('left')}
          >
            <Icon icon='mingcute:arrow-left-fill' />
            LEFT
          </button>
          <button
            className='bg-brand text-primary flex items-center rounded-lg px-4 py-2'
            onClick={() => handleButton('right')}
          >
            <Icon icon='mingcute:arrow-right-fill' />
            RIGHT
          </button>
        </span>
        <button
          className='bg-brand text-primary flex items-center rounded-lg px-4 py-2'
          onClick={() => handleButton('down')}
        >
          <Icon icon='mingcute:arrow-down-fill' />
          DOWN
        </button>
      </div>
    </>
  );
}
