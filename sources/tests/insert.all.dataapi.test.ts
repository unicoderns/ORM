/* eslint-disable @typescript-eslint/no-explicit-any */
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

import 'jasmine'

import * as users from './dummy/usersModel'

import { Engines, Drivers } from '../interfaces/config'
import { ORMModelQuery } from '..'

let usersTable: users.Users

beforeAll((done) => {
    usersTable = new users.Users({
        debug: false,
        engine: Engines.PostgreSQL,
        driver: Drivers.DataAPI,
    })
    done()
})

describe('DataAPI', () => {
    describe('Insert', () => {
        it('undefined value should fail', () => {
            try {
                usersTable.insert({ first_name: undefined })
            } catch (error) {
                expect(error).toEqual(new Error('Type transformation for: first_name.'))
            }
        })

        it('undefined field should fail', () => {
            try {
                usersTable.insert({ first_name: '' })
            } catch (error) {
                expect(error).toEqual(new Error('Type transformation for: first_name.'))
            }
        })

        it('1 value', () => {
            const expected = {
                sql: 'INSERT INTO "users" ("firstName") VALUES (:firstName);',
                parameters: [{ name: 'firstName', value: { stringValue: 'Chriss' } }],
            }

            usersTable.insert({ firstName: 'Chriss' }).then((query: ORMModelQuery) => {
                expect(query).toEqual(expected)
            })
        })

        it('2 parameters', () => {
            const expected = {
                sql: 'INSERT INTO "users" ("firstName", "username") VALUES (:firstName, :username);',
                parameters: [
                    { name: 'firstName', value: { stringValue: 'Chriss' } },
                    { name: 'username', value: { stringValue: 'chriss' } },
                ],
            }

            usersTable
                .insert({
                    firstName: 'Chriss',
                    username: 'chriss',
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })

        it('full unsafe parameters', () => {
            const expected = {
                sql:
                    'INSERT INTO "users" ("username", "email", "password", "firstName", "lastName", "admin", "verified", "active") VALUES (:username, :email, :password, :firstName, :lastName, :admin, :verified, :active);',
                parameters: [
                    { name: 'username', value: { stringValue: 'username' } },
                    { name: 'email', value: { stringValue: 'test@unicoderns.com' } },
                    { name: 'password', value: { stringValue: 'hash' } },
                    { name: 'firstName', value: { stringValue: 'Chriss' } },
                    { name: 'lastName', value: { stringValue: 'Mejia' } },
                    { name: 'admin', value: { booleanValue: false } },
                    { name: 'verified', value: { booleanValue: true } },
                    { name: 'active', value: { booleanValue: true } },
                ],
            }

            usersTable
                .insert({
                    username: 'username',
                    email: 'test@unicoderns.com',
                    password: 'hash',
                    firstName: 'Chriss',
                    lastName: 'Mejia',
                    admin: false,
                    verified: true,
                    active: true,
                })
                .then((query: ORMModelQuery) => {
                    expect(query).toEqual(expected)
                })
        })
    })
})
