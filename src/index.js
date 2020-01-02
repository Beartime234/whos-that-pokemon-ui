import React from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import App from './components/App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss';
import {BrowserRouter} from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('app')
);