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

  const alreadyExists = await client.curiosity.findFirst({
    where: {
      userId: user?.id,
      postId: Number(id),
    },
  });

  if (alreadyExists) {
    await client.curiosity.delete({
      where: {
        id: alreadyExists.id,
      },
    });
  } else {
    await client.curiosity.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        post: {
          connect: {
            id: Number(id),
          },
        },
      },
    });
  }

  res.json({ ok: true });
};

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  }),
);
