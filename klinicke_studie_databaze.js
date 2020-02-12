// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixData from 'wix-data';

$w.onReady(() => {
	$w("#dataset1").onReady(() => {
		loadStatus();
		loadNemocnice();
		loadZamereni();
		loadFaze();
	})
});


let lastFilterTitle;
let lastFilterStatus;
let lastFilterNemocnice;
let lastFilterFaze;
let lastFilterZamereni;
let debounceTimer;


function loadStatus() {
	wixData.query('Status')
	.find()
	.then(res => {
		console.log(res)
		console.log(res.items[0].title)
		let options = [{'value': '', 'label': 'Nefiltrováno'}];
		options.push(...res.items.map(status => {
			console.log(status)
			console.log(status.title)
			return {"value": status.title, 'label': status.title};
		}));
		console.log(options)
		$w('#iStatus').options = options;
	});
}


function loadNemocnice() {
	wixData.query('Zapojenenemocnice')
	.find()
	.then(res => {
		let options = [{'value': '', 'label': 'Nefiltrováno'}];
		options.push(...res.items.map(nemocnice => {
			return {"value": nemocnice.title, 'label': nemocnice.title};
		}));
		$w('#iNemocnice').options = options;
	});
}


function loadZamereni() {
	wixData.query('Terapeutickezamereni')
	.find()
	.then(res => {
		let options = [{'value': '', 'label': 'Nefiltrováno'}];
		options.push(...res.items.map(zamereni => {
			return {"value": zamereni.title, 'label': zamereni.title};
		}));
		$w('#iTerZamereni').options = options;
	});
}


function loadFaze() {
	wixData.query('Faze')
	.find()
	.then(res => {
		let options = [{'value': '', 'label': 'Nefiltrováno'}];
		options.push(...res.items.map(faze => {
			return {"value": faze.title, 'label': faze.title};
		}));
		$w('#iFaze').options = options;
	});
}


function filter(title, status, nemocnice, faze, zamereni) {
	if (lastFilterTitle !== title || lastFilterStatus !== status || lastFilterNemocnice !== nemocnice || lastFilterFaze !== faze || lastFilterZamereni !== zamereni) {
		let newFilter = wixData.filter();
		if (title)
			newFilter = newFilter.contains('title', title)
			.or(newFilter.contains('celyNazev', title));
		if (status)
			newFilter = newFilter.contains('status', status);
		if (nemocnice)
			newFilter = newFilter.contains('zapojeneNemocniceVCr', nemocnice);
		if (faze)
			newFilter = newFilter.eq('faze', faze);
		if (zamereni)
			newFilter = newFilter.contains('terapeutickeZamereni', zamereni)
		$w('#dataset1').setFilter(newFilter);
		lastFilterTitle = title;
		lastFilterStatus = status;
		lastFilterNemocnice = nemocnice;
		lastFilterFaze = faze;
		lastFilterZamereni = zamereni
	}
}


export function iTitle_keyPress(event) {
	if (debounceTimer) {
		clearTimeout(debounceTimer);
		debounceTimer = undefined;
	}
	debounceTimer = setTimeout(() => {
		filter($w('#iTitle').value, lastFilterStatus, lastFilterNemocnice, lastFilterFaze, lastFilterZamereni);
	}, 500);
}


export function iTerZamereni_change(event) {
	filter(lastFilterTitle, lastFilterStatus, lastFilterNemocnice, lastFilterFaze, $w('#iTerZamereni').value);
}


export function iStatus_change(event) {
	filter(lastFilterTitle, $w('#iStatus').value, lastFilterNemocnice, lastFilterFaze, lastFilterZamereni);
}


export function iFaze_change(event) {
	filter(lastFilterTitle, lastFilterStatus, lastFilterNemocnice, $w('#iFaze').value, lastFilterZamereni);
}


export function iNemocnice_change(event) {
	filter(lastFilterTitle, lastFilterStatus, $w('#iNemocnice').value, lastFilterFaze, lastFilterZamereni);
}