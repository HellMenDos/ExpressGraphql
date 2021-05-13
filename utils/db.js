const sequelize = require('../utils/db-connect')

//await sequelize.query("UPDATE `images` SET `rating`=ROUND((RAND() * (1000-500))+500)");

const DB = class {
    static async q(sql) {
        const res = await sequelize.query(sql, {type: sequelize.QueryTypes.SELECT});
        return res;
    }

    static async exec(sql) {
        const res = await sequelize.query(sql);
        return res;
    }

    static async one(sql) {
        const res = await this.q(sql);
        return res[0];
    }

    static async count(table, where = false) {
        const sql = "SELECT count(*)AS `count` FROM `" + table + "` WHERE 1 " + this.parseWhere(where);
        const res = await this.one(sql)
        return res.count;
    }

    static async delete(table, where, limit = []) {
        const sql = "DELETE FROM `" + table + "` WHERE 1 " + this.parseWhere(where) + this.parseLimit(limit);
        await this.exec(sql)
    }

    static async update(table, options, where = false, limit = []) {
        const sql = "UPDATE `" + table + "` SET " + this.parseOptions(options) + " WHERE 1 " + this.parseWhere(where) + this.parseLimit(limit);
        await this.exec(sql)
    }

    static async insert(table, options = {}) {
        const sql = "INSERT INTO `" + table + "` SET " + this.parseOptions(options);
        const res = await this.exec(sql);
        return res;
    }
    static async insertid(table, options = {}) {
        const sql = "INSERT INTO `" + table + "` SET id = NULL, " + this.parseOptions(options);
        const res = await this.exec(sql);
        return res;
    }
    static parseWhere(where) {
        if (where) {
            let whr = "";
            Object.keys(where).forEach(key => {
                whr = whr + " AND `" + key + "`='" + where[key] + "'";
            })
            return whr;
        }
        return "";
    }


    static parseLimit(limit) {
        if (limit.length) {
            if (limit.length == 1) {
                return " LIMIT " + limit[0];
            } else {
                return " LIMIT " + limit[0] + "," + limit[1];
            }
        }
        return "";
    }

    static parseOptions(options) {
        if (options) {
            let opts = [];
            Object.keys(options).forEach(key => {
                opts.push(" `" + key + "`='" + options[key] + "'");
            })
            return opts.join(",");
        }
        return "";
    }
}

module.exports = DB
