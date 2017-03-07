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
    // animation="property: material.opacity; easing: easeOutCubic; dur: 3000; to: 0.7"
    return (
      <Entity id="location-wrapper">
        {this.props.locations.map(function(location) {
          return <Entity
                    id={`${location.type}-${location.index}`}
                    className={location.type}
                    key={location.index}
                    geometry={{
                      primitive: 'sphere',
                      radius: location.radius,
                      segmentsWidth: 12,
                      segmentsHeight: 12}}
                    position={location.position}
                    material={{color: location.color}}
                    animation="property: geometry.radius; dur: 3000; easing: easeOutCubic; to: 0.3" />
        }.bind(this))}
      </Entity>
    );
  }
}
