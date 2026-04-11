const item = require('../json/item.json')

// --------------------------------------------------------------------
function onRequestItem(resp)
{
    resp.write( JSON.stringify(item) )
}
// --------------------------------------------------------------------

module.exports = {
    onRequestItem
}