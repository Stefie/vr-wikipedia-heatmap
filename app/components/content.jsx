import React from 'react';
import ReactDOM from 'react-dom';

export default class Content extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <main className="page-content">
        <div>
          <img src="./app/assets/images/wikipedia-logo.png" alt="wikipedia logo"/>
        </div>
        <h1>Live-edit VR Heatmap</h1>
      </main>
    );
  }
}
