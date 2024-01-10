import conexao from '../infra/conexao.js';
import express from 'express';
import moment from 'moment';

const app = express();
const PORT = 3000;

app.use(express.json());

const clientes = [];
const agendamentos = [];

app.get('/clientes', (req, res) => {
    // res.status(200).send(clientes)
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
    const {nome, nomepet, endereco, cpf, telefone} = req.body;
    const novoCliente = {nome, nomepet, endereco, cpf, telefone};
    // clientes.push(novoCliente);
    // res.status(201).json({message: 'Cliente adicionado com sucesso', cliente: novoCliente});
    const sql = "INSERT INTO clientes SET ?;"
    conexao.query(sql, novoCliente, (erro, resultado) => {
        if (erro) {
            console.log(erro)
        }else {
            res.status(201).json(resultado)
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
    const {clienteId, data} = req.body;
    const cliente = clientes.find(c => c.id == clienteId);

    if(!cliente){
        return res.status(404).json({message: 'Cliente não encontrado'});
    }

    const novoAgendamento = {clienteId, data: moment(data).locale("pt-br").format("L")};
    agendamentos.push(novoAgendamento);
    res.status(201).json({message: 'Agendamento marcado com sucesso', agendamento: novoAgendamento});
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