const request = require("supertest");
const mongoose = require("../../src/database/connectionTeste");
const palestraModel = require("../../src/models/palestra");

const app = require("../../src/index");

const arquivoCorreto = `${__dirname}../../filesTest/arquivo-correto.txt`;
const arquivoInvalido = `${__dirname}../../filesTest/arquivo-invalido.pdf`;
const arquivoVazio = `${__dirname}../../filesTest/arquivo-vazio.txt`;

// array com todos os resultados esperados da saida da rota de metodo POST e endpoint /palestras
const result = [
  {
    nome:
      "Diminuindo tempo de execução de testes em aplicações Rails enterprise",
    duracao: "60",
    hora: "09:00",
    day: 1,
  },
  {
    nome: "Trabalho remoto: prós e cons",
    duracao: "60",
    hora: "10:00",
    day: 1,
  },
  {
    nome: "A mágica do Rails: como ser mais produtivo",
    duracao: "60",
    hora: "11:00",
    day: 1,
  },
  {
    nome: "Almoço",
    duracao: "60",
    hora: "12:00",
    day: 1,
  },
  {
    nome: "Ruby on Rails: Por que devemos deixá-lo para trás",
    duracao: "60",
    hora: "13:00",
    day: 1,
  },
  {
    nome: "Manutenção de aplicações legadas em Ruby on Rails",
    duracao: "60",
    hora: "14:00",
    day: 1,
  },
  {
    nome: "Reinventando a roda em ASP clássico",
    duracao: "45",
    hora: "15:00",
    day: 1,
  },
  {
    nome: "Erros de Ruby oriundos de versões erradas de gems",
    duracao: "45",
    hora: "15:45",
    day: 1,
  },
  {
    nome: "Evento de Networking",
    hora: "16:30",
    day: 1,
  },
  {
    nome: "Erros comuns em Ruby",
    duracao: "45",
    hora: "09:00",
    day: 2,
  },
  {
    nome: "Desenvolvimento orientado a gambiarras",
    duracao: "45",
    hora: "09:45",
    day: 2,
  },
  {
    nome: "Programação em par",
    duracao: "45",
    hora: "10:30",
    day: 2,
  },
  {
    nome: "Clojure engoliu Scala: migrando minha aplicação",
    duracao: "45",
    hora: "11:15",
    day: 2,
  },
  {
    nome: "Almoço",
    duracao: "60",
    hora: "12:00",
    day: 2,
  },
  {
    nome: "Apresentando Lua para as massas",
    duracao: "30",
    hora: "13:00",
    day: 2,
  },
  {
    nome: "Aplicações isomórficas: o futuro (que talvez nunca chegaremos)",
    duracao: "30",
    hora: "13:30",
    day: 2,
  },
  {
    nome: "Codifique menos, Escreva mais!",
    duracao: "30",
    hora: "14:00",
    day: 2,
  },
  {
    nome: "Ensinando programação nas grotas de Maceió",
    duracao: "30",
    hora: "14:30",
    day: 2,
  },
  {
    nome: "Ruby vs. Clojure para desenvolvimento backend",
    duracao: "30",
    hora: "15:00",
    day: 2,
  },
  {
    nome: "Um mundo sem StackOverflow",
    duracao: "30",
    hora: "15:30",
    day: 2,
  },
  {
    nome: "Otimizando CSS em aplicações Rails",
    duracao: "30",
    hora: "16:00",
    day: 2,
  },
  {
    nome: "Rails para usuários de Django lightning",
    duracao: 5,
    hora: "16:30",
    day: 2,
  },
  {
    nome: "Evento de Networking",
    hora: "16:35",
    day: 2,
  },
];

describe("Store do controller, testes de upload e logica da organização dos horarios", () => {
  it("Tem que retornar sucesso do envio do arquivo correto e retornar a lista das palestras organizadas por horario de acordo com as regras colocadas", async () => {
    const response = await request(app)
      .post("/palestras")
      .attach("file", arquivoCorreto);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("palestras", result);
  });

  it("Tem que retornar erro ao não enviar um arquivo", async () => {
    const response = await request(app).post("/palestras").attach("file");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Tem que retornar erro ao enviar um arquivo vazio", async () => {
    const response = await request(app)
      .post("/palestras")
      .attach("file", arquivoVazio);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Tem que retornar erro ao enviar um arquivo de formato diferente de txt", async () => {
    const response = await request(app)
      .post("/palestras")
      .attach("file", arquivoInvalido);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("Index do controller, teste de retorno de dados do banco", () => {
  it("Tem que retornar os dados das palestras no banco de dados", async () => {
    const response = await request(app).get("/palestras");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("palestras");
  });
});

describe("Show do controller, teste de retorno de dados do banco", () => {
  it("Tem que retornar a palestra com o id passado na URL como parametro", async () => {
    // criando uma palestra fake para teste
    const palestra = await palestraModel.create({
      nome: "Testando Api com jest",
      duracao: "60",
      hora: "18:00",
    });
    const response = await request(app).get(`/palestras/${palestra._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("palestra");
  });
});

describe("Update do controller, teste de atualização de dados do banco", () => {
  it("Tem que retornar sucesso ao tentar atualizar uma palestra com Id existente e body existente", async () => {
    // criando uma palestra fake para teste
    const palestra = await palestraModel.create({
      nome: "Testando Api com jest",
      duracao: "60",
      hora: "18:00",
    });
    const response = await request(app).put(`/palestras/${palestra._id}`).send({
      nome: "Palestra de teste",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("palestra");
  });

  it("Tem que retornar erro ao tentar atualizar uma palestra com Id inexistente e body existente", async () => {
    const response = await request(app)
      .put(`/palestras/5ee566d446f59f40304ea5fb`)
      .send({
        nome: "Palestra de teste",
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Tem que retornar erro ao tentar atualizar uma palestra com Id existente e body inexistente", async () => {
    // criando uma palestra fake para teste
    const palestra = await palestraModel.create({
      nome: "Testando Api com jest",
      duracao: "60",
      hora: "18:00",
    });
    const response = await request(app).put(`/palestras/${palestra._id}`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Tem que retornar erro ao tentar atualizar uma palestra com Id inexistente e body inexistente", async () => {
    const response = await request(app).put(
      `/palestras/5ee566d446f59f40304ea5fb`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  it("Tem que retornar erro ao tentar atualizar uma palestra com Id existente e body existente, porém editando o horario ou a duração", async () => {
    // criando uma palestra fake para teste
    const palestra = await palestraModel.create({
      nome: "Testando Api com jest",
      duracao: "60",
      hora: "18:00",
    });
    const response = await request(app).put(`/palestras/${palestra._id}`).send({
      nome: "Palestra de teste",
      duracao: "60",
      hora: "12:00",
    });

    expect(response.status).toBe(403);
    expect(response.body).toHaveProperty("error");
  });
});

describe("Destroy do controller, teste de retirar dados do banco", () => {
  afterAll(() => mongoose.disconnect());

  it("Tem que deletar a palestra com o id passado na URL como parametro", async () => {
    // criando uma palestra fake para teste
    const palestra = await palestraModel.create({
      nome: "Testando Api com jest",
      duracao: "60",
      hora: "18:00",
    });
    const response = await request(app).delete(`/palestras/${palestra._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});
