import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { Measurement, MeasurementType } from './measurement'
import { BodyFat } from './body.fat'

/**
 * Entity implementation for weight measurements.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<Weight>}
 */
export class Weight extends Measurement implements IJSONSerializable, IJSONDeserializable<Weight> {
    private _body_fat?: BodyFat // Object of body_fat measurement associated with the weight measurement.

    constructor() {
        super()
        super.unit = 'kg'
        super.type = MeasurementType.WEIGHT
    }

    get body_fat(): BodyFat | undefined {
        return this._body_fat
    }

    set body_fat(value: BodyFat | undefined) {
        this._body_fat = value
    }

    public fromJSON(json: any): Weight {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        super.fromJSON(json)
        if (json.id !== undefined) super.id = json.id
        if (json.body_fat !== undefined) {
            this.body_fat = new BodyFat().fromJSON(json)
            this.body_fat.value = json.body_fat
        }

        return this
    }

    public toJSON(): any {
        return {
            ...super.toJSON(),
            body_fat: this.body_fat ? this.body_fat.value : undefined
        }
    }
}
