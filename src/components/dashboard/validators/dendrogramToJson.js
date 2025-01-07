import { z } from 'zod';

export const schema = z.object({
  name: z.string(),
  length: z.string(),
  nodeStyle: z.object({
    radius: z.number(),
    stroke: z.string(),
    fill: z.string(),
  }).optional(),
  pathStyle: z.object({
    fill: z.string(),
    stroke: z.string(),
    strokeOpacity: z.number(),
    strokeWidth: z.number(),
  }).optional(),
  labelStyle: z.object({
    hidden: z.boolean(),
    fontSize: z.number(),
    fill: z.string(),
  }).optional(),
  children: z.array(z.object({})).default([])
});

export const validateTotalSchema = async (data) => {
  try {
    let firstCase = await schema.parseAsync(data);
    if(data.children?.length === 0) return firstCase;
    if(!data.children) return firstCase;
    for (const child of data.children) {
      let res = await validateTotalSchema(child);
      firstCase = firstCase && res
    }
    return firstCase;
  } catch (error) {
    throw new Error('El archivo no tiene el formato correcto');
  }
}