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

  const post = await client.post.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      answers: {
        select: {
          answer: true,
          id: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
      _count: {
        select: {
          answers: true,
          curiosities: true,
        },
      },
    },
  });

  const isCurious = Boolean(
    await client.curiosity.findFirst({
      where: {
        postId: Number(id),
        userId: user?.id,
      },
      select: {
        id: true,
      },
    }),
  );

  res.json({ ok: true, post, isCurious });
};

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  }),
);
