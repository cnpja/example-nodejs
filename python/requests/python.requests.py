import requests

# Coloque aqui sua Chave de API
api_key = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

# Dado um CNPJ, consulta a Receita Federal e adquire as informações
# da inscrição bem como CNAEs e sócios 
def get_company(tax_id):
  url = "https://api.cnpja.com.br/companies/${tax_id}"
  headers = { 'Authorization': api_key }
  response = requests.request("GET", url, headers = headers)
  return response

# Teste com o CNPJ desejado:
tax_id = '33000167000101'
print(get_company(tax_id))