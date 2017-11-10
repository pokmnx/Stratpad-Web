<?php

// deployed manually to /var/www/html/regions.php
// https://cloud.stratpad.com/regions.php?q=victo

// dependency: mysql db, installed and imported from http://forums.geobytes.com/viewtopic.php?f=32&t=6816
// see /home/woodj/geobytes on cloud.stratpad.com

// update as of Jun 2015 - looks like this is unsupported now - the cron gets 404'd when it tries to download, and there don't seem 
// to be any updates available; so, we are left updating ourselves, or using their API:
// http://www.geobytes.com/free-ajax-cities-jsonp-api/

// could also do reverse ip lookup to get a city, and then join against nbc so that we can order results by distance
// <script type="text/javascript" src="http://www.google.com/jsapi"></script>
// JSON.stringify(google.loader.ClientLocation)
// {"latitude":53.59,"longitude":-113.407,"address":{"city":"Edmonton","region":"AB","country":"Canada","country_code":"CA"}}
// note that we also have X-AppEngine-City, X-AppEngine-Region and X-AppEngine-Country
// eg. http://mylocationtest.appspot.com/
// can re-order in javascript - eg to put the putative country at the top

$headers = getallheaders();

// eg. http://localhost:8000
$request_origin = $headers['Origin'];

// CORS
$host = parse_url($request_origin, PHP_URL_HOST);
if ($host == 'localhost' || $host == 'staging.stratpad.com' || $host == 'cloud.stratpad.com') {
	header("Access-Control-Allow-Origin: " . $request_origin);
	header('Access-Control-Allow-Credentials: true');
	header('Access-Control-Allow-Methods: GET');
}

// return JSON
header('Content-Type: application/json');

// choose a query param q > city > region > country

if ($_GET["q"] != '') {
	getCities($_GET["q"]);
} 
else if ($_GET["city"] != '') {
	getCities($_GET["city"]);
}
else if ($_GET["region"] != '') {
	getRegions($_GET["region"]);
}
else if ($_GET["countryId"] != '') {
	getRegionsByCountry($_GET["countryId"]);	
}
else if ($_GET["country"] != '') {
	getCountries($_GET["country"]);	
}
else 
{
    print("No query.");
    exit();
}


function mysqlConnect() {
	// connect
	$mysqli = new mysqli("localhost", "stratpad", "#$%asd3443Qeyu", "geobytes");
	if (mysqli_connect_errno()) {
		printf("Connect failed: %s\n", mysqli_connect_error());
		exit();
	}

	// db is in latin1
	if (!$mysqli->set_charset("latin1")) {
		printf("Error loading character set latin1: %s\n", $mysqli->error);
		exit();
	}
	
	return $mysqli;
}

function getCities($queryParam) {
	$mysqli = mysqlConnect();
	$query = $queryParam . "%";

	// ordering and scoring done by our selectize UI control
	// because we are limiting, get the best city matches and return those (rather than sorting during the query)	
	$sql = "
	SELECT C.CityId, C.City, R.Region, Co.Country, Co.CurrencyCode 
		FROM Cities C 
		JOIN Regions R ON R.RegionID = C.RegionID 
		JOIN Countries Co ON Co.CountryID = C.CountryID
		WHERE C.City like ? limit 50
	";
	$response = array("data"=>array("locations"=>array()), "status"=>"success");
	if ($stmt = $mysqli->prepare($sql)) {

		$stmt->bind_param("s", $query); // 's' = string
		$stmt->execute();    
		$stmt->bind_result($cityId, $city, $region, $country, $currency);

		// cityId, city, region, country, currency
		while ($stmt->fetch()) {
			$response['data']['locations'][] = array('cityId'=> $cityId, 'city'=> utf8_encode($city), region=> utf8_encode($region), 'country'=> utf8_encode($country), 'currency'=>utf8_encode($currency));    	
		}

		$stmt->close();
	}

	$mysqli->close();

	// {"data":{"locations":[{"city":"Edmonton","country":"Canada","region":"Alberta"}]},"status":"success"}
	print json_encode($response);

}

function getRegions($queryParam) {
	$mysqli = mysqlConnect();
	$query = $queryParam . "%";
	$sql = "
		SELECT R.RegionID, R.Region, Co.Country, Co.CurrencyCode 
			FROM Regions R JOIN Countries Co ON Co.CountryID = R.CountryID 
			WHERE R.Region like ? order by Co.Country, R.Region limit 50
	";
	$response = array("data"=>array("locations"=>array()), "status"=>"success");
	if ($stmt = $mysqli->prepare($sql)) {

		$stmt->bind_param("s", $query); // 's' = string
		$stmt->execute();    
		$stmt->bind_result($regionId, $region, $country, $currency);

		// cityId, city, region, country, currency
		while ($stmt->fetch()) {
			$response['data']['locations'][] = array('regionId'=> $regionId, 'region'=> utf8_encode($region), 'country'=> utf8_encode($country), 'currency'=>utf8_encode($currency));    	
		}

		$stmt->close();
	}

	$mysqli->close();

	// {"data":{"locations":[{"regionId":1234,"country":"Canada","region":"Alberta"}]},"status":"success"}
	print json_encode($response);

}

function getRegionsByCountry($countryId) {
	$mysqli = mysqlConnect();
	$sql = "
		SELECT R.RegionID, R.Region, Co.Country, Co.CurrencyCode 
			FROM Regions R JOIN Countries Co ON Co.CountryID = R.CountryID 
			WHERE Co.CountryId = ? order by R.Region limit 100
	";
	$response = array("data"=>array("locations"=>array()), "status"=>"success");
	if ($stmt = $mysqli->prepare($sql)) {

		$stmt->bind_param("i", $countryId); // 'i' = int
		$stmt->execute();    
		$stmt->bind_result($regionId, $region, $country, $currency);

		// cityId, city, region, country, currency
		while ($stmt->fetch()) {
			$response['data']['locations'][] = array('regionId'=> $regionId, 'region'=> utf8_encode($region), 'country'=> utf8_encode($country), 'currency'=>utf8_encode($currency));    	
		}

		$stmt->close();
	}

	$mysqli->close();

	// {"data":{"locations":[{"regionId":1234,"country":"Canada","region":"Alberta"}]},"status":"success"}
	print json_encode($response);

}


function getCountries($queryParam) {
	$mysqli = mysqlConnect();
	$query = $queryParam . "%";
	$sql = "
	SELECT Co.CountryID, Co.Country, Co.CurrencyCode 
		FROM Countries Co
		WHERE Co.Country like ? order by Co.Country limit 50
	";
	$response = array("data"=>array("locations"=>array()), "status"=>"success");
	if ($stmt = $mysqli->prepare($sql)) {

		$stmt->bind_param("s", $query); // 's' = string
		$stmt->execute();    
		$stmt->bind_result($countryId, $country, $currency);

		// cityId, city, region, country, currency
		while ($stmt->fetch()) {
			$response['data']['locations'][] = array('countryId'=> $countryId, 'country'=> utf8_encode($country), 'currency'=>utf8_encode($currency));    	
		}

		$stmt->close();
	}

	$mysqli->close();

	// {"data":{"locations":[{"city":"Edmonton","country":"Canada","region":"Alberta"}]},"status":"success"}
	print json_encode($response);

}

?>
