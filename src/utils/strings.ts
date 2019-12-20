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
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
        PARAMETER_COULD_NOT_BE_UPDATED: 'This parameter could not be updated.',
        PARAMETER_COULD_NOT_BE_UPDATED_DESC: 'The follow parameter could not be updated: ',
        INVALID_FIELDS: 'One or more request fields are invalid...',
        INVALID_NUMBER: ' must be a valid number!',
        NEGATIVE_NUMBER: ' can\'t be negative!',
        INVALID_STRING: ' must be a string!',
        EMPTY_STRING: ' must have at least one character!',
        INVALID_DATE: ', is not in valid ISO 8601 format.',
        INVALID_DATE_DESC: 'Date must be in the format: yyyy-MM-dd\'T\'HH:mm:ssZ',
        REQUIRED_FIELDS: 'Required fields were not provided...',
        REQUIRED_FIELDS_DESC: ' are required!'
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
