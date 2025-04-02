import mongoose, { Schema, Document } from "mongoose";


export interface ITopic extends Document {
	_id: string;
	title: string;
	subtitle: string;
	description: string;
	categories: string[];
	price: number; 
	imageFileUrl: string;
	pdfFileUrl: string;
	createdAt: Date;
	updatedAt: Date;
}

const topicSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, "Title is required"],
			trim: true,
			maxLength: [100, "Title cannot be more than 100 characters"],
		},
		subtitle: {
			type: String,
			required: [true, "Subtitle is required"],
			trim: true,
			maxLength: [200, "Subtitle cannot be more than 200 characters"],
		},
		description: {
			type: String,
			required: [true, "Description is required"],
			trim: true,
		},
		categories: {
			type: [String],
			required: [true, "At least one category is required"],
			validate: {
				validator: function (v: string[]) {
					return v.length > 0;
				},
				message: "At least one category must be specified",
			},
		},
		price: {
			type: Number,
			required: [true, "Price is required"],
			min: [0, "Price cannot be negative"],
			set: (v: string) => parseFloat(parseFloat(v).toFixed(2)), 
		},
		imageFileUrl: {
			type: String,
			required: [true, "Image URL is required"],
			validate: {
				validator: function (v: string) {
					return /^https?:\/\/.+/.test(v);
				},
				message: "Image URL must be a valid URL",
			},
		},
		pdfFileUrl: {
			type: String,
			required: [true, "PDF URL is required"],
			validate: {
				validator: function (v: string) {
					return /^https?:\/\/.+/.test(v);
				},
				message: "PDF URL must be a valid URL",
			},
		},
	},
	{
		timestamps: true,
		toJSON: {
			transform: function (doc, ret) {
				ret.id = ret._id;
				delete ret.__v;
				return ret;
			},
		},
	},
);


topicSchema.index({ categories: 1 });
topicSchema.index({ title: 1 });

const Topics = mongoose.models.Topics || mongoose.model<ITopic>("Topics", topicSchema);

export default Topics;
