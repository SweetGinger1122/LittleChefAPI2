const companion = require('../json/companion.json')

// --------------------------------------------------------------------
function onRequestCompanion(resp)
{
    resp.write( JSON.stringify(companion) )
}
// --------------------------------------------------------------------

module.exports = {
    onRequestCompanion
}