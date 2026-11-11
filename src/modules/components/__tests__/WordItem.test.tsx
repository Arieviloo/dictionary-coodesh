import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { WordItem } from '../WordItem';

describe('WordItem Component', () => {
  it('should render the word text correctly', async () => {
    const { getByText } = await waitFor(() => render(<WordItem word="react" onPress={() => {}} />));
    expect(getByText('react')).toBeTruthy();
  });

  it('should trigger onPress callback when tapped', async () => {
    const onPressMock = jest.fn();
    const { getByText } = await waitFor(() => render(<WordItem word="react" onPress={onPressMock} />));

    fireEvent.press(getByText('react'));
    expect(onPressMock).toHaveBeenCalledWith('react');
  });
});