import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import EventSource from 'eventsource';

const CSS = require('./assets/styles/style.styl');

class VRTwitterStream extends React.Component {
  constructor(props) {
    super(props);

    this._addLocations = this._addLocations.bind(this);;
  }
  _fetchRecents() {

  }
  componentWillMount(){
    const url = 'https://stream.wikimedia.org/v2/stream/recentchange?origin=*';

    console.log(`Connecting to EventStreams at ${url}`);
    const eventSourceInitDict = {rejectUnauthorized: false};
    const eventSource = new EventSource(url, eventSourceInitDict);

    eventSource.onopen = function(event) {
        console.log('--- Opened connection.');
    };

    eventSource.onerror = function(event) {
        console.error('--- Encountered error', event);
    };

    eventSource.onmessage = function(event) {
        // event.data will be a JSON string containing the message event.
        console.log(JSON.parse(event.data));
        /**if(event.data){
          console.log(tweet);
          const coordinates = tweet.geo.coordinates;
          this._addLocations(wrapperSphere, coordinates, 'orange');
          //io.emit('tweet', tweet);
        }**/
    };
  }
  componentDidMount(){
    let wrapperSphere = document.querySelector('#vr-wikipedia-heatmap');
  }
  _addLocations(wrapperSphere, coordinates, color) {
    const markerColor = color || 'red';
    let lng = coordinates[1],
        lat = coordinates[0];
    let phi = (90-lat) * (Math.PI/180);
    let theta = -((lng+180) * (Math.PI/180));


      /** marker **/
      var marker = document.createElement('a-entity');
      marker.id = 'value';
      marker.setAttribute('geometry', {
        radius: 0.2,
        primitive: 'sphere'
      });
      marker.setAttribute('position', {
        x: -(19.5 * Math.sin(phi) * Math.cos(theta)),
        y: (19.5 * Math.cos(phi)),
        z: (19.5 * Math.sin(phi) * Math.sin(theta))
      });
      marker.setAttribute('material', {color: color});

      wrapperSphere.appendChild(marker);
      console.log('Tweet added to map');
  }

  render() {
    return (
      <Scene>
        <a-assets>
          <img src="./app/assets/images/natural-earth.jpg" id="globe" />
        </a-assets>
        <Entity
          id="wikipedia"
          geometry="primitive: sphere; radius: 20;"
          material="src: #globe; shader: flat; repeat: -1 1; side: back;"
          position="0 1 0" />
        <a-light type="ambient"></a-light>
      </Scene>
    );
  }
}


ReactDOM.render(<VRTwitterStream />, document.querySelector('#root'));
