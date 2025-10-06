import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: true
    }
})

// Hash the Password
userSchema.pre("save", async function(){
    if (this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
});

// Compare passwords
userSchema.methods.comparePassword = function (passwordReceived) {
    return bcrypt.compare(passwordReceived, this.password);
}

// Export of the the User Model
const User = mongoose.model("User", userSchema);
export default User;

