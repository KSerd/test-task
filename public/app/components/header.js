import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Header extends Component {
  render(){
    return (
      <div className='nav'>
          <Link to="/fb/results">Results</Link>
      </div>
    );
  }
}

export default Header;