# CNPJá! - Documentação da API


## Índice
<!-- generated with https://ecotrust-canada.github.io/markdown-toc/ -->

### Autorização
  * [Método](#método)
  * [Utilização](#utilização)

### Consulta de CNPJs
> `/companies/{cnpj}`
  * [Objetivo](#objetivo)
  * [Requisição](#requisiçãoo)
    + [Tempo Real e Cache](#tempo-real-e-cache)
    + [Customização da Consulta](#customização-da-consulta)
  * [Retornos Esperados](#retornos-esperados)
    + [OK (200)](#ok-200)
    + [Accepted (202)](#accepted-202)
    + [Bad Request (400)](#bad-request-400)
    + [Unauthorized (401)](#unauthorized-401)
    + [Not Found (404)](#not-found-404)
    + [Too Many Requests (429)](#too-many-requests-429)
    + [Internal Server Error (500)](#internal-server-error-500)
    + [Service Unavailable (503)](#service-unavailable-503)
  * [Tipos de Objeto](#tipos-de-objeto)
    + [Company](#company)
    + [Registration](#registration)
    + [Address](#address)
    + [Legal Nature](#legal-nature)
    + [Simples Nacional](#simples-nacional)
    + [Activity](#activity)
    + [Member](#member)
    + [SINTEGRA](#sintegra)
    + [State Registration](#state-registration)
    + [Role](#role)
    + [Files](#files)
    + [Error](#error)

### Dados do Usuário
> `/me`
  * [Objetivo](#objetivo-1)
  * [Requisição](#requisição-1)
  * [Retornos Esperados](#retornos-esperados-1)
    + [OK (200)](#ok-200-1)

### Histórico de Requisições
> `/me/requests`
  * [Objetivo](#objetivo-2)
  * [Requisição](#requisição-2)
  * [Retornos Esperados](#retornos-esperados-2)
    + [OK (200)](#ok-200-2)
    + [Unauthorized (401)](#unauthorized-401-1)

### Download de Arquivos
> `/files/{file_name}`
  * [Objetivo](#objetivo-3)
  * [Requisição](#requisição-3)
  * [Retornos Esperados](#retornos-esperados-3)
    + [OK (200)](#ok-200-3)
    + [Not Found (404)](#not-found-404-1)



# Autorização

## Método

Todas as rotas de nossa API, com exceção do dowload de arquivos, requerem autorização através de uma Chave Privada.

Esta Chave está vinculada ao e-mail utilizado para criação da conta, e pode ser obtida na página [Minha Conta](https://www.cnpja.com.br/me) de nosso website.

O padrão de caracteres obedece o seguinte formato:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```


## Utilização

Sua chave de API deve ser adicionada na propriedade `Authorization` dos `Headers`.

A maneira de realizar isto é dependente da linguagem e biblioteca que estiver utilizando. 

Refira-se aos exemplos em nosso [Guia Rápido](https://www.cnpja.com.br/docs) ou na pasta [Examples](../examples) deste repositório.

Não preceda a string por nenhum termo como `ApiKey`, `Token` ou `Bearer`.


# Consulta de CNPJs 

> `/companies/{cnpj}`

## Objetivo

Nossa consulta ao CNPJ visa retornar dados das seguintes fontes em uma requisição unificada:
- Receita Federal: Informações institucionais, contato, endereço, atividades e membros.
- Simples Nacional: Opção pelo Simples e SIMEI.
- SINTEGRA: Inscrições estaduais de todas as UFs.
- IBGE: Código do estado e município.


## Requisição

Envie uma requisição `GET` para:

```
https://api.cnpja.com.br/companies/{cnpj}
```

Substitua o parâmetro `{cnpj}` pelos 14 dígitos do CNPJ que deseja consultar.

Não utilize pontos `.`, hífens `-`, ou barras `/`.

Sua Chave de API deve estar presente na propriedade `Authorization` dos `Headers`.


**Exemplos**:

```
CORRETO -> https://api.cnpja.com.br/companies/00000000000191
CORRETO -> https://api.cnpja.com.br/companies/33000167000101

INCORRETO -> https://api.cnpja.com.br/companies/33.000.167/0001-01
INCORRETO -> https://api.cnpja.com.br/companies/33.000.167\/0001-01
INCORRETO -> https://api.cnpja.com.br/companies/33.000.167%2F0001-01
```


### Tempo Real e Cache

Os nossos dados são sensíveis a data e hora irão retornar com uma estampa de tempo UTC de sua aquisição.

Utilizamos os termos a seguir para se referir a sua idade:
- **Tempo Real**: Adquiridos na fonte no mesmo momento em que recebemos a requisição
- **Cache**: Retornados de nosso banco de dados

Por padrão, requisições em Tempo Real, consomem uma quantidade maior de seus créditos em relação as feitas ao Cache.

É possível controlar de maneira inteligente a idade dos dados utilizando parâmetros opcionais a seguir na requisição.


### Customização da Consulta

Através dops parâmetros a seguir você pode configurar a consulta da maneira que melhor o atenda.

Se todos forem omitidos, nossa consulta padrão é:
- Dados da Receita Federal Tempo Real
- Dados do Simples Nacional do Cache
- Dados do SINTEGRA do Cache
- Retorno 5xx em Caso de falhas nas consultas em Tempo Real

Parâmetro | Padrão | Descrição
:-- | :-- | :--
company_max_age | 1 | Idade máxima em dias para retornar dados da empresa do Cache
simples_max_age | null | Idade máxima em dias para retornar dados do Simples do Cache
sintegra_max_age | null | Idade máxima em dias para retornar dados do SINTEGRA
enable_cache_fallback | false | Habilita retorno em Cache no caso de uma requisição em Tempo Real falhar

**Exemplos**:
```
# Consultar CNPJ em Tempo Real e Simples Nacional do Cache:
https://api.cnpja.com.br/companies/00000000000191

# Consultar CNPJ em Tempo Real e Simples Nacional em Tempo Real:
https://api.cnpja.com.br/companies/00000000000191?simples_max_age=1

# Aceitar Cache do CNPJ de até um mês atrás e do Simples de até uma semana:
https://api.cnpja.com.br/companies/00000000000191?company_max_age=30&simples_max_age=7

# Consultar CNPJ em Tempo Real, Simples Nacional em Tempo Real e SINTEGRA em Tempo Real:
https://api.cnpja.com.br/companies/00000000000191?simples_max_age=1&sintegra_max_age=1

# Consultar Simples Nacional em Tempo Real e retornar informação do Cache em caso de falha:
https://api.cnpja.com.br/companies/00000000000191?simples_max_age=1&enable_cache_fallback=true
```

## Retornos Esperados

### OK (200)

Requisição realizada com sucesso.

```
{
  "last_update": "2020-03-19T20:01:43.036Z",
  "name": "PETROLEO BRASILEIRO S A PETROBRAS",
  "alias": "PETROBRAS",
  "tax_id": "33000167000101",
  "type": "MATRIZ",
  "founded": "1966-09-28",
  "size": "DEMAIS",
  "capital": 205431960490.52,
  "email": "ATENDIMENTOFISCOSSCO@PETROBRAS.COM.BR",
  "phone": "(21) 3224-8091/ (21) 3224-4477",
  "federal_entity": "UNIÃO",
  "registration": {
    "status": "ATIVA",
    "status_date": "2005-11-03",
    "status_reason": null,
    "special_status": null,
    "special_status_date": null
  },
  "address": {
    "street": "AV REPUBLICA DO CHILE",
    "number": "65",
    "details": null,
    "zip": "20031170",
    "neighborhood": "CENTRO",
    "city": "RIO DE JANEIRO",
    "state": "RJ",
    "city_ibge": "3304557",
    "state_ibge": "33"
  },
  "legal_nature": {
    "code": "2038",
    "description": "Sociedade de Economia Mista"
  },
  "primary_activity": {
    "code": "1921700",
    "description": "Fabricação de produtos do refino de petróleo"
  },
  "secondary_activities": [
    {
      "code": "0600001",
      "description": "Extração de petróleo e gás natural"
    },
    {
      "code": "3520401",
      "description": "Produção de gás; processamento de gás natural"
    },
    {
      "code": "4681801",
      "description": "Comércio atacadista de álcool carburante, biodiesel, gasolina e demais derivados de petróleo, exceto lubrificantes, não realizado por transportador retalhista (T.R.R.)"
    }
  ],
  "membership": [
    {
      "name": "EBERALDO DE ALMEIDA NETO",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "ROBERTO DA CUNHA CASTELLO BRANCO",
      "role": {
        "code": "16",
        "description": "Presidente"
      }
    },
    {
      "name": "CARLOS ALBERTO PEREIRA DE OLIVEIRA",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "RUDIMAR ANDREIS LORENZATTO",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "ANELISE QUINTAO LARA",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "ANDREA MARQUES DE ALMEIDA",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "ROBERTO FURIAN ARDENGHY",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "MARCELO BARBOSA DE CASTRO ZENKNER",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    },
    {
      "name": "NICOLAS SIMONE",
      "role": {
        "code": "10",
        "description": "Diretor"
      }
    }
  ],
  "files": {
    "registration": "https://api.cnpja.com.br/files/125ede2c-7799-4cf3-9f5b-16ee45c86fa2.pdf"
  },
  "sintegra": {
    "last_update": "2020-03-19T20:01:42.229Z",
    "home_state_registration": "81281882",
    "registrations": [
      {
        "number": "748878600131",
        "state": "DF",
        "enabled": false
      },
      {
        "number": "283058749",
        "state": "MS",
        "enabled": false
      },
      {
        "number": "81281882",
        "state": "RJ",
        "enabled": true
      },
      {
        "number": "240026870",
        "state": "RS",
        "enabled": false
      }
    ]
  },
  "simples_nacional": {
    "last_update": "2020-03-18T22:40:24.000Z",
    "simples_optant": false,
    "simples_included": null,
    "simples_excluded": null,
    "simei_optant": false
  }
}
```

### Accepted (202)

Este status está disponível apenas se habilitado o `enable_cache_fallback`.

Ele indica que alguma consulta em Tempo Real falhou e o dado foi retornado do Cache.

```
{
  // Detalhes sobre o(s) serviço(s) que falharam em Tempo Real
  "errors": [
    {
      "status": 500,
      "service": "sintegra",
      "message": "unexpected server error"
    }
  ],

  // Dados intermediários idem ao Retorno OK (200)
  "last_update": "2020-03-19T20:03:12.000Z",
  "name": "PETROLEO BRASILEIRO S A PETROBRAS",
  "alias": "PETROBRAS",
  "tax_id": "33000167000101",
  ... ,

  // O objeto do serviço que falhou conterá uma estampa de tempo retroativa
  "sintegra": 
    "last_update": "2019-12-31T00:00:00.000Z",
    "home_state_registration": "81281882",
    "registrations": [
      {
        "number": "81281882",
        "state": "RJ",
        "enabled": true
      },
      {
        "number": "748878600131",
        "state": "DF",
        "enabled": false
      },
      {
        "number": "283058749",
        "state": "MS",
        "enabled": false
      },
      {
        "number": "240026870",
        "state": "RS",
        "enabled": false
      }
    ]
  }
}
```


### Bad Request (400)

CNPJ inválido, certifique-se que:
- No parâmetro `cnpj` foi enviado apenas dígitos
- No parâmetro `cnpj` foi enviado 14 dígitos
- Os dígitos obedecem o [algoritmo de CNPJ](https://www.geradorcnpj.com/algoritmo_do_cnpj.htm)

```
{
  "error": 400,
  "message": "parameter validation failed",
  "details": {
    "constraints": [
      "tax_id must be shorter than or equal to 14 characters",
      "tax_id must be a number string"
    ]
  }
}
```


### Unauthorized (401)

Não foi possível autenticar sua requisição, certifique-se que:
- Sua Chave de API está na propriedade `Authorization` dos `Headers`
- Sua chave está no formato correto incluindo hífens `-`

```
{
  "error": 401,
  "message": "invalid api-key",
  "details": { }
}
```


### Not Found (404)

O CNPJ consultado não está registrado na Receita Federal

```
{
  "error": 404,
  "message": "tax id is not registered at revenue service",
  "details": { }
}
```


### Too Many Requests (429)

Este erro será exibido em duas ocasiões:
- Seus créditos acabaram
- Você excedeu o limite de 100 requisições concorrentes

```
{
  "error": 429,
  "message": "not enough credits",
  "details": {
    "credits_required": 16,
    "credits_remaining": 0
  }
}
```


### Internal Server Error (500)

Um erro imprevisto ocorreu em nosso serviço.

Temos um sistema de monitoramento que irá nos alertar sobre o ocorrido e atuaremos sobre o problema imediatamente.

```
{
  "error": 500,
  "message": "unexpected server error",
  "details": { }
}
```

### Service Unavailable (503)

A fonte de dados da consulta em Tempo Real que tentou executar está indisponível.

Você pode previnir que este erro ocorra customizando a consulta com o `enable_cache_fallback`.

```
{
  "error": 503,
  "message": "revenue service is unavailable",
  "details": { }
}
```


## Tipos de Objeto

Cada objeto em nossa API obedece a um dos seguintes tipos.

Nunca realizaremos renomeações ou remoções de propriedades uma vez estabelecidas.

Porém, é possível adicionarmos propriedades aos objetos já existentes, ou criarmos novos.


### Company

Propriedade | Tipo | Descrição
:-- | :-- | :--
last_update | string | Estampa de tempo da última atualização na Receita Federal
name | string | Razão social
alias | string | Nome fantasia
tax_id | string | Número do CNPJ
type | string | Tipo de empresa (MATRIZ ou FILIAL)
founded | string | Data de fundação em formato 'YYYY-MM-DD'
size | string |  Porte da empresa (MEI, ME, EPP ou DEMAIS)
capital | number | Valor declarado do capital social com até duas casas decimais
email | string | E-mail
phone | string | Telefone
federal_entity | string | Ente Federativo Responsável (EFR)
registration | [Registration](#registration) | Infomações da situação cadastral
address | [Address](#address) | Endereço detalhado
legal_nature | [Legal Nature](#legal-nature) | Natureza jurídica
simples_nacional | [Simples Nacional](#simples-nacional) | Dados do Simples Nacional
primary_activity | [Activity](#activity) | Atividade econômica primária
secondary_activities | [Activity](#activity)[ ] | Atividades econômicas secundárias
membership | [Member](#member)[ ] | Quadro de sócios e administradores (QSA)
sintegra | [SINTEGRA](#sintegra) | Dados do SINTEGRA (Inscrição Estadual)
files | [Files](#files) | Arquivos referentes a consulta


### Registration

Propriedade | Tipo | Descrição
:-- | :-- | :--
status | string | Situação cadastral (ATIVA, SUSPENSA, INAPTA, BAIXA ou NULA)
status_date | string | Data da situação cadastral em formato 'YYYY-MM-DD'
status_reason | string | Motivo da situação cadastral
special_status | string | Situação especial
special\_status\_date | string | Data da situação especial em formato 'YYYY-MM-DD'


### Address

Propriedade | Tipo | Descrição
:-- | :-- | :--
street | string | Logradouro
number | string | Número
details | string | Complemento
zip | string | CEP
neighborhood | string | Bairro ou Distrito
city | string | Cidade
city_ibge | string | Código IBGE do município
state | string | Estado
state_ibge | string | Código IBGE da UF


### Legal Nature

Obedece a [Tabela de Natureza Jurídica](http://receita.economia.gov.br/orientacao/tributaria/cadastros/cadastro-nacional-de-pessoas-juridicas-cnpj/tabelas-utilizadas-pelo-programa-cnpj/tabela-de-natureza-juridica-e-qualificacao-do-quadro-de-socios-e-administradores)

Propriedade | Tipo | Descrição
:-- | :-- | :--
code | string | Código de 4 dígitos da natureza jurídica
description | string | Descrição da natureza jurídica


### Simples Nacional

Propriedade | Tipo | Descrição
:-- | :-- | :--
last_update | string | Estampa de tempo da última atualização no Simples Nacional
simples_optant | boolan | Define a opção pelo Simples Nacional
simples_included | string | Data de inclusão no Simples Nacional
simples_excluded | string | Data de exclusão do Simples Nacional
simei_optant | boolan | Define a opção pelo SIMEI


### Activity

Obedece os [Códigos CNAE do IBGE](https://cnae.ibge.gov.br/?view=estrutura&amp;tipo=cnae&amp;versao_classe=7.0.0&amp;versao_subclasse=9.1.0)

Propriedade | Tipo | Descrição
:-- | :-- | :--
code | string | Código de 7 dígitos da atividade econômica
description | string | Descrição da atividade econômica


### Member

Propriedade | Tipo | Descrição
:-- | :-- | :--
name | string | Nome completo do membro
role | [Role](#role) | Qualificação do membro no quadro de sócios e administradores


### SINTEGRA

Propriedade | Tipo | Descrição
:-- | :-- | :--
last_update | string | Estampa de tempo da última atualização no SINTEGRA
home_state_registration | string | I.E. habilitada no estado de origem da empresa
registrations | [State Registration](#state-registration)[ ] | Inscrições Estaduais da empresa


### State Registration

Propriedade | Tipo | Descrição
:-- | :-- | :--
number | string | Número da Inscrição Estadual
state | string | Unidade Federal da inscrição
enabled | boolean | Define se habilitada ou não


### Role

Propriedade | Tipo | Descrição
:-- | :-- | :--
code | string | Código de 2 dígitos da qualificação
description | string | Descrição da qualificação


### Files

Propriedade | Tipo | Descrição
:-- | :-- | :--
registration | string | URL do Comprovante de Inscrição em PDF


### Error

Propriedade | Tipo | Descrição
:-- | :-- | :--
error |  number | Código HTTP do erro
message | string | Breve mensagem sobre o ocorrido
details | object | Detalhes extras sobre o erro


# Dados do Usuário

> `/me`

## Objetivo

Provê informações sobre sua conta, incluindo cadastro, plano e créditos restantes.

## Requisição

Envie uma requisição `GET` para:

```
https://api.cnpja.com.br/me
```

Sua Chave de API deve estar presente na propriedade `Authorization` dos `Headers`.


## Retornos Esperados

### OK (200)

```
{
  "email": "contato@cnpja.com.br",
  "name": "Contato CNPJá",
  "given_name": "Contato",
  "family_name": "CNPJá",
  "nickname": "CNPJá",
  "status": "ACTIVE",
  "remaining_credits": 9321.8,
  "profile_picture": null,
  "plan": {
    "name": "PRO",
    "price": 99,
    "credits": 10000,
    "reffils": "daily"
  }
}
```

# Histórico de Requisições

> `/me/requests`

## Objetivo

Retorna seu histórico de requisições dentro do intervalo de data especificado.

## Requisição

Envie uma requisição `GET` para:

```
https://api.cnpja.com.br/me/requests?start_date={data_inicio}&end_date={data_terminio}
```

Substitua os parâmetros `data_inicio` e `data_termino` pelo intervalo desejado.

O fornecimento das datas e mandatório e deve obedecer o formato `YYYY-MM-DD`.

Sua Chave de API deve estar presente na propriedade `Authorization` dos `Headers`.


## Retornos Esperados

### OK (200)

```
{
  "count": 2,
  "results": [
    {
      "id": 2753,
      "path": "/companies/35565391000176?company_max_age=0",
      "requested": "2020-03-09T09:26:39.000Z",
      "status": 200,
      "time": 8485,
      "cost": 1
    },
    {
      "id": 2755,
      "path": "/companies/07506399000126?company_max_age=0&sintegra_max_age=0",
      "requested": "2020-03-10T01:29:32.000Z",
      "status": 200,
      "time": 11218,
      "cost": 16
    }
  ]
}
```

### Unauthorized (401)

Chave de API incorreta.



# Download de Arquivos

> `/files/{file_name}`

## Objetivo

Esta rota visa expôr uma URL pública e temporária para download de arquivos.

Não requer autenticação através de Chave de API.

## Requisição

Envie uma requisição `GET` para:

```
https://api.cnpja.com.br/files/{files_name}
```

Substitua o parâmetro `{file_name}` pelo UUID do arquivo seguido por sua extensão.

Não é necessário autenticação, você pode utilizar diretamente por um navegador.


## Retornos Esperados

### OK (200)

Será retornado o buffer do arquivo.

### Not Found (404)

O arquivo não existe ou expirou.
