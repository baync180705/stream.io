import type { Socket } from "socket.io-client";
import { addMusicToTrackService } from "../../../services/trackServices";
import type { Dispatch, SetStateAction } from "react";

interface AddMusicHandlers {
    setToastMessage: Dispatch<SetStateAction<null | string>>;
    setQueue: Dispatch<SetStateAction<File[]>>;
}

export const handleAddMusic = async (event: React.ChangeEvent<HTMLInputElement>, roomID: string, socket: Socket, setQueue: AddMusicHandlers['setQueue'], setToastMessage: AddMusicHandlers['setToastMessage']) => {
    if (event.target.files && event.target.files[0]) {

      const allowedMimeTypes = [
        "audio/mpeg", "audio/aac", "audio/flac", "audio/alac",
        "audio/wav", "audio/x-wav", "audio/aiff", "audio/x-aiff"
      ];

      const allowedExtensions = ["mp3", "aac", "flac", "alac", "wav", "aiff"];

      const file = event.target.files[0];

      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      if(allowedMimeTypes.includes(file.type) && fileExtension && allowedExtensions.includes(fileExtension)){

        try{
          const res = await addMusicToTrackService(roomID, file.name);
          if(res){
            setQueue((prevQueue) => [...prevQueue, file]); 
            setToastMessage(`${file.name} added to the queue.`);
            socket.emit("track_stream", {roomID: roomID});
          }
        }catch(err){
          setToastMessage("Failed to add music to track. Try again later !");
          if (err instanceof Error) {
              throw new Error(err.message);
          } else {
              throw new Error("An unknown error occurred");
          }
        }

      }else{
        setToastMessage("Invalid File Format ! Please try again.");
      }
    }
};