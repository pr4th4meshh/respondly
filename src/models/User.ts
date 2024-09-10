import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1640960543409-dbe56ccc30e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGRlZmF1bHQlMjBhdmF0YXJ8ZW58MHx8MHx8fDA%3D",
    },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model("User", UserSchema)
