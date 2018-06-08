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
 * fetch country from country master
 * @Param {} inputData.
 * @returns {output} resultset of Country
 */ 
function fetchCountry(inputData,connection){
    var queryselectCountry = 'select * from "MDB_DEV"."MST_COUNTRY" where SOFT_DEL is not null ';
    var whereClause = "";
    if(inputData.countryCode !== ''){
        whereClause += " AND COUNTRY_CODE='" + inputData.countryCode + "'";
    }
    if(inputData.countryName !== ''){
        whereClause += " AND COUNTRY_NAME='" + inputData.countryName + "'";
    }
    queryselectCountry += whereClause; 
	var pstmtSelectCountry = connection.prepareStatement(queryselectCountry);
	var rsSelectCountry = pstmtSelectCountry.executeQuery();
	return rsSelectCountry;
}
/**
 * To fetch a country from country master on the behalf of input countryCode.
 * @Param {String} countryCode for search
 * @Param [] output to put the data in it
 * @returns {output} Array of country record
 */
 
function getCountryDetails(countryCode,output){
    var inputData = {};
	inputData.countryCode = countryCode;
	inputData.countryName = "";
    var connection = $.db.getConnection();
    var rsCountrydetails = fetchCountry(inputData,connection);
	while (rsCountrydetails.next()) {
		var record = {};
		record.COUNTRYCODE = rsCountrydetails.getString(1);
		record.COUNTRYNAME = rsCountrydetails.getString(2);
		record.SOFTDEL = rsCountrydetails.getString(3);
		record.CREATEDBY = rsCountrydetails.getString(4);
		record.CREATEDDATE = rsCountrydetails.getString(5);
		record.MODIFYBY = rsCountrydetails.getString(6);
		record.MODIFYDATE = rsCountrydetails.getString(7);
		output.results.push(record);
	}
	connection.commit();
	connection.close();
}
/**
 * To fetch a country from country master on the behalf of input countryCode.
 * @Param {String} countryCode for search
 * @returns {output} Array of country record
 */
 

function getCountry() {
    var output = {
		results: []
	};

	var countryCode = $.request.parameters.get('countryCode');
	try {
		getCountryDetails(countryCode, output);
		
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
 * To fetch all the country present in CountryMaster.
 * @Param [] output .
 * @return {String} array of country record .
 */ 
function getCountries() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallCountry = 'select  * from "MDB_DEV"."MST_COUNTRY"';
		var pstmtCallCountry = connection.prepareCall(CallCountry);
		pstmtCallCountry.execute();
		var rsCallCountry = pstmtCallCountry.getResultSet();
		connection.commit();
		while (rsCallCountry.next()) {
			var record = {};
			record.CountryCode = rsCallCountry.getString(1);
			record.CountryName = rsCallCountry.getString(2);
			record.SOFT_DEL = rsCallCountry.getString(3);
			record.CREATE_BY = rsCallCountry.getString(4);
			record.CREATE_DATE = rsCallCountry.getString(5);
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



/*checkStatusDescription(record);
            dateFormat(record);*/
 /**
 * Insert new country.
 * @Param {string} countryCode 
 * @Param {string} countryName .
 * @Param [] output .
 * @return {String} message .
 */ 
function addCountry(inputData,connection,record) {
			var quryInsertCountry =
				'insert into  "MDB_DEV"."MST_COUNTRY"(COUNTRY_CODE,COUNTRY_NAME,CREATE_BY) values(?,?,?)';
			var paramInsertCountry = connection.prepareStatement(quryInsertCountry);
			paramInsertCountry.setString(1, inputData.countryCode);
			paramInsertCountry.setString(2, inputData.countryName);
			paramInsertCountry.setString(3, inputData.createby);
			var rsInsertCountry = paramInsertCountry.executeUpdate();
			connection.commit();
			if (rsInsertCountry > 0) {
				record.status = 1;
				record.Message = "Country Successfully inserted";
			} else {
				record.status = 0;
				record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
			}
	

}
function getTodayDate(){
    var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if(dd < 10) {
    dd = "0" + dd;
} 

if(mm < 10) {
    mm = "0" + mm;
} 

today = dd + '.' + mm + '.' + yyyy;
return today;
}
/**
 * Update the Country data
 * @Param {string} countryCode
 * @Param {string} countryName.
 * @Param [] output .
 * @returns {string} message.
 */
function updateCountry() {
 	var Output = {
		results: []
	};
	
	var connection = $.db.getConnection();
	var countryCode = $.request.parameters.get('countryCode');
	var countryName = $.request.parameters.get('countryName');
	var softDel =  $.request.parameters.get('softDel');
	var modifiedBy =  $.request.parameters.get('modifiedBy');
	var record = {};
	try {
			var qryUpdateCountry = 'update "MDB_DEV"."MST_COUNTRY"  set COUNTRY_NAME =? , SOFT_DEL =?,MODIFIED_BY=?,MODIFIED_DATE=? where COUNTRY_CODE=? ';
			var pstmtUpdateCountry = connection.prepareStatement(qryUpdateCountry);
			pstmtUpdateCountry.setString(1, countryName);
			pstmtUpdateCountry.setString(2, softDel);
			pstmtUpdateCountry.setString(3, modifiedBy);
			pstmtUpdateCountry.setString(4, getTodayDate());
			pstmtUpdateCountry.setString(5, countryCode);
			var rsUpdateCountry = pstmtUpdateCountry.executeUpdate();
			connection.commit();
			if (rsUpdateCountry > 0) {
				record.status = '0';
				record.message = 'Successfully Update Country';
			} else {
				record.status = '1';
				record.message = 'failed to delete Country.Kindly contact to Admin!!! ';
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
 * To delete country from country master
 * @Param {String} countryId for deletion.
 * @returns {output} message
 */ 
function deleteCountry() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var countryCode = $.request.parameters.get('countryCode');
	var record = {};
	try {
			var qryDeleteCountry = 'update  "MDB_DEV"."MST_COUNTRY" set SOFT_DEL=? where COUNTRY_CODE=?';
			var pstmtDeleteCountry = connection.prepareStatement(qryDeleteCountry);
			pstmtDeleteCountry.setString(1, '1');
			pstmtDeleteCountry.setString(2, countryCode);
			var rsDeleteCountry = pstmtDeleteCountry.executeUpdate();
			connection.commit();
			if (rsDeleteCountry > 0) {
				record.status = '0';
				record.message = 'Successfully deleted Country';
			} else {
				record.status = '1';
				record.message = 'failed to delete Country.Kindly contact to Admin!!! ';
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
 * To fetch  country Hierarchy from country master on the behalf of input countryCode.
 * @Param {String} countryCode for search
 * @Param [] output to put the data in it
 * @returns {output} Array of country record
 * @author : Shriyansi
 */

function getCountryHierarchyDetails(countryCode , output) {
   var record;
    var recordRegion;
	var recordState;
	var recordDistrict;
	var recordArea;
	var recordZone;
	var recordBranch;
	var regionArray = [];
	var stateArray = [];
	var districtArray = [];
	var areaArray = [];
	var zoneArray = [];
	var branchArray = [];
		var connection = $.db.getConnection();
	/*	var SCountry = $.request.parameters.get('SCountry');*/
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1,countryCode );
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, 'SELECTCOUNTRY');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.CountryCode = rCallPro.getString(1);
			record.CountryName = rCallPro.getString(2);
		    }
		    var CallProREGION = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallREGION = connection.prepareCall(CallProREGION);
    		pstmtCallREGION.setString(1,record.CountryCode);
    		pstmtCallREGION.setString(2, 'null');
    		pstmtCallREGION.setString(3, 'SELECTREGION');
    		pstmtCallREGION.execute();
    		var rCallProREGION = pstmtCallREGION.getResultSet();
    		connection.commit();
    		while (rCallProREGION.next()) {
    		recordRegion = {};
			recordRegion.REGIONCODE = rCallProREGION.getString(1);
			recordRegion.REGIONNAME = rCallProREGION.getString(2);
			
			var CallProSTATE = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallSTATE = connection.prepareCall(CallProSTATE);
    		pstmtCallSTATE.setString(1,recordRegion.REGIONCODE);
    		pstmtCallSTATE.setString(2, 'null');
    		pstmtCallSTATE.setString(3, 'SELECTSTATE');
    		pstmtCallSTATE.execute();
    		var rCallProSTATE = pstmtCallSTATE.getResultSet();
    		connection.commit();
    		while (rCallProSTATE.next()) {
    		recordState = {};
			recordState.STATECODE = rCallProSTATE.getString(1);
			recordState.STATENAME = rCallProSTATE.getString(2);
			stateArray.push(recordState);
			
			var CallProDISTRICT = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallDISTRICT = connection.prepareCall(CallProDISTRICT);
    		pstmtCallDISTRICT.setString(1,recordState.STATECODE);
    		pstmtCallDISTRICT.setString(2, 'null');
    		pstmtCallDISTRICT.setString(3, 'SELECTDISTRICT');
    		pstmtCallDISTRICT.execute();
    		var rCallProDISTRICT = pstmtCallDISTRICT.getResultSet();
    		connection.commit();
    		while (rCallProDISTRICT.next()) {
    		recordDistrict = {};
			recordDistrict.DISTRICTCODE = rCallProDISTRICT.getString(1);
			recordDistrict.DISTRICTNAME = rCallProDISTRICT.getString(2);
			districtArray.push(recordDistrict);
			
			var CallProAREA = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallAREA = connection.prepareCall(CallProAREA);
    		pstmtCallAREA.setString(1,recordDistrict.DISTRICTCODE);
    		pstmtCallAREA.setString(2, 'null');
    		pstmtCallAREA.setString(3, 'SELECTAREA');
    		pstmtCallAREA.execute();
    		var rCallProAREA = pstmtCallAREA.getResultSet();
    		connection.commit();
    		while (rCallProAREA.next()) {
    		recordArea = {};
			recordArea.AREACODE = rCallProAREA.getString(1);
			recordArea.AREANAME = rCallProAREA.getString(2);
			areaArray.push(recordArea);
			
				
			var CallProZONE = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallZONE = connection.prepareCall(CallProZONE);
    		pstmtCallZONE.setString(1,recordArea.AREACODE);
    		pstmtCallZONE.setString(2, 'null');
    		pstmtCallZONE.setString(3, 'SELECTZONE');
    		pstmtCallZONE.execute();
    		var rCallProZONE = pstmtCallZONE.getResultSet();
    		connection.commit();
    		while (rCallProZONE.next()) {
    		recordZone = {};
			recordZone.ZONECODE = rCallProZONE.getString(1);
			recordZone.ZONENAME = rCallProZONE.getString(2);
			zoneArray.push(recordZone);
			
				
			var CallProBRANCH = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Country_CRUD"(?,?,?)';
    		var pstmtCallBRANCH = connection.prepareCall(CallProBRANCH);
    		pstmtCallBRANCH.setString(1,recordZone.ZONECODE);
    		pstmtCallBRANCH.setString(2, 'null');
    		pstmtCallBRANCH.setString(3, 'SELECTBRANCH');
    		pstmtCallBRANCH.execute();
    		var rCallProBRANCH = pstmtCallBRANCH.getResultSet();
    		connection.commit();
    		while (rCallProBRANCH.next()) {
    		recordBranch = {};
			recordBranch.BRANCHCODE = rCallProBRANCH.getString(1);
			recordBranch.BRANCHNAME = rCallProBRANCH.getString(2);
			branchArray.push(recordBranch);
			}
			recordZone.BRANCH = branchArray;
			}
			recordArea.ZONE = zoneArray;
			
			
			}
			
			recordDistrict.AREA = areaArray;
			}
			recordState.DISTRICT = districtArray;
			//recordRegion.STATE = recordState;
			
			}
			recordRegion.STATE = stateArray;
			regionArray.push(recordRegion);
    		}
			record.REGION = regionArray;  
			output.results.push(record);
	

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
 * This is a function which call getCountryHierachyDetails to get all details of country on the behalf of input countryCode.
 * @Param {String} countryCode for search
 * @Param [] output to put the data in it
 * @returns {output} countrycode
 * @author : Shriyansi
 */
 

function getCountryHierarchy(){
	var output = {
		results: []
	};

    var countryCode = $.request.parameters.get('countryCode');
	try {

		if (countryCode !== null && countryCode !== "") {
		    getCountryHierarchyDetails(countryCode, output);
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
 * This is a function which call addCountry to Validate to add country data  on the behalf of input countryCode countryName.
 * @Param {String} countryCode ,countryName for search
 * @Param [] output to put the data in it
 * @returns {output} countrycode 
 * @author : Shriyansi
 */
function validateCountry(){
    var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var inputData = {};
	var countryCode = $.request.parameters.get('countryCode');
	var countryName = $.request.parameters.get('countryName');
	var createby = $.request.parameters.get('createby');
	inputData.countryCode = countryCode;
	inputData.countryName = countryName;
	inputData.createby = createby;
	try {
	    var	record = {};
	    var rsCountryValidation = fetchCountry(inputData,connection);
		if (rsCountryValidation.next()) {
		    var softDel = rsCountryValidation.getString(3);
		    if(softDel === "0"){
		        record.status = 1;
				record.Message = "Country already present in our System!!! Kindly add another country.";
		    }else{
		       record.status = 1;
			   record.Message = "Country is inactive in our System!!! Kindly use edit functionality to activate it."; 
		    }
		} else {
		  addCountry(inputData,connection,record);
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
	case "getCountry":
		getCountry();
		break;
    case "getCountries":
		getCountries();
		break;
	case "addCountry":
		addCountry();
		break;
	case "updateCountry":
		updateCountry();
		break;
	case "deleteCountry":
		deleteCountry();
		break;
	case "getCountryHierarchyDetails":
	    getCountryHierarchyDetails();
	    break;
	case "getCountryHierarchy":
	    getCountryHierarchy();
	    break;
	case "validateCountry":
	    validateCountry();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');
}