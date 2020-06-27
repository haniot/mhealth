import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { DIContainer } from '../../../src/di/di'
import { Default } from '../../../src/utils/default'

const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Home', () => {
    context('GET /v1/measurements/types', () => {
        it('should for status code 200 with object containing the types of measurements', () => {
            return request
                .get('/v1/measurements/types')
                .set('Content-Type', 'application/json')
                .expect(200)
                .then(res => {
                    expect(res.body).to.eql(Default.MEASUREMENTS_TYPES)
                })
        })
    })
})
