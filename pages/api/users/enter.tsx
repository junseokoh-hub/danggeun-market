import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(401).end();
  }

  console.log(req.body);
  return res.status(200).end();
};

export default withHandler("POST", handler);
