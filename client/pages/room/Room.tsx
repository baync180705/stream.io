import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../components/Toast";
import { MemberList } from "../../components/MemberList";
import { MusicQueue } from "../../components/MusicQueue";
import { useSocket } from "../../hooks/useSocket";
import { handleSockets } from "./handlers/handleSockets";
import { handleLeaveRoom } from "./handlers/handleLeaveRoom";
import { handleRemoveMusic } from "./handlers/handleRemoveMusic";
import { handleAddMusic } from "./handlers/handleAddMusic";

export const Room: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [members, setMembers] = useState<string[]>([]); 
  const [queue, setQueue] = useState<File[]>([]); 

  const navigate = useNavigate();
  const location = useLocation();

  const {user, roomID} = location.state || {};
  const socket = useSocket();

  useEffect(() => {

    if (!user || !roomID) {
      console.error("User or RoomID is undefined. Redirecting to Home.");
      navigate("/");
      return;
    }

    handleSockets(user , roomID, socket, setMembers, setQueue);

    return () => {
      socket.off("user_list_updated");
    };
  }, [navigate, roomID, socket, user]);

  return (
    <div className="relative">
      <div className="flex flex-col h-screen w-screen justify-center items-center bg-gradient-to-br from-gray-950 via-zinc-900 to-teal-950 text-white">
        <div className="flex flex-col bg-white/10 p-12 rounded-2xl shadow-xl backdrop-blur-md w-[48rem] h-[32rem]">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Room</h1>
            <button
              onClick={()=>handleLeaveRoom(roomID, user, navigate, socket, setToastMessage)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Leave Room
            </button>
          </div>

          <div className="flex flex-row gap-8">
            {/* Member List */}
            <div className="flex flex-col w-1/3 bg-white/10 p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Members</h2>
              <MemberList members={members} />
            </div>

            {/* Music Queue */}
            <div className="flex flex-col w-2/3 bg-white/10 p-4 rounded-md shadow-md">
              <h2 className="text-xl font-semibold mb-4">Music Queue</h2>
              <MusicQueue queue={queue} onRemoveMusic={(music: File)=>handleRemoveMusic(music, roomID, socket, setQueue, setToastMessage)}/>
              <label
                htmlFor="add-music"
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer text-center"
              >
                Add Music
              </label>
              <input
                id="add-music"
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleAddMusic(event, roomID, socket, setQueue, setToastMessage)}
              />
            </div>
          </div>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};