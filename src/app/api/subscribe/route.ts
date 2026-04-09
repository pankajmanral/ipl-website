import { NextResponse } from "next/server";
import predictionsData from "@/data/predictions.json";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Simulate sending email
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Find today's match
    const matches = predictionsData.matches;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    const todayMatch = matches.find((m: any) => {
      const mDate = new Date(m.date);
      const mDay = new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate()).getTime();
      return mDay === today;
    });

    return NextResponse.json({ 
      success: true, 
      prediction: todayMatch || null,
      message: `Direct intel sent to ${email}`
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
