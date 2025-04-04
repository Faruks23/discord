import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4 } from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export const PATCH = async (
  req: NextRequest,
  { params }: { params: { serverId: string } }
) => {
  try {
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.serverId) {
      return new NextResponse("Server ID missing", { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: params.serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    });

    return NextResponse.json(server, { status: 200 });
  }
  catch (error) {
    console.log("[invite-code_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
