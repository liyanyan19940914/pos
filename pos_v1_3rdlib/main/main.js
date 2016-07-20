'use strict';

function buildCartItems(inputs, allItems) {

  let cartItems = [];

  for (let input of inputs) {

    let splitedInput = input.split('-');
    let barcode = splitedInput[0];
    let count = parseFloat(splitedInput[1] || 1);

    let cartItem = cartItems.find(cartItem=>cartItem.item.barcode === barcode);

    if (cartItem) {
      cartItem.count += count;
    } else {
      let item = allItems.find(item=>item.barcode === barcode);
      cartItems.push({item, count});
    }
  }

  return cartItems;
}

let getPromotionType = (barcode, promotions)=> {

  let promotion = promotions.find(promotion=>promotion.barcodes.includes(barcode));

  return promotion ? promotion.type : '';
}

let disCount = (count, price, promotionType)=> {

  let subtotal = count * price;
  let subsaved = 0;

  if (promotionType === 'BUY_TWO_GET_ONE_FREE') {
    subsaved = parseInt(count / 3) * price;
  }

  subtotal -= subsaved;

  return {subsaved, subtotal};
}

let buildReceiptItems = (cartItems, promotions) => {
  return cartItems.map(cartItem=> {

    let promotionType = getPromotionType(cartItem.item.barcode, promotions);

    let {subtotal, subsaved}=disCount(cartItem.count, cartItem.item.price, promotionType);

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

  let print = receipt.receiptItems.map(receiptItem=> {
      return `名称：${ receiptItem.cartItem.item.name}，\
数量：${ receiptItem.cartItem.count}${ receiptItem.cartItem.item.unit}，\
单价：${ formatMoney(receiptItem.cartItem.item.price)}(元)，\
小计：${ formatMoney(receiptItem.subtotal)}(元)`;
    })
    .join('\n');

  return `***<没钱赚商店>收据***
${print}
----------------------
总计：${ formatMoney(receipt.total)}(元)
节省：${ formatMoney(receipt.saved)}(元)
**********************`;
}

let formatMoney = (money)=> {
  return money.toFixed(2);
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
