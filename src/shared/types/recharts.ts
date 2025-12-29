import type { TooltipProps as RechartsTooltipProps } from "recharts";

export interface CustomTooltipProps
  extends RechartsTooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      value: number;
      color: string;
    };
    value: number;
    name: string;
    dataKey: string;
    color: string;
  }>;
}

export interface CustomLegendProps {
  payload?: Array<{
    value: string;
    type?: string;
    color?: string;
    id?: string;
  }>;
}
