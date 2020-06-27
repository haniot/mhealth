import { IService } from './service.interface'
import { Measurement } from '../domain/model/measurement'
import { LastMeasurements } from '../domain/model/last.measurements'

export interface IMeasurementService extends IService<Measurement> {
    /**
     * Add a new Measurement or a list of Measurement.
     *
     * @param item Measurement | Array<Measurement> to insert.
     * @return {Promise<Measurement | any>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    add(item: any | Array<any>): Promise<any>

    /**
     * Removes measurement according to its unique identifier and related patient.
     *
     * @param measurementId PhysicalActivity unique identifier.
     * @param patientId Patient unique identifier.
     * @return {Promise<boolean>}
     * @throws {ValidationException | RepositoryException}
     */
    removeByPatient(measurementId: string, patientId: string): Promise<boolean>

    /**
     * Retrieve LastMeasurements by unique identifier (ID)  and related patient.
     *
     * @param patientId Patient unique identifier.
     * @return {Promise<PhysicalActivity>}
     * @throws {RepositoryException}
     */
    getLast(patientId: string): Promise<LastMeasurements>
}
