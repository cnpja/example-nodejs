const request = require('request-promise');

// Coloque aqui sua Chave de API
const apiKey = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

/**
 * Dado um CNPJ, consulta a Receita Federal e adquire as informações
 * da inscrição bem como CNAEs e sócios 
 * @param { string } taxId - CNPJ a ser consultado
 */
async function getCompany(taxId) {
  const cnpjaHost = 'https://api.cnpja.com.br';
  const cleanTaxId = taxId ? taxId.toString().replace(/\D+/g, '') : null;

  const company = await request({
    uri: `${cnpjaHost}/companies/${cleanTaxId}`,
    headers: { 'Authorization': apiKey },
    json: true,
  });
  return company;
}

// Teste com o CNPJ desejado:
const taxId = '33.000.167/0001-01';

getCompany(taxId)
  .then((company) => console.log(company))
  .catch((e) => console.log(e.response.body || `HTTP Error: ${e.response.statusCode}`));
