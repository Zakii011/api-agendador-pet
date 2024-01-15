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

app.post('/agendamentos', (req, res) => {
    const agendamento = req.body
    const where_cpf = "SELECT * FROM clientes WHERE cpf = ?;"
    agendamento.data = moment(agendamento.data).locale("pt-br").format("L")

    conexao.query(where_cpf, agendamento.cpf_cliente, (erro, resultado_cliente) => {
        if (erro) {
            res.status(400).json({ "erro": erro })
        }else if (resultado_cliente.length > 0) {
            const sql_command = "INSERT INTO agendamentos (id_cliente, nome_cliente, data) VALUES (?, ?, ?);"
            conexao.query(sql_command, [resultado_cliente[0]['id'], resultado_cliente[0]['nome'], agendamento.data], (erro, resultado) => {
                if (erro) {
                    res.status(400).json({ "erro": erro })
                }else {
                    res.status(201).json({ "message": "Agendamento cadastrado com sucesso!", "agendamento": agendamento, "cliente": resultado_cliente[0]})
                }
            })
        }
        else {
            res.status(201).json({ "resultado": "Cliente inválido" })
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
