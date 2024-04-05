import React from 'react';
import { createRoot } from 'react-dom/client';
import Main from './components/Main';

import './styles.css';

const container = document.getElementById('index');
const root = createRoot(container);
root.render(<Main />);
