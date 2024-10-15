
/**
 * @enum {ContentType}
 * @description Enum of content Types. Please use them instead of Strings.
 * It will be useful to properly build HTTP requests.
 */
export const enum ContentType {
    JSON= 'application/json',
    URL_ENCODED= 'application/x-www-form-urlencoded',
    FORM_DATA= 'multipart/form-data'
}