/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */

export abstract class Default {
    public static readonly APP_ID: string = 'mhealth.app'
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 4000
    public static readonly PORT_HTTPS: number = 4001
    public static readonly SWAGGER_PATH: string = './src/ui/swagger/api.yaml'
    public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/haniot/mhealth-service/v2/swagger.json'
    public static readonly LOGO_URI: string = 'https://i.imgur.com/O7PxGWQ.png'

    // RabbitMQ
    public static readonly RABBITMQ_URI: string = 'amqp://guest:guest@127.0.0.1:5672'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://127.0.0.1:27017/mhealth-service'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://127.0.0.1:27017/mhealth-service-test'

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '.certs/server.key'
    public static readonly SSL_CERT_PATH: string = '.certs/server.crt'
    public static readonly RABBITMQ_CA_PATH: string = '.certs/ca.crt'

    public static readonly MEASUREMENTS_TYPES: Array<any> = [
        {
            id: 'blood_glucose',
            display_name: 'Blood Glucose'
        },
        {
            id: 'blood_pressure',
            display_name: 'Blood Pressure'
        },
        {
            id: 'body_temperature',
            display_name: 'Body Temperature'
        },
        {
            id: 'body_fat',
            display_name: 'Body Fat'
        },
        {
            id: 'height',
            display_name: 'Height'
        },
        {
            id: 'waist_circumference',
            display_name: 'Waist Circumference'
        },
        {
            id: 'weight',
            display_name: 'Weight'
        }
    ]
}
