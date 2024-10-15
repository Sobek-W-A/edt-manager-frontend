/**
 * @enum {HTTPMethod}
 * @description Enum of HTTP methods. Please use them instead of Strings.
 * It will be useful to properly build HTTP requests.
 */
export const enum HTTPMethod {
    GET     = 'GET',
    POST    = 'POST',
    PUT     = 'PUT',
    DELETE  = 'DELETE',
    PATCH   = 'PATCH'
}