import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {dbConnect} from "../../../../../backend/config/dbConnect";
import User from "../../../../../backend/models/user";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; // dodaj to do .env.local

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ message: "Login successful" }, { status: 200 });
    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
