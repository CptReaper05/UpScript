// Letter path definitions for tracing
// Each letter has SVG path data and guide points for accuracy calculation

export interface LetterData {
  letter: string;
  path: string;
  guidePoints: Array<{ x: number; y: number }>;
}

// Generate guide points along a path
function generateGuidePoints(path: string, numPoints: number = 50): Array<{ x: number; y: number }> {
  // Simplified: For web, we'll use the path directly and sample points
  // In a real implementation, you'd parse the SVG path and sample points along it
  const points: Array<{ x: number; y: number }> = [];
  
  // For now, return evenly spaced points in a grid pattern
  // This is a simplified version - in production, parse the actual SVG path
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    // This is a placeholder - actual implementation would sample the path
    points.push({ x: 50 + t * 200, y: 50 + Math.sin(t * Math.PI * 2) * 50 });
  }
  
  return points;
}

// Letter path definitions (SVG path data)
const letterPaths: Record<string, string> = {
  'A': 'M 50 200 L 150 50 L 250 200 M 100 150 L 200 150',
  'B': 'M 50 50 L 50 200 M 50 50 Q 150 50 150 100 Q 150 150 50 150 M 50 150 Q 150 150 150 200 Q 150 200 50 200',
  'C': 'M 200 50 Q 50 50 50 125 Q 50 200 200 200',
  'D': 'M 50 50 L 50 200 M 50 50 Q 150 50 150 125 Q 150 200 50 200',
  'E': 'M 50 50 L 50 200 M 50 50 L 200 50 M 50 125 L 150 125 M 50 200 L 200 200',
  'F': 'M 50 50 L 50 200 M 50 50 L 200 50 M 50 125 L 150 125',
  'G': 'M 200 50 Q 50 50 50 125 Q 50 200 200 200 M 150 125 L 200 125',
  'H': 'M 50 50 L 50 200 M 200 50 L 200 200 M 50 125 L 200 125',
  'I': 'M 125 50 L 125 200 M 50 50 L 200 50 M 50 200 L 200 200',
  'J': 'M 150 50 L 150 175 Q 150 200 100 200 Q 50 200 50 175',
  'K': 'M 50 50 L 50 200 M 50 125 L 200 50 M 50 125 L 200 200',
  'L': 'M 50 50 L 50 200 M 50 200 L 200 200',
  'M': 'M 50 200 L 50 50 L 125 125 L 200 50 L 200 200',
  'N': 'M 50 200 L 50 50 L 200 200 L 200 50',
  'O': 'M 125 50 Q 50 50 50 125 Q 50 200 125 200 Q 200 200 200 125 Q 200 50 125 50',
  'P': 'M 50 50 L 50 200 M 50 50 Q 150 50 150 100 Q 150 150 50 150',
  'Q': 'M 125 50 Q 50 50 50 125 Q 50 200 125 200 Q 200 200 200 125 Q 200 50 125 50 M 150 150 L 200 200',
  'R': 'M 50 50 L 50 200 M 50 50 Q 150 50 150 100 Q 150 150 50 150 M 50 150 L 200 200',
  'S': 'M 200 50 Q 50 50 50 125 Q 200 125 200 200 Q 50 200 50 175',
  'T': 'M 125 50 L 125 200 M 50 50 L 200 50',
  'U': 'M 50 50 L 50 175 Q 50 200 125 200 Q 200 200 200 175 L 200 50',
  'V': 'M 50 50 L 125 200 L 200 50',
  'W': 'M 50 50 L 50 200 L 125 100 L 200 200 L 200 50',
  'X': 'M 50 50 L 200 200 M 200 50 L 50 200',
  'Y': 'M 125 50 L 125 125 M 50 50 L 125 125 M 200 50 L 125 125 M 125 125 L 125 200',
  'Z': 'M 50 50 L 200 50 M 200 50 L 50 200 M 50 200 L 200 200'
};

export function getLetterData(letter: string): LetterData {
  const upperLetter = letter.toUpperCase();
  const path = letterPaths[upperLetter] || letterPaths['A'];
  
  return {
    letter: upperLetter,
    path,
    guidePoints: generateGuidePoints(path, 50)
  };
}

export function getAllLetters(): string[] {
  return Object.keys(letterPaths).sort();
}

export function calculateAccuracy(
  userPoints: Array<{ x: number; y: number }>,
  guidePoints: Array<{ x: number; y: number }>,
  threshold: number = 50
): number {
  if (userPoints.length === 0 || guidePoints.length === 0) return 0;
  
  // Calculate match ratio (percentage of user points within threshold)
  let matches = 0;
  let totalDistance = 0;
  
  for (const userPoint of userPoints) {
    let minDistance = Infinity;
    
    for (const guidePoint of guidePoints) {
      const distance = Math.sqrt(
        Math.pow(userPoint.x - guidePoint.x, 2) + 
        Math.pow(userPoint.y - guidePoint.y, 2)
      );
      minDistance = Math.min(minDistance, distance);
    }
    
    if (minDistance <= threshold) {
      matches++;
    }
    totalDistance += minDistance;
  }
  
  const matchRatio = matches / userPoints.length;
  const avgDistance = totalDistance / userPoints.length;
  const distanceScore = Math.max(0, 1 - avgDistance / threshold);
  
  // Weighted accuracy: 60% match ratio, 40% distance score
  const accuracy = (matchRatio * 0.6 + distanceScore * 0.4) * 100;
  
  return Math.min(100, Math.max(0, accuracy));
}

export function getStarsFromAccuracy(accuracy: number): number {
  if (accuracy >= 90) return 3;
  if (accuracy >= 70) return 2;
  if (accuracy >= 50) return 1;
  return 0;
}

