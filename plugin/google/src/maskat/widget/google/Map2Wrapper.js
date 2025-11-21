/*
 * Copyright (c)  2006-2011 Maskat Project.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
maskat.lang.Class.declare("maskat.widget.google.Map2Wrapper")
	.extend("maskat.layout.Widget", {

	defaultGetter: "getCenter",

	defaultSetter: "setCenter",
	
    createWidget: function(parent){
		var div = document.createElement("div");
		div.style.position = "absolute";
		div.style.left = this.left + "px";
		div.style.top = this.top + "px";
		div.style.width = this.width + "px";
		div.style.height = this.height + "px";

		parent.appendChildElement(div);
		this.element = div;

		var map = new google.maps.Map2(div);
		var latlng = new google.maps.LatLng(this.initialLatitude, this.initialLongitude);
		map.setCenter(latlng, this.initialZoomLevel);

		switch (this.mapControl) {
		case "large":
			map.addControl(new google.maps.LargeMapControl());
			break;
		case "small":
			map.addControl(new google.maps.SmallMapControl());
			break;
		default:
			break;
		}

		if (this.typeControl) {
			map.addControl(new google.maps.MapTypeControl());
		}

		if (this.doubleClickZoom){
			map.enableDoubleClickZoom();
		} else {
			map.disableDoubleClickZoom();
    	}

		if (this.continuousZoom){
	    	map.enableContinuousZoom();
	    }

		this.map = map;
		return map;
    },

	getWidgetId: function(){
		return this.name;
	},

	unwrap: function(){
		return this.map;
	},

	getCenter: function() {
		return this.map.getCenter();
	},

	setCenter: function(value) {
		this.map.setCenter(new google.maps.LatLng(value.lat, value.lng));
	},

	panTo: function(value) {
		this.map.panTo(new google.maps.LatLng(value.lat, value.lng));
	},

	openInfoWindow: function(value) {
		var latlng = new google.maps.LatLng(value.lat, value.lng);
		var text = document.createTextNode(value.text);
		this.map.openInfoWindow(latlng, text);
	},

	addMarker: function(value) {
		var latlng = new google.maps.LatLng(value.lat, value.lng);
		var marker = new google.maps.Marker(latlng);
		google.maps.Event.addListener(marker, "click", function() {
			marker.openInfoWindow(value.text);
		});
		this.map.addOverlay(marker);
	},

	setMarkers: function(values) {
		this.map.clearOverlays();
	
		if (values && values instanceof Array) {
			for (var i = 0; i < values.length; i++) {
				this.setValue(values[i], "addMarker");
			}
		}
	}

});
