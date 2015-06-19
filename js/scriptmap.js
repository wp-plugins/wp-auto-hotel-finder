var map1000, service1000, infoWindow1000,map2;
var markers = [];
var currentImg; 
var totalImg; 
var autocomplete;
var MARKER_PATH = imgdefault;
var hostnameRegexp = new RegExp('^https?://.+?/');
var zoomm=14;
var refreshIntervalId; 
 
 
/**
 	* Function for creating google maps with hotels 
 	*/	
function setMap(lat,lng) {
	 
	  var llc = new google.maps.LatLng(lat,lng);
                
	  map1000 = new google.maps.Map(document.getElementById('map-canvas1000'), {
		center: llc,
		zoom: zoomm
	  });
	  
	   var request1000 = {
		location: llc,
		radius: 3500,
		types: ['lodging']
	  };
	 
  		infowindow1000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content1000')
		  	});
		  	google.maps.event.addListener(infowindow1000,'closeclick',function(){
		  clearInterval(refreshIntervalId);
		   
		});
	  		service1000 = new google.maps.places.PlacesService(map1000);
	  		service1000.nearbySearch(request1000, callback2);
		 
	       
	    google.maps.event.addListener(map1000,'dragend',function() {
			 lat = map1000.getCenter().lat();
			 lng = map1000.getCenter().lng();
			  var llc = new google.maps.LatLng(lat,lng);
			 var request1000 = {
				location: llc,
				radius: 3500,
				types: ['lodging']
			  };
			var  infowindow1000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content1000')
		  	});
		  	
		  	google.maps.event.addListener(infowindow1000,'closeclick',function(){
		  clearInterval(refreshIntervalId);
		 
		});
	  		service1000 = new google.maps.places.PlacesService(map1000);
	  		service1000.nearbySearch(request1000, callback2);
			  
		});
	   
	 if (search!="") { 
	  
	 
	
		document.getElementById('searchcontent').style.display="inline"
 
	 	var input = document.getElementById('pac-input');

	  	var types = document.getElementById('type-selector');
	  	map1000.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
	   

	  	var autocomplete = new google.maps.places.Autocomplete(input);
	  	autocomplete.bindTo('bounds', map1000);
	 
	  	service1000 = new google.maps.places.PlacesService(map1000);
	  	service1000.nearbySearch(request1000, callback2);
 
		

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
		 
	
			var place = autocomplete.getPlace();
			if (!place.geometry) {
			  window.alert("Autocomplete's returned place contains no geometry");
			  return;
			}

			 
			  map1000.setCenter(place.geometry.location);
			  map1000.setZoom(zoomm);   
			   var marker = new google.maps.Marker({
				position: place.geometry.location,
				map: map1000
				}); 
  
	 
			var request1000 = {
				location: place.geometry.location,
				radius: 3500,
				types: ['lodging']
			  };
			var  infowindow1000 = new google.maps.InfoWindow({
		  		content: document.getElementById('info-content1000')
		  	});
		  	 google.maps.event.addListener(infowindow1000,'closeclick',function(){
		  clearInterval(refreshIntervalId);
		  
		});
	  		service1000 = new google.maps.places.PlacesService(map1000);
	  		service1000.nearbySearch(request1000, callback2);
	  		 
			 
	  });
	 }  
	  		 
	}



/**
 	* Function for initializing google maps 
 	*/	
function initialize() {
 
  if (address!='' && lat=='' && lng=='') {
   
 	var geocoder = new google.maps.Geocoder();
  
 	geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                     lng = results[0].geometry.location.lng();
 					 setMap(lat,lng);
                } else {
                    alert("Request failed.")
                }
            });
            
           
  } else {
  	setMap(lat,lng);
  }
  
}
 
/**
 	* Function for creating google maps with hotels
 	*/	
	function callback2(results, status) {
 
	  if (status == google.maps.places.PlacesServiceStatus.OK) {
			clearResults();
		   clearMarkers();
		for (var i = 0; i < results.length; i++) {
		//console.log(results[i]);
	  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
			var photos = results[i].photos;
			var markerIcon = MARKER_PATH;
			if (photos) {
				markerIcon = photos[0].getUrl({'maxWidth': 50, 'minHeight': 50});
 
			}
		
			/* 
			markers[i] = new google.maps.Marker({
			  position: results[i].geometry.location,
			  animation: google.maps.Animation.DROP,
			  icon: markerIcon
			});
			*/
			var ido = Math.floor((Math.random()*10000)+1);
			 
		 
			markers[i] = new google.maps.Marker({
				  position: results[i].geometry.location,
				  map: map1000,
				  icon: imgdefault
			  });
	   
			markers[i].placeResult = results[i];
		 
			google.maps.event.addListener(markers[i], 'click', showInfoWindow);
			setTimeout(dropMarker(i), i * 100);
	 
		}
		var t=i+1;
		var center = map1000.getCenter();
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode({"latLng":center},function(data,status){
 			if(status == google.maps.GeocoderStatus.OK){
 				var add = data[1].formatted_address; //this is the full address
				 
				markers[t] = new google.maps.Marker({
						position: center,
						map: map1000,
						 title: add
  					});
  					markers[t].placeResult = null;
			}
		})
		
		 
				 
  		
  		 
		 addResult();
	  	}
	}
	
	 
/**
 	* Function for clearing results on listing
 	*/		
	
	function clearResults() {
	  var results = document.getElementById('results');
	  while (results.childNodes[0]) {
		results.removeChild(results.childNodes[0]);
	  }
	}
	
/**
 	* Function for clearing markers on map
 	*/		
	function clearMarkers() {
	  for (var i = 0; i < markers.length; i++) {
		if (markers[i]) {
		  markers[i].setMap(null);
		}
	  }
	  markers = [];
	}
/**
 	* Function for dropping markers on map 
 	*/		
	function dropMarker(i) {
	  return function() {
		markers[i].setMap(map1000);
	  };
	}

 
/**
 	* Change row color background for result table
 	*/	 
	function clickRow(id){
        google.maps.event.trigger(markers[id], 'click');
        document.getElementById("idrow"+id).style.backgroundColor="#F5F6CE";
    }
    
    /**
 	* Function for adding results on listing
 	*/	
	function addResult() {
	  var i;
	  var distance;
	  var arrayMarker = new Array();
	  var center = map1000.getCenter();
	   for (i in markers) {
	  	 if (markers[i]) {
	   		if (markers[i].placeResult) {
				var rs = markers[i].placeResult;
				var markerLatLng = rs.geometry.location;
				var distance = parseInt(google.maps.geometry.spherical.computeDistanceBetween(center, markerLatLng)); 
				arrayMarker.push([[distance,markers[i],i]]);
			}	
			}
	   }
	 
	
		 var col=0;
		 var asc=1;
		  arrayMarker.sort(function(a, b){
			return (parseInt(a[col]) == parseInt(b[col])) ? 0 : ((parseInt(a[col]) > parseInt(b[col])) ? asc : -1*asc);
		});
     
	  var results = document.getElementById('results');
	 var j;
	 var i;
     for (j in arrayMarker) {
     
 		var distance = arrayMarker[j][0][0];
 		var marker = arrayMarker[j][0][1];
 		var i = arrayMarker[j][0][2];
	 	var rs = marker.placeResult;
	 	 
		var tr = document.createElement('tr');
		tr.setAttribute("id","idrow"+i);
	  	tr.style.backgroundColor = (j % 2 == 0 ? '#F0F0F0' : '#FFFFFF');
 	  	var nameTd = document.createElement('td');
	    var titled = document.createElement('div');
	    
	    titled.innerHTML='<span style="cursor:pointer; color: #cf4d35;" onclick="clickRow('+i+')"><b >' + rs.name;
	    if (rs.photos) {
	    	 titled.innerHTML+= "&nbsp;&#128247;";
	    }
	    titled.innerHTML+= '</b></span>';
	    
	    nameTd.appendChild(titled);
	      
	       var texth = '';
		  var imgh = "";
		  var ratingHtml = '';
		  if (rs.rating) {
	   
			for (var h = 0; h < 5; h++) {
			  if (rs.rating < (h + 0.5)) {
				ratingHtml += '&#10025;';
			  } else {
				ratingHtml += '&#10029;';
			  }
		  
			}
			  texth +=  ratingHtml+"<br>";
		  }
		  texth+=rs.vicinity+"<br>";
	   texth+=distance +' mt.';
	    texth+='<div id="spanwebid'+rs.place_id+'"></div>';
	  	texth+='<div id="spanphoneid'+rs.place_id+'"></div>';	 
	 
	   var bt2 = document.createElement('span'); 
	       bt2.innerHTML = texth;
	  
	  //var name = document.innerHTML(text);
	   nameTd.appendChild(bt2);
 
     

	  tr.appendChild(nameTd);
	 
	  results.appendChild(tr);
	 	 
		
	  }
	
 
	}
	
	
	
	 
	 
	
	/**
 	* show infowindow on map
 	*/	
	function showInfoWindow() {
		if (document.getElementById('info-content1000') && document.getElementById('info-content1000').style.display=="none") {
			document.getElementById('info-content1000').style.display = 'block';
		}

	  var marker = this;
	  service1000.getDetails({placeId: marker.placeResult.place_id},
		  function(place, status) {
		   
			if (status != google.maps.places.PlacesServiceStatus.OK) {
			  return;
			}
			infowindow1000.open(map1000, marker);
			buildIWContent(place);
		  });
	}
	
	/**
 	* Function for sliding images on infowindow
 	*/	
	function viewImg() {
		for(var i=0;i<totalImg;i++) {
			document.getElementById("imgslider"+i).style.display="none";
		}
		if (currentImg>=totalImg) {
			currentImg=0;
		}
		document.getElementById("imgslider"+currentImg).style.display="block";
		currentImg++;
	 
	 
		 
	}
	/**
 	* Function for loading the place information into the HTML elements used by the info window.
 	*/	
	 
	function buildIWContent(place) {
		 var html='';
		  clearInterval(refreshIntervalId);
		 currentImg=0;
		 totalImg=0;
	 var info = "";
		if (place.photos) {
	 	     var ff="";
			 for(var v=0;v<place.photos.length;v++) {
				 ff = place.photos[v].getUrl({'maxWidth': 200, 'maxHeight': 200});
			 
				 if (ff!="") {
					html += '<img class="mapsslider" style="display:none;" id="imgslider'+v+'" width="200px" src="'+ff+'"/>';
				 }
			 }	
			totalImg = v;	
		}
		if (html!="") {
			document.getElementById('iw-image').style.display = '';
			document.getElementById('slider').innerHTML = html;
		   	viewImg();
			  refreshIntervalId = setInterval(function() { viewImg();}, 3000);
			 
		} else {
			document.getElementById('iw-image').style.display = 'none';
			document.getElementById('slider').innerHTML = "";
		}
		
		  info = '<b><a target="_blank" href="' + place.url + '">' + place.name + '</a></b>';
		  if (place.rating) {
				var ratingHtml = '';
				for (var i = 0; i < 5; i++) {
				  if (place.rating < (i + 0.5)) {
					ratingHtml += '&#10025;';
				  } else {
					ratingHtml += '&#10029;';
				  }
			}
			  info+="<br>"+ratingHtml;
	  	}
		info+="<br>Address: "+place.vicinity;
		if (place.formatted_phone_number) {
			var phone="<br>Phone: "+'<a href="tel:'+place.formatted_phone_number+'">'+place.formatted_phone_number+'</a>';
			info+=phone;
			document.getElementById('spanphoneid'+place.place_id).innerHTML = phone;
		}
		
 
	  if (place.website) {
		var website = place.website;
	 
		if (website.indexOf("http")==-1) {
		  website = 'http://' + website + '/';
		}
		website='<a href="'+website+'" target="_blank">'+website+"</a>";
		info+="<br>Website: "+website
		document.getElementById('spanwebid'+place.place_id).innerHTML = "Website: "+website;
	  } 
	  document.getElementById('iw-info').innerHTML = info;
	}


 
  // initialise google maps
	google.maps.event.addDomListener(window, 'load', initialize);

 