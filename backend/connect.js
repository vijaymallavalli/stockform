import mysql2 from 'mysql2';
import twilio from 'twilio';


export const db = mysql2.createConnection({
    host: "localhost",
    user: "root",
    password: "vijay",
    database: "mart"
});

const accountSid = 'ACcf2e967a1dd66ef049f1ae2902611c37';
const authToken = 'b79972542d67770aef1123071c600bec';
const client = twilio(accountSid, authToken);

export { client };
