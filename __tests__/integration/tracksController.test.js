const request = require("supertest");
const mongoose = require("../../src/database/connectionTeste");
const tracksModel = require("../../src/models/tracks");

const app = require("../../src/index");

describe("Index do controller, teste de retorno de dados do banco", () => {
  it("Tem que retornar os dados das tracks no banco de dados", async () => {
    // criando uma track fake para teste
    const track = await tracksModel.create({
      track: {
        trackTeste: {
          nome: "Testes automatizados",
          duracao: "60",
          hora: "18:30",
        },
      },
    });
    const response = await request(app).get(`/tracks`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("tracks");
  });
});

describe("Show do controller, teste de retorno de dados do banco", () => {
  it("Tem que retornar a track com o id passado na URL como parametro", async () => {
    // criando uma track fake para teste
    const track = await tracksModel.create({
      track: {
        trackTeste: {
          nome: "Testes automatizados",
          duracao: "60",
          hora: "18:30",
        },
      },
    });
    const response = await request(app).get(`/tracks/${track._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("track");
  });

  it("Tem que retornar erro ao passar Id inexistente", async () => {
    const response = await request(app).get(`/tracks/5ee566d446f59f40304ea5fb`);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});

describe("destroy do controller, teste de retirar dados do banco", () => {
  afterAll(() => mongoose.disconnect());
  it("Tem que deletar a track com o id passado na URL como parametro", async () => {
    // criando uma track fake para teste
    const track = await tracksModel.create({
      track: {
        trackTeste: {
          nome: "Testes automatizados",
          duracao: "60",
          hora: "18:30",
        },
      },
    });
    const response = await request(app).delete(`/tracks/${track._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  it("Tem que retornar erro ao passar Id inexistente", async () => {
    const response = await request(app).delete(
      `/tracks/5ee566d446f59f40304ea5fb`
    );

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });
});
