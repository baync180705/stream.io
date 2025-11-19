import type { Socket } from "socket.io-client";
import { removeMusicFromTrackService } from "../../../services/trackServices";
import type { Dispatch, SetStateAction } from "react";

interface RemoveMusicHandlers {
    setToastMessage: Dispatch<SetStateAction<null | string>>;
    setQueue: Dispatch<SetStateAction<File[]>>;
}

export const handleRemoveMusic = async (music: File, roomID: string, socket: Socket, setQueue: RemoveMusicHandlers['setQueue'], setToastMessage: RemoveMusicHandlers['setToastMessage']) => {
    try {
      const res = await removeMusicFromTrackService(roomID, music.name);
      if (res) {
        setQueue((prevQueue) => prevQueue.filter((_,i) => i !== prevQueue.indexOf(music))); 
        setToastMessage(`${music} removed from the queue.`);
        socket.emit("track_stream", { roomID: roomID }); 
      }
    } catch (err) {
      setToastMessage("Failed to remove music from track. Try again later!");
      if (err instanceof Error) {
        throw new Error(err.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  };