import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: [true, "Original url is required"],
            trim: true,
            maxLength: 2048,
        },
        shortCode: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 4,
            maxLength: 20,
        },
        clicks: {
            type: Number,
            default: 0,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// Index for listing recently created active URLs
urlSchema.index({ isActive: 1, createdAt: -1 });

const Url = mongoose.model("Url", urlSchema);

export default Url;
