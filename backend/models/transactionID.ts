import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    url: { type: String, required: true },
});

const customerSchema = new Schema({
    email: { type: String, required: true },
    nameAndSurname: { type: String, required: true },
    companyName: { type: String },
    nip: { type: String },
});

const paymentHistoryEntrySchema = new Schema({
    status: { type: String, required: true },
    timestamp: { type: Date, required: true },
    details: { type: String }
});

const transactionSchema = new Schema({
    status: { type: Boolean, required: true },
    p24OrderId: { type: Number },
    amount: { type: Number },
    createdAt: { type: Date, default: Date.now },
    lastUpdated: { type: Date },
    attempts: { type: Number, default: 0 },
    products: [productSchema],
    customer: customerSchema,
    paymentHistory: [paymentHistoryEntrySchema],
    errorMessage: { type: String },
    errorCode: { type: String },
    discountInfo: {
        discountPercentage: { type: Number },
        amountSaved: { type: Number }
    }
});

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export type ITransaction = {
    status: boolean;
    p24OrderId?: number;
    amount?: number;
    createdAt?: Date;
    lastUpdated?: Date;
    attempts?: number;
    products: Array<{
        name: string;
        price: number;
        quantity: number;
        url: string;
        _id: string;
    }>;
    customer: {
        email: string;
        nameAndSurname: string;
        companyName: string;
        nip: string;
        _id: string;
    };
    paymentHistory?: Array<{
        status: string;
        timestamp: Date;
        details?: string;
    }>;
    errorMessage?: string;  
    errorCode?: string;     
};

export type IProduct = mongoose.InferSchemaType<typeof productSchema>;

export default Transaction;
