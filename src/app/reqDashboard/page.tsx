// app/reqDashboard/page.tsx
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function ReqDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value

  if (!token) {
    redirect("/");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };

    if (decoded.role !== "user") {
      redirect("/");
    }
  } catch (err) {
    redirect("/");
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
      <p className="mt-2 text-gray-600">Only users with role "user" can see this.</p>
    </div>
  );
}
