import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  const { id } = req.query;
  const { user } = req.session;
  const answer = req.body;

  const newAnswer = await client.answer.create({
    data: {
      user: {
        connect: { id: user?.id },
      },
      post: {
        connect: {
          id: Number(id),
        },
      },
      answer,
    },
  });

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
    },
  });

  if (!post) res.json({ ok: true, answer: newAnswer });
};

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  }),
);
