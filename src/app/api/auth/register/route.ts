import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {dbConnect} from "../../../../../backend/config/dbConnect";
import User from "../../../../../backend/models/user";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, password } = await req.json();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ message: "User created" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
