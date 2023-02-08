import { NextApiRequest, NextApiResponse } from "next";

export interface ResponseType {
  ok: boolean;
  [key: string]: any;
}

type Method = "GET" | "POST" | "DELETE";

interface ConfigType {
  methods: Method[];
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<any>;
  isPrivate?: boolean;
}

const withHandler = ({ methods, handler, isPrivate = true }: ConfigType) => {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method && !methods.includes(req.method as any)) {
      return res.status(405).end();
    }

    if (isPrivate && !req.session.user) {
      return res.status(401).json({ ok: false });
    }

    try {
      await handler(req, res);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  };
};

export default withHandler;
