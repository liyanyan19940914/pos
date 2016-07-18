'use strict';

function printReceipt(inputs) {
  let allItem=loadAllItems();
  let cartItems=buildCartItems(inputs,allItem);
  console.log(cartItems);
}

function existItem(barcode,allItem) {
  for(let i=0;i<allItem.length;i++){
    if(barcode===allItem[i].barcode){
     let item=allItem[i];
      return item;
    }
  }

}

function foundCounts(item,cartItems){
  for(let i=0;i<cartItems.length;i++){
    if(cartItems[i].item.barcode===item.barcode){
      let cartItem=cartItems[i];
      return cartItem;
    }
  }
}

function buildCartItems(inputs,allItem){
  let cartItems=[];
  for(let i=0;i<inputs.length;i++) {
    let itemArray = inputs[i].split('-');
    let barcode = itemArray[0];
    let count=parseInt(itemArray[1] || 1);
    let item = existItem(barcode, allItem);
    let existCartItem = foundCounts(item, cartItems);
    if (existCartItem) {
      existCartItem.count += count;
    }
    else {
      cartItems.push({item: item, count: count});
    }
  }
  return cartItems;
}
