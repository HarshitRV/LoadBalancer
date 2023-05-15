import express, { Express, Request, Response } from "express";
import { createServer } from "http";

import { sayHello } from "./utils/utils.js";


const app: Express = express();

const PORT: String | Number = process.env.PORT || 3000;

const servers = [
	{ url: "http://localhost:3001", weight: 3 },
	{ url: "http://localhost:3002", weight: 2 },
	{ url: "http://localhost:3003", weight: 1 },
];
const weights = servers.map((server) => server.weight);

let currentServer = 0;

// weighted round-robin load balancing algorithm
app.route("/").get((req, res) => {
	console.log(
		`request served by ${servers[currentServer].url} with pid ${process.pid} ⚙️`
	);
	const server = servers[currentServer];
	res.redirect(server.url);
	server.weight--;
	if (server.weight === 0) {
		console.log(currentServer);
		server.weight = weights[currentServer];
		currentServer = (currentServer + 1) % servers.length;
	}
});

app.route("/health").get((req: Request, res: Response) => {
	res.status(200).send({
		msg: `load balancer serving on port ${PORT}`,
	});
});

app.listen(PORT, () => {
	console.log(`load balancer serving on port ${PORT} 🚀`);
});
