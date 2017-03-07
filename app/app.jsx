import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import Rp from 'request-promise-native';
import Locations from './components/locations.jsx';
import Content from './components/content.jsx';

if (window && !window.EventSource){
  window.EventSource = require('./js/eventsource-polyfill.js');
}
import EventSourceReact from 'react-eventsource';

const ApiPort  = (location.protocol == 'https:') ? 443 : 80;
const CSS = require('./assets/styles/style.styl');

class VRStream extends React.Component {
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
        let color = '#ffd11a', // yellow
            radius = 0.5,
            type = 'flag';

        if(data.length){
          let dataLengthOld = data.length.old ? data.length.old : 0;
          radius = (data.length.new - dataLengthOld)/30;
          color = '#00e600', //green
          type = 'add';
          if(radius <= 0){
            color = '#ff0000'; //red
            radius = -radius,
            type = 'delete';
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
            _this._addLocations(location.latitude, location.longitude, radius, color, type)
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
  _addLocations(lat, lng, radius, color, type) {
    const _this = this,
          index = this.state.edits;
    return Promise.resolve()
        .then(function() {
          let phi = (90-lat) * (Math.PI/180);
          let theta = -((lng+180) * (Math.PI/180));
          //console.log(index);
          const positionX = -((25 - (_this.state.edits/1000)) * Math.sin(phi) * Math.cos(theta)),
                positionY = ((25 - (_this.state.edits/1000)) * Math.cos(phi)),
                positionZ = ((25 - (_this.state.edits/1000)) * Math.sin(phi) * Math.sin(theta) ),
                position = `${positionX} ${positionY} ${positionZ}`;

          _this.setState(previousState => ({
            locations: [...previousState.locations, {'position': position, 'index': previousState.edits, 'radius': radius, 'color': color, 'type': type}],
            edits: previousState.edits + 1
          }));
          console.log('Added ' + _this.state.edits + ' locations.');
        })
        .then(function() {
/**
            setTimeout(function(){
              let wrapper = document.querySelector(`.${type}`);
              let entity = document.querySelector(`#${type}-${index}`);
              if(wrapper == entity){
                console.log('First element of type');
              } else{
                console.log(entity);
                console.log(entity.id);
                entity.setAttribute('geometry', 'mergeTo', '#location-wrapper');
              }
              console.log('I waited for: '+type + '-'+index);
            }, 1000)
**/
        });
  }

  render() {
    return (
      <div className="scene-wrapper">
        <Content />
        <Scene>
          <a-assets>
            <img src="./app/assets/images/natural-earth.jpg" id="globe" />
          </a-assets>
          <Entity
            id="vr-wikipedia-heatmap"
            geometry="primitive: sphere; radius: 35;"
            material="src: #globe; repeat: -1 1; side: double;"
            position="0 0 0">
            <Locations locations={this.state.locations} />
          </Entity>
          <a-entity light="type: directional; color: #ffe6cc; intensity: 0.6" position="-10 0 0"></a-entity>
          <a-entity light="type: ambient; color: #fff; intensity: 0.7"></a-entity>
        </Scene>
    </div>
    );
  }
}


ReactDOM.render(<VRStream />, document.querySelector('#root'));
