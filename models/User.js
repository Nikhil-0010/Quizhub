import mongoose from "mongoose";

const {Schema, model} = mongoose;

const typeSchema = new Schema({
    type: {type: String, required:true},
    rights: {type: String, required:true},
},{ timestamps: true });

const UserSchema = new Schema({
    email: {type: String, required:true, unique: true},
    name: {type: String, required:true},
    phone: {type: Number},
    password: {type: String, required: true},
    user_type: {type: [typeSchema], required: true, validate: {
        validator: function (userTypes) {
          const types = userTypes.map((ut) => ut.type);
          return types.length === new Set(types).size; // Ensure no duplicates
        },
        message: "Duplicate types are not allowed.",
      },},
    organization: {type: mongoose.Schema.Types.ObjectId, ref: 'Organization'},
},{ timestamps: true });

export default mongoose.models.User || model("User", UserSchema);
