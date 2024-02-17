import { afterAll, beforeAll, it, describe, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    // execSync: Permite que a gente rode comandos no terminal
    // Aqui eu quero apagar o banco e depois rodar as migrations novamente p/ ter um banco limpo
    execSync('yarn run knex migrate:rollback')
    execSync('yarn run knex migrate:latest')
  })

  it('Should be able to create a new transaciton', async () => {
    await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })
      .expect(201)
  })

  it('Should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-cookie')

    await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)
  })

  it('Should be able to list all transactions with the correct data', async () => {
    const createTransactionsResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })

    const cookies = createTransactionsResponse.get('Set-cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New transaction',
        amount: 4000,
      }),
    ])
  })

  it('Should be able to get a specific transaction by id', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-cookie')

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    const { id } = listTransactionsResponse.body.transactions[0]

    await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies)
      .expect(200)
  })

  it('Should be able to get the summary', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New transaction',
        amount: 4000,
        type: 'credit',
      })

    await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 2000,
      type: 'debit',
    })

    const cookies = createTransactionResponse.get('Set-cookie')

    await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200)
  })

  it('Should be able to get the coorect amout on summary is requested', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Credit transaction',
        amount: 4000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-cookie')

    await request(app.server)
      .post('/transactions')
      .set('Cookie', cookies)
      .send({
        title: 'Debit transaction',
        amount: 2000,
        type: 'debit',
      })

    const summaryResponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)

    console.log(summaryResponse.body.summary)

    expect(summaryResponse.body.summary).toEqual({
      total_amount: 2000,
    })
  })
})
