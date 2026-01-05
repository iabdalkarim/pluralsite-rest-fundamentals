import * as dotenv from "dotenv";
import {auth, requiredScopes} from "express-oauth2-jwt-bearer";

dotenv.config();

export const validateAccessToken = auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
});

export const checkScope = (scope: string) => requiredScopes([scope]);