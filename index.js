const setupRTMP = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.1.google.com:19302" },
        //Prod
        {
          urls: "turn:X.X.X.X:3478",
          username: "XXXXXX",
          credential: "XXX",
        },
        // Staging
        {
          urls: "turn:X.X.X.X:3478",
          username: "XXXXX",
          credential: "XXX",
        },
      ],
    };

    let pc = new RTCPeerConnection(configuration);
    pc.ontrack = function (event) {
      console.error(event);
      let el = document.getElementById("video-display");
      // setStreamRef(event.track);
      el.srcObject = event.streams[0];
      el.autoplay = true;
      el.controls = true;

    //   el.onloadeddata = function () {
    //     setStreaming(true);
    //   };

    //   const endStream = function () {
    //     setStreaming(false);
    //   };

    //   event.track.onended = function () {
    //     endStream();
    //   };
    };

    pc.addTransceiver('video')
    pc.addTransceiver('audio')
    //pc.createOffer({ offerToReceiveVideo: true })
    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);
        // let eventID = currentGame.stats.eventId;

        return fetch(
          "http://X.X.X.X:8080/createPeerConnection?eventID=7",
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
      .then((res) => pc.setRemoteDescription(res))
      .catch((err) => console.log(err));
};

setupRTMP();
