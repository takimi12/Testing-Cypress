import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    _id: string;
    title: string;
    subtitle1: string;
    subtitle2: string;
    subtitle3: string;
    price: number;
    description: string;
    category: string;
    imageFileUrl: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxLength: [100, "Title cannot be more than 100 characters"],
        },
        subtitle1: {
            type: String,
            required: [true, "Subtitle 1 is required"],
            trim: true,
            maxLength: [200, "Subtitle 1 cannot be more than 200 characters"],
        },
        subtitle2: {
            type: String,
            required: [true, "Subtitle 2 is required"],
            trim: true,
            maxLength: [200, "Subtitle 2 cannot be more than 200 characters"],
        },
        subtitle3: {
            type: String,
            required: [true, "Subtitle 3 is required"],
            trim: true,
            maxLength: [200, "Subtitle 3 cannot be more than 200 characters"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
            set: (v: string) => parseFloat(parseFloat(v).toFixed(2)),
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
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

categorySchema.index({ category: 1 });
categorySchema.index({ title: 1 });

const Categories = mongoose.models.Categories || mongoose.model<ICategory>("Categories", categorySchema);

export default Categories;