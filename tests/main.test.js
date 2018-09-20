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
describe('General', () => {
    it('Model has correct table name', () => {
        expect(usersTable.getTableName()).toEqual("users");
    });
    it('Safe Model should be a safe model', () => {
        expect(usersTable.isSafe()).toBeTruthy;
    });
    it('Unsafe Model should be a unsafe model', () => {
        expect(usersUnsafeTable.isSafe()).toBeFalsy;
    });
});
//# sourceMappingURL=main.test.js.map