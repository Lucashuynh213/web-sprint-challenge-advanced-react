// Write your tests here
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import AppFunctional from './AppFunctional';

describe('AppFunctional', () => {
  test('renders AppFunctional component', () => {
    render(<AppFunctional />);

    expect(screen.getByText('Coordinates (2, 2)')).toBeInTheDocument();
    expect(screen.getByText('You moved 0 times')).toBeInTheDocument();
  });

  test('can move and submit form in AppFunctional component', () => {
    render(<AppFunctional />);

    fireEvent.click(screen.getByText('UP'));
    fireEvent.click(screen.getByText('RIGHT'));

    expect(screen.getByText('Coordinates (3, 1)')).toBeInTheDocument();
    expect(screen.getByText('You moved 2 times')).toBeInTheDocument();

    const emailInput = screen.getByPlaceholderText('type email');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    // Use a custom text matcher to handle the case where the text may be split
    const successMessage = screen.getByText((content, element) => {
      const hasText = (node) => node.textContent === 'Success message is correct';
      const childrenDontHaveText = Array.from(element.children).every(
        (child) => !hasText(child)
      );
      return hasText(element) && childrenDontHaveText;
    });

    expect(successMessage).toBeInTheDocument();
    expect(emailInput.value).toBe('');
  });
});