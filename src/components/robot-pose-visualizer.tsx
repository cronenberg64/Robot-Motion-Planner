'use client';

interface RobotPoseVisualizerProps {
  // A single pose, not a sequence. The values are expected to be in the [-1, 1] range.
  jointAngles: Record<string, number>; 
  link1Length?: number;
  link2Length?: number;
  size?: number;
}

// Maps an angle from [-1, 1] range to [-180, 180] degrees.
const mapAngleToDegrees = (angle: number) => angle * 180;

export function RobotPoseVisualizer({
  jointAngles,
  link1Length = 50,
  link2Length = 40,
  size = 150,
}: RobotPoseVisualizerProps) {
  const viewBox = `-${size / 2} -${size / 2} ${size} ${size}`;
  
  // Base of the robot arm
  const baseX = 0;
  const baseY = 0;

  // Get angles from props, default to 0 if not present.
  // Convert from [-1, 1] range to degrees for trigonometric functions.
  const angle1 = mapAngleToDegrees(jointAngles.joint1 || 0);
  const angle2 = mapAngleToDegrees(jointAngles.joint2 || 0);

  // Convert degrees to radians and adjust for SVG coordinate system (0 degrees is right, we want it to be up).
  const angle1Rad = (angle1 - 90) * (Math.PI / 180);
  const x1 = baseX + link1Length * Math.cos(angle1Rad);
  const y1 = baseY + link1Length * Math.sin(angle1Rad);

  // The second joint's angle is relative to the first link.
  const totalAngle2 = angle1 + angle2;
  const angle2Rad = (totalAngle2 - 90) * (Math.PI / 180);
  const x2 = x1 + link2Length * Math.cos(angle2Rad);
  const y2 = y1 + link2Length * Math.sin(angle2Rad);

  return (
    <div className="flex items-center justify-center bg-muted/50 rounded-lg p-2 aspect-square" style={{width: size, height: size}}>
      <svg width="100%" height="100%" viewBox={viewBox}>
        {/* Flip Y-axis to have origin at bottom-left and move it to center */}
        <g transform={`translate(0, ${size/4}) scale(1, -1)`}>
          {/* Base */}
          <rect x="-15" y="-10" width="30" height="10" rx="2" fill="hsl(var(--secondary-foreground))" />
          
          {/* Link 1 */}
          <line x1={baseX} y1={baseY} x2={x1} y2={y1} stroke="hsl(var(--foreground))" strokeWidth="5" strokeLinecap="round"/>
          <circle cx={baseX} cy={baseY} r="7" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
          <circle cx={x1} cy={y1} r="7" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />
          
          {/* Link 2 */}
          <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="hsl(var(--foreground))" strokeWidth="5" strokeLinecap="round" />
          {/* End effector */}
          <circle cx={x2} cy={y2} r="5" fill="hsl(var(--accent))" stroke="hsl(var(--card))" strokeWidth="2"/>
        </g>
      </svg>
    </div>
  );
}
