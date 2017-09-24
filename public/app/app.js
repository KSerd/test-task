import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';

import Prepostions from './components/prepostions';
import Results from './components/results';

ReactDom.render(
  <BrowserRouter>
    <div>
      <Route exact path="/fb/results" component={Results}/>
      <Route exact path="/fb" component={Prepostions}/>
    </div>
  </BrowserRouter>,
document.getElementById('app'));