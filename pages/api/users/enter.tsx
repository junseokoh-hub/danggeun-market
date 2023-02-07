import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;

  if (!user) return res.status(400).json({ ok: false });

  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.MESSAGING_SERVICES_SID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your Login Token is ${payload}`,
    // });
    // console.log(message);
  }

  return res.json({ ok: true });
};

export default withHandler({
  method: "POST",
  handler,
  isPrivate: false,
});
