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
    return (
      <Entity id="location-wrapper">
        {this.props.locations.map(function(location) {
          return <Entity
                    id={`${location.type}-${location.index}`}
                    className={location.type}
                    key={location.index}
                    geometry={{
                      primitive: 'sphere',
                      radius: 0.28,
                      segmentsWidth: 12,
                      segmentsHeight: 12
                    }}
                    position={location.positionStart}
                    material={{color: location.color, shader: 'flat'}}
                    animation={{property: 'position', dur: 2000, easing: 'easeOutCubic', to: location.position}} />
        }.bind(this))}
      </Entity>
    );
  }
}
