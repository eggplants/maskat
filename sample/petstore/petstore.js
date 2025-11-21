var items = [];
var totalPrice = 0;

function loadInventoryTabItems(event){
	with(event.layout.scope) {
		inventoryTabFolder.activeTab(0);
		while (inventoryTabFolder.arrTabItem.length > 0) {
			inventoryTabFolder.removeTabItem(0);
		}

		if (items.length > 0) {
			for (i = 0; i < items.length; i++) {
				var tabItem = inventoryTabFolder.addTabItem(items[i].itemId);
				new rialto.widget.Image("images/" + items[i].imageURL, 10, 10, tabItem, "petimage");
				new rialto.widget.Label("accountLabel", 10, 150, tabItem, items[i].itemId, 'libelle1');
				new rialto.widget.Label("descriptionLabel", 30, 150, tabItem, items[i].description, 'libelle1');
				new rialto.widget.Label("accountLabel", 50, 150, tabItem, items[i].productId, 'libelita');
				new rialto.widget.Label("priceLabel", 70, 150, tabItem, "$" + items[i].price, 'libNormal');
				new rialto.widget.Label("accountLabel", 140, 10, tabItem, items[i].account, 'libNormal');
				var button = new rialto.widget.Button(90, 180, 'add to cart', 'add this item to your shopping cart', tabItem);
				button.itemIndex= i;
				button.onclick = addItemToCart;
			}
		}
		inventoryTabFolder.activeTab(0);
	}
}

function addItemToCart() {
	var item = items[this.itemIndex];
	totalPrice += parseInt(item.price);
	totalPriceText.setValue("$" + totalPrice);
	
	var orderLines = cartGrid.tabData;
	var found = false;
	for (i = 0; i < orderLines.length; i++) {
		if (item.itemId == orderLines[i][0]) {
			orderLines[i][3] += 1;
			cartGrid.initTab();
			cartGrid.fillGrid(orderLines);
			found = true;
			break;
		}
	}

	if (!found) {
		cartGrid.addOneLine([ item.itemId, item.productId, item.description, 1, "$" + item.price ]);
	}
	petstoreTabFolder.activeTab(1);
}

function continueShopping(event) {
	with(event.layout.scope) {
		petstoreTabFolder.activeTab(0);
	}
}

function checkout() {
	alert("This demonstration ends here. Thank you!");
}