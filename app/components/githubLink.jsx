import React from 'react';
import ReactDOM from 'react-dom';

export default class GitHub extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section className="overlay-content github-link">
        <a href="https://github.com/Stefie/vr-wikipedia-heatmap" target="blank" title="View on GitHub"><span>CREDITS</span></a>
      </section>
    );
  }
}
