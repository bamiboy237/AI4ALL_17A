import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import App from './App';

jest.mock('axios');

global.IS_REACT_ACT_ENVIRONMENT = true;

describe('image upload availability', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => root.unmount());
    container.remove();
    jest.resetAllMocks();
  });

  test('shows model choices without waiting for backend metadata', async () => {
    await act(async () => {
      root.render(<App />);
    });

    const fileInput = container.querySelector('input[type="file"]');
    expect(fileInput).not.toBeNull();
    expect(fileInput.disabled).toBe(false);
    expect(container.textContent).toContain('HAM10000 CNN');
    expect(container.textContent).toContain('EfficientNet-B0');
    expect(axios.get).not.toHaveBeenCalled();
  });
});
