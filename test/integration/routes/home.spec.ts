import { Container } from 'inversify'
import { DI } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'

const container: Container = DI.getInstance().getContainer()
const app: App = container.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Home', () => {
    describe('GET /', () => {
        context('when want access the home page', () => {
            it('should redirect the user from the reference page', () => {
                return request
                    .get('/')
                    .set('Content-Type', 'application/json')
                    .expect(302)
                    .then(res => {
                        expect(res.body).to.eql({})
                    })
            })
        })
    })
})
