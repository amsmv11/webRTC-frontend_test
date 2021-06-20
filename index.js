const setupRTMP = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        // Prod
        {
          urls: "turn:34.243.91.76:3478",
          username: "eaglestream",
          credential: "root",
        },
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
      let el = document.getElementById("video_display");
      setStreamRef(event.track);
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
          "http://54.171.42.53/createPeerConnection",
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
