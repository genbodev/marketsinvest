<?php
ini_set('memory_limit','-1');
include 'settings.php';
$accountConfig = json_decode(file_get_contents(__DIR__ . '/accounts_config.txt'), true);
$accounts_string = "";
foreach($accountConfig as $array){
      $accounts_string = $accounts_string . $array['id'] . ',';
};
$accounts_string = rtrim($accounts_string,',');
$reportUrl = $report_serve . '/?report=AccountPerformanceChart&login='. $login .'&password=' . md5($password) . '&accounts=' . $accounts_string . '&begin=2010-01-01%2021:00:00&end=2099-01-01%2020:59:59&format=json';
$accountUrl = $report_serve . '/?report=SignalAccounts&login='. $login .'&password=' . md5($password) . '&format=json';
$curlReport = curl_init();
$curlAccount = curl_init();
curl_setopt($curlReport, CURLOPT_URL, $reportUrl);
curl_setopt($curlReport, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curlReport, CURLOPT_HTTPHEADER,['Content-type: application/json']);
curl_setopt($curlReport, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curlAccount, CURLOPT_URL, $accountUrl);
curl_setopt($curlAccount, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curlAccount, CURLOPT_HTTPHEADER,['Content-type: application/json']);
curl_setopt($curlAccount, CURLOPT_SSL_VERIFYPEER, false);
$result = curl_exec($curlReport);
$resultAccount = curl_exec($curlAccount);
echo curl_errno($curlReport) ? 'Error report' . curl_error($curlReport) : "Data Report is load ";
echo curl_errno($curlAccount) ? 'Error account' . curl_error($curlAccount) : "Data Account is load ";
curl_close($curlReport);
curl_close($curlAccount);
file_put_contents(__DIR__ . '/AccountData.json', $resultAccount);

$dataArray = json_decode($result);
file_put_contents(__DIR__ . '/dsf.json', json_encode($dataArray));
$accountsArray = explode(',',$accounts_string);
foreach ($accountsArray as $account){
    $arrayForResultJSON = [];
    foreach ($dataArray as $element){
        if ($element->ACCOUNT_ID == $account){
           array_push($arrayForResultJSON, $element);
        }
    }
    file_put_contents(__DIR__ . '/' . $account .'.json', json_encode($arrayForResultJSON));
}
?>