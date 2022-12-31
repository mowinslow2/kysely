import { Kysely, PostgresDialect, } from 'kysely';
import pkg from 'pg';
const { Pool } = pkg;
const db = new Kysely({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: 'postgresql://morgan:u_HWIkgQZ0tIDMGs_tv8Xw@morgan-serverless-6048.7tt.cockroachlabs.cloud:26257/demo?sslmode=verify-full'
        })
    })
});
async function insertUser(user) {
    try {
        const { id } = await db.insertInto('users').values(user).returning('id').executeTakeFirstOrThrow();
        if (id) {
            console.log('User ' + user.name + ' was added with ID ' + id);
            return id;
        }
        else {
            throw new Error('No id returned when adding a user!');
        }
    }
    catch (error) {
        console.log('ERROR: ', error);
        return;
    }
}
async function insertOrder(order) {
    try {
        const { id } = await db.insertInto('orders').values(order).returning('id').executeTakeFirstOrThrow();
        if (id) {
            console.log('Order was added with ID ' + id);
            return id;
        }
        else {
            throw new Error('No id returned when adding an order!');
        }
    }
    catch (error) {
        console.log('ERROR: ', error);
        return;
    }
}
async function getUser(id) {
    try {
        const user = await db.selectFrom('users').select(['name', 'address', 'city']).where('id', '=', id).executeTakeFirst();
        return user;
    }
    catch (error) {
        console.log('ERROR: ', error);
        return;
    }
}
async function getUserOrder(name) {
    const order = await db
        .selectFrom('users')
        .innerJoin('orders', 'orders.user_id', 'users.id')
        .select(['name', 'product_name', 'quantity'])
        .where('name', '=', name)
        .executeTakeFirstOrThrow();
    return order;
}
const name = 'Morgan';
const address = '1234 cockroach way';
const city = 'New York City';
const user = {
    name: name,
    address: address,
    city: city,
    prefix: null
};
const userId = await insertUser(user);
let orderId;
if (userId) {
    const userInfo = await getUser(userId);
    if (userInfo) {
        console.log("Morgan's address is: " + userInfo.address + ', ' + userInfo.city);
    }
    else {
        console.log("No user found with that name!");
    }
    const order = {
        user_id: userId,
        product_name: 'computer',
        quantity: 1
    };
    orderId = await insertOrder(order);
}
if (orderId) {
    const orderInfo = await getUserOrder(name);
    if (orderInfo) {
        console.log("Order Info: " + orderInfo.name + ", " + orderInfo.product_name + ", " + orderInfo.quantity);
    }
}
//# sourceMappingURL=demo.js.map