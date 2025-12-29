export interface ChartData {
  name: string;
  value: number;
  color: string;
  percentage: number;
  [key: string]: string | number;
}

export interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ChartData;
    value: number;
    name: string;
  }>;
}
