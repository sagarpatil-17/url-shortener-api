import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
    {
        original_url: {
            type: String,
            required: [true, "Original url is required"],
            trim: true,
            maxlength: 2048,
        },
        short_code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 4,
            maxlength: 20,
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
