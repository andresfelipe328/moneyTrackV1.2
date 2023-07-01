import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   _id: {
//     type: ObjectId,
//     required: true,
//     unique: true,
//   },
//   name: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     required: true,
//   },
//   image: {
//     type: String,
//   },
//   emailVerified: {
//     type: Boolean,
//   },
// });

const userLinkSchema = new mongoose.Schema({
  _id: {
    type: ObjectId,
  },
  is_linked: {
    type: Boolean,
    required: true,
  },
  access_token: {
    type: String,
    required: true,
  },
  item_id: {
    type: String,
    required: true,
  },
});

// Creating model objects
// const User = mongoose.models.User || mongoose.model("users", userSchema);

const UserLink =
  mongoose.models.usersLink || mongoose.model("usersLink", userLinkSchema);

// Exporting our model objects
export { UserLink };
