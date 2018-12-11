const financialStatements='https://services.last10k.com/v1/company/';
const apiKey10K='3263880343774e3d956bf1733f28ba07';
const apiKey10K2='76530829d2e3491185c4f7272aa746df';
const data1={};
const data2={};
let companyticker=[];

function catchError1(err, tick1) {
  $('.renderList').hide();
  $('.renderTable').hide();
  $('.renderError').append(`<br /><p>${err.message} for ticker ${tick1.toUpperCase()}.</p><br />`);
  $('html, body').animate({scrollTop:200}, 1000);
}

function catchError2(err, tick2) {
  $('.renderList').hide();
  $('.renderTable').hide();
  $('.renderError').append(`<br /><p>${err.message} for ticker ${tick2.toUpperCase()}.</p><br />`);
  $('html, body').animate({scrollTop:200}, 1000);
}

function renderListData() {
  $('.renderList').html('');
  $('.renderList').html(`<ul>
  <li>Company Ticker:</li>
  <li>${companyticker[0].toUpperCase()}</li>
  <li>Current Ratio:</li>
  <li>${Math.round(data1.companyAssets1/data1.companyLiab1*100)/100}x</li>
  <li>ROE:</li>
  <li>${Math.round(data1.returnEquity1*100)/100}%</li>
  <li>Debt Ratio:</li>
  <li>${Math.round(data1.totalLiab1/data1.totalAssets1*100)/100}x</li>
  <li>Company Ticker:</li>
  <li>${companyticker[1].toUpperCase()}</li>
  <li>Current Ratio:</li>
  <li>${Math.round(data2.companyAssets2/data2.companyLiab2*100)/100}x</li>
  <li>ROE:</li>
  <li>${Math.round(data2.returnEquity2*100)/100}%</li>
  <li>Debt Ratio:</li>
  <li>${Math.round(data2.totalLiab2/data2.totalAssets2*100)/100}x</li>
</ul>`);

}

function renderTableData() {
  $('.renderTable').html('');
  $('.renderTable').html(`<table>
  <thead>
    <tr>
      <th>Company Ticker</th>
      <th>Current Ratio</th>
      <th>ROE</th>
      <th>Debt Ratio</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>${companyticker[0].toUpperCase()}</th>
      <td>${Math.round(data1.companyAssets1/data1.companyLiab1*100)/100}x</td>
      <td>${Math.round(data1.returnEquity1*100)/100}%</td>
      <td>${Math.round(data1.totalLiab1/data1.totalAssets1*100)/100}x</td>
    </tr>
    <tr>
      <th>${companyticker[1].toUpperCase()}</th>
      <td>${Math.round(data2.companyAssets2/data2.companyLiab2*100)/100}x</td>
      <td>${Math.round(data2.returnEquity2*100)/100}%</td>
      <td>${Math.round(data2.totalLiab2/data2.totalAssets2*100)/100}x</td>
    </tr>
  </tbody>
</table>`);

$('html, body').animate({scrollTop:200}, 1000);
}

function storeIncomeData2(responseJson) {
  data2.returnEquity2=responseJson.ReturnOnEquity.Recent.TTM;
  renderTableData();
  renderListData();
}

function getIncomeData2(tick2) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey10K2})
  };
  newUrl=financialStatements + tick2 +'/ratios';

  fetch(newUrl, options)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => {
    storeIncomeData2(responseJson);
  })
  .catch(err => catchError2(err, tick2));
}

function getAndStoreBalanceData2(responseJson) {
  data2.companyAssets2=responseJson.Data.AssetsCurrent;
  data2.companyLiab2=responseJson.Data.LiabilitiesCurrent;
  data2.totalAssets2=responseJson.Data.Assets;
  data2.totalLiab2=responseJson.Data.Liabilities;
  renderTableData();
  renderListData();
}

function getCompany2Balance(tick2) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey10K2})
  };
  newUrl=financialStatements + tick2 +'/balancesheet';

  fetch(newUrl, options)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => getAndStoreBalanceData2(responseJson))
  .catch(err => catchError2(err,tick2));
}

function storeIncomeData1(responseJson) {
  data1.returnEquity1=responseJson.ReturnOnEquity.Recent.TTM;
  renderTableData();
  renderListData();
}

function getIncomeData1(tick1) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey10K})
  };
  newUrl=financialStatements + tick1 +'/ratios';

  fetch(newUrl, options)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => storeIncomeData1(responseJson))
  .catch(err => catchError1(err, tick1));
}

function getAndStoreBalanceData1(responseJson) {
  data1.companyAssets1=responseJson.Data.AssetsCurrent;
  data1.companyLiab1=responseJson.Data.LiabilitiesCurrent;
  data1.totalAssets1=responseJson.Data.Assets;
  data1.totalLiab1=responseJson.Data.Liabilities;
  renderTableData();
  renderListData();
}

function getCompany1Balance(tick1) {
  const options = {
    headers: new Headers({
      "Ocp-Apim-Subscription-Key": apiKey10K})
  };
  newUrl=financialStatements + tick1 +'/balancesheet';

  fetch(newUrl, options)
  .then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error(response.statusText);
  })
  .then(responseJson => getAndStoreBalanceData1(responseJson))
  .catch(err => catchError1(err, tick1));
}

function submitTickers() {
  $('.tickersValue').on('submit', function(event){
    event.preventDefault();
    $('.renderError').html('');
    $('.renderList').show();
    $('.renderTable').show();
    const ticker1= $('#ticker1').val();
    const ticker2= $('#ticker2').val();
    ticker1.toUpperCase();
    ticker2.toUpperCase();
    companyticker=[];
    companyticker.push(ticker1);
    companyticker.push(ticker2);
    getCompany1Balance(ticker1);//call balance sheet for company1
    getIncomeData1(ticker1);//call roe for company1
    getCompany2Balance(ticker2);//call balancesheet for company2
    getIncomeData2(ticker2);//call roe for company2
  })
}

function runApp() {
  submitTickers();
}

$(runApp);


//https://hangouts.google.com/hangouts/_/thinkful.com/asalazar

//sessions: tuesday and friday at 12pm
