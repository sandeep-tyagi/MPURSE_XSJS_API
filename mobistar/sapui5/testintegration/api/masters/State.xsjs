
/**
 * This is a DateFunction() return Date Formate.
 * @author name : shriyansi
 */
 function dateFunction() {
	var dp = new Date();
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) {
		monthp = '0' + monthp;
	}
	if (dayp.length < 2) {
		dayp = '0' + dayp;
	}
	var yyyymmddp = dayp + '.' + monthp + '.' + yearp;
	return yyyymmddp;
}

/**
 * To delete any state on the behalf of state id.
 * @Param {String} state id as an input.
 * @return {output} success or failure.
 * @author: Shriyansi.
 */
 
  
 function checkStatusDescription(record){
    if(record.SOFT_DEL === '0'){
        record.SOFT_DEL_DESC = 'Active';
    }else  if(record.SOFT_DEL === '1'){
        record.SOFT_DEL_DESC = 'Inactive';
    }
    return record;
}

function dateFormat(record) {
    var date = record.CREATE_DATE;
   if (date) {
    record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    return record.CREATE_DATE;
   }
  }
function deleteState() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var stateCode = $.request.parameters.get('stateCode');
	var record = {};
	try {
		var qryDeleteState = 'update "MDB_TEST_INTEGRATION"."MST_STATE" set SOFT_DEL=? where STATE_CODE=?';
		var pstmtDeleteState = connection.prepareStatement(qryDeleteState);
		pstmtDeleteState.setString(1, '1');
		pstmtDeleteState.setString(2, stateCode);
		var rsDeleteRegion = pstmtDeleteState.executeUpdate();
		connection.commit();
		if (rsDeleteRegion > 0) {
			record.status = '0';
			record.message = 'Successfully deleted State';
		} else {
			record.status = '1';
			record.message = 'failed to delete State.Kindly contact to Admin!!! ';
		}
		Output.results.push(record);
		connection.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/**
 * To Update any state on the behalf of state id.
 * @Param {String} state id as an input.
 * @return {output} success or failure.
 * @author : Shriyansi.
 */
function updateState() {
	var record;
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();

	var STATE_CODE = $.request.parameters.get('STATE_CODE');
	var STATE_NAME = $.request.parameters.get('STATE_NAME');
	var COUNTRY_CODE = $.request.parameters.get('COUNTRY_CODE');
    var softDel =  $.request.parameters.get('softDel');
   var modifiedBy =  $.request.parameters.get('modifiedBy');
	try {
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, STATE_CODE);
		pstmtCallPro.setString(2, STATE_NAME);
		pstmtCallPro.setString(3, COUNTRY_CODE);
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, softDel);
		pstmtCallPro.setString(6, 'ADMIN');
		pstmtCallPro.setString(7, dateFunction());
		pstmtCallPro.setString(8, modifiedBy);
		pstmtCallPro.setString(9, dateFunction());
		pstmtCallPro.setString(10, 'UPDATE');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		if (rCallPro > 0) {
			record.status = 1;
			record.Message = "Record Successfully Update";

		} else {
			record.status = 0;
			record.Message = "Record Successfully  not Update";
		}

		Output.results.push(record);
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/**
 * To fetch any states.
 * @Param {String} countrycode as an input.
 * @return {output} row of resultset.
 * @author : Shriyansi.
 */
function getState() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var SCountry = $.request.parameters.get('SCountry');
	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, 'null');
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, SCountry);
		pstmtCallPro.setString(4, 'null');
		pstmtCallPro.setString(5, '0');
		pstmtCallPro.setString(6, 'ADMIN');
		pstmtCallPro.setString(7, dateFunction());
		pstmtCallPro.setString(8, 'null');
		pstmtCallPro.setString(9, dateFunction());
		pstmtCallPro.setString(10, 'SELECT1STATE');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.StateCode = rCallPro.getString(1);
			record.StateName = rCallPro.getString(2);
			record.CountryCode = rCallPro.getString(3);
			record.RegionCode = rCallPro.getString(4);
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

/**
 * To fetch All state of state master.
 * @return {output} row of resultset.
 * @author: Shriyansi.
 */
function getStates() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var pstmtState = '';
	var queryState = '';
	try {
		queryState = 'SELECT * FROM "MDB_TEST_INTEGRATION"."MST_STATE" as s inner join "MDB_TEST_INTEGRATION"."MST_REGION" as r on s.REGION_CODE=r.REGION_CODE ';
		pstmtState = connection.prepareStatement(queryState);
		var rsState = pstmtState.executeQuery();
		while (rsState.next()) {
			var record = {};
			record.StateCode = rsState.getString(1);
			record.StateName = rsState.getString(2);
			record.CountryCode = rsState.getString(3);
			record.RegionCode = rsState.getString(4);
			record.SOFT_DEL = rsState.getString(5);
			record.CREATE_BY = rsState.getString(6);
			record.CREATE_DATE = rsState.getString(7);
			record.RegionName = rsState.getString(11);
			checkStatusDescription(record);
            dateFormat(record);
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

/**
 * To fetch All state for a region on the behalf of regioncode .
 * @return {output} row of resultset.
 * @author: Shriyansi.
 */
function getRegionStates() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var regionCode = $.request.parameters.get('regionCode');
	var pstmtState = '';
	var queryState = '';
	try {

		queryState = 'SELECT * FROM  "MDB_TEST_INTEGRATION"."MST_STATE" WHERE REGION_CODE=?';
		pstmtState = connection.prepareStatement(queryState);
		pstmtState.setString(1, regionCode);

		var rsState = pstmtState.executeQuery();

		while (rsState.next()) {
			var record = {};
			record.StateCode = rsState.getString(1);
			record.StateName = rsState.getString(2);
			record.CountryCode = rsState.getString(3);
			record.RegionCode = rsState.getString(4);
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

function fetchState(inputData,connection){
    var queryselectState = 'select * from "MDB_TEST_INTEGRATION"."MST_STATE" where SOFT_DEL is not null ';
    var whereClause = "";
    if(inputData.countryName !== ''){
        whereClause += " AND STATE_CODE='" + inputData.STATE_CODE + "'";
    }
    if(inputData.countryName !== ''){
        whereClause += " AND STATE_NAME='" + inputData.STATE_NAME + "'";
    }
    if(inputData.countryCode !== ''){
        whereClause += " AND COUNTRY_CODE='" + inputData.COUNTRY_CODE + "'";
    }
    if(inputData.countryName !== ''){
        whereClause += " AND REGION_CODE='" + inputData.REGION_CODE + "'";
    }
    queryselectState += whereClause; 
	var pstmtSelectState = connection.prepareStatement(queryselectState);
	var rsSelectState = pstmtSelectState.executeQuery();
	return rsSelectState;
}

/**
 * To fetch All state for a country.
 * @return {output} row of resultset.
 * @author : Shriyansi.
 */
function getCountryStates() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var countryCode = $.request.parameters.get('countryCode');
	var pstmtState = '';
	var queryState = '';
	try {

		queryState = 'SELECT * FROM  "MDB_TEST_INTEGRATION"."MST_STATE" WHERE COUNTRY_CODE=? and soft_del = ?';
		pstmtState = connection.prepareStatement(queryState);
		pstmtState.setString(1, countryCode);
        pstmtState.setString(2, '0');
		var rsState = pstmtState.executeQuery();

		while (rsState.next()) {
			var record = {};
			record.StateCode = rsState.getString(1);
			record.StateName = rsState.getString(2);
			record.CountryCode = rsState.getString(3);
			record.RegionCode = rsState.getString(4);
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

/**
 * To add State into State master table.
 * @Param {COUNTRY_CODE, STATE_CODE, STATE_NAME,REGION_CODE} string variable.
 * @return {String} integer.
 */
function addState(inputData,connection,record) {

			var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
			var pstmtCallPro = connection.prepareCall(CallPro);
			pstmtCallPro.setString(1, inputData.STATE_CODE);
			pstmtCallPro.setString(2,inputData.STATE_NAME);
			pstmtCallPro.setString(3, inputData.COUNTRY_CODE);
			pstmtCallPro.setString(4, inputData.REGION_CODE);
			pstmtCallPro.setString(5, '0');
			pstmtCallPro.setString(6, inputData.createby);
			pstmtCallPro.setString(7, dateFunction());
			pstmtCallPro.setString(8, 'null');
			pstmtCallPro.setString(9, dateFunction());
			pstmtCallPro.setString(10, 'INSERT');
			pstmtCallPro.execute();
			var rCallPro = pstmtCallPro.getParameterMetaData();
			connection.commit();
				if (rCallPro.getParameterCount() > 0) {
				record.status = 1;
				record.Message = "Record Successfully inserted";
			} else {
				record.status = 0;
				record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
			}
	

}
/*
/**
 * To fetch any District, Country and state on the behalf of StateCode.
 * @Param {String} state id as an input.
 * @return {output} row of resultset.
 * @Author: Shriyansi.
 */
function getDistrictByStateCountry() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var record;
	var StateCode = $.request.parameters.get('StateCode');
	try {
		var query =
			'select md.DISTRICT_CODE,md.DISTRICT_NAME,ms.STATE_CODE,ms.REGION_CODE,ms.COUNTRY_CODE  from "MDB_TEST_INTEGRATION"."MST_DISTRICT" as md inner join "MDB_TEST_INTEGRATION"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE inner join "MDB_TEST_INTEGRATION"."MST_COUNTRY" as cm on ms.COUNTRY_CODE = cm.COUNTRY_CODE where md.STATE_CODE = ? and md.soft_del = ? ';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, StateCode);
		pstmt.setString(2, '0');
		var rs = pstmt.executeQuery();
		connection.commit();
		while (rs.next()) {
			record = {};
			record.DistrictCode = rs.getString(1);
			record.DistrictName = rs.getString(2);
			record.StateCode = rs.getString(3);
			record.ZoneCode = rs.getString(5);
			record.CountryCode = rs.getString(4);
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

/**
 * This is a fucntion which is called by getStateHierarchy() to fetch stateHierarchy on the behalf of StateCode.
 * @Param {String} statecode as an input.
 * @return {output} row of resultset.
 * @Author: Shriyansi.
 */

function getStateDetails(stateCode, output) {
	var connection = $.db.getConnection();
	var record;
	var recordDistrict;
	var recordArea;
	var recordZone;
	var recordBranch;
	var districtarray = [];
	var areaArray = [];
	var zoneArray = [];
	var branchArray = [];
	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, stateCode);
		pstmtCallPro.setString(2, ' ');
		pstmtCallPro.setString(3, ' ');
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, '0');
		pstmtCallPro.setString(6, ' ');
		pstmtCallPro.setString(7, dateFunction());
		pstmtCallPro.setString(8, ' ');
		pstmtCallPro.setString(9, dateFunction());
		pstmtCallPro.setString(10, 'SELECTSTATE');
		pstmtCallPro.execute();
		var rsCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		record = {};
		while (rsCallPro.next()) {
			record.STATE_CODE = rsCallPro.getString(1);
			record.STATE_NAME = rsCallPro.getString(2);
			record.COUNTRY_CODE = rsCallPro.getString(3);
			record.REGION_CODE = rsCallPro.getString(4);
			record.REGION_NAME = rsCallPro.getString(5);
			}

		var CallProDistrict = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallProDistrict = connection.prepareCall(CallProDistrict);
		pstmtCallProDistrict.setString(1, stateCode);
		pstmtCallProDistrict.setString(2, ' ');
		pstmtCallProDistrict.setString(3, ' ');
		pstmtCallProDistrict.setString(4, ' ');
		pstmtCallProDistrict.setString(5, '0');
		pstmtCallProDistrict.setString(6, ' ');
		pstmtCallProDistrict.setString(7, dateFunction());
		pstmtCallProDistrict.setString(8, ' ');
		pstmtCallProDistrict.setString(9, dateFunction());
		pstmtCallProDistrict.setString(10, 'STATEDISTRICT');
		pstmtCallProDistrict.execute();
		var rsCallProDistrict = pstmtCallProDistrict.getResultSet();
		connection.commit();
		while (rsCallProDistrict.next()) {
			recordDistrict = {};
			recordDistrict.DISTRICT_CODE = rsCallProDistrict.getString(1);
			recordDistrict.DISTRICT_NAME = rsCallProDistrict.getString(2);

			var CallProAREA = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
			var pstmtCallProAREA = connection.prepareCall(CallProAREA);
			pstmtCallProAREA.setString(1, recordDistrict.DISTRICT_CODE);
			pstmtCallProAREA.setString(2, ' ');
			pstmtCallProAREA.setString(3, ' ');
			pstmtCallProAREA.setString(4, ' ');
			pstmtCallProAREA.setString(5, '0');
			pstmtCallProAREA.setString(6, ' ');
			pstmtCallProAREA.setString(7, dateFunction());
			pstmtCallProAREA.setString(8, ' ');
			pstmtCallProAREA.setString(9, dateFunction());
			pstmtCallProAREA.setString(10, 'STATEAREA');
			pstmtCallProAREA.execute();
			var rsCallProAREA = pstmtCallProAREA.getResultSet();
			connection.commit();
			while (rsCallProAREA.next()) {
				recordArea = {};
				recordArea.AREA_CODE = rsCallProAREA.getString(1);
				recordArea.AREA_NAME = rsCallProAREA.getString(2);
				districtarray.push(recordArea);

				var CallProZONE = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
				var pstmtCallProZONE = connection.prepareCall(CallProZONE);
				pstmtCallProZONE.setString(1, recordArea.AREA_CODE);
				pstmtCallProZONE.setString(2, ' ');
				pstmtCallProZONE.setString(3, ' ');
				pstmtCallProZONE.setString(4, ' ');
				pstmtCallProZONE.setString(5, '0');
				pstmtCallProZONE.setString(6, ' ');
				pstmtCallProZONE.setString(7, dateFunction());
				pstmtCallProZONE.setString(8, ' ');
				pstmtCallProZONE.setString(9, dateFunction());
				pstmtCallProZONE.setString(10, 'STATEZONE');
				pstmtCallProZONE.execute();

				var rsCallProZONE = pstmtCallProZONE.getResultSet();
				connection.commit();
				while (rsCallProZONE.next()) {
					recordZone = {};
					recordZone.ZONE_CODE = rsCallProZONE.getString(1);
					recordZone.ZONE_NAME = rsCallProZONE.getString(2);
					zoneArray.push(recordZone);

					var CallProBRANCH = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::State_CRUD"(?,?,?,?,?,?,?,?,?,?)';
					var pstmtCallProBRANCH = connection.prepareCall(CallProBRANCH);
					pstmtCallProBRANCH.setString(1, recordZone.ZONE_CODE);
					pstmtCallProBRANCH.setString(2, ' ');
					pstmtCallProBRANCH.setString(3, ' ');
					pstmtCallProBRANCH.setString(4, ' ');
					pstmtCallProBRANCH.setString(5, '0');
					pstmtCallProBRANCH.setString(6, ' ');
					pstmtCallProBRANCH.setString(7, dateFunction());
					pstmtCallProBRANCH.setString(8, ' ');
					pstmtCallProBRANCH.setString(9, dateFunction());
					pstmtCallProBRANCH.setString(10, 'STATEBRANCH');
					pstmtCallProBRANCH.execute();
					var rsCallProBRANCH = pstmtCallProBRANCH.getResultSet();
					while (rsCallProBRANCH.next()) {
						recordBranch = {};
						recordBranch.BRANCHCODE = rsCallProBRANCH.getString(1);
						recordBranch.BRANCHNAME = rsCallProBRANCH.getString(2);
						branchArray.push(recordBranch);
					
					}
					recordZone.BRANCH = branchArray;	
					recordArea.ZONE = zoneArray;
					//areaArray.push(recordArea);
				}//zoneArray.BRANCH = branchArray;
				//recordArea.ZONE = zoneArray;
                areaArray.push(recordArea);
			}
			recordDistrict.AREA = areaArray;
			districtarray.push(recordDistrict);
		}
		record.DISTRICT = districtarray;
		output.results.push(record);
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

}

/**
 * This is a fucntion which is called getStateDetails() to fetch stateHierarchy on the behalf of StateCode.
 * @Param {String} statecode as an input.
 * @return {output} row of resultset.
 * @Author: Shriyansi.
 */

function getStateHierarchy() {
	var output = {
		results: []
	};
	var stateCode = $.request.parameters.get('stateCode');
	try {
		if (stateCode !== null && stateCode !== "") {
			getStateDetails(stateCode, output);
		}
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

/**
 * This is a validateState() which is call before add state details.
 * @author name : shriyansi
 */

function validateState(){
	var record;
	var Output = {
		results: []
	};
	var inputData = {};
	var connection = $.db.getConnection();
	var COUNTRY_CODE = $.request.parameters.get('COUNTRY_CODE');
	var STATE_CODE = $.request.parameters.get('STATE_CODE');
	var STATE_NAME = $.request.parameters.get('STATE_NAME');
	var REGION_CODE = $.request.parameters.get('REGION_CODE');
	var createby = $.request.parameters.get('createby');
	inputData.COUNTRY_CODE = COUNTRY_CODE;
	inputData.STATE_CODE = STATE_CODE;
	inputData.STATE_NAME = STATE_NAME;
	inputData.REGION_CODE = REGION_CODE;
	inputData.createby = createby;
		try {
	    var	record = {};
	    var rsStateValidation = fetchState(inputData,connection);
		if (rsStateValidation.next()) {
		    var softDel = rsStateValidation.getString(5);
		    var stateName = rsStateValidation.getString(2);
		    if(stateName === STATE_NAME){
		        record.status = 1;
				record.Message = "This State Name is  already present in our System!!! Kindly add another State Name.";
		    }else if(softDel === "0"){
		        record.status = 1;
				record.Message = "State already present in our System!!! Kindly add another State.";
		    }else{
		       record.status = 1;
			   record.Message = "State is inactive in our System!!! Kindly use edit functionality to activate it."; 
		    }
		} else {
		  addState(inputData,connection,record);
		}
		Output.results.push(record);
		connection.close();
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
	
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getStates":
		getStates();
		break;
	case "getState":
		getState();
		break;
	case "getRegionStates":
		getRegionStates();
		break;
	case "getCountryStates":
		getCountryStates();
		break;
	case "addState":
		addState();
		break;
	case "updateState":
		updateState();
		break;
	case "deleteState":
		deleteState();
		break;	
	case "updateState":
		updateState();
		break;	
	case "getDistrictByStateCountry":
		getDistrictByStateCountry();
		break;
	case "getStateHierarchy":
		getStateHierarchy();
		break;
	case "getStateDetails":
		getStateDetails();
		break;
	case "validateState":
	    validateState();
	    break;
	case "fetchState":
	    fetchState();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}