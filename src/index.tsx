import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Register from '../src/componenets/test'
import { Provider } from 'react-redux';
import store from './redux/store/store';
import Alert from './componenets/Alert/Alert';
import Layout from './componenets/Layout/Layout';
ReactDOM.render(
  <React.StrictMode>
    <Layout></Layout>
  </React.StrictMode>,
  document.getElementById('root')
)


