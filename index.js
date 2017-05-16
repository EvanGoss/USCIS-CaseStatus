const Nightmare = require('nightmare');
const url = 'https://egov.uscis.gov/casestatus/landing.do';

var receiptNumbers = [
  'msc1791121621',
  'msc1791121622',
  'msc1791121623',
  'msc1791121624',
  'msc1791121625',
  'msc1791121626',
  'msc1791121627',
  'msc1791121628',
  'msc1791121629'
  ];

const getStatus = async function(receiptNum) {
  console.log('checking status of', receiptNum);
  const nightmare = new Nightmare({ show: false });

  // Open URL, input receipt number, click submit
  try {
    await nightmare
      .goto(url)
      .wait('input#receipt_number')
      .type('#receipt_number', receiptNum)
      .click('form#landingForm > div.main-row:nth-child(2) > div.container:nth-child(1) > div.landing_box.bg-white.mt30:nth-child(1) > div.case-status-info3:nth-child(1) > fieldset.case-status-from3:nth-child(1) > div.filed-block.mt20.col-lg-12:nth-child(2) > div.filed-box.col-lg-6:nth-child(2) > input.btn2.border-radius5:nth-child(1)')
  } catch(error) {
    console.log('Error:', error, 'Receipt Number:', receiptNum);
  }

  // Gather info from results page
  try {
    const result = await nightmare
      .wait('div.rows.text-center h1')
      .wait('div.rows.text-center p')
      .evaluate(function () {
        return [
          document.querySelector('div.rows.text-center h1').innerText,
          document.querySelector('div.rows.text-center p').innerText
        ];
      })
      .end();
    return {
      receiptNum: receiptNum,
      date: new Date(),
      status: result[0],
      description: result[1]
    };
  } catch(error) {
    console.log('Error:', error, 'Receipt Number:', receiptNum);
  }

} // end of getStatus

for (var i = 0; i < receiptNumbers.length; i++) {
  getStatus(receiptNumbers[i])
    .then(result => console.dir(result))
    .catch(error => console.error(error));
}