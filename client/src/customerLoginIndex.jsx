import React from 'react';
import ReactDOM from 'react-dom';
import CustomerLogin from './components/customerlogin/CustomerLogin.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../dist/customerlogin/styles.css';

ReactDOM.render((<CustomerLogin />), document.getElementById('login'));
