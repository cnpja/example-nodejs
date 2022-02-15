const axios = require('axios');

// Coloque aqui sua Chave de API
const apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

// Cria uma instância do Axios para a API CNPJá!
const cnpja = axios.create({
  baseURL: 'https://api.cnpja.com',
  headers: { authorization: apiKey },
});

/**
 * Dado um CNPJ, consulta a Receita Federal e adquire as informações
 * da inscrição bem como CNAEs e sócios 
 * @param { string } taxId - CNPJ a ser consultado
 */
async function getCompany(taxId) {
  const { data: company } = await cnpja({
    method: 'get',
    url: `/office/${taxId ? taxId.toString().replace(/\D+/g, '') : null}`,
  });
  return company;
}

// Teste com o CNPJ desejado:
const taxId = '33.000.167/0001-01';

getCompany(taxId)
  .then((company) => console.log(company))
  .catch((e) => console.log(e.response.data || `HTTP Error: ${e.response.status}`));
