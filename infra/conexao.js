import mysql from 'mysql'

const conexao = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'admin123',
    database: 'bd_agendamento_pet'
})

export default conexao