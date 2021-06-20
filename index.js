const setupRTMP = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Prod
        /*{
          urls: "turn:34.243.91.76:3478",
          username: "eaglestream",
          credential: "root",
        },*/
        // Staging
        {
          urls: "turn:3.249.123.75:3478",
          username: "eaglestream",
          credential: "root",
        },
      ],
    };

    let pc = new RTCPeerConnection(configuration);
    pc.ontrack = function (event) {
      // let el = document.createElement(event.track.kind);
      console.error(event)
      let el = document.getElementById("video-display");  
      el.srcObject = event.streams[0];
      el.autoplay = true;
      el.controls = true;
      // document.getElementById("rtmpFeed").appendChild(el);  
    };

    // pc.oniceconnectionstatechange = e => log(pc.iceConnectionState)
    // pc.onicecandidate = event => {
    //   if (event.candidate === null) {
    //     console.log(btoa(JSON.stringify(pc.localDescription)));  
    //   }
    // }

    pc.addTransceiver('video')
    pc.addTransceiver('audio')
    // pc.addTransceiver('audio', {'direction': 'recvonly'})
    // pc.addTransceiver('video', {'direction': 'recvonly'})
    // pc.addTransceiver('video', {'direction': 'recvonly'})

    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);
        // let eventID = currentGame.stats.eventId;

        return fetch(
          "http://54.171.42.53:8080/createPeerConnection?eventID=7",
          {
            method: "post",
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(offer),
          }
        );
      })
      .then((res) => res.json())
      .then((offer) => pc.setRemoteDescription(offer))
      .catch((err) => console.log(err));
};

setupRTMP();




