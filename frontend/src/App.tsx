import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { io } from 'socket.io-client';
import Home from './components/Home';

function App() {
   
  // const [remoteStream, setRemoteStream] = useState<MediaDevices | null>(null);
  // const [peerConnection, setPeerConnection] = useState();
  // const [callStatus, setCallStatus] = useState([]);
  const socket = io('http://localhost:3000');

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home socket={socket} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
