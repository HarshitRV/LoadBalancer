/**
 * This class creates a custom error
 * object that can be used to create
 * custom error messages.
 *
 * @param {string} message
 * @param {string} status
 *
 * @returns {object}
 */
class ServerError extends Error {
	status: number;

	constructor(message: string, status: number) {
		super(message);
		this.message = message;
		this.status = status;
	}
}

module.exports = ServerError;
