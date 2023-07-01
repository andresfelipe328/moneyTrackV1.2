import dbConnect from "@/config/connectMongoDB";
import { UserLink } from "@/models/models";
import { ObjectId } from "mongodb";

const findUserLink = async (session: any) => {
  try {
    await dbConnect();

    const userLink = await UserLink.findOne({
      _id: new ObjectId(session.user.id),
    });

    if (!userLink)
      return {
        status: false,
        access_token: null,
        message: "user link created",
      };
    else {
      return {
        status: true,
        access_token: userLink.access_token,
        message: "user link created",
      };
    }
  } catch (err) {
    return { status: false, access_token: null, message: err };
  }
};

export default findUserLink;
