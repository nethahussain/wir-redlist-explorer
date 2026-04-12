/**
 * WIR Redlist Explorer — Women in Red Wikidata Redlist Explorer
 * 
 * A tool for [[Wikipedia:WikiProject Women in Red]] that queries Wikidata
 * in real time to find notable women missing from English Wikipedia.
 * Filter by occupation, country, or both simultaneously.
 *
 * Installation: Add to your [[Special:MyPage/common.js]]:
 *   importScript('User:Netha_Hussain/WIR-RedlistExplorer.js');
 *
 * Or load the stylesheet too for enhanced styling:
 *   importStylesheet('User:Netha_Hussain/WIR-RedlistExplorer.css');
 *   importScript('User:Netha_Hussain/WIR-RedlistExplorer.js');
 *
 * This script only activates on pages containing the element:
 *   <div id="wir-redlist-explorer"></div>
 *
 * @author [[User:Netha_Hussain]]
 * @license CC0-1.0
 * @see [[Wikipedia:WikiProject Women in Red/Redlist index]]
 */
( function () {
'use strict';

// Wait for the page content to be ready
mw.hook( 'wikipage.content' ).add( function ( $content ) {

// Only run if the placeholder div exists on the page
var container = document.getElementById( 'wir-redlist-explorer' );
if ( !container ) return;

// Prevent running twice
if ( container.getAttribute( 'data-wir-loaded' ) ) return;
container.setAttribute( 'data-wir-loaded', '1' );

// Show loading feedback immediately
container.innerHTML = '<p style="color:#54595d">⏳ Loading Wikidata Redlist Explorer…</p>';

// ── OCCUPATION DATA ──────────────────────────────────────────────────────────
var OCCUPATIONS = {
	'Activism & Politics': {
		'Activists': ['Q15253558'], 'Civil rights activists': ['Q1021386'], 'Diplomats': ['Q193391'],
		'Feminists': ['Q34074720'], 'Human rights activists': ['Q1476215'], 'Labor activists': ['Q7886765'],
		'Monarchs': ['Q116'], 'Nobles': ['Q2478141'], 'Politicians': ['Q82955'],
		'Resistance fighters': ['Q1397808'], 'Revolutionaries': ['Q3242115'],
		'Social workers': ['Q7019111'], 'Suffragists': ['Q27532437'], 'Trade unionists': ['Q15627169']
	},
	'Arts & Visual Arts': {
		'Animators': ['Q266569'], 'Architects': ['Q42973'], 'Calligraphers': ['Q3303330'],
		'Cartoonists': ['Q1114448'], 'Ceramicists': ['Q7541856'], 'Comics artists': ['Q15296938'],
		'Costume designers': ['Q1323191'], 'Engravers': ['Q329439'], 'Graphic designers': ['Q627325'],
		'Illustrators': ['Q644687'], 'Interior designers': ['Q2895295'], 'Jewellery designers': ['Q2519376'],
		'Miniaturists': ['Q10862983'], 'Muralists': ['Q3374326'], 'Painters': ['Q1028181'],
		'Photographers': ['Q33231'], 'Printmakers': ['Q11569986'], 'Sculptors': ['Q1281618'],
		'Textile artists': ['Q5322166'], 'Visual artists': ['Q3391743'], 'Weavers': ['Q18939491']
	},
	'Business & Economics': {
		'Bankers': ['Q806798'], 'Businesspeople': ['Q43845', 'Q131524'], 'Economists': ['Q188094'],
		'Industrialists': ['Q6606110'], 'Managers': ['Q2462658']
	},
	'Education & Academia': {
		'Academics': ['Q3400985'], 'Educational specialists': ['Q5341303', 'Q1569495', 'Q901222'],
		'Educators': ['Q1056391', 'Q37226', 'Q974144'], 'Librarians': ['Q182436'],
		'Linguists': ['Q14467526'], 'Philologists': ['Q13418253'], 'Professors': ['Q121594'],
		'Researchers': ['Q1650915'], 'University teachers': ['Q1622272']
	},
	'Law & Justice': {
		'Judges': ['Q16533'], 'Lawyers': ['Q40348'], 'Magistrates': ['Q4594605'],
		'Notaries': ['Q189010'], 'Prosecutors': ['Q600751']
	},
	'Literature & Writing': {
		'Art critics': ['Q4164507'], 'Art historians': ['Q1792450'], 'Authors': ['Q482980'],
		'Biographers': ['Q18814623'], 'Bloggers': ['Q877517'], "Children's writers": ['Q4853732'],
		'Columnists': ['Q1086863'], 'Comics writers': ['Q11892507'], 'Critics': ['Q6430706'],
		'Editors': ['Q1607826'], 'Essayists': ['Q11774202'], 'Folklorists': ['Q15214752'],
		'Historians': ['Q201788'], 'Journalists': ['Q1930187'], 'Literary critics': ['Q4263842'],
		'Novelists': ['Q6625963'], 'Playwrights': ['Q214917'], 'Poets': ['Q49757'],
		'Publishers': ['Q2516866'], 'Screenwriters': ['Q28389'], 'Songwriters': ['Q753110'],
		'Translators': ['Q333634'], 'Writers': ['Q36180']
	},
	'Media & Entertainment': {
		'Actresses': ['Q33999'], 'Comedians': ['Q245068'], 'Film critics': ['Q1350157'],
		'Film directors': ['Q2526255'], 'Film producers': ['Q3282637'], 'Models': ['Q4610556'],
		'Presenters': ['Q13590141'], 'Radio presenters': ['Q2722764'],
		'Television presenters': ['Q947873'], 'Voice actresses': ['Q2405480']
	},
	'Performing Arts': {
		'Choreographers': ['Q2490358'], 'Circus performers': ['Q6660286'], 'Composers': ['Q36834'],
		'Conductors (music)': ['Q158852'], 'Curators': ['Q674426'], 'Dancers': ['Q5716684'],
		'Flautists': ['Q12902372'], 'Guitarists': ['Q855091'], 'Harpists': ['Q3127709'],
		'Musicians': ['Q639669'], 'Opera singers': ['Q2865819'], 'Organists': ['Q765778'],
		'Pianists': ['Q486748'], 'Singers': ['Q177220'], 'Theatre directors': ['Q3387717'],
		'Violinists': ['Q1259917'], 'Violoncellists': ['Q1323883']
	},
	'Religion & Spirituality': {
		'Abbesses': ['Q75178'], 'Missionaries': ['Q219477'], 'Nuns': ['Q191808'],
		'Religious leaders': ['Q2259451'], 'Saints': ['Q43115'], 'Theologians': ['Q1234713']
	},
	'Science & Technology': {
		'Anthropologists': ['Q4773904'], 'Archaeologists': ['Q3621491'], 'Astronomers': ['Q11063'],
		'Astrophysicists': ['Q752129'], 'Biochemists': ['Q15142903'], 'Biologists': ['Q864503'],
		'Botanists': ['Q2374149'], 'Chemists': ['Q593644'], 'Computer scientists': ['Q82594'],
		'Ecologists': ['Q15839134'], 'Entomologists': ['Q3055126'], 'Epidemiologists': ['Q12765408'],
		'Geneticists': ['Q3126128'], 'Geographers': ['Q901402'], 'Geologists': ['Q520549'],
		'Marine biologists': ['Q2867476'], 'Mathematicians': ['Q170790'],
		'Meteorologists': ['Q12050421'], 'Microbiologists': ['Q15917187'],
		'Neuroscientists': ['Q6337803'], 'Paleontologists': ['Q1662561'],
		'Physicists': ['Q169470'], 'Statisticians': ['Q2732142'], 'Zoologists': ['Q350979']
	},
	'Medicine & Health': {
		'Dentists': ['Q27349'], 'Dermatologists': ['Q1789414'], 'Gynecologists': ['Q15924224'],
		'Midwives': ['Q185196'], 'Nurses': ['Q186360'], 'Oncologists': ['Q4165402'],
		'Ophthalmologists': ['Q15924610'], 'Pathologists': ['Q4202929'], 'Pediatricians': ['Q1919436'],
		'Pharmacists': ['Q105186'], 'Physicians': ['Q39631'], 'Psychiatrists': ['Q211346'],
		'Psychologists': ['Q212980'], 'Radiologists': ['Q1569276'], 'Sociologists': ['Q2306091'],
		'Surgeons': ['Q774306'], 'Veterinarians': ['Q202883']
	},
	'Sports': {
		'Alpine skiers': ['Q4144610'], 'Archers': ['Q13382355'], 'Athletes': ['Q2066131'],
		'Badminton players': ['Q13141064'], 'Basketball players': ['Q3665646'],
		'Boxers': ['Q11338576'], 'Canoeists': ['Q13382566'], 'Chess players': ['Q10873124'],
		'Cricketers': ['Q12299841'], 'Cross-country skiers': ['Q13382608'],
		'Cyclists': ['Q2309784'], 'Divers': ['Q13381427'], 'Equestrians': ['Q13382603'],
		'Fencers': ['Q13381689'], 'Figure skaters': ['Q13381572'],
		'Football players': ['Q937857'], 'Golfers': ['Q13156709'],
		'Gymnasts': ['Q15117302'], 'Handball players': ['Q13365117'],
		'Hockey players': ['Q11774891'], 'Judokas': ['Q6665249'],
		'Martial artists': ['Q14373094'], 'Rowers': ['Q13382576'],
		'Rugby players': ['Q14089670'], 'Sailors': ['Q476246'],
		'Shooters': ['Q17486376'], 'Speed skaters': ['Q15117395'],
		'Swimmers': ['Q10843402'], 'Table tennis players': ['Q13219587'],
		'Tennis players': ['Q10833314'], 'Track & field athletes': ['Q11513337'],
		'Volleyball players': ['Q15117415'], 'Water polo players': ['Q17524364'],
		'Weightlifters': ['Q13381376'], 'Wrestlers': ['Q13474373']
	},
	'Other': {
		'Astronauts': ['Q11631'], 'Aviators': ['Q2095549'], 'Collectors': ['Q3243461'],
		'Cooks & chefs': ['Q3499072'], 'Engineers': ['Q81096'], 'Environmentalists': ['Q3578589'],
		'Explorers': ['Q11900058'], 'Fashion designers': ['Q3501317'], 'Firefighters': ['Q107711'],
		'Inventors': ['Q205375'], 'Military personnel': ['Q47064'], 'Philanthropists': ['Q12362622'],
		'Pilots': ['Q158063'], 'Police officers': ['Q361593'], 'Spies': ['Q9352089'],
		'Technologists': ['Q5482740']
	}
};

// ── COUNTRY DATA ─────────────────────────────────────────────────────────────
var COUNTRIES_BY_REGION = {
	'Africa': {
		'Algeria':'Q262','Cameroon':'Q1009','DR Congo':'Q974','Egypt':'Q79',
		'Ethiopia':'Q115','Ghana':'Q117','Kenya':'Q114','Madagascar':'Q1019',
		'Malawi':'Q1020','Morocco':'Q1028','Mozambique':'Q1029','Nigeria':'Q1033',
		'Rwanda':'Q1037','Senegal':'Q1041','South Africa':'Q258',
		'Tanzania':'Q924','Tunisia':'Q948','Uganda':'Q1036','Zimbabwe':'Q954'
	},
	'Americas': {
		'Argentina':'Q414','Bolivia':'Q750','Brazil':'Q155','Canada':'Q16',
		'Chile':'Q298','Colombia':'Q739','Cuba':'Q241','Ecuador':'Q736',
		'Guatemala':'Q774','Haiti':'Q790','Jamaica':'Q766','Mexico':'Q96',
		'Paraguay':'Q733','Peru':'Q419','Trinidad & Tobago':'Q754',
		'United States':'Q30','Uruguay':'Q77','Venezuela':'Q717'
	},
	'Asia': {
		'Afghanistan':'Q889','Bangladesh':'Q902','Cambodia':'Q424',
		'China':'Q148','India':'Q668','Indonesia':'Q252','Iran':'Q794',
		'Iraq':'Q796','Israel':'Q801','Japan':'Q17','Kazakhstan':'Q232',
		'South Korea':'Q884','Malaysia':'Q833','Mongolia':'Q711',
		'Myanmar':'Q836','Nepal':'Q837','Pakistan':'Q843',
		'Philippines':'Q928','Singapore':'Q334','Sri Lanka':'Q854',
		'Taiwan':'Q865','Thailand':'Q869','Turkey':'Q43','Vietnam':'Q881'
	},
	'Europe': {
		'Albania':'Q222','Austria':'Q40','Belgium':'Q31',
		'Bosnia & Herzegovina':'Q225','Bulgaria':'Q219','Croatia':'Q224',
		'Czech Republic':'Q213','Denmark':'Q35','Estonia':'Q191',
		'Finland':'Q33','France':'Q142','Germany':'Q183','Greece':'Q41',
		'Hungary':'Q28','Iceland':'Q189','Ireland':'Q27','Italy':'Q38',
		'Latvia':'Q211','Lithuania':'Q37','Netherlands':'Q55','Norway':'Q20',
		'Poland':'Q36','Portugal':'Q45','Romania':'Q218','Russia':'Q159',
		'Serbia':'Q403','Slovakia':'Q214','Slovenia':'Q215','Spain':'Q29',
		'Sweden':'Q34','Switzerland':'Q39','Ukraine':'Q212',
		'United Kingdom':'Q145'
	},
	'West Asia': {
		'Bahrain':'Q398','Jordan':'Q810','Kuwait':'Q817','Lebanon':'Q822',
		'Oman':'Q842','Palestine':'Q219060','Qatar':'Q846',
		'Saudi Arabia':'Q851','Syria':'Q858','United Arab Emirates':'Q878',
		'Yemen':'Q805'
	},
	'Oceania & Pacific': {
		'Australia':'Q408','Fiji':'Q712','New Zealand':'Q664',
		'Papua New Guinea':'Q691','Samoa':'Q683'
	}
};

// ── Flatten data for dropdowns ───────────────────────────────────────────────
function flattenOccupations() {
	var out = [];
	var groups = Object.keys( OCCUPATIONS );
	for ( var g = 0; g < groups.length; g++ ) {
		var group = groups[g];
		var items = Object.keys( OCCUPATIONS[group] );
		for ( var i = 0; i < items.length; i++ ) {
			out.push( { group: group, name: items[i], qids: OCCUPATIONS[group][items[i]] } );
		}
	}
	out.sort( function ( a, b ) { return a.name.localeCompare( b.name ); } );
	return out;
}

function flattenCountries() {
	var out = [];
	var regions = Object.keys( COUNTRIES_BY_REGION );
	for ( var r = 0; r < regions.length; r++ ) {
		var region = regions[r];
		var items = Object.keys( COUNTRIES_BY_REGION[region] );
		for ( var i = 0; i < items.length; i++ ) {
			out.push( { region: region, name: items[i], qId: COUNTRIES_BY_REGION[region][items[i]] } );
		}
	}
	out.sort( function ( a, b ) { return a.name.localeCompare( b.name ); } );
	return out;
}

var ALL_OCC = flattenOccupations();
var ALL_CTY = flattenCountries();

// ── SPARQL builder ───────────────────────────────────────────────────────────
function buildQuery( occQIds, ctyQId, limit ) {
	var hasOcc = occQIds && occQIds.length > 0;
	var hasCty = !!ctyQId;
	var occValues = hasOcc ? occQIds.map( function ( q ) { return 'wd:' + q; } ).join( ' ' ) : '';
	var occFilter = hasOcc ? '?item wdt:P106 ?occ . VALUES ?occ { ' + occValues + ' }' : '';
	var ctyFilter = hasCty
		? '{ { ?item (wdt:P27|wdt:P17|wdt:P495|wdt:P1532) wd:' + ctyQId + ' . } UNION { ?item (wdt:P19/wdt:P17) wd:' + ctyQId + ' . } }'
		: '';

	return 'SELECT ?item ?itemLabel ?itemDescription ' +
		'(SAMPLE(?_dob) AS ?dob) (SAMPLE(?_dod) AS ?dod) ' +
		'(SAMPLE(?_countryLabel) AS ?countryLabel) ' +
		'(GROUP_CONCAT(DISTINCT ?_occLabel; separator=", ") AS ?occupations) ' +
		'(SAMPLE(?_image) AS ?image) ' +
		'(COUNT(DISTINCT ?sitelink) AS ?sites) ' +
		'WHERE { ' +
		'?item wdt:P31 wd:Q5 ; wdt:P21 wd:Q6581072 . ' +
		occFilter + ' ' +
		ctyFilter + ' ' +
		'OPTIONAL { ?item wdt:P569 ?_dob . } ' +
		'OPTIONAL { ?item wdt:P570 ?_dod . } ' +
		'OPTIONAL { ?item wdt:P27 ?_country . ?_country rdfs:label ?_countryLabel . FILTER(LANG(?_countryLabel)="en") } ' +
		'OPTIONAL { ?item wdt:P106 ?_occItem . ?_occItem rdfs:label ?_occLabel . FILTER(LANG(?_occLabel)="en") } ' +
		'OPTIONAL { ?item wdt:P18 ?_image . } ' +
		'OPTIONAL { ?sitelink schema:about ?item . } ' +
		'FILTER NOT EXISTS { ?article schema:about ?item ; schema:isPartOf <https://en.wikipedia.org/> . } ' +
		'SERVICE wikibase:label { bd:serviceParam wikibase:language "en,mul" . } ' +
		'} ' +
		'GROUP BY ?item ?itemLabel ?itemDescription ' +
		'ORDER BY DESC(?sites) ' +
		'LIMIT ' + limit;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate( ds ) {
	if ( !ds ) return '';
	try {
		var d = new Date( ds );
		if ( isNaN( d ) ) return ds;
		var y = d.getUTCFullYear();
		var m = d.getUTCMonth() + 1;
		var day = d.getUTCDate();
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		if ( y < 0 ) return Math.abs( y ) + ' BCE';
		if ( m === 1 && day === 1 ) return '' + y;
		return day + ' ' + months[m - 1] + ' ' + y;
	} catch ( e ) { return ds; }
}

function getQid( uri ) {
	if ( !uri ) return '';
	var m = uri.match( /Q\d+$/ );
	return m ? m[0] : '';
}

function escHtml( s ) {
	var d = document.createElement( 'div' );
	d.textContent = s;
	return d.innerHTML;
}

function thumbUrl( commonsUrl, width ) {
	if ( !commonsUrl ) return '';
	return commonsUrl.replace( 'http://', 'https://' ) + '?width=' + ( width || 50 );
}

// ── State ────────────────────────────────────────────────────────────────────
var selectedOcc = null;
var selectedCty = null;
var lastQuery = '';
var currentLimit = 500;

// ── Build the UI using OOUI ──────────────────────────────────────────────────
mw.loader.using( [ 'oojs-ui-core', 'oojs-ui-widgets' ] ).then( function () {

	// Build occupation options grouped
	var occOptions = [];
	var occGroups = Object.keys( OCCUPATIONS );
	for ( var g = 0; g < occGroups.length; g++ ) {
		var groupName = occGroups[g];
		var groupItems = Object.keys( OCCUPATIONS[groupName] ).sort();
		var optionItems = [];
		for ( var i = 0; i < groupItems.length; i++ ) {
			optionItems.push( new OO.ui.MenuOptionWidget( {
				data: groupItems[i],
				label: groupItems[i]
			} ) );
		}
		occOptions.push( new OO.ui.MenuSectionOptionWidget( { label: groupName } ) );
		occOptions = occOptions.concat( optionItems );
	}

	// Build country options flat alphabetical
	var ctyOptions = [];
	for ( var c = 0; c < ALL_CTY.length; c++ ) {
		ctyOptions.push( new OO.ui.MenuOptionWidget( {
			data: ALL_CTY[c].name,
			label: ALL_CTY[c].name
		} ) );
	}

	// Limit options
	var limitOptions = [
		new OO.ui.MenuOptionWidget( { data: '100', label: '100' } ),
		new OO.ui.MenuOptionWidget( { data: '200', label: '200' } ),
		new OO.ui.MenuOptionWidget( { data: '500', label: '500' } ),
		new OO.ui.MenuOptionWidget( { data: '1000', label: '1000' } )
	];

	// Create widgets
	var occDropdown = new OO.ui.DropdownWidget( {
		label: 'Any occupation',
		menu: { items: occOptions, filterFromInput: true },
		$overlay: true
	} );
	occDropdown.$element.addClass( 'wir-dropdown' );

	var ctyDropdown = new OO.ui.DropdownWidget( {
		label: 'Any country',
		menu: { items: ctyOptions, filterFromInput: true },
		$overlay: true
	} );
	ctyDropdown.$element.addClass( 'wir-dropdown' );

	var limitDropdown = new OO.ui.DropdownWidget( {
		label: '500',
		menu: { items: limitOptions }
	} );
	limitDropdown.getMenu().selectItemByData( '500' );
	limitDropdown.$element.addClass( 'wir-limit-dropdown' );

	var searchButton = new OO.ui.ButtonWidget( {
		label: 'Search Wikidata',
		flags: [ 'primary', 'progressive' ],
		disabled: true
	} );

	var clearButton = new OO.ui.ButtonWidget( {
		label: 'Clear',
		flags: [ 'destructive' ],
		framed: false
	} );

	// Event handlers
	occDropdown.getMenu().on( 'select', function ( item ) {
		if ( item ) {
			var name = item.getData();
			selectedOcc = ALL_OCC.filter( function ( o ) { return o.name === name; } )[0] || null;
		}
		searchButton.setDisabled( !selectedOcc && !selectedCty );
	} );

	ctyDropdown.getMenu().on( 'select', function ( item ) {
		if ( item ) {
			var name = item.getData();
			selectedCty = ALL_CTY.filter( function ( c ) { return c.name === name; } )[0] || null;
		}
		searchButton.setDisabled( !selectedOcc && !selectedCty );
	} );

	limitDropdown.getMenu().on( 'select', function ( item ) {
		if ( item ) currentLimit = parseInt( item.getData() );
	} );

	clearButton.on( 'click', function () {
		selectedOcc = null;
		selectedCty = null;
		occDropdown.setLabel( 'Any occupation' );
		occDropdown.getMenu().selectItem( null );
		ctyDropdown.setLabel( 'Any country' );
		ctyDropdown.getMenu().selectItem( null );
		searchButton.setDisabled( true );
		var resultDiv = document.getElementById( 'wir-results' );
		if ( resultDiv ) resultDiv.innerHTML = '';
	} );

	searchButton.on( 'click', function () {
		doSearch();
	} );

	// ── Build DOM ────────────────────────────────────────────────────────────
	// Filter bar
	var $filterBar = $( '<div>' ).addClass( 'wir-filter-bar' );

	var $occField = new OO.ui.FieldLayout( occDropdown, {
		label: 'Occupation',
		align: 'top'
	} );
	var $ctyField = new OO.ui.FieldLayout( ctyDropdown, {
		label: 'Country',
		align: 'top'
	} );
	var $limitField = new OO.ui.FieldLayout( limitDropdown, {
		label: 'Limit',
		align: 'top'
	} );

	$filterBar.append(
		$occField.$element,
		$ctyField.$element,
		$limitField.$element,
		$( '<div>' ).addClass( 'wir-buttons' ).append(
			searchButton.$element,
			clearButton.$element
		)
	);

	// Results container
	var $results = $( '<div>' ).attr( 'id', 'wir-results' );

	// Assemble
	$( container ).empty().append( $filterBar, $results );

	// ── Search function ──────────────────────────────────────────────────────
	function doSearch() {
		if ( !selectedOcc && !selectedCty ) return;

		searchButton.setDisabled( true );
		searchButton.setLabel( 'Querying…' );

		var resultDiv = document.getElementById( 'wir-results' );
		resultDiv.innerHTML = '<div class="wir-loading">' +
			'<span class="mw-spinner mw-spinner-inline" style="display:inline-block">' +
			'<span class="mw-spinner-container"><div></div><div></div><div></div><div></div>' +
			'<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></span></span>' +
			' Querying Wikidata SPARQL endpoint…</div>';

		var query = buildQuery(
			selectedOcc ? selectedOcc.qids : null,
			selectedCty ? selectedCty.qId : null,
			currentLimit
		);
		lastQuery = query;

		var url = 'https://query.wikidata.org/sparql?query=' + encodeURIComponent( query ) + '&format=json';

		fetch( url, {
			headers: { 'Accept': 'application/sparql-results+json' }
		} )
		.then( function ( resp ) {
			if ( !resp.ok ) throw new Error( 'SPARQL ' + resp.status + ': ' + resp.statusText );
			return resp.json();
		} )
		.then( function ( data ) {
			var seen = {};
			var results = [];
			var bindings = data.results.bindings;
			for ( var i = 0; i < bindings.length; i++ ) {
				var b = bindings[i];
				var qid = getQid( b.item ? b.item.value : '' );
				var name = b.itemLabel ? b.itemLabel.value : '';
				if ( !qid || seen[qid] || /^Q\d+$/.test( name ) ) continue;
				seen[qid] = true;
				results.push( {
					qid: qid,
					name: name,
					description: b.itemDescription ? b.itemDescription.value : '',
					dob: fmtDate( b.dob ? b.dob.value : '' ),
					dod: fmtDate( b.dod ? b.dod.value : '' ),
					country: b.countryLabel ? b.countryLabel.value : '',
					occupations: b.occupations ? b.occupations.value : '',
					image: b.image ? b.image.value : '',
					sites: parseInt( b.sites ? b.sites.value : '0' ) || 0
				} );
			}
			renderResults( results );
		} )
		.catch( function ( err ) {
			resultDiv.innerHTML = '<div class="wir-error">' +
				'<strong>Query error:</strong> ' + escHtml( err.message ) +
				'<br><small>The Wikidata SPARQL endpoint may be temporarily overloaded. ' +
				'Try reducing the limit or narrowing your selection.</small></div>';
		} )
		.finally( function () {
			searchButton.setDisabled( false );
			searchButton.setLabel( 'Search Wikidata' );
		} );
	}

	// ── Render results as a wikitable ────────────────────────────────────────
	function renderResults( results ) {
		var resultDiv = document.getElementById( 'wir-results' );
		var titleParts = [];
		if ( selectedOcc ) titleParts.push( selectedOcc.name );
		if ( selectedCty ) titleParts.push( selectedCty.name );
		var title = titleParts.join( ' — ' );

		var sparqlUrl = 'https://query.wikidata.org/#' + encodeURIComponent( lastQuery );

		var html = '<h3>Missing articles: ' + escHtml( title ) + '</h3>';
		html += '<p class="wir-intro">This table of missing women biographies was generated using ' +
			'[https://www.wikidata.org Wikidata] for [[Wikipedia:WikiProject Women in Red]]. ' +
			'The table can be sorted by clicking on column headers. ' +
			'The <b>sitelinks</b> column indicates the number of links to information about the women on other ' +
			'Wikimedia projects and is often an indicator of notability.</p>';
		html += '<p class="wir-summary">∑ <b>' + results.length + '</b> items · ' +
			'<a href="' + sparqlUrl + '" target="_blank">View SPARQL query</a></p>';

		// Build wikitable
		html += '<table class="wikitable sortable wir-table">';
		html += '<thead><tr>' +
			'<th class="headerSort" data-sort-type="number">#</th>' +
			'<th>name</th>' +
			'<th class="wir-col-img">image</th>' +
			'<th class="wir-col-desc">description</th>' +
			'<th class="wir-col-occ">occupation (P106)</th>' +
			'<th>country of citizenship (P27)</th>' +
			'<th>date of birth (P569)</th>' +
			'<th>date of death (P570)</th>' +
			'<th>item</th>' +
			'<th class="headerSort" data-sort-type="number">sitelinks</th>' +
			'</tr></thead><tbody>';

		for ( var i = 0; i < results.length; i++ ) {
			var r = results[i];
			var wpTitle = r.name.replace( / /g, '_' );
			var imgHtml = r.image ? '<img src="' + thumbUrl( r.image, 50 ) +
				'" loading="lazy" alt="" width="50" style="border-radius:3px;max-height:50px;object-fit:cover">' : '';
			html += '<tr>' +
				'<td>' + ( i + 1 ) + '</td>' +
				'<td class="wir-name"><a href="/w/index.php?title=' + encodeURIComponent( wpTitle ) +
					'&action=edit&redlink=1" class="new" title="' + escHtml( r.name ) +
					' (page does not exist)">' + escHtml( r.name ) + '</a></td>' +
				'<td class="wir-col-img">' + imgHtml + '</td>' +
				'<td class="wir-col-desc">' + escHtml( r.description ) + '</td>' +
				'<td class="wir-col-occ">' + escHtml( r.occupations ) + '</td>' +
				'<td>' + escHtml( r.country ) + '</td>' +
				'<td>' + escHtml( r.dob ) + '</td>' +
				'<td>' + escHtml( r.dod ) + '</td>' +
				'<td><a href="https://www.wikidata.org/wiki/' + r.qid + '" class="extiw" title="d:' +
					r.qid + '">' + r.qid + '</a></td>' +
				'<td style="text-align:right">' + r.sites + '</td>' +
				'</tr>';
		}

		html += '</tbody></table>';

		if ( results.length === 0 ) {
			html += '<p><i>No results found. Try broadening your search.</i></p>';
		}

		resultDiv.innerHTML = html;

		// Re-init MediaWiki's sortable tables on the new content
		if ( mw.loader.getState( 'jquery.tablesorter' ) === 'ready' ) {
			$( resultDiv ).find( 'table.sortable' ).tablesorter();
		} else {
			mw.loader.using( 'jquery.tablesorter' ).then( function () {
				$( resultDiv ).find( 'table.sortable' ).tablesorter();
			} );
		}
	}

} ).catch( function ( err ) { // catch mw.loader.using errors
	container.innerHTML = '<p style="color:#d33"><strong>Error loading UI components:</strong> ' +
		String( err ) + '</p><p>Try <a href="' + mw.util.getUrl( mw.config.get( 'wgPageName' ) ) +
		'">reloading the page</a>.</p>';
} ); // end mw.loader.using

} ); // end mw.hook

} )();
