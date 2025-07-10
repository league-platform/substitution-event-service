import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { connect } from "https://deno.land/x/redis/mod.ts";

const redis = await connect({ hostname: "redis", port: 6379 });

const router = new Router();

router
  .post("/substitutions", async (ctx) => {
    const body = await ctx.request.body().value;
    const key = `substitution:${body.matchId}:${Date.now()}`;
    await redis.hset(key, {
      playerOut: body.playerOut,
      playerIn: body.playerIn,
      minute: body.minute,
    });
    console.log(`EVENT: substitution.made -> ${key}`);
    ctx.response.status = 201;
    ctx.response.body = { message: "Substitution registered", key };
  })
  .get("/substitutions", async (ctx) => {
    const keys = await redis.keys("substitution:*");
    ctx.response.body = { substitutions: keys };
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Substitution service running on http://localhost:8000");
await app.listen({ port: 8000 });
