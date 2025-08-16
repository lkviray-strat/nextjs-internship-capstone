import { queries } from "@/src/lib/db/queries";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  const url = req.nextUrl.clone();
  if (!userId) {
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  const teams = await queries.teams.getTeamsByLeaderId(userId);

  if (teams.length > 0) {
    url.pathname = `/${teams[0].id}/dashboard`;
    return NextResponse.redirect(url);
  }

  url.pathname = "/";
  return NextResponse.redirect(url);
}
