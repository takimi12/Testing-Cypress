import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    discount: {
        type: Number,
        required: true,
    },
});

export default mongoose.models.DiscountCode || mongoose.model("DiscountCode", DiscountCodeSchema);

type IDiscountCode = mongoose.InferSchemaType<typeof DiscountCodeSchema>;
