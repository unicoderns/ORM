////////////////////////////////////////////////////////////////////////////////////////////
// The MIT License (MIT)                                                                  //
//                                                                                        //
// Copyright (C) 2018  Unicoderns S.A. - info@unicoderns.com - unicoderns.com             //
//                                                                                        //
// Permission is hereby granted, free of charge, to any person obtaining a copy           //
// of this software and associated documentation files (the "Software"), to deal          //
// in the Software without restriction, including without limitation the rights           //
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell              //
// copies of the Software, and to permit persons to whom the Software is                  //
// furnished to do so, subject to the following conditions:                               //
//                                                                                        //
// The above copyright notice and this permission notice shall be included in all         //
// copies or substantial portions of the Software.                                        //
//                                                                                        //
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR             //
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,               //
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE            //
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER                 //
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,          //
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE          //
// SOFTWARE.                                                                              //
////////////////////////////////////////////////////////////////////////////////////////////

import { ValidatorUtils } from '../utils/validator'
import { ORMModel } from '../model'
import { Config, ORMModelRow, ORMModelQuery } from '../interfaces'
import { Statement } from './statement'
import { regularQuotes } from '../utils/defaultValues'

/**
 * Model Abstract
 */
export class Insert extends Statement {
    private model: ORMModel
    public config: Config = {} // ToDo: move all config to file
    private validatorUtils: ValidatorUtils
    protected template = 'INSERT INTO <orm_table_name> (<orm_column_names>) VALUES (<orm_value_keys>);'
    protected templateJoin = ''
    protected templateWhere = ''
    protected templateJoinWhere = ''

    /**
     * Set model
     *
     * @param model ORMModel
     * @param config Config
     */
    constructor(model: ORMModel, config: Config) {
        super(config)
        this.model = model
        this.config = config
        this.validatorUtils = new ValidatorUtils(config)
    }

    public process(data: ORMModelRow): any {
        const fields: string[] = []
        const wildcards: string[] = []
        const values: string[] = []
        const valuesObj: any = []

        for (const key in data) {
            const value = typeof data[key] === 'undefined' ? '' : data[key]

            fields.push(key)
            values.push(value)
            valuesObj.push(this.validatorUtils.transform({ fields: this.model.getFields({ all: true }), key, value }))
            wildcards.push(this.strToReplace(key))
        }

        return {
            fields,
            wildcards,
            values,
            valuesObj,
        }
    }
    /**
     * Insert query
     *
     * @var data object to be inserted in the table
     * @return Promise with query result
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public insert(data: ORMModelRow): ORMModelQuery {
        this.paramCursor.restore()

        const processed = this.process(data)

        const query = this.assembling({
            tableName: this.quote(this.model.tableName),
            fields: regularQuotes + processed.fields.join(`${regularQuotes}, ${regularQuotes}`) + regularQuotes,
            values: processed.wildcards.join(', '),
        })

        return this.query({ sql: query, parameters: processed.valuesObj, values: processed.values })
    }
}
