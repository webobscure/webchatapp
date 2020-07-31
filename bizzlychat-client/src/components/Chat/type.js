import React, {createRef, Component} from 'react';
import webcamera from '../../assets/webcam.png';

import './Input.css';



class Input extends Component {
  constructor() {
    super()
    this.userVideo = React.createRef()
  }


  turnOnCamera()  {
   const video = userVideo.current
   const constraints = {video: true}
   navigator.mediaDevices.getUserMedia(constraints).then(
     (stream) => { video.srcObject = stream}
   )
  
   console.log("You click on camera");
 }
render() {
  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={({ target: { value } }) => setMessage(value)}
        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
      />
      <button type="button" onClick={this.turnOnCamera }>
        <img src={webcamera} alt="webcam" className="webcamera"/>
        <video ref={this.userVideo} autoPlay/>
      </button>
  
      <button className="sendButton" onClick={e => sendMessage(e)}>Send</button>
  </form>
  )
}

  
}

export default Input