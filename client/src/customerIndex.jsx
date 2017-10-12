import React from 'react';
import ReactDOM from 'react-dom';
import CustomerApp from './components/customer/CustomerApp.jsx';
import { BrowserRouter } from 'react-router-dom';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../../node_modules/font-awesome/css/font-awesome.css';

ReactDOM.render((
  <BrowserRouter>
    <CustomerApp />
  </BrowserRouter>
), document.getElementById('app'));
