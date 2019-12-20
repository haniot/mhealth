import { JsonUtils } from '../utils/json.utils'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { HeartRateZoneData } from './heart.rate.zone.data'

/**
 * Implementation of Heart Rate zones model.
 *
 * @implements {IJSONSerializable, IJSONDeserializable<HeartRateZone>}
 */
export class HeartRateZone implements IJSONSerializable, IJSONDeserializable<HeartRateZone> {
    private _fat_burn?: HeartRateZoneData // 'Fat Burn' heart rate zone
    private _cardio?: HeartRateZoneData // 'Cardio' heart rate zone
    private _peak?: HeartRateZoneData  // 'Peak' heart rate zone
    private _out_of_range?: HeartRateZoneData  // 'Out of Range' heart rate zone

    get fat_burn(): HeartRateZoneData | undefined {
        return this._fat_burn
    }

    set fat_burn(value: HeartRateZoneData | undefined) {
        this._fat_burn = value
    }

    get cardio(): HeartRateZoneData | undefined {
        return this._cardio
    }

    set cardio(value: HeartRateZoneData | undefined) {
        this._cardio = value
    }

    get peak(): HeartRateZoneData | undefined {
        return this._peak
    }

    set peak(value: HeartRateZoneData | undefined) {
        this._peak = value
    }

    get out_of_range(): HeartRateZoneData | undefined {
        return this._out_of_range
    }

    set out_of_range(value: HeartRateZoneData | undefined) {
        this._out_of_range = value
    }

    public fromJSON(json: any): HeartRateZone {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.fat_burn !== undefined) this.fat_burn = new HeartRateZoneData().fromJSON(json.fat_burn)
        if (json.cardio !== undefined) this.cardio = new HeartRateZoneData().fromJSON(json.cardio)
        if (json.peak !== undefined) this.peak = new HeartRateZoneData().fromJSON(json.peak)
        if (json.out_of_range !== undefined) this.out_of_range = new HeartRateZoneData().fromJSON(json.out_of_range)

        return this
    }

    public toJSON(): any {
        return {
            fat_burn: this.fat_burn ? this.fat_burn.toJSON() : this.fat_burn,
            cardio: this.cardio ? this.cardio.toJSON() : this.cardio,
            peak: this.peak ? this.peak.toJSON() : this.peak,
            out_of_range: this.out_of_range ? this.out_of_range.toJSON() : this.out_of_range
        }
    }
}
