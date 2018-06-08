function getAllCountryData(){
	var output = {
		results: []
	};
	output.results.push({});
	var connection = $.db.getConnection();
	try {
		var queryGetAllCountry = 'SELECT * FROM "MDB_TEST_INTEGRATION"."COUNTRIESDATA" ' ;
		var pstmtGetAllCountry = connection.prepareStatement(queryGetAllCountry);
		var rGetAllCountry = pstmtGetAllCountry.executeQuery();
		connection.commit();
		while (rGetAllCountry.next()) {
			var record = {};
			record.ID = rGetAllCountry.getString(1);
			record.COUNTRYCODE = rGetAllCountry.getString(2);
			record.COUNTRYNAME = rGetAllCountry.getString(3);
			record.CURRENCYCODE = rGetAllCountry.getString(4);
			record.ISONUMERIC = rGetAllCountry.getString(5);
			record.NORTH = rGetAllCountry.getString(6);
			record.SOUTH = rGetAllCountry.getString(7);
			record.EAST = rGetAllCountry.getString(8);
			record.WEST = rGetAllCountry.getString(9);
			record.CAPITAL = rGetAllCountry.getString(10);
			record.CONTINENTNAME = rGetAllCountry.getString(11);
			record.CONTINENT = rGetAllCountry.getString(12);
			record.AREAINSQKM = rGetAllCountry.getString(13);
			record.ISOALPHA3 = rGetAllCountry.getString(14);
			record.GEONAMEID = rGetAllCountry.getString(15);
			output.results.push(record);
		}
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function getAllRegionData(){
	var output = {
		results: []
	};
	output.results.push({});
	var CountryCode = $.request.parameters.get('COUNTRYCODE');
	var connection = $.db.getConnection();
	try {
		var queryGetAllRegion = 'SELECT * FROM "MDB_TEST_INTEGRATION"."REGIONSDATA" where COUNTRYCODE = ?' ;
		var pstmtGetAllRegion = connection.prepareStatement(queryGetAllRegion);
		pstmtGetAllRegion.setString(1,CountryCode);
		var rGetAllRegion = pstmtGetAllRegion.executeQuery();
		connection.commit();
		while (rGetAllRegion.next()) {
			var record = {};
			record.COUNTRYCODE = rGetAllRegion.getString(2);
			record.REGIONNAME = rGetAllRegion.getString(3);
			record.REGIONCODE = rGetAllRegion.getString(4);
			/*record.CURRENCYCODE = rGetAllCountry.getString(4);
			record.ISONUMERIC = rGetAllCountry.getString(5);
			record.NORTH = rGetAllCountry.getString(6);
			record.SOUTH = rGetAllCountry.getString(7);
			record.EAST = rGetAllCountry.getString(8);
			record.WEST = rGetAllCountry.getString(9);
			record.CAPITAL = rGetAllCountry.getString(10);
			record.CONTINENTNAME = rGetAllCountry.getString(11);
			record.CONTINENT = rGetAllCountry.getString(12);
			record.AREAINSQKM = rGetAllCountry.getString(13);
			record.ISOALPHA3 = rGetAllCountry.getString(14);
			record.GEONAMEID = rGetAllCountry.getString(15);*/
			output.results.push(record);
		}
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function getAllStateData(){
	var output = {
		results: []
	};
	output.results.push({});
	var countryCode =  $.request.parameters.get('countryCode');
	var connection = $.db.getConnection();
	try {
		var queryGetAllState = 'SELECT s.STATE_NAME, s.STATE_CODE ,s.COUNTRYCODE, r.REGIONCODE , r.REGIONNAME FROM  "MDB_TEST_INTEGRATION"."STATESDATA" as s inner join "MDB_TEST_INTEGRATION"."REGIONSDATA" as r on s.REGIONCODE= r.REGIONCODE '
	+ ' inner join "MDB_TEST_INTEGRATION"."MST_REGION" as mr on s.REGIONCODE = mr.REGION_CODE where mr.COUNTRY_CODE = s.COUNTRYCODE and mr.SOFT_DEL =  ? and s.COUNTRYCODE = ? ' ;
		var pstmtGetAllState = connection.prepareStatement(queryGetAllState);
		pstmtGetAllState.setString(1,'0');
		pstmtGetAllState.setString(2,countryCode);
		var rGetAllState = pstmtGetAllState.executeQuery();
		connection.commit();
		while (rGetAllState.next()) {
			var record = {};
			record.STATE_NAME = rGetAllState.getString(1);
			record.STATE_CODE = rGetAllState.getString(2);
			record.COUNTRYCODE = rGetAllState.getString(3);
			record.REGIONCODE = rGetAllState.getString(4);
			record.REGIONNAME = rGetAllState.getString(5);
			output.results.push(record);
		}
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

function getAllDistrictData(){
	var output = {
		results: []
	};
	output.results.push({});
	var connection = $.db.getConnection();
	var stateCode = $.request.parameters.get('StateCode');
	try {
		var queryGetAllDistrict = ' SELECT dd.DISTRICT_CODE,dd.DISTRICT_NAME,dd.STATE_CODE FROM "MDB_TEST_INTEGRATION"."DISTRICT_DATA" as dd ' 
+ ' inner join "MDB_TEST_INTEGRATION"."MST_STATE" as ms on dd.STATE_CODE = ms.STATE_CODE '
+ ' where ms.SOFT_DEL = ? and dd.STATE_CODE = ?';
		//'SELECT * FROM "MDB_TEST_INTEGRATION"."DISTRICT_DATA"  where STATE_CODE = ? ';
		var pstmtGetAllDistrict = connection.prepareStatement(queryGetAllDistrict);
		pstmtGetAllDistrict.setString(1, '0');
		pstmtGetAllDistrict.setString(2, stateCode);
		var rGetAllDistrict = pstmtGetAllDistrict.executeQuery();
		connection.commit();
		while (rGetAllDistrict.next()) {
			var record = {};
			record.DISTRICT_CODE = rGetAllDistrict.getString(1);
			record.DISTRICT_NAME = rGetAllDistrict.getString(2);
			record.STATE_CODE = rGetAllDistrict.getString(3);
		/*	record.STATE_NAME = rGetAllDistrict.getString(5);*/
			output.results.push(record);
		}
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

	var aCmd = $.request.parameters.get('cmd');
    switch (aCmd) {
    case "getAllCountryData":
        getAllCountryData();
        break;
    case "getAllRegionData":
        getAllRegionData();
        break;
    case "getAllStateData":
        getAllStateData();
        break;
    case "getAllDistrictData":
        getAllDistrictData();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}