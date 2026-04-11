const shopItem = require('../json/shop_item.json')

// --------------------------------------------------------------------
function onRequestShopItem(resp)
{
    resp.write( JSON.stringify(shopItem) )
}
// --------------------------------------------------------------------

module.exports = {
    onRequestShopItem
}