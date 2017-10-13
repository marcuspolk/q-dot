import React from 'react';
import ReactDOM from 'react-dom';
import CustomerSignup from './components/customerlogin/CustomerSignup.jsx';
import '../../node_modules/jquery/dist/jquery.js';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import '../../node_modules/bootstrap/dist/css/bootstrap-theme.css';
import '../../node_modules/bootstrap/dist/js/bootstrap.js';
import '../dist/customerlogin/styles.css';

ReactDOM.render((<CustomerSignup />), document.getElementById('signup'));
