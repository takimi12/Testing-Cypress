import mongoose from "mongoose";

const MONGODB_URL = process.env.NEXT_PUBLIC_MONGODB_URL;

if (!MONGODB_URL) {
    throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose || {
    conn: null,
    promise: null
};

if (!global.mongoose) {
    global.mongoose = cached;
}

export const dbConnect = async (): Promise<typeof mongoose> => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URL, opts);
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};