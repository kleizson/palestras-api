
# palestras-api

  

Esta api é tem o objetivo de organizar horários de palestras recebidas via txt.

  

## Começando

  

Para executar o projeto, será necessário instalar os seguintes programas:

  

- [MongoDB: Necessário para criar o banco de dados](https://docs.mongodb.com/manual/administration/install-community/)

- [Node.js 12.18.0 (incluso NPM): Necessário para rodar a api](https://nodejs.org/en/download/)

- [NPM ou Yarn: Necessário para gerenciamento de pacotes do node](https://yarnpkg.com/getting-started/install)

## Desenvolvimento

Para iniciar o desenvolvimento, é necessário clonar o projeto do GitHub num diretório de sua preferência:

```shell
cd "diretorio de sua preferencia"
git clone https://github.com/kleizson/palestras-api
```
### Construção

Para instalar todas as depedências necessárias, executar o comando abaixo:

```shell
npm install
ou
yarn install
```
## Estrutura do projeto

- \__test\__/  __*#pasta onde fica os testes*__
	- coverage/
	- filesTest/
	- integration/
		- palestraController.test.js
		- tracksController.test.js
- src/ __*#pasta onde fica todo o código fonte*__
	- controllers/
		- palestrasController.js
		- tracksController.js
	- database/
		- connection.js
	- models/
		- palestra.js
		- tracks.js
    - index.js
    - routes.js
    - server.js
- .env.example __*#arquivo para preencher as variáveis de ambiente*__
- jest.config.js
## Configuração

Para executar o projeto, é necessário utilizar o banco de dados MongoDB.
Após instalar o MongoDB, você abre o programa chamado "MongoDBCompassCommunity", ao abrir, as configurações por padrão são essas abaixo: 

![Print da tela inicial do MongoDB](https://i.imgur.com/FE2mHST.png)

Deixe as configurações dessa maneira, será mais fácil para fazermos a conexão com o Node. Clique em conectar e pronto! Banco de dados online!
Agora você irá criar um arquivo na raiz do projeto chamado ".env", nele irá ficar as váriaveis de ambiente, dentro do projeto existe um arquivo de exemplo.

![Print do vs code com o arquivo .env.exameplo aberto](https://i.imgur.com/Q5DqJ38.png)

Em DB_URL ficará a url do banco oficial da Api, em DB_URL_TESTE, ficará o banco que usaremos para teste, se você configurou tudo certo até então, a URL do seu banco será igual a essa: mongodb://localhost:27017/{NomeDoBancoDeDados} (sem as chaves)
Coloque o nome que quiser no banco de dados, ele irá ser criado automaticamente.
## Testes

Para rodar os testes, utilize o comando abaixo:

```
npm test
ou
yarn test
```
## Iniciar projeto
Para iniciar o servidor da Api, basta utilizar esse comando abaixo:
```
npm start
ou
yarn start
```
# Endpoints

## Palestras

Enviar arquivo TXT das palestras para upload e cadastramento no Banco de dados

__POST__ ```http://localhost:3333/palestras```


```
// POST http://localhost:3333/palestras

{
  "message": "Upload feito com sucesso! Palestras cadastradas",
  "palestras": [
    {
      "nome": "Diminuindo tempo de execução de testes em aplicações Rails enterprise",
      "duracao": "60",
      "hora": "09:00",
      "day": 1
    },
    {
      "nome": "Trabalho remoto: prós e cons",
      "duracao": "60",
      "hora": "10:00",
      "day": 1
    },
    ....
  ]
}

```
____
Retorna todas as palestras do banco de dados.

__GET__ ```http://localhost:3333/palestras```

```
// GET http://localhost:3333/palestras

{
  "message": "Upload feito com sucesso! Palestras cadastradas",
  "palestras": [
    {
      "nome": "Diminuindo tempo de execução de testes em aplicações Rails enterprise",
      "duracao": "60",
      "hora": "09:00",
      "day": 1
    },
    {
      "nome": "Trabalho remoto: prós e cons",
      "duracao": "60",
      "hora": "10:00",
      "day": 1
    },
    ....
  ]
}

```
____
Retorna a palestra com o Id que foi passado como parâmetro.

__GET__ ```http://localhost:3333/palestras/id```

```
// GET http://localhost:3333/palestras/5ee60e932ceda053d4d54d6f

{
  "palestra": {
    "_id": "5ee60e932ceda053d4d54d6f",
    "nome": "Ruby on Rails: Por que devemos deixá-lo para trás",
    "duracao": "60",
    "hora": "13:00",
    "day": 1,
    "createdAt": "2020-06-14T11:48:35.985Z",
    "__v": 0
  }
}
```
____
Atualiza o nome da palestra com id passado como parâmetro (proibido atualizar hora ou duração).

__PUT__ ```http://localhost:3333/palestras/id```

```
body = {
    nome: "Ruby on Rails: Aprendendo sobre o Framework"
}
```

```
// PUT http://localhost:3333/palestras/5ee60e932ceda053d4d54d6f

{
  "message": "Palestra atualizada com sucesso!",
  "palestra": {
    "_id": "5ee60e932ceda053d4d54d6f",
    "nome": "Ruby on Rails: Aprendendo sobre o Framework",
    "duracao": "60",
    "hora": "13:00",
    "day": 1,
    "createdAt": "2020-06-14T11:48:35.985Z",
    "__v": 0
  }
}
```
____
Deleta a palestra com o id que foi passado como parâmetro.

__DEL__ ```http://localhost:3333/palestras/id```

```
// DEL http://localhost:3333/palestras/5ee60e932ceda053d4d54d6f

{
  "message": "Palestra deletada com sucesso!"
}
```
## Tracks

Retorna todas as tracks com as palestras de cada track.

__GET__ ```http://localhost:3333/tracks```

```
// GET http://localhost:3333/tracks

{
  "tracks": [
    {
      "_id": "5ee60e932ceda053d4d54d6a",
      "track": {
        "track1": [
          {
            "nome": "Diminuindo tempo de execução de testes em aplicações Rails enterprise",
            "duracao": "60",
            "hora": "09:00",
            "day": 1
          },
          {
            "nome": "Trabalho remoto: prós e cons",
            "duracao": "60",
            "hora": "10:00",
            "day": 1
          },
          ....
        ]
      },
      "__v": 0
    },
    {
      "_id": "5ee60e942ceda053d4d54d82",
      "track": {
        "track2": [
          {
            "nome": "Erros comuns em Ruby",
            "duracao": "45",
            "hora": "09:00",
            "day": 2
          },
          {
            "nome": "Desenvolvimento orientado a gambiarras",
            "duracao": "45",
            "hora": "09:45",
            "day": 2
          },
        ....
        ]
      },
      "__v": 0
    }
  ]       
}
```
____
Retorna a track com o Id que foi passado como parâmetro.

__GET__ ```http://localhost:3333/tracks/id```

```
// GET http://localhost:3333/tracks/5ee60e932ceda053d4d54d6a

{
  "track": {
    "_id": "5ee60e932ceda053d4d54d6a",
    "track": {
      "track1": [
        {
          "nome": "Diminuindo tempo de execução de testes em aplicações Rails enterprise",
          "duracao": "60",
          "hora": "09:00",
          "day": 1
        },
        {
          "nome": "Trabalho remoto: prós e cons",
          "duracao": "60",
          "hora": "10:00",
          "day": 1
        },
        ....
      ]
    },
    "__v": 0
  }
}
```
____
Deleta a track com o Id que foi passado como parâmetro

__DEL__ ```http://localhost:3333/tracks/id```

```
// DEL http://localhost:3333/tracks/5ee60e932ceda053d4d54d6a

{
  "message": "track deletada com sucesso!"
}
```
# Erros

## Error 400

Esse erro pode significar:
- Você passou um Id que não existe, tanto para palestras ou para tracks
- Você passou um Id em formato inválido (id em formato não aceito pelo mongoDB)
- Você deu upload em um arquivo que não tem formato suportado
- Você deu upload em um arquivo com formato suportado mas ele estava vazio
- Você não deu upload em arquivo nenhum
- Você tentou atualizar alguma palestra sem passar nenhum body

```
// GET http://localhost:3333/tracks/5ee60e932ceda053d4d54d6a

// Id não existe

{
  "error": {
    "message": "Id da Track não existe!"
  }
}
```
____
## Error 403

Esse erro pode significar:
- Você tentou atualizar algo que era proibido


```
body = {
    hora: "17:00"
}
```

```
// PUT http://localhost:3333/palestras/5ee60e932ceda053d4d54d6f

{
  "error": {
    "message": "Não é permitido editar os horários ou a duração das palestras!"
  }
}
```
___
## Error 500

Esse erro pode significar:
- Algum erro não esperado

Nessa situação, o servidor retorna o Erro em sua forma pura.

```
{
  "error": {
    "message": {Erro do qual o servidor não estava esperando}
  }
}
```

# Considerações

Decidi escolher javascript pois é a linguagem que mais tenho conhecimento programando em Back-end porém, não vejo problema em aprender alguma nova ferramente ou linguagem se for preciso.

# Bibliotecas usadas

- Dependências
  - Express
  - Cors
  - Dotenv
  - Moment
  - Mongoose
  - Multer
- Dependências de desenvolvimento
  - Jest
  - Nodemon
  - SuperTest
  