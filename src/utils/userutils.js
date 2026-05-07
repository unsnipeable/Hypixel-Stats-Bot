const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data", "users.json");

let cache = null;

function load() {
    if (cache) return cache;

    if (!fs.existsSync(FILE_PATH)) {
        fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
        fs.writeFileSync(FILE_PATH, JSON.stringify({}, null, 2));
    }

    const raw = fs.readFileSync(FILE_PATH, "utf-8");
    cache = JSON.parse(raw || "{}");
    return cache;
}

function save() {
    if (!cache) return;
    fs.writeFileSync(FILE_PATH, JSON.stringify(cache, null, 2));
}

function get(userId, key, defaultValue = null) {
    const data = load();

    if (!data[userId]) {
        data[userId] = {};
    }

    if (key === undefined) {
        return data[userId];
    }

    return data[userId][key] ?? defaultValue;
}

function set(userId, key, value) {
    const data = load();

    if (!data[userId]) {
        data[userId] = {};
    }

    data[userId][key] = value;
}

function remove(userId, key) {
    const data = load();
    if (data[userId]) {
        delete data[userId][key];
    }
}

function deleteUser(userId) {
    const data = load();
    delete data[userId];
}

module.exports = {
    get,
    set,
    remove,
    deleteUser,
    save
};