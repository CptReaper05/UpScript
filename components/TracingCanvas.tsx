'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { getLetterData, calculateAccuracy, getStarsFromAccuracy } from '@/lib/letters';

interface TracingCanvasProps {
  letter: string;
  onComplete?: (accuracy: number, stars: number) => void;
  difficulty?: 'EASY' | 'MEDIUM' | 'HARD';
  showGuide?: boolean;
}

export default function TracingCanvas({ 
  letter, 
  onComplete, 
  difficulty = 'EASY',
  showGuide = true 
}: TracingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [userPoints, setUserPoints] = useState<Array<{ x: number; y: number }>>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [stars, setStars] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  const letterData = getLetterData(letter);
  const threshold = difficulty === 'EASY' ? 60 : difficulty === 'MEDIUM' ? 50 : 40;
  const guideThickness = difficulty === 'EASY' ? 30 : difficulty === 'MEDIUM' ? 20 : 10;

  const drawGuide = useCallback((ctx: CanvasRenderingContext2D) => {
    if (!showGuide) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    ctx.save();
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = guideThickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Parse and draw the path
    const commands = letterData.path.split(/(?=[MLQ])/);
    let currentX = 0, currentY = 0;
    
    ctx.beginPath();
    commands.forEach(cmd => {
      const parts = cmd.trim().split(/\s+/);
      if (parts.length === 0) return;
      
      const type = parts[0];
      const coords = parts.slice(1).map(Number);
      
      if (type === 'M' && coords.length >= 2) {
        currentX = coords[0];
        currentY = coords[1];
        ctx.moveTo(currentX, currentY);
      } else if (type === 'L' && coords.length >= 2) {
        currentX = coords[0];
        currentY = coords[1];
        ctx.lineTo(currentX, currentY);
      } else if (type === 'Q' && coords.length >= 4) {
        ctx.quadraticCurveTo(coords[0], coords[1], coords[2], coords[3]);
        currentX = coords[2];
        currentY = coords[3];
      }
    });
    
    ctx.stroke();
    ctx.restore();
  }, [letterData.path, showGuide, guideThickness]);

  const drawUserPath = useCallback((ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number }>) => {
    if (points.length === 0) return;
    
    ctx.save();
    ctx.strokeStyle = '#6C63FF';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }, []);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw guide
    drawGuide(ctx);
    
    // Draw user path
    drawUserPath(ctx, userPoints);
  }, [userPoints, drawGuide, drawUserPath]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (isComplete) return;
    
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    
    setIsDrawing(true);
    setUserPoints([coords]);
    setAccuracy(null);
    setStars(null);
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isComplete) return;
    
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;
    
    setUserPoints(prev => [...prev, coords]);
    
    // Calculate accuracy in real-time
    const currentAccuracy = calculateAccuracy(
      [...userPoints, coords],
      letterData.guidePoints,
      threshold
    );
    setAccuracy(currentAccuracy);
  };

  const handleEnd = () => {
    if (!isDrawing) return;
    
    setIsDrawing(false);
    
    // Final accuracy calculation
    const finalAccuracy = calculateAccuracy(
      userPoints,
      letterData.guidePoints,
      threshold
    );
    const finalStars = getStarsFromAccuracy(finalAccuracy);
    
    setAccuracy(finalAccuracy);
    setStars(finalStars);
    setIsComplete(true);
    
    if (onComplete) {
      onComplete(finalAccuracy, finalStars);
    }
  };

  const handleReset = () => {
    setUserPoints([]);
    setAccuracy(null);
    setStars(null);
    setIsComplete(false);
    setIsDrawing(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 400;
    canvas.height = rect.height || 400;
    
    // Initial draw
    redraw();
  }, [letter, redraw]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative bg-white rounded-lg shadow-lg p-4">
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] border-2 border-gray-200 rounded-lg touch-none cursor-crosshair"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        
        {accuracy !== null && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-sm text-gray-600">Accuracy: </span>
                <span className="text-2xl font-bold text-purple-600">
                  {accuracy.toFixed(0)}%
                </span>
              </div>
              {stars !== null && (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-gray-600">Stars: </span>
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < stars ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ⭐
                    </span>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

