import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { poolRotes } from "./routes/pool";
import { authRotes } from "./routes/auth";
import { gameRotes } from "./routes/game";
import { guessRotes } from "./routes/guess";
import { userRotes } from "./routes/user";

async function bootstrap() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.register(jwt, {
    secret: 'nlwcopa',
  })

  await fastify.register(authRotes)
  await fastify.register(gameRotes)
  await fastify.register(guessRotes)
  await fastify.register(poolRotes)
  await fastify.register(userRotes)

  await fastify.listen({ port: 3333, host:'0.0.0.0'});
}

bootstrap();
