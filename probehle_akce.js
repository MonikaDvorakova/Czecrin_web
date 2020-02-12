// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixData from 'wix-data';

let minDate = new Date(2019, 0, 1);
let maxDate = new Date(2019, 11, 31);

$w.onReady(function () {
	//filters dataset
	$w("#dataset1").setFilter( wixData.filter()
		.between("datumOd", minDate, maxDate)
	)
	.then( () => {
		console.log("Dataset is now filtered");
	} )
	.catch( (err) => {
		console.log(err);
	} );

	//link elements of the items of the repeater to data
	$w('#repeater2').onItemReady(($wInRepeater, itemData) => {
		
		$wInRepeater('#text103').text = itemData.title;
		$wInRepeater('#text110').text = formatDateText(itemData);
		$wInRepeater('#text112').text = itemData.mistoKonani;

		//if there is no data, element collapse, otherwise it is linked to data
		const SeveralDaysMeeting = itemData.datumDo;
		const thereIsNoImage = !itemData.foto1;
		const thereIsNoAbstract = !itemData.abstraktaUrl;
		const thereIsNoPresentation = !itemData.prezentaceUrl;
		const thereIsNoMedia1 = !itemData.media1Popis;
		const thereIsNoMedia2 = !itemData.media2Popis;
		const thereIsNoMoreInfo = !itemData.viceInfoOdkaz;

		if (thereIsNoMoreInfo) {
			$wInRepeater('#button23').collapse();
		} else {
			$wInRepeater('#button23').link = itemData.viceInfoOdkaz;
			$wInRepeater('#button23').target = '_blank';

		}
		if (thereIsNoImage) {
			$wInRepeater('#box23').collapse();
		}
		if (thereIsNoMedia1) {
			$wInRepeater('#box21').collapse();
		} else {
			$wInRepeater('#text114').text = itemData.media1Popis;
			$wInRepeater('#button21').link = itemData.media1Url;
			$wInRepeater('#button21').target = '_blank';

		}
		if (thereIsNoMedia2) {
			$wInRepeater('#box22').collapse();
		} else {
			$wInRepeater('#text115').text = itemData.media2Popis;
			$wInRepeater('#button22').link = itemData.media2Url;
			$wInRepeater('#button22').target = '_blank';
		}
		if (thereIsNoAbstract) {
			$wInRepeater('#box16').collapse();
		} else {
			$wInRepeater('#button16').link = itemData.abstraktaUrl;
			$wInRepeater('#button16').target = '_blank';
		}
		if (thereIsNoPresentation) {
			$wInRepeater('#box20').collapse();
		} else {
			$wInRepeater('#button20').link = itemData.prezentaceUrl;
			$wInRepeater('#button20').target = '_blank';
		}

		//Create the fotogalery
		let seznamFotek = createListOfImages(itemData);
		let fotogaleryLength = seznamFotek.length;
		let index = 0;

		if (!thereIsNoImage) {
			galeryAddLinks (index, fotogaleryLength, seznamFotek, $wInRepeater);
		}

		//adds event listeners to buttons in galery
		$wInRepeater("#button25").onClick( (event, $w) => {
			if (index > 0) {
				index -= 1;
			} else {
				index = seznamFotek.length - 1;
			}
			galeryAddLinks (index, fotogaleryLength, seznamFotek, $wInRepeater)
		} );
		$wInRepeater("#button26").onClick( (event, $w) => {
			if (index < seznamFotek.length - 1) {
				index += 1;
			} else {
				index = 0;
			}
			galeryAddLinks (index, fotogaleryLength, seznamFotek, $wInRepeater)
		} );
  	});
});


function galeryAddLinks (index, fotogaleryLength, seznamFotek, InRepeater) {
	InRepeater('#text117').text = `${index+1}/${fotogaleryLength}`;
	InRepeater('#text116').text = seznamFotek[index].popis;
	InRepeater('#image22').src = seznamFotek[index].src;
	InRepeater('#image22').tooltip = seznamFotek[index].popis;
}


function createListOfImages (data) {
	//It goes through data of each item in repeater and it looks for images
	//It saves the images into a list together with the text description of the image.
	let seznamFotek =[];
		for (let key in data) {
			if (key.includes("foto") && !key.includes('popis') && data[key]) {
				seznamFotek.push({
					src: data[key],
					title: key
				});
			}
		}
		for (let i in seznamFotek) {
			for (let key2 in data) {
				if (key2.includes(seznamFotek[i].title) && key2.includes('popis')) {
					seznamFotek[i].popis = data[key2]
				}
			}
		}
	return seznamFotek;
}

function formatDateText (itemData) {
	// creates a string which is used in the field "datum konani"
	let yearValue = itemData.datumOd.getFullYear();
	let czechMonths = ['ledna', 'února', 'března', 'dubna', 'května', 'června', 'července', 'srpna', 'září', 'října', 'listopadu', 'prosince']
	let monthValue = czechMonths[itemData.datumOd.getMonth()];
	let dayValue = itemData.datumOd.getDate();
	let repeaterDateText = ""
	if (itemData.datumDo) {
		let dayValueTill = itemData.datumDo.getDate();
		repeaterDateText = `${dayValue}. - ${dayValueTill}. ${monthValue} ${yearValue}`;
	} else {
		repeaterDateText = `${dayValue}. ${monthValue} ${yearValue}`
	}
	return repeaterDateText;
}