function buildCartItems(inputs,allItems){
  let cartItems = [];

  for(let input of inputs){
    let splitedItem = input.split('-');
    let barcode = splitedItem[0];
    let count = parseFloat(splitedItem[1] || 1);

    let cartItem = cartItems.find(cartItem => cartItem.item.barcode === barcode);

    if(cartItem){
      cartItem.count++;
    }
    else {
      let item = allItems.find(item=>item.barcode === barcode);

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}
