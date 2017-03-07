import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import Rp from 'request-promise-native';
import Locations from './components/locations.jsx';
if (window && !window.EventSource){
  window.EventSource = require('./js/eventsource-polyfill.js');
}
import EventSourceReact from 'react-eventsource';

const ApiPort  = (location.protocol == 'https:') ? 443 : 80;
const CSS = require('./assets/styles/style.styl');

class VRTwitterStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edits: 0,
      locations: []
    }
    // {x: 0, y: 0, z: -10, index: 0}
    this._addLocations = this._addLocations.bind(this);
    this._validateIP = this._validateIP.bind(this);
    this._fetchEdits = this._fetchEdits.bind(this);
  }
  componentWillMount(){

  }
  componentDidMount(){
    this._fetchEdits();
  }
  _fetchEdits() {
    const eventsource = new EventSource("https://stream.wikimedia.org/v2/stream/recentchange"),
          _this = this;

    eventsource.onmessage = (message) => {
      const data = JSON.parse(message.data),
            user = data.user,
            isAnonymous = _this._validateIP(user);


      if (isAnonymous) {
        let color = 'blue',
            radius = 0.5;

        if(data.length){
          let dataLengthOld = data.length.old ? data.length.old : 0;
          radius = (data.length.new - dataLengthOld)/30;
          color = 'lime';
          if(radius <= 0){
            color = 'red';
            radius = -radius;
          }
          if (radius < 0.1){
            radius = 0.1;
          }
          if (radius > 10){
            radius = 10
          }
        }

        const options = {
            uri: `http://freegeoip.net:${ApiPort}/json/${user}`,
            headers: {'User-Agent': 'Request-Promise'},
            json: true
        };
        Rp(options)
        .then((location) => {
            _this._addLocations(location.latitude, location.longitude, radius, color)
        })
        .catch((err) => {
            console.log(err)
        });

      }
    };
    eventsource.error = () => {
      console.log('Error connecting to wikidata API.');
    }
  }
  _validateIP(user){
     if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(user)){
        return (true)
      }
    return (false)
  }
  _addLocations(lat, lng, radius, color) {
    let phi = (90-lat) * (Math.PI/180);
    let theta = -((lng+180) * (Math.PI/180));

    const positionX = -((25 - (this.state.edits/1000)) * Math.sin(phi) * Math.cos(theta)),
          positionY = ((25 - (this.state.edits/1000)) * Math.cos(phi)),
          positionZ = ((25 - (this.state.edits/1000)) * Math.sin(phi) * Math.sin(theta) ),
          position = `${positionX} ${positionY} ${positionZ}`;

    this.setState(previousState => ({
      locations: [...previousState.locations, {'position': position, 'index': previousState.edits, 'radius': radius, 'color': color}],
      edits: previousState.edits + 1
    }));
    console.log('Added ' + this.state.edits + ' locations.');
  }

  render() {
    /**
      <audio id="sonar-ping" src="./app/assets/sounds/42796__digifishmusic__sonar-ping.wav" preload="auto"></audio>
      <audio id="ping" src="./app/assets/sounds/51702__bristolstories__ping.mp3" preload="auto"></audio>
      <audio id="ding" src="./app/assets/sounds/91926__corsica-s__ding.wav" preload="auto"></audio>
    **/

    return (
      <Scene>
        <a-assets>
          <img src="./app/assets/images/natural-earth.jpg" id="globe" />
        </a-assets>
        <Entity
          id="vr-wikipedia-heatmap"
          geometry="primitive: sphere; radius: 35;"
          material="src: #globe; shader: flat; repeat: -1 1; side: double;"
          position="0 1 0">
          <Locations locations={this.state.locations} />
        </Entity>
        <a-light type="ambient"></a-light>
      </Scene>

    );
  }
}


ReactDOM.render(<VRTwitterStream />, document.querySelector('#root'));
