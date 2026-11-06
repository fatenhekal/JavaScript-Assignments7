import config from "../../config/config.setvice.js";
import { verifyAccessToken } from "../utilites/token.js";
import { httpError } from "../utilites/http-error.js";

export const authenticate = (req, res, next) => {
    const authorization = req.get("authorization");
    if (!authorization?.startsWith("Bearer ")) {
        return next(httpError(401, "A Bearer access token is required."));
    }

    try {
        const payload = verifyAccessToken(authorization.slice(7), config.jwtSecret);
        req.auth = { userId: payload.sub };
        return next();
    } catch {
        return next(httpError(401, "The access token is invalid or expired."));
    }
};
