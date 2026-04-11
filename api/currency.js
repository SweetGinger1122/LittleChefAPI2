const currency = require('../json/currency.json')

// --------------------------------------------------------------------
function onRequestCurrency(resp)
{
    resp.write( JSON.stringify(currency) )
}
// --------------------------------------------------------------------

module.exports = {
    onRequestCurrency
}