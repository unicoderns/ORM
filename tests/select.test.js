"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const users = __importStar(require("./dummy/usersModel"));
const connection_1 = require("../connection");
/**
 * Starting mock system
 */
let db = new connection_1.DB({
    dev: true, connection: {
        "user": "apiUser",
        "password": "password",
        "database": "apiDB",
        "port": 3306,
        "host": "localhost",
        "connectionLimit": 10,
        "validations": {
            "fields": true
        }
    }
});
let usersTable;
let usersUnsafeTable;
beforeAll(done => {
    usersTable = new users.Users(db);
    usersUnsafeTable = new users.Users(db, "unsafe");
    done();
});
describe('Get general', () => {
    it('Simple with empty fields array', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: []
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple unsafe', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active`, `users`.`password`, `users`.`added_salt` FROM `users`;',
            values: []
        };
        usersUnsafeTable.returnQuery().getAll({
            fields: []
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get all', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"]
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ?;',
            values: [3]
        };
        usersTable.returnQuery().getAll({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get Some', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('Simple without limit', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users`;',
            values: []
        };
        usersTable.returnQuery().getSome({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            where: {
                id: 3
            },
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 3;',
            values: []
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 3;',
            values: [3]
        };
        usersTable.returnQuery().getSome({
            fields: ["created", "email"],
            where: {
                id: 3
            },
            limit: 3
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
describe('Get one', () => {
    it('Simple', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({}).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With where', () => {
        var expected = {
            sql: 'SELECT `users`.`id`, `users`.`created`, `users`.`username`, `users`.`email`, `users`.`first_name`, `users`.`last_name`, `users`.`admin`, `users`.`verified`, `users`.`active` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` LIMIT 1;',
            values: []
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"]
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
    it('With fields and where', () => {
        var expected = {
            sql: 'SELECT `users`.`created`, `users`.`email` FROM `users` WHERE `users`.`id` = ? LIMIT 1;',
            values: [3]
        };
        usersTable.returnQuery().get({
            fields: ["created", "email"],
            where: {
                id: 3
            }
        }).then((query) => {
            expect(query).toEqual(expected);
        }).catch((err) => {
            console.error(err);
        });
    });
});
//# sourceMappingURL=select.test.js.map