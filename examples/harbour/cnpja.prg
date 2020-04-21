PROCEDURE Main()

  // Coloque aqui sua Chave de API
  CHAVEAPI="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"

  // Escolha o CNPJ a ser pesquisado
  CNPJ="33000167000101"

  // Cria um objeto para requisicao HTTP
  ? "Buscando CNPJ " + CNPJ + "..."
  http := CreateObject("MSXML2.ServerXMLHTTP")
  http:Open("GET", "https://api.cnpja.com.br/companies/" + CNPJ, .F.)

  // Adiciona sua Chave de API nos headers
  http:SetRequestHeader("Authorization", CHAVEAPI)

  // Envia e imprime a resposta
  http:send()
  response := http:responseText
  ? response

  WAIT
RETURN
