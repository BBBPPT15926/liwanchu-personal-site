import { useEffect, useRef } from 'react';

type Letter = {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
};

type LetterGlitchProps = {
  glitchColors?: string[];
  colors?: string[];
  className?: string;
  glitchSpeed?: number;
  speed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  showCenterVignette?: boolean;
  showOuterVignette?: boolean;
  smooth?: boolean;
  characters?: string;
};

const defaultGlitchColors = ['#2b4539', '#61dca3', '#61b3dc'];
const fontSize = 16;
const charWidth = 10;
const charHeight = 20;

export default function LetterGlitch({
  glitchColors,
  colors,
  className = '',
  glitchSpeed = 50,
  speed,
  centerVignette,
  outerVignette,
  showCenterVignette,
  showOuterVignette,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789',
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>();
  const letters = useRef<Letter[]>([]);
  const grid = useRef({ columns: 0, rows: 0 });
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const lastGlitchTime = useRef(Date.now());
  const lettersAndSymbols = Array.from(characters);
  const resolvedGlitchColors = glitchColors ?? colors ?? defaultGlitchColors;
  const resolvedGlitchSpeed = speed ?? glitchSpeed;
  const shouldShowCenterVignette = showCenterVignette ?? centerVignette ?? false;
  const shouldShowOuterVignette = showOuterVignette ?? outerVignette ?? true;
  const colorSignature = resolvedGlitchColors.join('|');

  const getRandomChar = () =>
    lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)] ?? '0';

  const getRandomColor = () =>
    resolvedGlitchColors[Math.floor(Math.random() * resolvedGlitchColors.length)] ?? '#61dca3';

  const hexToRgb = (hexColor: string) => {
    const normalized = hexColor.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (_, r, g, b) =>
      `${r}${r}${g}${g}${b}${b}`,
    );
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(normalized);

    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number,
  ) => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor),
    };

    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number) => ({
    columns: Math.ceil(width / charWidth),
    rows: Math.ceil(height / charHeight),
  });

  const initializeLetters = (columns: number, rows: number) => {
    grid.current = { columns, rows };
    letters.current = Array.from({ length: columns * rows }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1,
    }));
  };

  const drawLetters = () => {
    const canvas = canvasRef.current;
    const ctx = context.current;

    if (!canvas || !ctx || letters.current.length === 0) return;

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    letters.current.forEach((letter, index) => {
      const x = (index % grid.current.columns) * charWidth;
      const y = Math.floor(index / grid.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;

    if (!canvas || !parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    context.current?.setTransform(dpr, 0, 0, dpr, 0, 0);

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);
    drawLetters();
  };

  const updateLetters = () => {
    if (letters.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(letters.current.length * 0.05));

    for (let i = 0; i < updateCount; i += 1) {
      const index = Math.floor(Math.random() * letters.current.length);
      const letter = letters.current[index];

      if (!letter) continue;

      letter.char = getRandomChar();
      letter.targetColor = getRandomColor();

      if (!smooth) {
        letter.color = letter.targetColor;
        letter.colorProgress = 1;
      } else {
        letter.colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = () => {
    let needsRedraw = false;

    letters.current.forEach((letter) => {
      if (letter.colorProgress >= 1) return;

      letter.colorProgress = Math.min(letter.colorProgress + 0.05, 1);

      const startRgb = hexToRgb(letter.color);
      const endRgb = hexToRgb(letter.targetColor);

      if (startRgb && endRgb) {
        letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
        needsRedraw = true;
      }
    });

    if (needsRedraw) drawLetters();
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    context.current = canvas.getContext('2d');
    resizeCanvas();

    const animate = () => {
      const now = Date.now();

      if (now - lastGlitchTime.current >= resolvedGlitchSpeed) {
        updateLetters();
        drawLetters();
        lastGlitchTime.current = now;
      }

      if (smooth) handleSmoothTransitions();

      animationRef.current = window.requestAnimationFrame(animate);
    };

    animate();

    let resizeTimeout: number | undefined;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) window.cancelAnimationFrame(animationRef.current);
      window.clearTimeout(resizeTimeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [characters, colorSignature, resolvedGlitchSpeed, smooth]);

  return (
    <div className={`relative h-full w-full overflow-hidden bg-black ${className}`}>
      <canvas ref={canvasRef} className="block h-full w-full" />
      {shouldShowOuterVignette ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0)_58%,rgba(0,0,0,0.95)_100%)]" />
      ) : null}
      {shouldShowCenterVignette ? (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0)_62%)]" />
      ) : null}
    </div>
  );
}
