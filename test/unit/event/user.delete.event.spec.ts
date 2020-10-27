import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { UserDeleteEvent } from '../../../src/application/integration-event/event/user.delete.event'
import { User } from '../../../src/application/domain/model/user'
import { UserType } from '../../../src/application/domain/utils/user.type'

describe('Event: UserDeleteEvent', () => {
    context('construct', () => {
        it('should attributes must have default values', () => {
            const obj = new UserDeleteEvent()
            assert.propertyVal(obj, 'event_name', UserDeleteEvent.NAME)
            assert.propertyVal(obj, 'type', EventType.USER)
            assert.propertyVal(obj, 'timestamp', undefined)
            assert.propertyVal(obj, 'user', undefined)
        })

        it('should attributes must have values passed as parameter', () => {
            for(const user of defaultUsers) {
                let timestamp = new Date()
                let obj = new UserDeleteEvent(timestamp, user)
                assert.propertyVal(obj, 'event_name', UserDeleteEvent.NAME)
                assert.propertyVal(obj, 'type', EventType.USER)
                assert.propertyVal(obj, 'timestamp', timestamp)
                assert.propertyVal(obj, 'user', user)
            }
        })
    })

    context('toJSON', () => {
        it('should return empty object when there is no user attribute', () => {
            const obj = new UserDeleteEvent().toJSON()
            assert.isEmpty(obj)
        })

        it('should return the object with the attributes populated', () => {
            for(const user of defaultUsers) {
                let timestamp = new Date()
                let obj = new UserDeleteEvent(timestamp, user).toJSON()
                assert.propertyVal(obj, 'event_name', UserDeleteEvent.NAME)
                assert.propertyVal(obj, 'type', EventType.USER)
                assert.propertyVal(obj, 'timestamp', timestamp)
                assert.deepEqual(obj.user, user.toJSON())
            }
        })
    })
})

const defaultUsers = [
    new User().fromJSON(
        {
            id: '4cb4862751b5f21ba364b4cb',
            type: UserType.PATIENT
        }
    ),
    new User().fromJSON(
        {
            id: '3bac4862751b5f21ba364b4cf',
            type: UserType.HEALTH_PROFESSIONAL
        }
    )
]
