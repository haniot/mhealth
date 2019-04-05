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
        TITLE: 'Data Acquisition Service',
        APP_DESCRIPTION: 'Micro-service for Data Acquisition.'
    }

    public static readonly ERROR_MESSAGE: any = {
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.',
        PARAMETER_COULD_NOT_BE_UPDATED: 'This parameter could not be updated.',
        PARAMETER_COULD_NOT_BE_UPDATED_DESC: 'The follow parameter could not be updated: '
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
        NOT_FOUND_DESC: 'Measurement not found or already removed. A new operation for the same resource is required.'
    }
}
