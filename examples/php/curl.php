<?php

  $curl = curl_init();

  // Coloque aqui sua Chave de API
  $api_key = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx";

  // Escolha o CNPJ para testar
  $tax_id = "33000167000101";

  // Executa a chamada para API CNPJá!
  $cnpja_url="https://api.cnpja.com.br/companies/";

  curl_setopt_array($curl, array(
    CURLOPT_URL => $cnpja_url . $tax_id,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => array(
      "Authorization: " . $api_key
    ),
  ));

  $response = curl_exec($curl);
  curl_close($curl);

  echo "Resposta da API: <br>" . $response . "<br><br>";
    
  // Decodifica o JSON de retorno
  $company = json_decode($response);

  // Acessa as propriedades que desejar
  echo "Razão Social: " . $company->name . "<br>";
  echo "Nome Fantasia: " . $company->alias . "<br>";
  echo "Tipo: " . $company->type . "<br>";
  // etc...

?>
