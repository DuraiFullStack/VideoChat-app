import { useEffect, useRef, useState } from "react"

function ClientVideo() {
    const [clientVideo, setClientvideo] = useState<MediaStream | null>(null);
    const [isPaused, setIsPaused] = useState(true);
    const videoRef = useRef<HTMLVideoElement | null>(null)

    

    const getClientMedia = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setClientvideo(stream);
        if (videoRef.current){
            videoRef.current.srcObject = stream;
        }
    }

    const stopMedia = () => {
        clientVideo?.getTracks().forEach((track) => {
            track.stop();
        })
    }
    
    const mediaManager = () => {
        if (isPaused) {
            stopMedia();
        } else {
            getClientMedia();
        }
    }

    useEffect(() => {
        mediaManager();
    }, [isPaused]);
    return (
        <>
            <video ref={videoRef} autoPlay/>
            <button onClick={() => { setIsPaused(prev => !prev) }}>{isPaused ? 'play' : 'pause'}</button>
        </>
    )
}

export default ClientVideo