/**
 * @desc: Function is defined to structure the response object
 * @param {*} res : Object
 * @param {*} status : String
 * @param {*} responsebody : Object
 * @param {*} responseMessage : String
 * @returns Object
 */
 const responseHandler = (res, status, responsebody = null, responseMessage = null) => {
	return {
		statusCode: res.statusCode,
		status: status,
		body: responsebody,
		message: responseMessage
	}
}

module.exports = responseHandler