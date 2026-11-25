import mongoose from "mongoose";
import { maxLength, minLength } from "zod";

const urlSchema = new mongoose.Schema(
    {
        original_url: {
            type: String,
            required: [true, "Original url is required"],
            trim: true,
            maxLength: 2048
        },
        short_code: {
            type: String,
            required: true,
            unique: true,
            time: true,
            minLength: 4,
            maxLength: 20,
        },
        clicks: {
            type: Number,
            default: 0,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

// index for fast short code lookup 
urlSchema.index({ short_code: 1 }, { unique: true });

// index for listing recently created urls 
urlSchema.index({ createAt: -1 });

const Url = mongoose.model("Url", urlSchema);

export default Url;