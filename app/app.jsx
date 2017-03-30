import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import Rp from 'request-promise-native';
import Locations from './components/locations.jsx';
import Content from './components/content.jsx';
import Lights from './components/lights.jsx';
import GitHub from './components/githubLink.jsx';

if (window && !window.EventSource){
  window.EventSource = require('./js/eventsource-polyfill.js');
}

const ApiPort  = (location.protocol == 'https:') ? 443 : 80;
const CSS = require('./assets/styles/style.styl');

class VRStream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edits: 0,
      locations: [],
      storedIPs: [],
      ipCoordinates: [],
      editTitle:'VR Live Edit Heatmap',
      connectionError: false,
      VRMode: false,
      isIos: /(iPad|iPhone|iPod)/g.test(navigator.userAgent),
      tabIsVisible: true
    }

    this._addLocations = this._addLocations.bind(this);
    this._validateIP = this._validateIP.bind(this);
    this._fetchEdits = this._fetchEdits.bind(this);
    this._handleStreamData = this._handleStreamData.bind(this);
    this._getCoordinates = this._getCoordinates.bind(this);
    this.eventName = null;
    this.reconnect = null;
    this.eventsource = null;
  }
  componentDidMount(){
    this._fetchEdits();

    const aScene = document.querySelector('a-scene'),
    _this = this;
    aScene.addEventListener('enter-vr', function(){
      _this.setState({
        VRMode: true
      });
    });
    aScene.addEventListener('exit-vr', function(){
      _this.setState({
        VRMode: false
      });
    });

    /** visibiliyChange EventListener for iOS webvr-polyfill disconnect bug **/
    const keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (let stateKey in keys) {
        if (stateKey in document) {
            this.eventKey = stateKey;
            this.eventName = keys[stateKey];
            break;
        }
    }
    document.addEventListener(this.eventName, this._handleTabVisibility.bind(this));
  }
  componentDidUpdate(){
    // workaround for the webvr-polyfill which disconnects all open network connections after 30000ms in vr-mode on iOS devices (with iOSWakeLock())
    // reopens stream if stream is disconnected on ios in vr-mode
    if(this.state.isIos && this.state.VRMode && !this.reconnect){
      let _this = this;
      this.reconnect =  setInterval(function() {
        if(_this.eventsource.readyState == 2) _this._fetchEdits();
      }, 500);
    } else if (this.state.isIos && !this.state.VRMode && this.reconnect) {
      // remove eventListener for ios when not in vr-mode
      clearInterval(this.reconnect);
      this.reconnect = null;
    }
  }
  componentWillUnmount(){
    // remove visibiliyChange EventListener for iOS webvr-polyfill disconnect bug
    // remove interval for ios-bug on willUnmount.
    document.removeEventListener(this.eventName);
    if(this.reconnect){
      clearInterval(this.reconnect);
      this.reconnect = null;
    }
  }
  _handleTabVisibility(e) {
    // visibiliyChange EventListener for iOS webvr-polyfill disconnect bug
    // only reconnect on ios if tab/ document is visible, remove interval when tab is the background or minimized.
    const tabIsVisible = !e.target[this.eventKey];
    this.setState({ tabIsVisible: tabIsVisible });
    if(this.state.isIos && !tabIsVisible){
      clearInterval(this.reconnect);
      this.reconnect = null;
    }
  }
  _fetchEdits() {
    // connect to Wikipedia API Stream
    this.eventsource = new EventSource("https://stream.wikimedia.org/v2/stream/recentchange");
    this.eventsource.onmessage = (message) => {
      // only add new markers when tab is focused/ visible
      if(this.state.tabIsVisible) this._handleStreamData(message);
    };
    this.eventsource.onerror = (error) => {
      this.setState({
        connectionError: <div className="connection-error"><h2>Error connecting to Wikidata API.</h2></div>
      });
    }

  }
  _handleStreamData(message){
    const data = JSON.parse(message.data),
          user = data.user,
          isAnonymous = this._validateIP(user);

    // Only continue if user is anonymous
    if (isAnonymous) {
      // Set marker attributes according to type of edit
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
        if(radius < 0.1){
          radius = 0.1;
        }
        if (radius >= 10){
          radius = 10
        }
      }
      // check if there are stored coordinates for ip-address
      if(this.state.ipCoordinates.length){
        const userIndex = this.state.storedIPs.indexOf(user);
        if(userIndex == -1){
          // new IP address -> get coordinates with API call
          this._getCoordinates(user, radius, color, type, data.title);
        } else {
          // IP address + coordinates are already stored in app state
          const coordinates = this.state.ipCoordinates[userIndex];
          this._addLocations(coordinates[0], coordinates[1], radius, color, type, data.title);
        }
      } else {
        this._getCoordinates(user, radius, color, type, data.title);
      }
    }
  }
  _getCoordinates(user, radius, color, type, title){
    const options = {
      uri: `http://freegeoip.net:${ApiPort}/json/${user}`,
      headers: {'User-Agent': 'Request-Promise'},
      json: true
    };
    // Look up coordinates for IP address of anonymous user
    Rp(options)
    .then((location) => {
        //  Add marker if IP lookup was successful
        this.setState(previousState => ({
          storedIPs:  [...previousState.storedIPs, user],
          ipCoordinates: [...previousState.ipCoordinates, { user, 'coordinates': [location.latitude, location.longitude]}],
          connectionError: false
        }));
        this._addLocations(location.latitude, location.longitude, radius, color, type, title);
    })
    .catch((err) => {
      this.setState({
        connectionError: <div className="connection-error"><h2>Error while fetching geo coordinates.</h2><p>Either the API is down or you're using an AdBlocker.</p><p>This page is unable to fetch the geo coordinates of the Wikipedia edits with your AdBlocker enabled.</p><p>Please consider turning it off while looking at this page.</p></div>
      });
    });
  }
  _validateIP(user){
    //  check if user has a valid IP
     if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(user)){
        return (true)
      }
    return (false)
  }
  _addLocations(lat, lng, radius, color, type, title) {
    const index = this.state.edits,
          phi = (90-lat) * (Math.PI/180),
          theta = -((lng+180) * (Math.PI/180)),
          positionX = -((25 - (index/1000)) * Math.sin(phi) * Math.cos(theta)),
          positionY = ((25 - (index/1000)) * Math.cos(phi)),
          positionZ = ((25 - (index/1000)) * Math.sin(phi) * Math.sin(theta) ),
          position = `${positionX} ${positionY} ${positionZ}`;

    this.setState(previousState => ({
      locations: [...previousState.locations, {'position': position, 'index': previousState.edits, 'radius': radius, 'color': color, 'type': type}],
      edits: previousState.edits + 1,
      editTitle: title
    }));
  }

  render() {
    return (
      <div className="scene-wrapper">
        {!this.state.VRMode && <div><Content title={this.state.editTitle} /><GitHub /></div>}
        {this.state.connectionError}
        <Scene>
          <a-assets>
            <img src="./app/assets/images/natural-earth.jpg" id="globe" />
          </a-assets>
          <Entity
            id="vr-wikipedia-heatmap"
            geometry="primitive: sphere; radius: 27;"
            material="src: #globe; repeat: -1 1; side: double;"
            position="0 0 0">
            <Locations locations={this.state.locations} />
          </Entity>
          <Lights />
          <Entity camera="userHeight:0" wasd-controls="" look-controls="" />
        </Scene>
    </div>
    );
  }
}

ReactDOM.render(<VRStream />, document.querySelector('#root'));
