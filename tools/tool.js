'use strict'

class Response {
    constructor(content, state = 200, message = '') {
        return {
            content,
            state,
            message
        }
    }
}

module.exports = {
    Response
}