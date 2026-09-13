const pool=require("../config/db");

const findByEmail=async (email)=>{
    const [rows]=await pool.query(
        "SELECT * FROM users WHERE email=?",
        [email]
    );
    return rows[0];
};

const create=async ({name,email,passwordHash})=>{
    const [result]=await pool.query(
        `INSERT INTO users
        (name,email,password_hash)
        VALUES(?,?,?)`,
        [name,email,passwordHash]
    );

    const [rows]=await pool.query(
        `SELECT id,name,email,created_at
        FROM users
        WHERE id=?`,
        [result.insertId]
    );

    return rows[0];
};

module.exports={
    findByEmail,create
};

