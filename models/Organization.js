import mongoose from "mongoose";

const {Schema, model} = mongoose;

const OrganizationSchema = new Schema({
    name: {type: String, required:true},
    description: {type: String, required:true},
    location: {type: String},
    phone: {type: Number},
    email: {type: String},
    website: {type: String},
    logo: {type: String},
    admins: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true}],
    students: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, unique:true}],
},{ timestamps: true });

export default mongoose.models.Organization || model("Organization", OrganizationSchema);
