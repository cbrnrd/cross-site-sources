// Initialize mongodb

db.getSiblingDB('xss').auth(
    process.env.MONGO_INITDB_ROOT_USERNAME,
    process.env.MONGO_INITDB_ROOT_PASSWORD
);

db.createUser({
    user: 'xss',
    pwd: 'xss',
    roles: [{
        role: 'root',
        db: 'xss'
    }]
});