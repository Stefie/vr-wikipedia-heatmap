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
          <h1>Headline Component</h1>
          <p>Dummy React component</p>
        </div>
      </main>
    );
  }
}
