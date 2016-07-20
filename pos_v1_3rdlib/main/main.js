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

let buildReceipt = (receiptItems)=> {
  let total = 0;
  let saved = 0;

  for (let receiptItem of receiptItems) {
    total += receiptItem.subtotal;
    saved += receiptItem.subsaved;
  }

  return {receiptItems, total, saved};
}

let buildReceiptString = (receipt)=> {
  let prints = '***<没钱赚商店>收据***\n';

  receipt.receiptItems.map(receiptItem=> {
    prints += ( '名称：' + receiptItem.cartItem.item.name +
    '，数量：' + receiptItem.cartItem.count + receiptItem.cartItem.item.unit +
    '，单价：' + receiptItem.cartItem.item.price.toFixed(2) +
    '(元)，小计：' + (receiptItem.subtotal).toFixed(2) + '(元)\n');
    return prints;
  });
  prints += '----------------------\n';
  prints += ('总计：' + receipt.total.toFixed(2) + '(元)\n');
  prints += ('节省：' + receipt.saved.toFixed(2) + '(元)\n');
  prints += '**********************';

  return prints;

}

let printReceipt = (inputs)=> {
  let allItems = loadAllItems();
  let cartItems = buildCartItems(inputs, allItems);
  let promotions = loadPromotions();
  let receiptItems = buildReceiptItems(cartItems, promotions);
  let receip = buildReceipt(receiptItems);
  let print = buildReceiptString(receip);

  console.log(print);
}
