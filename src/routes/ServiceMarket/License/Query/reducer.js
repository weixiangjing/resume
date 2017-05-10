/**
 *  created by yaojun on 17/3/3
 *
 */



"use strict";
import {alterLicense} from '../../../../model/Lisence';
const Immutable           = require('immutable');
export const handler      = {}
export const initialState = () => Immutable.fromJS({});

    

export function toggleStatus(license){
    return alterLicense({
        license_codes:license.license_code,
        update_desc:license.license_status==2?"冻结":"解冻",
        update_type:license.license_status==2?2:3
    })
}