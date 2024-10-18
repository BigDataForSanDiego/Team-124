/* eslint-disable */
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../lib/dbConnect";
import { RtcTokenBuilder, RtcRole } from "agora-access-token";
import Room from "../../../models/Room";

type Room = {
  status: String;
};

type ResponseData = Room[] | string;

function getRtcToken(roomId: string, userId: string) {
  const appID = process.env.NEXT_PUBLIC_AGORA_APP_ID!;
  const appCertificate = process.env.AGORA_APP_CERT!;
  const channelName = roomId;
  const account = userId;
  const role = RtcRole.PUBLISHER;
  const expirationTimeInSeconds = 3600;
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithAccount(
    appID,
    appCertificate,
    channelName,
    account,
    role,
    privilegeExpiredTs
  );

  return token;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    const { method, query, body } = req;
    const roomId = query.roomId as string;
    const userId = body.userId;
  
    await dbConnect();
  
    if (method === "PATCH" || method === "POST") {
      const action = body.action; // 'join' or 'leave'
      const room = await Room.findById(roomId);
      if (!room) {
        return res.status(404).json({ error: "Room not found" });
      }
  
      let connectedUsers = room.connectedUsers || [];
  
      if (action === "join") {
        if (!connectedUsers.includes(userId)) {
          connectedUsers.push(userId);
        }
      } else if (action === "leave") {
        connectedUsers = connectedUsers.filter((id: any) => id !== userId);
      }
  
      let status = room.status;
  
      if (connectedUsers.length === 0) {
        // Delete the room
        await Room.findByIdAndDelete(roomId);
        return res.status(200).json("Room deleted");
      } else if (connectedUsers.length === 1) {
        status = "waiting";
      } else if (connectedUsers.length >= 2) {
        status = "active";
      }
  
      await Room.findByIdAndUpdate(roomId, {
        connectedUsers,
        status,
      });
  
      res.status(200).json({ status });
    } else if (method === "PUT") {
      // Existing PUT method logic
      await Room.findByIdAndUpdate(roomId, {
        status: "waiting",
      });
      res.status(200).json("success");
    } else {
      res.status(400).json("No method for this endpoint");
    }
  }