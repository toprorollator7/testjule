"use node";

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "workos";
import { internal } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/workos",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const wh = new Webhook(process.env.WORKOS_WEBHOOK_SECRET!);

    const user = await wh.verify(request.body, request.headers);

    await ctx.runMutation(internal.users.create, {
      email: user.data.email,
      firstName: user.data.firstName,
      userId: user.data.id,
    });

    return new Response(null, {
      status: 200,
    });
  }),
});

export default http;
