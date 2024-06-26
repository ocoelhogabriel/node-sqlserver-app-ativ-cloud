# Node SQL Server Application - Atividade 4 Cloud - Gabriel Oliveira de Sousa Coelho - RA: 10482211337

## Descrição

Esta aplicação é um exemplo simples em Node.js que se conecta a um banco de dados SQL Server, lê e insere dados em uma tabela. A aplicação é empacotada como um contêiner Docker e pode ser facilmente executada em qualquer ambiente compatível com Docker.

## Pré-requisitos

- Docker e Docker Compose instalados.
- Conta no Docker Hub para publicar a imagem do Docker.
- Conta no GitHub para versionar o código.

## Passos para Execução

### 1. Configurar o Ambiente

#### 1.1. Clone o Repositório

Clone o repositório do GitHub para o seu ambiente local.

```bash
git clone https://github.com/seu-usuario/node-sqlserver-app.git
cd node-sqlserver-app
```

#### 1.2. Configurar o Docker Compose

Verifique o arquivo `docker-compose.yml` para garantir que ele esteja configurado corretamente.

```yaml
version: '3.8'
services:
  sqlserver:
    image: mcr.microsoft.com/mssql/server:2019-latest
    container_name: sqlserver-atividadecloud
    environment:
      SA_PASSWORD: 'password@Password'
      ACCEPT_EULA: 'Y'
    ports:
      - "1433:1433"
    volumes:
      - sqlserverdata-atividadecloud:/var/opt/mssql
    networks:
      - sqlserver_network

  app:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - sqlserver
    environment:
      DB_SERVER: sqlserver
      DB_USER: sa
      DB_PASSWORD: 'password@Password'
      DB_NAME: master
      DB_PORT: 1433
    networks:
      - sqlserver_network

networks:
  sqlserver_network:

volumes:
  sqlserverdata-atividadecloud:
```

### 2. Executar o Banco de Dados e a Aplicação

#### 2.1. Subir o Ambiente com Docker Compose

Navegue até o diretório do projeto e execute o comando para subir os containers.

```bash
docker-compose up -d
```

### 3. Criar e Popular o Banco de Dados

#### 3.1. Acessar o Container do SQL Server

Conecte-se ao container SQL Server para criar o banco de dados e a tabela.

```bash
docker exec -it sqlserver-atividadecloud /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'password@Password'
```

#### 3.2. Criar a Tabela e Inserir Dados

No prompt do SQL Server, execute o script para criar a tabela e inserir os dados.

```sql
CREATE DATABASE [data-base];
USE [data-base];

CREATE TABLE tb_Notas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(255),
    descricao NVARCHAR(255)
);

DECLARE @i INT = 1;
WHILE @i <= 10
BEGIN
    INSERT INTO tb_Notas ( nome, descricao)
    VALUES ( CONCAT('Nota ', @i), CONCAT('Descrição da Nota ', @i));
    SET @i = @i + 1;
END
```

### 4. Testar a Aplicação

#### 4.1. Verificar se a Aplicação Está Rodando

Acesse a aplicação no navegador para verificar se está funcionando.

- URL da aplicação: [http://localhost:3000/buscar-notas](http://localhost:3000/buscar-notas)
- Endpoints adicionais:
  - Liveness Check: [http://localhost:3000/liveness](http://localhost:3000/liveness)
  - Readiness Check: [http://localhost:3000/readiness](http://localhost:3000/readiness)

### 5. Publicar no GitHub

#### 5.1. Inicializar o Repositório Git

Inicialize o repositório local e configure o repositório remoto no GitHub.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/seu-usuario/node-sqlserver-app.git
git branch -M main
git push -u origin main
```

### 6. Publicar no Docker Hub

#### 6.1. Construir a Imagem Docker

Construa a imagem Docker e publique no Docker Hub.

```bash
docker build -t seu-usuario/node-sqlserver-app .
docker login
docker tag seu-usuario/node-sqlserver-app:latest seu-usuario/node-sqlserver-app:0.0.1
docker push seu-usuario/node-sqlserver-app:0.0.1
```

### 7. Executar o Job de Inserção de Dados

#### 7.1. Criar um Job no SQL Server Agent (Opcional)

Você pode criar um job no SQL Server Agent para automatizar as inserções, caso deseje.

1. Acesse o SQL Server Management Studio (SSMS).
2. Navegue até SQL Server Agent > Jobs > New Job.
3. Configure o job com um script de inserção similar ao descrito anteriormente.

### 8. Configuração de Rede Docker para Execução em Conjunto

#### 8.1. Criar a Rede Docker

Crie uma rede Docker chamada `sqlserver_network`.

```bash
docker network create sqlserver_network
```

#### 8.2. Rodar o Contêiner SQL Server na Rede

Execute o contêiner SQL Server dentro da rede `sqlserver_network`.

```bash
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=password@Password" \
--network sqlserver_network \
--name sqlserver-atividadecloud-test \
-p 1433:1433 \
-d mcr.microsoft.com/mssql/server:2019-latest
```

#### 8.3. Rodar o Contêiner da Aplicação na Rede

Execute o contêiner da aplicação na mesma rede.

```bash
docker run -e DB_SERVER=sqlserver-atividadecloud-test \
-e DB_USER=sa \
-e DB_PASSWORD=password@Password \
-e DB_NAME=master \
--network sqlserver_network \
--name node-sqlserver-app \
-p 3000:3000 \
-d gcoelhotech/node-sqlserver-app
```

### 9. Baixar e Rodar a Imagem do Docker Hub

#### 9.1. Baixar a Imagem do Docker Hub

Use o comando abaixo para baixar a imagem diretamente do Docker Hub.

```bash
docker pull gcoelhotech/node-sqlserver-app
```

#### 9.2. Executar a Imagem Baixada

Depois de baixar a imagem, você pode executá-la com o comando:

```bash
docker run -e DB_SERVER=sqlserver-atividadecloud-test \
-e DB_USER=sa \
-e DB_PASSWORD=password@Password \
-e DB_NAME=master \
--network sqlserver_network \
--name node-sqlserver-app \
-p 3000:3000 \
-d gcoelhotech/node-sqlserver-app
```

### 10. Solução de Problemas

Se encontrar problemas ao conectar a aplicação ao banco de dados, verifique:

- **Rede Docker**: Certifique-se de que os contêineres estão na mesma rede.
- **Variáveis de Ambiente**: Verifique se as variáveis de ambiente estão configuradas corretamente.
- **Logs de Erro**: Consulte os logs dos contêineres para mais detalhes sobre possíveis erros.

```bash
docker logs node-sqlserver-app
docker logs sqlserver-atividadecloud-test
```

### 11. Conclusão

Com esses passos, você deve ser capaz de configurar, executar e publicar a aplicação. Certifique-se de que o Docker e Docker Compose estão corretamente instalados e configurados em seu ambiente. Caso encontre problemas, verifique os logs dos contêineres para obter mais informações sobre erros e possíveis soluções.

## Links

- **GitHub**: [https://github.com/seu-usuario/node-sqlserver-app](https://github.com/seu-usuario/node-sqlserver-app)
- **Docker Hub**: [https://hub.docker.com/r/seu-usuario/node-sqlserver-app](https://hub.docker.com/r/seu-usuario/node-sqlserver-app)

## Links App

- **GitHub**: [https://github.com/ocoelhogabriel/node-sqlserver-app-ativ-cloud.git](https://github.com/ocoelhogabriel/node-sqlserver-app-ativ-cloud.git)
- **Docker Hub**: [https://hub.docker.com/r/gcoelhotech/node-sqlserver-app](https://hub.docker.com/r/gcoelhotech/node-sqlserver-app)