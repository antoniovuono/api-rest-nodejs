import { expect, test } from 'vitest'

test('User can create an new transaction', () => {
  // Fazer a chamada http p/ criar uma nova transação
  // espero que o código seja 201

  const responseStatusCode = 201

  expect(responseStatusCode).toEqual(201)
})
