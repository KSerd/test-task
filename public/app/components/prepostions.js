import React, { Component } from 'react';
import Header from './header';
import axios from 'axios';
import queryString from 'query-string';

class Prepositions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      pharagraphs: []
    };
    this.sendChanges = this.sendChanges.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    let parsed = queryString.parse(this.props.location.search);
    let path = `/api/article?articleURL=${parsed.articleURL}`;
    axios.get(path).then((res) => {
      let tmp = [];
      res.data.pharagraphs.forEach((pharagraph, index) => {
        let obj = {
          originalText: pharagraph,
          usersText: '',
          articleUrl: parsed.articleURL
        };
        tmp[index] = obj;
      });

      res.data.pharagraphs = tmp;
      this.setState(res.data);
    }).catch((error) => {
      console.error(error);
    });
  }

  handleInputChange(event) {
    let id = event.target.id;
    this.state.pharagraphs[id].usersText = event.target.value;
  }

  sendChanges(event) {
    let id = event.target.id;
    let path = `/api/prepositions`;
    let postBody = {
      articleUrl: this.state.pharagraphs[id].articleUrl, 
      originalText: this.state.pharagraphs[id].originalText, 
      usersText: this.state.pharagraphs[id].usersText
    }

    axios.post(path, postBody).then((res) => {
      $(`textarea#${id}`).val('');
    }).catch((error) => {
      console.error(error);
    });
  }

  render(){
    return (
      <div>
        <Header />
        <h3 className='title'>Title: {this.state.title}</h3>
        <ul>
          {this.state.pharagraphs.map((pharagraph, index) =>
            <li key={index} className='listItem'>
              <div className="block">
                <span className="blockTitle">ORIGINAL TEXT</span>
                <div className="original">{pharagraph.originalText}</div>
              </div>
              <div className="block">
                <span className="blockTitle">USERS VERSION</span>
                <textarea className="form-control users" rows="3" id={index} onChange={this.handleInputChange}></textarea>
              </div>
              <button type="button" className="btn btn-outline-info sendButton" id={index} onClick={this.sendChanges}>Send Changes</button>
            </li>
          )}
        </ul>
      </div>
    )
  }
}

export default Prepositions;