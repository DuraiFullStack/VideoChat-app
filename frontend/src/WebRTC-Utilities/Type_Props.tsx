import { Socket } from "socket.io-client"

interface props{
    socket: Socket,
    userN?: string
}
export default props;