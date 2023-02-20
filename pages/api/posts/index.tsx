import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@libs/server/withSession";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>,
) => {
  if (req.method === "POST") {
    const { question, latitude, longitude } = req.body;
    const { user } = req.session;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({ ok: true, post });
  }

  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;
    console.log(latitude, longitude);
    // const parsedLatitude = parseFloat(latitude?.toString());
    // const parsedLongitude = parseFloat(longitude?.toString());
    // console.log(parsedLatitude);
    const posts = await client.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            curiosities: true,
            answers: true,
          },
        },
      },
      // where: {
      //   latitude: {
      //     gte: parsedLatitude - 0.01,
      //     lte: parsedLatitude + 0.01,
      //   },
      //   longitude: {
      //     gte: parsedLongitude - 0.01,
      //     lte: parsedLongitude + 0.01,
      //   },
      // },
    });
    res.json({
      ok: true,
      posts,
    });
  }
};

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  }),
);
