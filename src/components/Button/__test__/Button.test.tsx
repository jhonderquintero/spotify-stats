import * as React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Button } from '../Button';

describe('<Button />', function () {
  test('mounts', function () {
    render(<Button label="a" />);
    expect(screen.getByTestId('button-base'));
  });
});
