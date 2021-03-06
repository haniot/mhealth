/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Strings {
    public static readonly APP: any = {
        TITLE: 'MHealth Service',
        APP_DESCRIPTION: 'RESTFul microservice API responsible for managing health' +
            ' measurements, physical activity and sleep.'
    }

    public static readonly ERROR_MESSAGE: any = {
        REQUEST_BODY_INVALID: 'Unable to process request body!',
        REQUEST_BODY_INVALID_DESC: 'Please verify that the JSON provided in the request body has a valid format and try again.',
        ENDPOINT_NOT_FOUND: 'Endpoint {0} does not found!',
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
        PARAMETER_COULD_NOT_BE_UPDATED: 'This parameter could not be updated.',
        PARAMETER_COULD_NOT_BE_UPDATED_DESC: 'The follow parameter could not be updated: ',
        REQUIRED_FIELDS_NOT_VALID: '{0} are not valid!',
        INVALID_FIELDS: 'One or more request fields are invalid...',
        INVALID_FIELD: '{0} is not valid!',
        POSITIVE_INTEGER: 'The value must be an integer equal to or greater than zero.',
        POSITIVE_NUMBER: 'The value must be a number equal to or greater than zero.',
        INTEGER_GREATER_ZERO: 'The value must be an integer greater than zero.',
        NUMBER_GREATER_ZERO: 'The value must be a number greater than zero.',
        INVALID_STRING: ' must be a string!',
        EMPTY_STRING: ' must have at least one character!',
        REQUIRED_FIELDS: 'Required fields were not provided...',
        REQUIRED_FIELDS_DESC: ' are required!',
        DATE: {
            YEAR_NOT_ALLOWED: 'Date {0} has year not allowed. The year must be greater than 1678 and less than 2261.',
            INVALID_FORMAT: 'Date {0} is not valid!',
            INVALID_FORMAT_DESC: 'Date must be in the format: yyyy-MM-dd',
            INVALID_DATETIME_FORMAT: 'Datetime {0} is not in valid ISO 8601 format.',
            INVALID_DATETIME_FORMAT_DESC: 'Datetime must be in the format: yyyy-MM-ddTHH:mm:ssZ',
            RANGE_INVALID: 'The interval between dates {0} and {1} is invalid!',
            RANGE_INVALID_DESC: 'The end_date parameter can not contain an older date than that the start_date parameter.',
            RANGE_EXCEED_YEAR_DESC: 'The period between the received dates can not exceed 1 year.'
        },
    }

    public static readonly ENUM_VALIDATOR: any = {
        NOT_MAPPED: 'Value not mapped for ',
        NOT_MAPPED_DESC: 'The mapped values are: '
    }

    public static readonly DEVICE: any = {
        NOT_FOUND: 'Device not found!',
        NOT_FOUND_DESC: 'Device not found or already removed. A new operation for the same resource is required.'
    }

    public static readonly MEASUREMENT: any = {
        ALREADY_REGISTERED: 'Measurement is already registered...',
        NOT_FOUND: 'Measurement not found!',
        NOT_FOUND_DESC: 'Measurement not found or already removed. A new operation for the same resource is required.',
        UNIT_ERROR: 'The unit value is not valid for ',
        UNIT_ERROR_DESC: 'According with the SI, the correct unit value is: '
    }

    public static readonly PHYSICAL_ACTIVITY: any = {
        ALREADY_REGISTERED: 'Physical Activity is already registered...',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {physicalactivity_id} is not in valid format!'
    }

    public static readonly SLEEP: any = {
        ALREADY_REGISTERED: 'Sleep is already registered...',
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {sleep_id} is not in valid format!'
    }

    public static readonly PATIENT: any = {
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {patient_id} is not in valid format!'
    }
}
