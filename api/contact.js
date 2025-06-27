// api/contact.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI);
};

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now },
});

const Contact = mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  try {
    await connectDB();
    const contact = new Contact(req.body);
    await contact.save();
    res.status(200).json({ message: "Message received successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit message" });
  }
}
