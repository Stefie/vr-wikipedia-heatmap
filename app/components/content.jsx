import React from 'react';
import ReactDOM from 'react-dom';

export default class Content extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="page-content">
        <div className="logo">
          <img src="./app/assets/images/Wikipedia-puzzleglobe.png" alt="wikipedia logo"/>
        </div>
        <h1 className="edit-title">{this.props.title}</h1>
      </main>
    );
  }
}
