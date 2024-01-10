import conexao from '../infra/conexao.js';
import express from 'express';
import moment from 'moment';

const app = express();
const PORT = 3000;

app.use(express.json());


app.get('/clientes', (req, res) => {
    const sql = "SELECT * FROM clientes;"
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
        }else {
            res.status(200).json(resultado)
        }
    })
})

app.post('/clientes', (req, res) => {
    const cliente = req.body
    const sql = "INSERT INTO clientes SET ?;"
    conexao.query(sql, cliente, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        }else {
            // res.status(201).json(resultado)
            res.status(201).json({ "message": `Cliente ${cliente.nome} cadastrado com sucesso!`, "cliente": cliente })
        }
    })
});

app.get('/agendamentos', (req, res) => {
    const sql = "SELECT * FROM agendamentos;"
    conexao.query(sql, (erro, resultado) => {
        if (erro) {
            console.log(erro)
        }else {
            res.status(200).json(resultado)
        }
    })
})

app.post('/agendamentos', (req, res) => {const agendamento = req.body
    agendamento.data = moment(agendamento.data).locale("pt-br").format("L")
    const sql = "SELECT * FROM clientes WHERE id = ?;"
    conexao.query(sql, agendamento.id_cliente, (erro, resultado) => {
        if (erro) {
            res.status(400).json({ 'erro': erro })
        }else {
            const sqlCommand = "INSERT INTO agendamentos SET ?;"
            conexao.query(sqlCommand, agendamento, (erro, resultado) => {
                if (erro) {
                    res.status(400).json({ "erro": erro })
                }else {
                    res.status(201).json({ "message": "agendamento cadastrado com sucesso!", "agendamento": agendamento })
                }
            })
        }
    })
});


// Fazer a conexão
conexao.connect((erro) => {
    if (erro) {
        console.log(erro)
    }else {
        console.log("Conexão realizada com sucesso")

        app.listen(PORT, () => {
            console.log(`Servidor rodando no endereço: http://localhost:${PORT}`);
        })
    }
})