/**
 * Class representing a standard API response.
 * @class ApiResponse
 *
 * @param {number} statusCode - HTTP status code associated with the response.
 * @param {any} data - Data to be returned in the response.
 * @param {string} [message="Success"] - Response message (default is "Success").
 */
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode; // HTTP status code associated with the response.
        this.data = data; // Data to be returned in the response.
        this.message = message; // Response message (default is "Success").
        this.success = statusCode < 400; // Indicates if the response is successful based on the status code.
    }
}

export default ApiResponse;
