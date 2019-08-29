import HttpStatus from 'http-status-codes'
import { controller, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import moment from 'moment'
import { inject } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IUserAuthDataService } from '../../application/port/user.auth.data.service.interface'

/**
 * Controller that implements User Fitbit Sync feature operations.
 * @remarks
 * To define paths, we use library inversify-express-utils.
 *
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/v1/users/:user_id/fitbit/sync')
export class UserFitbitSyncController {
    constructor(
        @inject(Identifier.USER_AUTH_DATA_SERVICE) private readonly _userAuthDataService: IUserAuthDataService
    ) {
    }

    /**
     * Request the data sync from user.
     *
     * @returns Promise<Response>
     */
    @httpPost('/')
    public async requestDataSync(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            this._userAuthDataService.syncUserData(req.params.user_id).then()
            return res.status(HttpStatus.ACCEPTED).send({
                status: 'pending',
                completion_estimate: moment().add('5', 'minute').toISOString()
            })
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJson())
        }
    }
}
