import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    category: {
        type: String,
        required: true,
        trim: true,
        enum: ['tech', 'finance', 'healthcare', 'retail']
    },
    location_type: {
        type: String,
        required: true,
        enum: ['remote', 'onsite', 'hybrid']
    }
}, { timestamps: true });

companySchema.index({ company_id: 1 });

const Company = mongoose.model('Company', companySchema, 'companies');
export default Company;