import React from 'react';
import ReactDOM from 'react-dom';

export class Welcome extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="overlay welcome">
        <h2>Welcome!</h2>
        <p>This App shows you the 150 most recent changes to Wikipedia entries as a livestream on a VR-Globe</p>
        <div className="legend">
          <p className="added">Lines added</p>
          <p className="deleted">Lines deleted</p>
          <p className="flagged">Flagged content</p>
        </div>
        <p><a onClick={() => this.props.startFunction()} href="#" title="Start" className="start-stream">START STREAM</a></p>
      </div>
    );
  }
}

export class Loading extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="overlay loading welcome">
        <h2>Connecting to API...</h2>
        <div className="spinner">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      </div>
    );
  }
}

export class ConnectionError extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="overlay connection-error">
        <h2>Error while fetching geo coordinates.</h2>
        <p>Either the API is down or you're using an AdBlocker.</p>
        <p>This page is unable to fetch the geo coordinates of the Wikipedia edits with your AdBlocker enabled.</p>
        <p>Please consider turning it off while looking at this page.</p>
      </div>
    );
  }
}

export class APIError extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="overlay connection-error">
        <h2>Error connecting to Wikidata API.</h2>
        <p>Please check your internet connection.</p>
      </div>
    );
  }
}
