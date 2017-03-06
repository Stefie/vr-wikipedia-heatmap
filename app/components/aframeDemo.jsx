import 'aframe';
import {Entity, Scene} from 'aframe-react';
import React from 'react';
import ReactDOM from 'react-dom';
/**
var TweetList = React.createClass({
  render: function() {
    return (
        <ul className="tweets">
          {console.log(this.props.tweets)}
          {this.props.tweets.map(function(tweet, tweetIndex) {
            // Does the JSON result have coordinates
            var coordinates = [];
            if (tweet.coordinates){
              if (tweet.coordinates !== null){
                //If so then build up some nice json and send out to web sockets
                console.log(tweet);
                coordinates = tweet.coordinates;

                return <li key={tweetIndex}>{tweet.coordinates[1]} || {tweet.text}</li>
              }else if(tweet.place){
                console.log('has place');
                if(tweet.place.bounding_box === 'Polygon'){
                  // Calculate the center of the bounding box for the tweet
                  var coord, _i, _len;
                  var centerLat = 0;
                  var centerLng = 0;

                  for (_i = 0, _len = coords.length; _i < _len; _i++) {
                    coord = coords[_i];
                    centerLat += coord[0];
                    centerLng += coord[1];
                  }
                  centerLat = centerLat / coords.length;
                  centerLng = centerLng / coords.length;

                  // Build json object and broadcast it
                  coordinates = {"lat": centerLat,"lng": centerLng};
                  return <li key={tweetIndex}>{tweet.coordinates[1]} || {tweet.text}</li>
                }
              }
            }

          }.bind(this))}
        </ul>
    )
  }
});

var VRScene = React.createClass({
  render: function() {
    return (
      <div>
        <section className="aframe-section">
          <Scene embedded>
            <Entity text="value:A-Frame ready; color: #678782; align: center;  width: 20;" position="0 1.5 -3">
              <a-animation attribute="rotation"
                dur="10000"
                fill="forwards"
                to="-360 0 0"
                repeat="indefinite"></a-animation>
            </Entity>
            <Entity light={{type: 'spot', color: '#ffffff'}}/>
            <a-sky color="#f0f0f0"></a-sky>
          </Scene>
        </section>
    </div>
    )
  }
});

module.exports = exports = TweetList;
**/
