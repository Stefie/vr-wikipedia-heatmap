import React from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity} from 'aframe-react';
import 'aframe-animation-component';

export default class Locations extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const sounds = ['#sonar-ping', '#ping', '#ding'],
          sound = sounds[Math.floor(Math.random() * sounds.length)];
          //sound={{src: sound, autoplay: true, poolSize: 5}}
    return (
      <Entity id="location-wrapper" material="transparent: true;">
        {this.props.locations.map(function(location) {
          return <Entity
                    id={`edit-${location.index}`}
                    key={location.index}
                    geometry={{
                      primitive: 'sphere',
                      radius: location.radius}}
                    position={location.position}
                    material={{color: location.color, transparent: true, shader: 'flat', opacity: 0.99}}
                    animation="property: material.opacity; easing: easeOutCubic; dur: 5000; to: 0.5"
                    animation__scale="property: geometry.radius; dur: 3000; easing: easeOutCubic; to: 0.3" />
        }.bind(this))}
      </Entity>
    );
  }
}
