export const COLORS = {
  expense: [
    "#EF4444",
    "#F59E0B",
    "#84CC16",
    "#06B6D4",
    "#8B5CF6",
    "#EC4899",
    "#14B8A6",
    "#F97316",
    "#6366F1",
    "#10B981",
  ],
  income: [
    "#10B981",
    "#84CC16",
    "#06B6D4",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#F97316",
    "#6366F1",
    "#14B8A6",
  ],
  bar: [
    "#3B82F6",
    "#EF4444",
    "#10B981",
    "#F59E0B",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
    "#F97316",
    "#6366F1",
  ],
} as const;

export const ANIMATION_CONFIG = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.4 },
} as const;

export const CHART_CONFIG = {
  pie: {
    outerRadius: 120,
    innerRadius: 70,
    paddingAngle: 2,
    minLabelPercentage: 5,
  },
  bar: {
    margin: { top: 20, right: 30, left: 20, bottom: 60 },
    maxItems: 8,
  },
  container: {
    height: 350,
  },
} as const;
