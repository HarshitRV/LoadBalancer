/**
 * Types
 */
import { ServerArray } from "../types/types.js";

export const getLoadStats = async (url: String) => {
	try {
		const response = await fetch(url + "/load");
		const data = await response.json();
		return data;
	} catch (error) {
		console.log(error);
		return -1;
	}
};
