# CNPJá! - Documentação da API

## Consulta de CNPJs

> `GET /companies/{cnpj}`

- [Objetivo](#objetivo)
- [Requisição](#requisição)
- [Autorização](#autorização)
- [Tempo Real e Cache](#tempo-real-e-cache)
- [Parâmetros Opcionais](#parâmetros-opcionais)
- [Retornos Esperados](#retornos-esperados)
  - [OK (200)](#ok-200)
  - [Bad Request (400)](#bad-request-400)
  - [Unauthorized (401)](#unauthorized-401)
  - [Not Found (404)](#not-found-404)
  - [Too Many Requests (429)](#too-many-requests-429)
  - [Internal Server Error (500)](#internal-server-error-500)
- [Tipos de Objeto](#tipos-de-objeto)
  - [Company](#company)
  - [Registration](#registration)
  - [Address](#address)
  - [Legal Nature](#legal-nature)
  - [Simples Nacional](#simples-nacional)
  - [Activity](#activity)
  - [Member](#member)
  - [Role](#role)
  - [Files](#files)
  - [Error](#error)

## Download de Arquivos

> `GET /files/{file_name}`

- [Objetivo](#objetivo)
- [Requisição](#requisição)
- [Retornos Esperados](#retornos-esperados)
  - [OK (200)](#ok-200)
  - [Not Found (404)](#not-found-404)

# Consulta de CNPJs 

## Objetivo

Nossa consulta ao CNPJ visa retornar dados das seguintes fontes em uma requisição unificada:
- Receita Federal
- Simples Nacional
- IBGE (municípios)


## Requisição

Envie uma requisição `GET` para:

```
https://api.cnpja.com.br/companies/{cnpj}
```

Substitua o parâmetro `{cnpj}` pelos 14 dígitos do CNPJ que deseja consultar.

Não utilize pontos `.`, hífens `-`, ou barras `/`.


**Exemplos**:

```
CORRETO -> https://api.cnpja.com.br/companies/00000000000191
CORRETO -> https://api.cnpja.com.br/companies/33000167000101

INCORRETO -> https://api.cnpja.com.br/companies/33.000.167/0001-01
INCORRETO -> https://api.cnpja.com.br/companies/33.000.167\/0001-01
INCORRETO -> https://api.cnpja.com.br/companies/33.000.167%2F0001-01
```


### Autorização

Sua Chave de API é encontrada na página [Minha Conta](https://www.cnpja.com.br/account/me), e obedece o seguinte padrão de caracteres:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

É mandatório adicioná-la na propriedade `Authorization` dos `Headers`, consulte nossos [Exemplos](../examples) para entender como fazer na linguagem de sua preferência.

**Exemplos**:

```
CORRETO -> Authorization: 30af521b-197d-42ec-99a0-e598c9586418-414f5148-c544-4f84-a7d6-06e164a46636

INCORRETO -> Authorization: 30af521b197d42ec99a0e598c9586418414f5148c5444f84a7d606e164a46636
INCORRETO -> Authorization: ApiKey 30af521b-197d-42ec-99a0-e598c9586418-414f5148-c544-4f84-a7d6-06e164a46636
```


### Tempo Real e Cache

Os nossos dados sensíveis a data e hora irão retornar com uma estampa de tempo de sua aquisição.

Utilizamos os termos a seguir para se referir a sua idade:
- **Tempo Real**: Adquiridos na Receita Federal ou Simples Nacional no mesmo momento em que recebemos a requisição
- **Cache**: Retornados de nosso banco de dados

Por padrão, requisições em Tempo Real, consomem uma quantidade maior de seus créditos em relação as feitas ao Cache.

É possível controlar de maneira inteligente a idade dos dados utilizando parâmetros opcionais a seguir na requisição.


### Parâmetros Opcionais

Utilize os parâmetros a seguir para configurar a consulta da maneira que melhor o atenda.

Se todos forem omitidos, nossa consulta padrão é:
- Dados da inscrição no CNPJ em Tempo Real
- Dados do Simples Nacional do Cache

Parâmetro | Padrão | Descrição
:-- | :-- | :--
company_max_age | 1 | Idade máxima em dias para retornar dados da empresa do Cache
simples_max_age | null | Idade máxima em dias para retornar dados do Simples do Cache

**Exemplos**:
```
# Consultar CNPJ em Tempo Real e Simples Nacional do Cache:
https://api.cnpja.com.br/companies/00000000000191

# Consultar CNPJ em Tempo Real e Simples Nacional em Tempo Real:
https://api.cnpja.com.br/companies/00000000000191?simples_max_age=1

# Aceitar Cache do CNPJ de até um mês atrás e do Simples de até uma semana:
https://api.cnpja.com.br/companies/00000000000191?company_max_age=30&simples_max_age=7
```

## Retornos Esperados

### OK (200)

Requisição realizada com sucesso.

```
{
  "last_update": "2020-02-26T23:52:50.000Z",
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
    "city_ibge": "3304557",
    "state": "RJ",
    "state_ibge": "33"
  },
  "legal_nature": {
    "code": "2038",
    "description": "Sociedade de Economia Mista"
  },
  "simples_nacional": {
    "simples_optant": false,
    "simples_included": null,
    "simples_excluded": null,
    "simei_optant": false
  },
  "primary_activity": {
    "code": "1921700",
    "description": "Fabricação de produtos do refino de petróleo"
  },
  "secondary_activities": [
    {
      "code": "4681801",
      "description": "Comércio atacadista de álcool carburante, biodiesel, gasolina e demais derivados de petróleo, exceto lubrificantes, não realizado por transportador retalhista (T.R.R.)"
    },
    {
      "code": "0600001",
      "description": "Extração de petróleo e gás natural"
    },
    {
      "code": "3520401",
      "description": "Produção de gás; processamento de gás natural"
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
    "registration": "https://api.cnpja.com.br/files/6bd4911b-b841-41c7-ba7b-b51ab2839751.pdf"
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
  "message": "invalid tax id",
  "details": [
    {
      "tax_id": "12345678901234"
    }
  ]
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
  "details": []
}
```


### Not Found (404)

O CNPJ consultado não está registrado na Receita Federal

```
{
  "error": 404,
  "message": "tax id is not registered at revenue service",
  "details": [
    {
      "taxId": "00000000000000"
    }
  ]
}
```


### Too Many Requests (429)

Este erro será exibido em duas ocasiões:
- Foi excedido o limite de consultas diário
- Foi excedido o limite de consultas por minuto (plano FREE)

```
{
  "error": 429,
  "message": "rate limit exceeded",
  "details": [
    {
      "constraint": "exceeded minute limit of 10"
    }
  ]
}
```


### Internal Server Error (500)

Um erro imprevisto ocorreu em nosso serviço.

Temos um sistema de monitoramento que irá nos alertar sobre o ocorrido e atuaremos sobre o problema imediatamente.

```
{
  "error": 500,
  "message": "unexpected server error",
  "details": []
}
```



## Tipos de Objeto

Cada objeto em nossa API obedece a um dos seguintes tipos.

Nunca realizaremos renomeações ou remoções de propriedades uma vez estabelecidas.

Porém, é possível adicionarmos propriedades aos objetos já existentes, ou criarmos novos.


### Company

Propriedade | Tipo | Descrição
:-- | :-- | :--
last_update | string | Estampa de tempo com fuso da última atualização
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
details | object[ ] | Detalhes extras sobre o erro



# Download de Arquivos

## Objetivo

Esta rota visa expôr uma URL pública e temporária para download de arquivos.


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