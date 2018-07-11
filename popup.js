var subButton = document.getElementById('subButton');
var urlBox = document.getElementById('URL');
var histButton = document.getElementById('history');
var grid = document.getElementById('grid-containor');
var closeBtn = document.getElementsByClassName('closeBtn')[0];
var configButton = document.getElementById('configButton');

closeBtn.onclick = close;
configButton.onclick = openOptions;

displayWatchList();

subButton.onclick = function(e){
	e.preventDefault();

	var url = urlBox.value;
	urlBox.value = '';
	urlBox.blur

	chrome.storage.sync.get(url, function(data){
		var items = data[url];
		if(items){
			
			items[1] = true;
			items[3] = 1;
			items[4] = 1;
			chrome.storage.sync.set({[url]: items});
			displayWatchList();
		}
		else{
			chrome.storage.sync.set({[url]: [0, true, false, 1, 1 ,0]});
			displayWatchList();
		}
	});

};

histButton.onclick = displayHistory;

function updateValue(e){
	var url = e.target.parentElement.children[0].innerHTML;
	var allow =  e.target.parentElement.children[1].firstChild.value;
	var decline =  e.target.parentElement.children[2].firstChild.value;

	console.log(allow);
	console.log(decline);

	chrome.storage.sync.get(url, function(data){
		items = data[url];

		items[3] = allow;
		items[4] = decline;
		chrome.storage.sync.set({[url]: items});
	});

}

function deleteValue(e){
	var url = e.target.parentElement.children[0].innerHTML;

	chrome.storage.sync.get(url, function(data){
		var items = data[url];

		items = [items[0], false, false, 0, 0, 0];

		chrome.storage.sync.set({[url]: items}, displayWatchList);
	});
}

function displayWatchList(){

	while(grid.firstChild){
		grid.removeChild(grid.firstChild);
	}

	chrome.storage.sync.get(null, function(data){
		for(item in data){
			//console.log(data[item]);
			if(data[item][1] && item !== 'time'){
				var newDiv = document.createElement('div');
				var img = document.createElement('img');
				var p = document.createElement('p');
				var p1 = document.createElement('p');

				newDiv.setAttribute('class', 'gridItem');
				p.setAttribute('class', 'imgText');
				p1.setAttribute('class', 'imgText');
				img.src = 'https://s2.googleusercontent.com/s2/favicons?domain=' + item;
				p.textContent = item;
				newDiv.appendChild(p);
				newDiv.appendChild(img);

				if(data[item][2]){
					p1.textContent = 'Blocked';
					
				}
				else{
					p1.textContent = 'Unblocked';
				}
				newDiv.appendChild(p1);
				grid.appendChild(newDiv);
			}
		}
	});

}


function displayHistory(){
	var table = document.getElementById('histTable');
	while(table.childNodes[2]){
		table.removeChild(table.childNodes[2]);
	}
	chrome.storage.sync.get(null, function(data){
		var sorted = [];
		var allData = data;
		for(var item in allData){
			if(item !== 'time'){
				sorted.push([item, allData[item]]);
			}
		}
		
		sorted.sort(function(a,b){
			console.log(b[1][0], a[1][0]);
			return b[1][0] - a[1][0];
		});
		for(var i =0; i < sorted.length; i++){
			if(sorted[i][0] !== 'time'){
				var tr = table.insertRow(table.rows.length);
				var td1 = tr.insertCell(0);
				var td2 = tr.insertCell(1);
				td1.textContent = sorted[i][0];
				td2.textContent = sorted[i][1][0];
			}
		}
		document.getElementById('historyDiv').style.height = '265px';
	});
	
}

function close(){
	document.getElementById('historyDiv').style.height = '0px';
}

function openOptions(){
	chrome.tabs.create({url: "options.html"});
}
















