/**
 * Servercom Import
 */
import { getLoadStats } from "./getLoadStats.js";

/**
 * Types
 */
import { ServerArray } from "../types/types.js";

/**
 * @description This function is used to check if all the servers are busy.
 * @param servers : ServerArray
 * @returns : Promise<boolean>
 */
export const isAllServerBusy = async (
	servers: ServerArray
): Promise<boolean> => {
	for (const server of servers) {
		let load;
		try {
			load = await getLoadStats(server.url);
		} catch (error) {
			console.log("Error in isAllServerBusy.ts: ", error);
			continue;
		}
		if (load.activeUsers !== load.maxLoad) {
			return false;
		}
	}
	return true;
};
