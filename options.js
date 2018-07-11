var watchTable = document.getElementsByTagName('table')[0];
var body = document.getElementsByTagName('body')[0];

displayWatchList();

function displayWatchList(){
	while(watchTable.childNodes[2]){
		watchTable.removeChild(watchTable.childNodes[2]);
	}
	

	chrome.storage.sync.get(null, function(data){
		var noItems = true;
		for(var item in data){
			if(data[item][1] && item !== 'time'){
				noItems = false;
				var tableRow = document.createElement('tr');
				var tableUrl = document.createElement('td');
				var allowFor = document.createElement('td');
				var declineFor = document.createElement('td');
				var cellButton1 = document.createElement('td');
				var cellButton2 = document.createElement('td');
				var allowMins = document.createElement('input');
				var declineMins = document.createElement('input');
				var deleteButton = document.createElement('button');
				var updateButton = document.createElement('button');

				allowMins.setAttribute('type', 'number');
				allowMins.setAttribute('class', 'numInput');
				allowMins.defaultValue = data[item][3];
				console.log(data[item][3]);
				declineMins.setAttribute('type', 'number');
				declineMins.setAttribute('class', 'numInput');
				declineMins.defaultValue = data[item][4];

				allowFor.appendChild(allowMins);
				declineFor.appendChild(declineMins);
	
				if(item.length <= 42){
					tableUrl.textContent = item;
				}

				else{
					tableUrl.textContent = item.slice(0, 38) + '...';
				}

				tableRow.appendChild(tableUrl);
				tableRow.appendChild(allowFor);
				tableRow.appendChild(declineFor);

				deleteButton.textContent = 'Delete';
				updateButton.textContent = 'Update';

				deleteButton.addEventListener('click', deleteValue);
				updateButton.addEventListener('click', updateValue);

				deleteButton.style.backgroundColor = '#8080ff';
				updateButton.style.backgroundColor = '#8080ff';
				deleteButton.style.color = 'white';
				updateButton.style.color = 'white';
				deleteButton.style.fontSize = '15px';
				updateButton.style.fontSize = '15px';

				if(data[item][2]){
					deleteButton.disabled = true;
					updateButton.disabled = true;
				}

				cellButton1.appendChild(updateButton);
				cellButton2.appendChild(deleteButton);
				cellButton1.setAttribute('background-color', ' #e6ffff');
				cellButton2.setAttribute('background-color', ' #e6ffff');
				tableRow.appendChild(updateButton);
				tableRow.appendChild(deleteButton);

				watchTable.appendChild(tableRow);

			}
		}

		
		if(noItems){
			var p = document.createElement('p');
			p.textContent = "There's nothing here! Add a website to the watchlist!"
			body.removeChild(body.children[1]);
			body.appendChild(p);
		}
	});
}

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

























