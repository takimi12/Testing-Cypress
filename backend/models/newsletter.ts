import mongoose, { Schema } from "mongoose";

const NewsletterSchema = new Schema(
	{
		email: String,
		name: String,
	},
	{
		timestamps: true,
	},
);

const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter", NewsletterSchema);

export default Newsletter;

type INewsletter = mongoose.InferSchemaType<typeof NewsletterSchema>;
