import { RequestHandler } from "express";

const isAdmin: RequestHandler = (req, res, next) => {
    // TO-DO
    next();
}

export default isAdmin;