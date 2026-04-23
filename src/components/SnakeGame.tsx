import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Don't spawn food on snake
      if (!snake.some(segment => segment.x === newFood!.x && segment.y === newFood!.y)) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(true);
    setFood(generateFood());
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction.y === 0) setDirection({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (direction.y === 0) setDirection({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (direction.x === 0) setDirection({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (direction.x === 0) setDirection({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const newHead = {
          x: prevSnake[0].x + direction.x,
          y: prevSnake[0].y + direction.y,
        };

        // Check walls
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, Math.max(50, BASE_SPEED - score / 10));
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isPaused, score, generateFood]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = '#ffffff0a';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = '#00f3ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00f3ff';
    ctx.fillRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4);
    
    // Draw Snake
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    snake.forEach((segment, i) => {
      ctx.fillStyle = i === 0 ? '#ff00ff' : '#ff00ffaa';
      ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2);
    });

  }, [snake, food]);

  return (
    <div className="flex-grow flex flex-col lg:flex-row gap-6 w-full max-w-full">
      {/* Game Window */}
      <div className="flex-grow relative flex flex-col bg-[#080808] border border-white/5 rounded-2xl p-4 shadow-2xl overflow-hidden min-w-0">
        {/* Game Viewport Container */}
        <div className="flex-grow border-2 border-[#00f3ff]/30 rounded-lg relative bg-[radial-gradient(circle_at_center,#111,transparent)] overflow-hidden flex items-center justify-center min-h-[400px]">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#00f3ff 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              className="bg-transparent shadow-[0_0_30px_rgba(0,243,255,0.15)] max-w-full max-h-full aspect-square"
            />
          </div>
          
          <AnimatePresence>
            {(isPaused || gameOver) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
              >
                <div className="p-8 border border-[#ff00ff]/50 bg-[#111111] rounded-2xl text-center shadow-[0_0_20px_rgba(255,0,255,0.2)]">
                  <h2 className={`text-2xl font-black mb-2 uppercase italic ${gameOver ? 'text-red-500' : 'text-[#00f3ff]'}`}>
                    {gameOver ? 'Protocol Terminated' : 'System Standby'}
                  </h2>
                  <p className="text-xs text-gray-400 mb-6 uppercase tracking-widest">
                    Score Achieved: <span className="text-white font-mono">{score}</span>
                  </p>
                  <button 
                    onClick={gameOver ? resetGame : () => setIsPaused(false)}
                    className="px-6 py-3 bg-[#00f3ff] text-black font-bold uppercase rounded-lg hover:bg-white hover:shadow-[0_0_15px_rgba(0,243,255,0.6)] transition-all"
                  >
                    {gameOver ? 'Reboot System' : 'Engage'}
                  </button>
                  <p className="mt-6 text-[10px] text-gray-500 uppercase tracking-widest">
                    Use Arrows to Navigate | Space to {isPaused ? 'Engage' : 'Pause'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Game Overlay Labels */}
          <div className="absolute top-4 left-4 font-mono text-[10px] text-white/40 uppercase pointer-events-none">Status: {gameOver ? 'Failure' : 'Active'}</div>
          <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#ff00ff] uppercase pointer-events-none">Protocol: OS-Snake</div>
        </div>
      </div>

      {/* Stats Sidebar */}
      <div className="w-full lg:w-48 lg:flex flex-col gap-4 hidden shrink-0">
        <div className="bg-[#111111] border border-white/10 rounded-xl p-5 text-center flex-grow flex flex-col justify-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Current Score</p>
          <p className="text-5xl font-black text-[#00f3ff] drop-shadow-[0_0_10px_rgba(0,243,255,0.4)]">{score}</p>
          <div className="h-px bg-white/10 my-6"></div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Target Score</p>
          <p className="text-2xl font-bold text-white">10000</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#111111] border border-white/5 p-3 rounded-lg text-center">
             <p className="text-[8px] text-gray-500 uppercase font-bold">Level</p>
             <p className="text-lg font-bold">{Math.floor(score / 100) + 1}</p>
          </div>
          <div className="bg-[#111111] border border-white/5 p-3 rounded-lg text-center">
             <p className="text-[8px] text-gray-500 uppercase font-bold">Eaten</p>
             <p className="text-lg font-bold">{score / 10}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
