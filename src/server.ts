/**
 * Node Modules
 */
import express, { Express, NextFunction, Request, Response } from "express";
import { createServer } from "http";

/**
 * Utils
 */
import { getLoadStats } from "./servercom/getLoadStats.js";
import { isAllServerBusy } from "./servercom/isAllServerBusy.js";
import catchAsync from "./utils/catchAsyncErr.js";

/**
 * Types
 */
import { Server, ServerArray } from "./types/types.js";

const app: Express = express();

const PORT: string | number = process.env.PORT || 3000;

const servers: ServerArray = [
	{ url: "http://localhost:3001", weight: 3 },
	{ url: "http://localhost:3002", weight: 2 },
	{ url: "http://localhost:3003", weight: 1 },
];
const weights: number[] = servers.map((server) => server.weight);

let currentServer = 0;

const changeServer = (server: Server) => {
	// reset current server weight and move on to next server
	server.weight = weights[currentServer];
	currentServer = (currentServer + 1) % servers.length;
};

// Weighted round-robin load balancing
app.route("/").get(
	catchAsync(async (req: Request, res: Response) => {
		console.log(`request served by ${servers[currentServer].url} ⚙️`);
		console.log(servers);
		const server: Server = servers[currentServer];

		// get load stats from server
		const load = await getLoadStats(server.url);

		if (load === -1) {
			console.log(`server at ${server.url} is down 🔻`);
			changeServer(server);
			return res.redirect("/");
		}
		// if load.activeUsers === load.maxLoad, then try next server
		else if (load.activeUsers === load.maxLoad) {
			console.log(`server at ${server.url} is at max load 🔻`);
			// if one server is at max load, then check if we have any server available
			// if none of the server are available, then response with 503 service unavailable
			if (await isAllServerBusy(servers)) {
				console.log("All servers are at max load 🔻");
				return res.status(503).send({
					msg: "All servers are at max load, please try again later 🚧",
				});
			}
			changeServer(server);
			return res.redirect("/");
		}

		res.redirect(server.url);
		server.weight--;
		if (server.weight === 0) {
			console.log(`Resetting weight for ${currentServer} 🔄 and moving on to next server`);
			server.weight = weights[currentServer];
			currentServer = (currentServer + 1) % servers.length;
		}
	})
);

/**
 * Health check route.
 */
app.route("/health").get((req: Request, res: Response) => {
	res.status(200).send({
		msg: `load balancer serving on port ${PORT}`,
	});
});

/**
 * Default error handling middleware.
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	const { status = 500, message = "Something went wrong", stack } = err;
	console.log(err);
	res.status(status).send({ err, message, stack });
});

app.listen(PORT, () => {
	console.log(`load balancer serving on port ${PORT} 🚀`);
});
