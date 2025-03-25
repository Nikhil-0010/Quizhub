import mongoose from "mongoose";

const {Schema, model} = mongoose;

const OrganizationSchema = new Schema({
    name: {type: String, required:true, unique:true},
    description: {type: String, required:true},
    location: {type: String},
    phone: {type: Number},
    email: {type: String},
    website: {type: String},
    logo: {type: String},
    admins: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
        validate: {
            validator: function (admins) {
                return admins.length === new Set(admins.map(String)).size; // Ensure no duplicates
            },
            message: "Duplicate admins are not allowed.",
        },
    },
    students: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        validate: {
            validator: function (students) {
                return students.length === new Set(students.map(String)).size; // Ensure no duplicates
            },
            message: "Duplicate students are not allowed.",
        },
    },
},{ timestamps: true });

export default mongoose.models.Organization || model("Organization", OrganizationSchema);
