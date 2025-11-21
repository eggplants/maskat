function focusOnMap(event) {
	with(event.layout.scope) {
		var index = searchResultGrid.getValue("selectedIndex"); 
		var row = searchResultGrid.getValue()[index];

		var info = { lat: row.lat, lng: row.lng, text: row[0] };
		map.setValue(info, "panTo");
		map.setValue(info, "openInfoWindow");

		nameText.setValue(row[0]);
		descriptionText.setValue(row.description);
	}
}

function showDetailTab(event) {
	with(event.layout.scope) {
		listFolder.unwrap().activeTab(1);
	}
}
