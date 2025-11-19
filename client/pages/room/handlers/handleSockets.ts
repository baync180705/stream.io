import type { Dispatch, SetStateAction } from "react";
import { Socket } from 'socket.io-client';

interface SocketHandlers {
    setMembers: Dispatch<SetStateAction<string[]>>;
    setQueue: Dispatch<SetStateAction<File[]>>;
}

export const handleSockets = (user:string, roomID: string, socket: Socket, setMembers: SocketHandlers['setMembers'], setQueue: SocketHandlers['setQueue'])=>{
    socket.emit("join_or_leave_room", {user: user, roomID: roomID});
    socket.on("user_list_updated", (userList: string[])=>{
      setMembers(userList);
    })

    socket.on("updated_track", (trackList: File[])=>{
      setQueue(trackList);
    })
}