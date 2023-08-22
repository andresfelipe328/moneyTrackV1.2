import dbConnect from "@/config/connectMongoDB";
import { UserLink } from "@/models/models";
import { ObjectId } from "mongodb";

// Checks for an access token in DB
const findUserLink = async (session: any) => {
  try {
    // connecting to DB
    await dbConnect();

    // Finding a record in collection
    const userLink = await UserLink.findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!userLink)
      return {
        status: false,
        access_token: null,
        message: "user link does not exist",
      };
    else {
      return {
        status: true,
        access_token: userLink.access_token,
        message: "user link does exist",
      };
    }
  } catch (err) {
    return { status: false, access_token: null, message: err };
  }
};

export default findUserLink;
