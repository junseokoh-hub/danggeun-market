import client from "@libs/server/client";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  await client.user.create({
    data: {
      email: "hi",
      name: "hi",
    },
  });

  res.json({
    ok: true,
  });
};

export default handler;
