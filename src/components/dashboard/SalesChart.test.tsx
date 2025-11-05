import { render } from '@testing-library/react';
import SalesChart from './SalesChart';

describe('SalesChart', () => {
  it('renders without crashing', () => {
    render(<SalesChart />);
  });
});
