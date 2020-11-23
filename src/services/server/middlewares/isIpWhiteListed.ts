import { RequestHandler } from "express";

const isIpWhiteListed: RequestHandler = (req, res, next) => {
    // TO-DO
    next();
}

export default isIpWhiteListed;