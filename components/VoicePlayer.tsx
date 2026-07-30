'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  src: string;
}

export default function VoicePlayer({
  src,
}: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const loaded = () => {
      setDuration(audio.duration);
    };

    const update = () => {
      setCurrent(audio.currentTime);
    };

    const ended = () => {
      setPlaying(false);
    };

    audio.addEventListener(
      'loadedmetadata',
      loaded,
    );

    audio.addEventListener(
      'timeupdate',
      update,
    );

    audio.addEventListener(
      'ended',
      ended,
    );

    return () => {
      audio.removeEventListener(
        'loadedmetadata',
        loaded,
      );

      audio.removeEventListener(
        'timeupdate',
        update,
      );

      audio.removeEventListener(
        'ended',
        ended,
      );
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audio) return;

    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }

    setPlaying(!playing);
  };

  const format = (time: number) => {
    const min = Math.floor(time / 60);

    const sec = Math.floor(time % 60);

    return `${min}:${sec
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div>

      <audio
        ref={audioRef}
        src={src}
      />

      <div className="d-flex align-items-center">

        <button
          className="btn btn-success rounded-circle"
          style={{
            width: 45,
            height: 45,
          }}
          onClick={togglePlay}
        >
          {playing ? '❚❚' : '▶'}
        </button>

        <div
          className="flex-grow-1 mx-3"
        >

          <input
            type="range"
            className="form-range"

            min={0}

            max={duration || 0}

            value={current}

            onChange={(e) => {
              const audio =
                audioRef.current;

              if (!audio) return;

              audio.currentTime =
                Number(e.target.value);

              setCurrent(
                Number(e.target.value),
              );
            }}
          />

          <small>
            {format(current)} /{' '}
            {format(duration)}
          </small>

        </div>

      </div>

    </div>
  );
}