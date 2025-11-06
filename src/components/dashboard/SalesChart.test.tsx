import { render } from '@testing-library/react';
import SalesChart from './SalesChart';

// Mock recharts to avoid rendering issues in Jest
jest.mock('recharts', () => ({
  Bar: () => null,
  BarChart: () => null,
  CartesianGrid: () => null,
  XAxis: () => null,
  YAxis: () => null,
}));

// Mock ui components
jest.mock('@/components/ui/chart', () => ({
  ChartConfig: {},
  ChartContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ChartTooltip: () => null,
  ChartTooltipContent: () => null,
}));

describe('SalesChart', () => {
  it('renders without crashing', () => {
    render(<SalesChart />);
    // Since it's mocked, just check it doesn't throw
    expect(true).toBe(true);
  });
});
