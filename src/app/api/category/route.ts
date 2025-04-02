import { dbConnect } from "../../../../backend/config/dbConnect";
import Category from "../../../../backend/models/category";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

interface CategoryData {
    title: string;
    subtitle1: string;
    subtitle2: string;
    subtitle3: string;
    price: number;
    description: string;
    category: string;
    imageFileUrl: string;
}

export async function POST(request: NextRequest) {
    const { 
        title, 
        subtitle1, 
        subtitle2, 
        subtitle3, 
        price, 
        description, 
        category, 
        imageFileUrl 
    }: CategoryData = await request.json();
    
    try {
        await dbConnect();
        await Category.create({
            title,
            subtitle1,
            subtitle2,
            subtitle3,
            price,
            description,
            category,
            imageFileUrl,
        });
    } catch (err) {
        console.log(err)
    }
    return NextResponse.json({ message: "Category Created" }, { status: 201 });
}

export async function GET() {
    await dbConnect();
    const categories = await Category.find();
    return NextResponse.json({ categories });
}

export async function DELETE(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id");
    await dbConnect();
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
}