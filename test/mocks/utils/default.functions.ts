/**
 * Class with some functions that are used in more than one mock class.
 */
export class DefaultFunctions {
    /**
     * Randomly generates a valid 24-byte hex ID.
     *
     * @return {string}
     */
    public static generateObjectId(): string {
        const chars = 'abcdef0123456789'
        let randS = ''
        for (let i = 0; i < 24; i++) {
            randS += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return randS
    }

    /**
     * Builds the date in format YYYY-MM-dd.
     *
     * @param dateString Date used to construct the final date.
     * @return {string}
     */
    public static generateSimpleDate(dateString: string): string {
        const date = new Date(dateString)
        return [
            date.getFullYear().toString(),
            (date.getMonth() + 1).toString().padStart(2, '0'),
            date.getDate().toString().padStart(2, '0')
        ].join('-')
    }
}
