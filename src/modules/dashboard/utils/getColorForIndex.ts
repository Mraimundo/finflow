/* eslint-disable @typescript-eslint/no-explicit-any */

import { COLORS } from "./constants";

export const getColorForIndex = (index: number, type: any): string => {
  const colors = type === "expense" ? COLORS.expense : COLORS.income;
  return colors[index % colors.length];
};
