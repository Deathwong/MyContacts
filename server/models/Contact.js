import mongoose from "mongoose";


const contactSchema = new mongoose
    .Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 20
        },
        userEmail: {
            type:String,
            required: true
        }
})

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;

