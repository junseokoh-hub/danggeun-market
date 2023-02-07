import client from "@libs/server/client";
import withHandler from "@libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { phone, email } = req.body;
  const payload = email ? { email } : { phone: Number(phone) };
  const user = await client.user.upsert({
    where: {
      ...payload,
    },
    create: {
      name: "Anonymous",
      ...payload,
    },
    update: {},
  });

  const token = await client.token.create({
    data: {
      payload: "1234",
      user: {
        connectOrCreate: {
          where: {
            ...payload,
          },
          create: {
            name: "Anonymous",
            ...payload,
          },
        },
      },
    },
  });
  console.log(token);

  // if (email) {
  //   let user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if (user) {
  //     console.log("Found it!");
  //   }
  //   if (!user) {
  //     console.log("Did not find. Will create");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  // if (phone) {
  //   let user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   });
  //   if (user) {
  //     console.log("Found it!");
  //   }
  //   if (!user) {
  //     console.log("Did not find. Will create");
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  //   console.log(user);
  // }

  return res.status(200).end();
};

export default withHandler("POST", handler);
