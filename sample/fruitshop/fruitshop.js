function initLayout(event) {
	with(event.layout.scope) {
		/* codeLib のラベルを非表示に設定する */
		customerIdText.unwrap().label.setVisible(false);
		productIdText.unwrap().label.setVisible(false);
	}
}

function orderComplete(event) {
	with(event.layout.scope) {
		orderDetailGrid.clear();
		totalAmount.setValue(0);

		alert("受注登録が完了しました。");
	}
}

/**
 * 受注明細を追加します。
 */
function addOrderDetail(event) {
	with(event.layout.scope) {
		// 商品名、単価の入力チェック
		if (productName.getValue() == "" || unitPrice.getValue() == "") {
			maskat.ui.Dialog.openAlert(
				"",
				"商品名または単価がセットされていません。\n商品情報を取得し直してください。",
				maskat.ui.Dialog.WARN
			);
			return;
		}

		// 受注金額の計算
		var quantityValue = parseInt(quantityText.getValue()) || 0;
		var unitPriceValue = parseInt(unitPrice.getValue()) || 0;
		var price = quantityValue * unitPriceValue;
		var total = (parseInt(totalAmount.getValue()) || 0) + price;
		totalAmount.setValue(total);

		// 明細データをグリッドに登録
		var row = [
			productIdText.getValue(),
			productName.getValue(),
			unitPriceValue,
			quantityValue,
			price
		];
		orderDetailGrid.unwrap().addOneLine(row);

		// 明細入力後に商品情報のデータをクリアする
		productIdText.setValue("");
		productName.setValue("");
		quantityText.setValue("");
		unitPrice.setValue("");
	}
}

/**
 * 受注明細中の選択行を削除します。
 */
function removeOrderDetail(event) {
	with(event.layout.scope) {
		var data = orderDetailGrid.getValue();
		var newRows = [];
		var total = 0;

		for (var i = 0; i < data.length; i++) {
			if (!data[i].sel) {
				newRows.push(data[i]);
				total += parseInt(data[i][4]);
			}
		}
		orderDetailGrid.setValue(newRows);
		totalAmount.setValue(total);
	}
}

/* 東京都の郵便番号一覧 */
var zipCodeList = maskat.util.CrossBrowser.loadJSONFrom("zipCodeListTokyo.json");

/**
 * LiveValidationプラグイン用の独自検証ルールです。
 *
 * 入力された郵便番号が東京都のものであることを検証します。
 */
function isValidZipCode(value, paramsObj) {

	for (var i=0, length = zipCodeList.length; i < length; i++) {
		if (zipCodeList[i] == value) {
			return true;
		}
	}
	Validate.fail(paramsObj.failureMessage);
}

/**
 * 顧客登録タブ選択時にデータをクリアします。
 */
function clearNewCustomerData(event) {
	var target = [
		"newCustomerNameText",
		"newPhoneNumberText",
		"newFaxNumberText",
		"newZipCodeText",
		"newAddressText",
		"newContactPersonText"
	];
	
	for (var i = 0, length = target.length; i < length; i++) {
		event.layout.getWidget(target[i]).setValue("");
	}
}

var newCustomerId;
function registerCustomerComplete(event) {
	alert("顧客登録が完了しました。顧客コードは " + newCustomerId + " です。");
	clearNewCustomerData(event);
}
