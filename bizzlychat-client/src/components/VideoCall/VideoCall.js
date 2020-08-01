import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";

const Container = styled.div`
    padding: 20px;
    display: flex;
    height: 100vh;
    width: 90%;
    margin: auto;
    flex-wrap: wrap;
`;

const StyledVideo = styled.video`
    height: 40%;
    width: 50%;
`;

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
  width: 50%;
  height: 50%;
`;




let socket
const VideoCall = () => {
    // не забыть включить partnerVideo !!!!!!!!!!!!!!!!!!!
    const [yourID, setYourID] = useState("");
    
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const userVideo = useRef();
    const partnerVideo = useRef()
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const ENDPOINT = 'https://bizzzly-chat.herokuapp.com/';

       
    useEffect(() => {
        
        socket = io(ENDPOINT)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
            setStream(stream);
            if (userVideo.current) {
              userVideo.current.srcObject = stream;
            }
          })
      
          socket.on("yourID", (id) => {
            setYourID(id);
          })
          socket.on("allUsers", (users) => {
            setUsers(users);
          })
      
          socket.on("hey", (data) => {
            setReceivingCall(true);
            setCaller(data.from);
            setCallerSignal(data.signal);
          })
        }, []);
      
        function callPeer(id) {
          const peer = new Peer({
            initiator: true,
            trickle: false,
            config: {
      
              iceServers: [
                  {
                      urls: "stun:numb.viagenie.ca",
                      username: "sultan1640@gmail.com",
                      credential: "98376683"
                  },
                  {
                      urls: "turn:numb.viagenie.ca",
                      username: "sultan1640@gmail.com",
                      credential: "98376683"
                  }
              ]
          },
            stream: stream,
          });
      
          peer.on("signal", data => {
            socket.emit("callUser", { userToCall: id, signalData: data, from: yourID })
          })
      
          peer.on("stream", stream => {
            if (partnerVideo.current) {
              partnerVideo.current.srcObject = stream;
            }
          });
      
          socket.on("callAccepted", signal => {
            setCallAccepted(true);
            peer.signal(signal);
          })
      
        }
      
        function acceptCall() {
          setCallAccepted(true);
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          });
          peer.on("signal", data => {
            socket.emit("acceptCall", { signal: data, to: caller })
          })
      
          peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
          });
      
          peer.signal(callerSignal);
        }
      
        let UserVideo;
        if (stream) {
          UserVideo = (
            <Video playsInline muted ref={userVideo} autoPlay />
          );
        }
      
        let PartnerVideo;
        if (callAccepted) {
          PartnerVideo = (
            <Video playsInline ref={partnerVideo} autoPlay />
          );
        }
      
        let incomingCall;
        if (receivingCall) {
          incomingCall = (
            <div>
              <h1>{caller} is calling you</h1>
              <button onClick={acceptCall}>Accept</button>
            </div>
          )
        }

    return (
        <Container>
            <Row>
            {UserVideo}
            {PartnerVideo}
            </Row>
            <StyledVideo muted ref={userVideo} autoPlay playsInline />
            {Object.keys(users).map(key => {
          if (key === yourID) {
            return null;
          }
          return (
            <button onClick={() => callPeer(key.id)}>Call {key}</button>
          );
        })}
         {incomingCall}
        </Container>
    );
};

export default VideoCall;