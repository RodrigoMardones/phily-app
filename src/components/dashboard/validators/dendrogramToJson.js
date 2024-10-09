import { z } from 'zod';

export const childrenSchema = z.object({
    name: z.string(),
    length: z.string(),
    nodeStyle: z.object({
        radius: z.number(),
        stroke: z.string(),
        fill: z.string(),
    }),
    pathStyle: z.object({
        fill: z.string(),
        stroke: z.string(),
        strokeOpacity: z.number(),
        strokeWidth: z.number(),
    }),
    labelStyle: z.object({
        hidden: z.boolean(),
        fontSize: z.number(),
        fill: z.string(),
    }),
    children: z.array(z.object({})),
});


export const schema = z.object({
  name: z.string(),
  length: z.string(),
  nodeStyle: z.object({
    radius: z.number(),
    stroke: z.string(),
    fill: z.string(),
  }),
  pathStyle: z.object({
    fill: z.string(),
    stroke: z.string(),
    strokeOpacity: z.number(),
    strokeWidth: z.number(),
  }),
  labelStyle: z.object({
    hidden: z.boolean(),
    fontSize: z.number(),
    fill: z.string(),
  }),
  children: z.array(z.object(childrenSchema)),
});
