
export type TokenType = {
  token: string,
  balance: string
}

export type AccountType = {
  address: string,
  balance: string,
  tokens: TokenType[]
}