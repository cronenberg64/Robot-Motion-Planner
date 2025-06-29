export type JointAngles = Record<string, number[]>;

export interface MotionStep {
  id: string;
  motionPrimitive: string;
  jointAngles: JointAngles;
}

export type MotionPlan = MotionStep[];
