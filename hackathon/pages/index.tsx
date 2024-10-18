import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import {
  ICameraVideoTrack,
  IRemoteVideoTrack,
  IAgoraRTCClient,
  IRemoteAudioTrack,
} from "agora-rtc-sdk-ng";

type TCreateRoomResponse = {
  room: Room;
  rtcToken: string;
};

type TGetRandomRoomResponse = {
  rtcToken: string;
  rooms: Room[];
};

type Room = {
  _id: string;
  status: string;
};

function createRoom(userId: string): Promise<TCreateRoomResponse> {
  return fetch(`/api/rooms?userId=${userId}`, {
    method: "POST",
  }).then((response) => response.json());
}

function getRandomRoom(userId: string): Promise<TGetRandomRoomResponse> {
  return fetch(`/api/rooms?userId=${userId}`).then((response) =>
    response.json()
  );
}

function setRoomToWaiting(roomId: string) {
  return fetch(`/api/rooms/${roomId}`, { method: "PUT" }).then((response) =>
    response.json()
  );
}

export const VideoPlayer = ({
  videoTrack,
  style,
}: {
  videoTrack: IRemoteVideoTrack | ICameraVideoTrack;
  style: object;
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const playerRef = ref.current;
    if (!videoTrack || !playerRef) return;
    videoTrack.play(playerRef);

    return () => {
      videoTrack.stop();
    };
  }, [videoTrack]);

  return <div ref={ref} style={style}></div>;
};

async function connectToAgoraRtc(
  roomId: string,
  userId: string,
  onVideoConnect: any,
  onWebcamStart: any,
  onAudioConnect: any,
  token: string
) {
  const { default: AgoraRTC } = await import("agora-rtc-sdk-ng");

  const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8",
  });

  await client.join(
    process.env.NEXT_PUBLIC_AGORA_APP_ID!,
    roomId,
    token,
    userId
  );

  client.on("user-published", (themUser, mediaType) => {
    client.subscribe(themUser, mediaType).then(() => {
      if (mediaType === "video") {
        onVideoConnect(themUser.videoTrack);
      }
      if (mediaType === "audio") {
        onAudioConnect(themUser.audioTrack);
        themUser.audioTrack?.play();
      }
    });
  });
  
  const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
  onWebcamStart(tracks[1]);
  await client.publish(tracks);

  return { tracks, client };
}

export default function Home() {
  const [userId] = useState(parseInt(`${Math.random() * 1e6}`) + "");
  const [room, setRoom] = useState<Room | undefined>();
  const [themVideo, setThemVideo] = useState<IRemoteVideoTrack>();
  const [myVideo, setMyVideo] = useState<ICameraVideoTrack>();
  const [themAudio, setThemAudio] = useState<IRemoteAudioTrack>();
  const rtcClientRef = useRef<IAgoraRTCClient>();

  
  useEffect(() => {
    const handleUnload = () => {
      if (room) {
        const data = JSON.stringify({ action: "leave", userId });
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon(`/api/rooms/${room._id}`, blob);
      }
    };
  
    window.addEventListener("unload", handleUnload);
  
    return () => {
      window.removeEventListener("unload", handleUnload);
    };
  }, [room, userId]);
  
  async function connectToARoom() {
    setThemAudio(undefined);
    setThemVideo(undefined);
    setMyVideo(undefined);
  
    if (rtcClientRef.current) {
      await rtcClientRef.current.leave();
      rtcClientRef.current = undefined;
    }
  
    if (room) {
      // Leave the current room
      await fetch(`/api/rooms/${room._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'leave', userId }),
      });
      setRoom(undefined);
    }
  
    const { rooms, rtcToken } = await getRandomRoom(userId);
  
    if (rooms.length > 0) {
      const roomId = rooms[0]._id;
      setRoom(rooms[0]);
  
      // Join the new room
      await fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'join', userId }),
      });
  
      const { tracks, client } = await connectToAgoraRtc(
        rooms[0]._id,
        userId,
        (themVideo: React.SetStateAction<IRemoteVideoTrack | undefined>) => setThemVideo(themVideo),
        (myVideo: React.SetStateAction<ICameraVideoTrack | undefined>) => setMyVideo(myVideo),
        (themAudio: React.SetStateAction<IRemoteAudioTrack | undefined>) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
    } else {
      const { room, rtcToken } = await createRoom(userId);
      setRoom(room);
  
      // Join the new room
      await fetch(`/api/rooms/${room._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'join', userId }),
      });
  
      const { tracks, client } = await connectToAgoraRtc(
        room._id,
        userId,
        (themVideo: React.SetStateAction<IRemoteVideoTrack | undefined>) => setThemVideo(themVideo),
        (myVideo: React.SetStateAction<ICameraVideoTrack | undefined>) => setMyVideo(myVideo),
        (themAudio: React.SetStateAction<IRemoteAudioTrack | undefined>) => setThemAudio(themAudio),
        rtcToken
      );
      rtcClientRef.current = client;
    }
  }
  

  const isChatting = room != null;

  return (
    <>
      <Head>
        <title>Video Chat</title>
        <meta name="description" content="Simple video chat app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {isChatting ? (
          <>
            {room._id}
            <button onClick={connectToARoom}>Next</button>
            <div className="video-panel">
              <div className="video-stream" id="my-video">
                {myVideo && (
                  <VideoPlayer
                    style={{ width: "100%", height: "100%" }}
                    videoTrack={myVideo}
                  />
                )}
              </div>
              <div className="video-stream" id="them-video">
                {themVideo && (
                  <VideoPlayer
                    style={{ width: "100%", height: "100%" }}
                    videoTrack={themVideo}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <button onClick={connectToARoom}>Connect</button>
          </>
        )}
      </main>
    </>
  );
}
