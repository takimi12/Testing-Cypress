import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please enter your name"],
	},
	email: {
		type: String,
		required: [true, "Please enter your email"],
		unique: true,
	},
	password: {
		type: String,
		required: [true, "Please enter your password"],
		minLength: [6, "Your password must be longer than 6 characters"],
		select: false,
	},
	role: {
		type: String,
		default: "user",
	},
});

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}

	this.password = await bcrypt.hash(this.password, 10);
});

export default mongoose.models.User || mongoose.model("User", userSchema);

type IUser = mongoose.InferSchemaType<typeof userSchema>;
