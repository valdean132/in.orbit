
![Logo](https://github.com/valdean132/in.orbit/blob/main/web/src/assets/logo-in-orbit.svg)


# In.orbit

NLW Pocket: Javascript - Full-stack Intermediário

Essa aplicação foi desenvolvida durante o NLW Pocket: Javascript - Full-stack Intermediário da Rocketseat utilizando no ***Back-end*** o NodeJs, TypeScript, Fastify como framework, integração do DrizzleORM + PostgreSQL, Docker e Zod para validação de dados e no ***Front-end*** o ReactJS, Typescript, tooling com Vite, TailwindCSS, consumo de API Node.js, gerenciamento de dados assíncronos com TanStack Query.
## Stack utilizada

**Front-end:** React, TypeScript, Tooling com Vite, TailwindCSS, TanStack

**Back-end:** Node, TypeScript, Fastify, DrizzleORM, PostgreSQL, Docker, ZOD


## Rodando localmente

Clone o projeto

```bash
  git clone https://github.com/valdean132/in.orbit
```

Entre no diretório do projeto, pastar SERVER, rodar o BACK-END

```bash
  cd server
```

Instale as dependências

```bash
  npm i
```

Com o Docker instalado - Inicie O Banco de dados com o Docker

```bash
  docker compese up -d
```

Para verificar se está Ok

```bash
  docker ps
```

Criar as migrações das tabelas rodando o comando:

```bash
  npx drizzle-kit generate
```

Criar as tabelas rodando o comando:

```bash
  npx drizzle-kit migrate
```

Visualizar as tabelas:

```bash
  npx drizzle-kit studio
```

Inicie o servidor

```bash
  npm run dev
```


Entre no diretório do projeto, pastar WEB, rodar o FRONT-END

```bash
  cd web
```

Instale as dependências

```bash
  npm i
```

Inicie o servidor

```bash
  npm run dev
```

Entre para visualizar:

```bash
  http://localhost:5173
```


## Rodando os testes

Para rodar os testes, rode o seguinte comando:

***Rodar na PASTA server***

```bash
  npm run seed
```

Esse comando gera uma base de dados fictícios.



## Autores

- [@RocketSeat](https://github.com/rocketseat-education)
- [@Valdean132](https://github.com/valdean132/)


## Licença

[MIT](https://choosealicense.com/licenses/mit/)

