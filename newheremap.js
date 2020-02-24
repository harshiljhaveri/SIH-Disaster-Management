class HereMap {

    constructor(/*appId, appCode,*/ mapElement) { 
	    /*this.appId = appId;
	    this.appCode = appCode;*/
	    this.platform = new H.service.Platform({
	        "app_id":"qUfxIATIF50WDQKwtDu5" /*this.appId*/,
	        "app_code": "4mKxbHf4BLHre_aYnI0XEiYHSYyUHRZeKT_pmZih05U" /*this.appCode*/
	    /*apiKey: "z6rVlgCg62beX3jcCuVxjsJFgLi-8DnC_kWqdztPU2w"*/
	    });
	    this.map = new H.Map(
	        mapElement,
	        this.platform.createDefaultLayers().normal.map,
	        {
	            zoom: 4,
	            center: { lat: 72.90, lng: 19.10/*insert the center of the map here*/ }
	        }
	    );
	    const mapEvent = new H.mapevents.MapEvents(this.map);
	    const behavior = new H.mapevents.Behavior(mapEvent);
	    this.geofencing = this.platform.getGeofencingService();
	    this.currentPosition = new H.map.Marker({ lat: 72.40, lng: 19.10 });
	    this.map.addObject(this.currentPosition);
		this.map.addEventListener("tap", (ev) => {
	    var target = ev.target;
	    this.map.removeObject(this.currentPosition);
	    this.currentPosition = new H.map.Marker(this.map.screenToGeo(ev.currentPointer.viewportX, ev.currentPointer.viewportY));
	    this.map.addObject(this.currentPosition);
	    this.fenceRequest(["1234"], this.currentPosition.getPosition()).then(result => {
	        	var txt;
			  if(result.geometries.length > 0) {
			  	var r = confirm("Would you like to cancel this event?");
			  	if (r == true) {
			    	txt = "You have submitted a request to cancel the event!";
			    	cancel=1;
			  	} else {
			    	txt = "You have submitted a request to confirm the event!";
					cancel=0;
			  	}
			  }
			  document.getElementById("demo").innerHTML = txt;
	        // if(result.geometries.length > 0) {
	        //     alert("You are within a geofence!")
	        // } else {
	        //     console.log("Not within a geofence!");
	        // }
	    });
	}, false);
	
	}
    draw(mapObject) {
    	this.map.addObject(mapObject);
    }
    polygonToWKT(polygon) {
	    const geometry = polygon.getGeometry();
	    return geometry.toString();
    }
    uploadGeofence(layerId, name, geometry) {
    	const zip = new JSZip();
		zip.file("data.wkt", "NAME\tWKT\n" + name + "\t" + geometry);
		return zip.generateAsync({ type:"blob" }).then(content => {
		    var formData = new FormData();
		    formData.append("zipfile", content);
		    return axios.post("https://gfe.api.here.com/2/layers/upload.json", formData, {
		        headers: {
		            "content-type": "multipart/form-data"
		        },
		        params: {
		            "app_id": this.appId,
		            "app_code": this.appCode,
		            "layer_id": layerId
		        }
		    });
		});
	}
    fenceRequest(layerIds, position) {
		 return new Promise((resolve, reject) => {
		        this.geofencing.request(
		            H.service.extension.geofencing.Service.EntryPoint.SEARCH_PROXIMITY,
		            {
		                'layer_ids': layerIds,
		                'proximity': position.lat + "," + position.lng,
		                'key_attributes': ['NAME']
		            },
		            result => {
		                resolve(result);
		            }, error => {
		                reject(error);
		            }
		        );
		    });
    }
}
				// var txt;
			 //  if(result.geometries.length > 0) {
			 //  	var r = confirm("Would you like to cancel this event?");
			 //  	if (r == true) {
			 //    	txt = "You have submitted a request to cancel the event!";
			 //    	cancel=1;
			 //  	} else {
			 //    	txt = "You have submitted a request to confirm the event!";
				// 	cancel=0;
			 //  	}
			 //  }
			 //  document.getElementById("demo").innerHTML = txt;