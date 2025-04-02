import { dbConnect } from "../../../../backend/config/dbConnect";
import Topic from "../../../../backend/models/topics";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface TopicData {
	title: string;
	subtitle: string;
	description: string;
	categories: string[];
	price: number;
	imageFileUrl: string;
	pdfFileUrl: string;
}

export async function POST(request: NextRequest) {
	const { title, subtitle, description, categories, price, imageFileUrl, pdfFileUrl }: TopicData =
		await request.json();
	try {
		await dbConnect();
		await Topic.create({
			title,
			subtitle,
			description,
			categories,
			price,
			imageFileUrl,
			pdfFileUrl,
		});
	} catch (err) {
		console.log(err)
	}
	return NextResponse.json({ message: "Topic Created" }, { status: 201 });
}

export async function GET() {
	await dbConnect();
	const topics = await Topic.find();
	return NextResponse.json({ topics });
}

export async function DELETE(request: NextRequest) {
	const id = request.nextUrl.searchParams.get("id");
	await dbConnect();
	await Topic.findByIdAndDelete(id);
	return NextResponse.json({ message: "Topic deleted" }, { status: 200 });
}