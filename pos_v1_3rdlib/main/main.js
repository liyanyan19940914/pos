'use strict';

function buildCartItems(inputs, allItems) {
  let cartItems = [];

  for (let input of inputs) {
    let splitedInput = input.split('-');
    let barcode = splitedInput[0];
    let count = parseFloat(splitedInput[1] || 1);

    let cartItem = cartItems.find(cartItem=>cartItem.item.barcode === barcode);
    if (cartItem) {
      cartItem.count++;
    } else {
      let item = allItems.find(item=>item.barcode === barcode);

      cartItems.push({item: item, count: count});
    }
  }

  return cartItems;
}

let getPromotionType = (barcode, promotions)=> {
  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));
  return promotion ? promotion.type : '';
}

let disCount = (cartItem, promotionType)=> {
  let freeItemCount = 0;
  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    freeItemCount = parseInt(cartItem.count / 3);
  }

  let subsaved = freeItemCount * cartItem.item.price;
  let subtotal = cartItem.item.price * cartItem.count - subsaved;

  return {subsaved, subtotal};
}
let buildReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem=> {
    let promotionType = getPromotionType(cartItem.item.barcode, promotions);
    let {subtotal, subsaved}=disCount(cartItem, promotionType);
    return {cartItem, subtotal, subsaved};
  })
}
