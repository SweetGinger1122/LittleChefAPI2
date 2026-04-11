const rarity = require('../json/rarity.json')

// --------------------------------------------------------------------
function onRequestRarity(resp)
{
    resp.write( JSON.stringify(rarity) )
}
// --------------------------------------------------------------------

module.exports = {
    onRequestRarity
}