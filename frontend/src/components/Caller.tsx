import { useEffect, useRef, useState } from "react";
import props from "../WebRTC-Utilities/Type_Props";

const Caller = ({ socket, userN }: props) => {
    //Needed state for caller function.
    const servers = {
        iceServers: [
            {
                urls: ['stun:stun1.l.google.com:19302', 'stun:stun3.l.google.com:19302']
            }
        ]
    }
    const localRef = useRef<HTMLVideoElement | null>(null);
    const remoteRef = useRef<HTMLVideoElement | null>(null);
    const [didIOffer, setDidIOffer] = useState(false)
    const [createdOffer, setCreatedOffer] = useState(false);
    const [answerGot, setAnswerGot] = useState(false);
    const [offerGot, setOfferGot] = useState(false)
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const [peerConnection] = useState(new RTCPeerConnection(servers))

    // Functions needed for the caller function.
    //This function handles the getmedia from local user.
    const GetLocalMedia = async () => {
        const rStream = new MediaStream();
        setRemoteStream(rStream);
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const video = localRef.current;
        if (video) {
            video.srcObject = stream;
            await video.play();
        }
        setLocalStream(stream);
        stream?.getTracks().forEach(track => {
            peerConnection.addTrack(track, stream);
        })
        peerConnection.ontrack = (e) => {
            e.streams[0].getTracks().forEach(track => {
                setRemoteStream(pc => {
                    pc?.addTrack(track);
                    return pc;
                });
            })
        }
    }

    const generateOffer = async () => {
        setDidIOffer(true);
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        socket.emit("newOffer", {
            userId: socket.id,
            offererName: userN,
            offer: offer,
        });
        setCreatedOffer(true);
        peerConnection.onicecandidate = async (e) => {
            if (e.candidate) {
                socket.emit('sendIceCanditates', { ice: e.candidate, userId: socket.id, type: "sender" });
            }
        };
    }

    const listenAnswerAfterOffer = () => {
        socket.on('waitingForAnswer', async (answerData) => {
            if (!answerData.answer) {
                return;
            }
            await peerConnection.setRemoteDescription(answerData.answer);
            setAnswerGot(true);
        });
        socket.on('recieveIceCanditates', async (iceC) => {
            console.log(iceC);
            if (iceC.type === "reciever") {
                await peerConnection.addIceCandidate(iceC.ice).catch(err => {
                    console.log("there is an error:", err);
                });
            }
        })
    }

    const answerCall = async () => {
        try {
            socket.on('waitingForOffer', async (offerData) => {
                if (createdOffer) {
                    return;
                }
                await peerConnection.setRemoteDescription(offerData.offer);
                setOfferGot(true);
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                socket.emit('newAnswer', { answer, userId: socket.id });
                peerConnection.onicecandidate = async (e) => {
                    if (e.candidate) {
                        socket.emit('sendIceCanditates', { ice: e.candidate, userId: socket.id, type: "reciever" });
                    }
                };
                socket.on('recieveIceCanditates', async (iceC) => {
                    console.log(iceC);
                    if (iceC.type === "sender") {
                        await peerConnection.addIceCandidate(iceC.ice).catch(err => {
                            console.log("there is an error:", err);
                        });
                    }
                })
                
            })
        }
        catch (err) {
            console.log(err);
        }
    }
    // run only once and get and store the lccal stream.

    useEffect(() => {
        GetLocalMedia();
        
    }, [])
    
    useEffect(() => {
        if (remoteRef.current && remoteStream){
            remoteRef.current.srcObject = remoteStream
        }
    },[remoteStream])

    // This one creates the call offer and listen for answer.
    useEffect(() => {
        if (didIOffer && !createdOffer) {
            generateOffer();
        }
        if (createdOffer && !answerGot) {
            listenAnswerAfterOffer();
        }
    }, [createdOffer, answerGot]);
    
    //This one listen for offer and creates answer.
    useEffect(() => {
        if (!offerGot) {
            answerCall();
        }
    }, []);
    
    //share ice canditates.
    

    return (
        <>
            <video ref={localRef} autoPlay></video >
            <video ref={remoteRef} autoPlay></video>
            <input type="button" onClick={generateOffer} value='call'/>
        </>
    )
}

export default Caller;