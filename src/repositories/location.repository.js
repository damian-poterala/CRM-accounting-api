import pool from '../config/db.js';

export async function findById(id) {
    const [rows] = await pool.query(`
        SELECT id
        FROM client_addresses
        WHERE id = ?
        LIMIT 1
    `, [ id ]);

    return rows[0] || null;
}

export async function getLocations(clientId) {
    const [rows] = await pool.query(`
        SELECT 
            ca.id,
            ca.client_id,
            ca.address_type_id,
            (SELECT display_name FROM dictionaries AS d WHERE d.id = ca.address_type_id LIMIT 1) AS address_type, 
            ca.street,
            ca.building_number,
            ca.apartment_number,
            ca.postal_code,
            ca.city,
            ca.country,
            DATE_FORMAT(ca.created_at, '%Y-%m-%d') AS created_at,
            DATE_FORMAT(ca.updated_at, '%Y-%m-%d') AS updated_at,
            ca.is_active
        FROM client_addresses AS ca
        WHERE client_id = ?
            AND is_active = 1
    `, [ clientId ]); 

    return rows;
}

export async function create(clientId, data) {
    const [result] = await pool.query(`
        INSERT INTO client_addresses (
            client_id,
            address_type_id,
            street,
            building_number,
            apartment_number,
            postal_code,
            city,
            country,
            is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [ clientId, data.addressTypeId, data.street, data.buildingNumber, data.apartmentNumber, data.postalCode, data.city, data.country, 1 ]);

    return result;
}

export async function update(locationId, data) {
    const [result] = await pool.query(`
        UPDATE client_addresses
        SET address_type_id = ?,
            street = ?,
            building_number = ?,
            apartment_number = ?,
            postal_code = ?,
            city = ?,
            country = ?
        WHERE id = ?
        LIMIT 1
    `, [ data.addressTypeId, data.street, data.buildingNumber, data.apartmentNumber, data.postalCode, data.city, data.country, locationId ]); 
}

export async function remove(id) {
    const [result] = await pool.query(`
        UPDATE client_addresses
        SET is_active = 0
        WHERE id = ?
    `, [ id ]);
    
    return result;
}

