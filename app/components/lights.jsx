import React from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity} from 'aframe-react';

export default class Lights extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sunRotation: 0,
    }
    this._setTimezone = this._setTimezone.bind(this);
  }
  componentWillMount(){
    this._setTimezone();
  }
  _setTimezone(){
    // set rotation for directional light to match global day/night-time & seasons
    const d = new Date(),
          month = d.getUTCMonth(),
          daytime = (d.getUTCHours() * 60) + d.getUTCMinutes(),
          rotationDaily = (-90) + (daytime/4);
    let rotationYearly;
    if(month < 6){
      rotationYearly = (15.333334) - (month * 7.66667);
    } else {
      rotationYearly = (-15.333334) + ((month-6) * 7.66667);
    }
    this.setState({
      sunRotation: `${rotationYearly} ${rotationDaily} 0`
    });
  }
  render() {
    return (
      <Entity id="lights">
        <Entity rotation={this.state.sunRotation}>
          <Entity light="type: directional; color: #ffe6cc; intensity: 0.6" position="0 0 -10" />
        </Entity>
        <Entity light="type: ambient; color: #fff; intensity: 0.7" />
      </Entity>
    );
  }
}
