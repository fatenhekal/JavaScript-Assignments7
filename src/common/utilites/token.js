import { createHmac, timingSafeEqual } from "node:crypto";

const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
const sign = (value, secret) => createHmac("sha256", secret).update(value).digest("base64url");

export const createAccessToken = (userId, secret) => {
    const now = Math.floor(Date.now() / 1000);
    const payload = encode({ sub: userId, iat: now, exp: now + 60 * 60 });
    const header = encode({ alg: "HS256", typ: "JWT" });
    const content = `${header}.${payload}`;
    return `${content}.${sign(content, secret)}`;
};

export const verifyAccessToken = (token, secret) => {
    const parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid access token.");
    }

    const [headerPart, payloadPart, signature] = parts;
    const content = `${headerPart}.${payloadPart}`;
    const expectedSignature = Buffer.from(sign(content, secret));
    const actualSignature = Buffer.from(signature);

    if (
        expectedSignature.length !== actualSignature.length ||
        !timingSafeEqual(expectedSignature, actualSignature)
    ) {
        throw new Error("Invalid access token.");
    }

    const header = JSON.parse(Buffer.from(headerPart, "base64url").toString("utf8"));
    const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf8"));
    if (header.alg !== "HS256" || typeof payload.sub !== "string" ||
        typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error("Invalid or expired access token.");
    }

    return payload;
};
