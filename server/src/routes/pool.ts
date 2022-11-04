import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import {z} from 'zod';
import ShortUniqueId from 'short-unique-id';
import { authenticate } from "../plugins/authenticate";

export async function poolRotes(fastify: FastifyInstance){
    fastify.get("/pools/count", async () => {
        const count = await prisma.pool.count();
    
        return { count };
      });

      fastify.post("/pools", async (request, reply) => {
        const createPoolBody = z.object({
          title: z.string(),
        });
        const { title } = createPoolBody.parse(request.body);
    
        const generate = new ShortUniqueId({ length: 6 });
        const code = String(generate()).toUpperCase();

        try{
          await request.jwtVerify()
          await prisma.pool.create({
            data: {
              title,
              code,
              ownerId: request.user.sub,

              participants: {
                create: {
                  userId: request.user.sub,
                }
              }
            },
          });
        } catch {
          await prisma.pool.create({
            data: {
              title,
              code,
            },
          });
        }   

        return reply.status(201).send({ code });
      });
    
      fastify.post("/pools/:id/join", {
        onRequest: [authenticate]
        }, async (request, reply) => {
          const joinsPoolBody = z.object({
            code: z.string(),
          })

          const {code} = joinsPoolBody.parse(request.body)

          const pool = await prisma.pool.findUnique({
            where: {
              code,
            },
            include: {
              participants: {
                where: {
                  userId: request.user.sub,
                }
              }
            }
          })

          if (!pool) {
            return reply.status(400).send({
              message: 'Pool not found.'
            })
          }

          if (pool.participants.length > 0) {
            return reply.status(400).send({
              message: 'You already joined this pool.'
            })
          }

          if (!pool.ownerId) {
            await prisma.pool.update({
              where: {
                id: pool.id,
              },
              data: {
                ownerId: request.user.sub,
              }
            })
          }

          await prisma.participant.create({
            data: {
              poolId: pool.id,
              userId: request.user.sub,
            }
          })

          return reply.status(201).send()
        })
}