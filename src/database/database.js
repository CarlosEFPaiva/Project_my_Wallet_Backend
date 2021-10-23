import pg from 'pg';
import connectionObject from './ConnectionObject.js';

const { Pool } = pg;
const connection = new Pool(connectionObject);

export default connection;