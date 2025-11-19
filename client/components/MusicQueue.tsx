import React, { useState, useRef } from "react";
import { TrashIcon, PlayIcon, PauseIcon } from "@heroicons/react/24/solid";

interface MusicQueueProps {
  queue: File[];
  onRemoveMusic: (music: File) => void;
}

export const MusicQueue: React.FC<MusicQueueProps> = ({ queue, onRemoveMusic }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayPause = (index: number) => {
    // If clicking the currently playing track → toggle play/pause
    if (currentTrackIndex === index) {
      if (audioRef.current) {
        if(audioRef.current.paused) audioRef.current.play()
        else audioRef.current.pause()
      }
    } 
    else {
      const prevTime = audioRef.current ? audioRef.current.currentTime : 0;
      setCurrentTrackIndex(index);

      // Wait for state update → then resume from same time
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.currentTime = prevTime;
          audioRef.current.play();
        }
      }, 0);
    }
  };

  const handleAudioEnds = () => {
    if (currentTrackIndex === null) return;

    // Go to next track if available
    if (currentTrackIndex < queue.length - 1) {
      setCurrentTrackIndex((i) => (i !== null ? i + 1 : null));
    } else {
      setCurrentTrackIndex(null); // End of queue
    }
  };

  return (
    <div>
      <ul className="space-y-2">
        {queue.length > 0 ? (
          queue.map((music, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-800 p-2 rounded-md shadow-md"
            >
              <span className="text-white">{music.name}</span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePlayPause(index)}
                  className="text-green-500 hover:text-green-700 transition"
                >
                  {currentTrackIndex === index &&
                  audioRef.current &&
                  !audioRef.current.paused ? (
                    <PauseIcon className="h-5 w-5" />
                  ) : (
                    <PlayIcon className="h-5 w-5" />
                  )}
                </button>

                <button
                  onClick={() => onRemoveMusic(music)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-400">No music in the queue</li>
        )}
      </ul>

      {currentTrackIndex !== null && (
        <audio
          ref={audioRef}
          src={URL.createObjectURL(queue[currentTrackIndex])}
          autoPlay
          onEnded={handleAudioEnds}
        />
      )}
    </div>
  );
};
