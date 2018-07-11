

/*chrome.storage.sync.set({'www.google.ca': [0.3, false, false, 0, 0, 0]});
chrome.storage.sync.set({'www.jkjcksdckdjsvdsk.ca': [0.01, false, false, 0]});
chrome.storage.sync.set({'www.reddit.com': [0.68, false, false, 0]});*/

chrome.runtime.onInstalled.addListener(function(){
	console.log("App Installed");
});

var web_list =[];

chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
	

	if(info.status == 'loading'){
		var site = tab.url.match('^(([^:/?#]+):)?(//([^/?#]*))?')[4];
		checkClose(tab.id, site);
		logTime();
		web_list.push(site);
	}
});

chrome.tabs.onActivated.addListener(function(){
	logTime();

	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		web_list.push(tabs[0].url.match('^(([^:/?#]+):)?(//([^/?#]*))?')[4]); //get url of site and then extract host name
	});

	
});

chrome.windows.onRemoved.addListener(function(){
	logTime();
});

chrome.windows.onFocusChanged.addListener(function(){
	logTime();
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
		if(tabs[0]){
			web_list.push(tabs[0].url.match('^(([^:/?#]+):)?(//([^/?#]*))?')[4]); //get url of site and then extract host name
		}

		else{
			web_list = [];
		}
	});
});
	

function logTime(){
	//console.log(web_list);
	if (web_list.length > 0){
		var url = web_list[web_list.length - 1];
		//console.log(url)
		chrome.storage.sync.get('time', function(data){
			var timeString = data.time;
			var time = new Date(timeString);
			var d = new Date();
			var mins = (d - time)/60000;
			//console.log(mins);

			chrome.storage.sync.get(url, function(data){
				var items = data[url];
				if(items){
					items[0] = items[0] + mins;
					items[0] = Math.round(items[0]*100)/100;
					chrome.storage.sync.set({[url]: items});
					
				}

				else{
					mins = Math.round(mins*100)/100;
					items = [mins, false, false, 0, 0, 0];
					chrome.storage.sync.set({[url]: items});
					
				}

				//console.log(items);
			});
		});
	}

	var date = new Date();
	var dateString = String(date);
	chrome.storage.sync.set({'time': dateString});
}

function checkClose(id, site){
	chrome.storage.sync.get(site, function(data){
		var arr = data[site];
		//console.log(arr);

		if(arr && arr[1]){

			if(arr[3] === 0){
				chrome.tabs.remove(id);
			}

			else if(arr[2]){
				//console.log('jesus');
				var current_time = new Date();
				var prev_time = new Date(arr[5]);
				var time_dist = (current_time - prev_time)/60000;
				//console.log(time_dist);

				if(time_dist >= arr[3] && time_dist <= arr[4] + arr[3]){
					chrome.tabs.remove(id);
					console.log('tab removed');
				}

				else if(time_dist > arr[4] + arr[3]){
					arr[2] = false;
					chrome.storage.sync.set({[site]: arr});

				}
			}

			else{
				var new_date = new Date();
				arr[5] = String(new_date);
				arr[2] = true;
				chrome.storage.sync.set({[site]: arr});
			}

		}
	});
}

































