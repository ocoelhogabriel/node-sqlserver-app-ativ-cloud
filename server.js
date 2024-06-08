const express = require("express");
const bodyParser = require("body-parser");
const { poolPromise, sql } = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Função para criar a tabela se não existir
async function createTable() {
  try {
    const pool = await poolPromise;
    const request = pool.request();
    const query = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tb_Notas' and xtype='U')
      CREATE TABLE tb_Notas (
        id INT IDENTITY(1,1) PRIMARY KEY,
        nome NVARCHAR(255),
        descricao NVARCHAR(255)
      )
    `;
    await request.query(query);
    console.log("Table tb_Notas is ready.");
  } catch (err) {
    console.error("Error creating table:", err);
  }
}

// Chama a função para criar a tabela
createTable();

// Rota para criar uma nova nota
app.post("/notas", async (req, res) => {
  const { nome, descricao } = req.body;
  try {
    const pool = await poolPromise;
    const request = pool.request();
    await request
      .input("nome", sql.NVarChar, nome)
      .input("descricao", sql.NVarChar, descricao)
      .query("INSERT INTO tb_Notas (nome, descricao) VALUES (@nome, @descricao)");
    res.status(201).send("Nota criada com sucesso");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao inserir nota");
  }
});

// Rota para obter todas as notas
app.get("/buscar-notas", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM tb_Notas");
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao obter notas");
  }
});

// Rota para obter uma nota pelo ID
app.get("/notas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM tb_Notas WHERE id = @id");
    if (result.recordset.length === 0) {
      res.status(404).send("Nota não encontrada");
    } else {
      res.status(200).json(result.recordset[0]);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao obter nota");
  }
});

// Rota para atualizar uma nota pelo ID
app.put("/notas/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, descricao } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .input("nome", sql.NVarChar, nome)
      .input("descricao", sql.NVarChar, descricao)
      .query("UPDATE tb_Notas SET nome = @nome, descricao = @descricao WHERE id = @id");
    res.status(200).send("Nota atualizada com sucesso");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao atualizar nota");
  }
});

// Rota para deletar uma nota pelo ID
app.delete("/notas/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM tb_Notas WHERE id = @id");
    res.status(200).send("Nota deletada com sucesso");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro ao deletar nota");
  }
});

// Rota de Liveness
app.get("/liveness", (req, res) => {
  res.status(200).send("Liveness Check OK");
});

// Rota de Readiness
app.get("/readiness", async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request().query("SELECT 1");
    res.status(200).send("Readiness Check OK");
  } catch (err) {
    res.status(500).send("Readiness Check Failed");
  }
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
