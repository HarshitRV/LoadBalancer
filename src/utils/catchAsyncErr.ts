import { NextFunction, Request, Response } from "express";

/**
 * @description This function is uses to handle the async errors.
 * @param {async function} f - The async function
 * @returns {function} - The middleware function
 */
const catchAsync = (f: any) => {
	return function (req: Request, res: Response, next: NextFunction) {
		f(req, res, next).catch((e: any) => next(e));
	};
};

export default catchAsync;
