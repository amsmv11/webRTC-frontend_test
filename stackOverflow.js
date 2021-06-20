const setupRTMP = () => {
    const configuration = {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun.1.google.com:19302" },
        //Prod
        {
          urls: "turn:X.X.X.X:3478",
          username: "XXXXXXX",
          credential: "XXX",
        },
        // Staging
        {
          urls: "turn:X.X.X.X:3478",
          username: "XXXXXXX",
          credential: "XXX",
        },
      ],
    };

    let pc = new RTCPeerConnection(configuration);
    pc.ontrack = function (event) {
      console.error(event);
      let el = document.getElementById("video-display");
      el.srcObject = event.streams[0];
      el.autoplay = true;
      el.controls = true;

    };

    pc.addTransceiver('video')
    pc.addTransceiver('audio')
    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer);

        return fetch(
          "http://X.X.X.X:8080/createPeerConnection",
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
