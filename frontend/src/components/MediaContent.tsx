//import { useState } from "react";
import ClientVideo from "./ClientVideo";
import io from 'socket.io-client';

const socket = io('ws://localhost:3000');
// const [offer, setOffer] = useState<RTCSessionDescription | null>(null);

// const MakeCall = async () => {
//     const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
//     const peerConnection = new RTCPeerConnection(configuration);
//     const offer = await peerConnection.createOffer();
//     socket.emit('new-offer', offer);
//     socket.on('new-answer', async (answer) => {
//         if (answer) {
//             const remoteDesc = new RTCSessionDescription(answer);
//             await peerConnection.setRemoteDescription(remoteDesc)
//         }
//     });
//     await peerConnection.setLocalDescription(offer);
//     peerConnection.setLocalDescription();
// }

socket.on('message', () => {
    
})

function MediaContent() {
    return (
        <>
            <ClientVideo />
        </>
    )
}

export default MediaContent;