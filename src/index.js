import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from '@vercel/analytics';
import './index.css';
import PatrimoineTracker from './patrimoine-tracker';

inject();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><PatrimoineTracker /></React.StrictMode>);
