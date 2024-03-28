import React from 'react';
import { createRoot } from 'react-dom/client';
import Simulate from './components/Simulate';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<Simulate />);
