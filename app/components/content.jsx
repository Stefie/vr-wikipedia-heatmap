import React from 'react';
import ReactDOM from 'react-dom';

export default class Content extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="overlay-content">
        <div className="logo">
          <a href="https://www.mediawiki.org/wiki/API:Recent_changes_stream" target="_blank" title="API description of Wikipedias 'Recent changes stream'"><img src="./app/assets/images/Wikipedia-puzzleglobe.png" alt="wikipedia logo"/></a>
        </div>
        <h1 className="edit-title">{this.props.title}</h1>
      </main>
    );
  }
}
