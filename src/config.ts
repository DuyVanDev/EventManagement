import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
    NEXT_PUBLIC_API_UPLOAD: z.string(),
    NEXT_PUBLIC_BASE_URL: z.string(),
    NEXT_PUBLIC_BASE_SEND_CHAT: z.string(),
});

const configProject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_API_UPLOAD: process.env.NEXT_PUBLIC_API_UPLOAD,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_BASE_SEND_CHAT: process.env.NEXT_PUBLIC_BASE_SEND_CHAT,

});
if (!configProject.success) {
  console.error(configProject.error.issues);
  throw new Error(".env error");
}

const envConfig = configProject.data;
export default envConfig;
