import React from 'react';
import { Switch, Route } from 'react-router-dom';
import CustomerHome from './CustomerHome.jsx';
import SelectedRestaurant from './SelectedRestaurant.jsx';

// main component that will switch components on render via routes
const CustomerMain = (props) => (
  <main>
    <Switch>
      <Route exact path={'/customer'} component={CustomerHome} user={props.user}/>
      <Route path={'/restaurant'} component={SelectedRestaurant}/>
    </Switch>
  </main>
)

export default CustomerMain;
