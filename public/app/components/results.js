import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

class Results extends Component {
  constructor(props) {
    super(props);

    this.state = {
      prepositions: []
    };

    this.approve = this.approve.bind(this);
  }

  componentDidMount() {
    let parsed = queryString.parse(this.props.location.search);
    let path = `/api/prepositions?isApproved=false`;
    let res = axios.get(path).then((res) => {
      this.setState({
        prepositions: res.data
      });
    }).catch((error) => {
      console.error(error);
    });
  }

  approve(event) {
    let id = event.target.id;
    let path = `/api/prepositions/${id}`;
    let putBody = {};
    this.state.prepositions.forEach((preposition, index) => {
      if (preposition._id == id) {
        putBody = preposition
      }
    });
    putBody.isApproved = true;

    let res = axios.put(path, putBody).then((res) => {
      $(`li#${id}`).remove();
    }).catch((error) => {
      console.error(error);
    });
  }

  delete(event) {
    let id = event.target.id;
    let path = `/api/prepositions/${id}`;

    let res = axios.delete(path).then((res) => {
      $(`li#${id}`).remove();
    }).catch((error) => {
      console.error(error);
    });
  }

  render(){
    return (
      <div>
        <ul>
          {this.state.prepositions.map((preposition, index) =>
            <li key={index} className='listItem' id={preposition._id}>
              <div className="block">
                <span className="blockTitle">ORIGINAL TEXT</span>
                <div className="original">{preposition.originalText}</div>
              </div>
              <div className="block">
                <span className="blockTitle">USERS VERSION</span>
                <div className="users">{preposition.usersText}</div>
              </div>
              <button type="button" className="btn btn-outline-info sendButton" id={preposition._id} onClick={this.approve}>Approve</button>
              <button type="button" className="btn btn-outline-danger sendButton" id={preposition._id} onClick={this.delete}>Delete</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export default Results;