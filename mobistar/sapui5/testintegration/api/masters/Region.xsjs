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
 * To delete any region from region master
 * @Param {String} region id for deletion.
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */
function deleteRegion() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var regionCode = $.request.parameters.get('regionCode');
	var record = {};
	try {
			var qryDeleteRegion = 'delete  from "MDB_TEST_INTEGRATION"."MST_REGION" where REGION_CODE=?';
			var pstmtDeleteRegion = connection.prepareStatement(qryDeleteRegion);
			pstmtDeleteRegion.setString(1, regionCode);
			var rsDeleteRegion = pstmtDeleteRegion.executeUpdate();
			connection.commit();
			if (rsDeleteRegion > 0) {
				record.status = '0';
				record.message = 'Successfully deleted Region';
			} else {
				record.status = '1';
				record.message = 'failed to delete Region.Kindly contact to Admin!!! ';
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
 * To update any region from region master
 * @Param {String} region id for deletion.
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */
function updateRegion() {
	var record;
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();
	var regionCode = $.request.parameters.get('regionCode');
	var regionName = $.request.parameters.get('regionName');
	var countryCode = $.request.parameters.get('countryCode');
	var softDel =  $.request.parameters.get('softDel');
	var modifiedBy =  $.request.parameters.get('modifiedBy');
	try {
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, regionCode);
		pstmtCallPro.setString(2, regionName);
		pstmtCallPro.setString(3, countryCode);
		pstmtCallPro.setString(4, softDel);
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, modifiedBy);
		pstmtCallPro.setString(8, getTodayDate());
		pstmtCallPro.setString(9, 'UPDATE');
		pstmtCallPro.execute();
		var rsInsert = pstmtCallPro.getResultSet();
		connection.commit();
		if (rsInsert > 0) {
			record.status = 1;
			record.Message = "Record Successfully Updated";

		} else {
			record.status = 0;
			record.Message = "Record Successfully  not Updated";
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
 * To fetch all the region from region master
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */
function getRegions() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, 'null');
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, 'null');
		pstmtCallPro.setString(4, '0');
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'ALLREGION');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.RegionCode = rCallPro.getString(1);
			record.RegionName = rCallPro.getString(2);
			record.CountryCode = rCallPro.getString(3);
			record.SOFT_DEL = rCallPro.getString(4);
			record.CreatedBy = rCallPro.getString(5);
			record.CREATE_DATE = rCallPro.getString(6);
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
 * To fetch all the region from region master on the behalf of regioncode and countrycode.
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */
function getRegion() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var RCode = $.request.parameters.get('RCode');
	var RCountry = $.request.parameters.get('RCountry');
	try {
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, RCode);
		pstmtCallPro.setString(2, 'null');
		pstmtCallPro.setString(3, RCountry);
		pstmtCallPro.setString(4, '0');
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECT');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.RegionCode = rCallPro.getString(1);
			record.RegionName = rCallPro.getString(2);
			record.CountryCode = rCallPro.getString(3);
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
 * To insert region into region master
 * @returns {output} Array of resultset..
 */
function testintegrationRegion(inputData,connection,record) {
			var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
			var pstmtCallPro = connection.prepareCall(CallPro);
			pstmtCallPro.setString(1, inputData.regionCode);
			pstmtCallPro.setString(2, inputData.regionName);
			pstmtCallPro.setString(3, inputData.countryCode);
			pstmtCallPro.setString(4, '0');
			pstmtCallPro.setString(5, inputData.createby);
			pstmtCallPro.setString(6, dateFunction());
			pstmtCallPro.setString(7, ' ');
			pstmtCallPro.setString(8, dateFunction());
			pstmtCallPro.setString(9, 'INSERT');
			pstmtCallPro.execute();
			var rsInsert = pstmtCallPro.getParameterMetaData();
			connection.commit();
			if (rsInsert.getParameterCount() > 0) {
				record.status = 1;
				record.Message = "Record Successfully inserted";

			} else {
				record.status = 0;
				record.Message = "Record Successfully  inserted";
			}
}

	/*	Output.results.push(record);
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
	
*/
/**
 * This is a function which is called by getRegionHierarchy(), to getregionhierarchy any region from region master
 * @Param {String} regioncode.
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */
function getRegionHierarchyDetails(regionCode , output){
 var record;
    var recordState;
	var recordDistrict;
	var recordArea;
	var recordZone;
	var recordBranch;
	var stateArray = [];
	var districtArray = [];
	var areaArray = [];
	var zoneArray = [];
	var branchArray = [];
		var connection = $.db.getConnection();
		try {
		    var CallProREGION = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallREGION = connection.prepareCall(CallProREGION);
    		pstmtCallREGION.setString(1,regionCode);
        	pstmtCallREGION.setString(2, 'null');
    		pstmtCallREGION.setString(3, 'null');
    		pstmtCallREGION.setString(4, '0');
    		pstmtCallREGION.setString(5, 'ADMIN');
    		pstmtCallREGION.setString(6, dateFunction());
    		pstmtCallREGION.setString(7, ' ');
    		pstmtCallREGION.setString(8, dateFunction());
    		pstmtCallREGION.setString(9, 'SELECTREGION');
    		pstmtCallREGION.execute();
    		var rCallProREGION = pstmtCallREGION.getResultSet();
    		connection.commit();
    		while (rCallProREGION.next()) {
    		record = {};
    		
			record.REGIONCODE = rCallProREGION.getString(1);
			record.REGIONNAME = rCallProREGION.getString(2);
			
    		}
			var CallProSTATE = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallSTATE = connection.prepareCall(CallProSTATE);
    		pstmtCallSTATE.setString(1,regionCode);
    		pstmtCallSTATE.setString(2, 'null');
    		pstmtCallSTATE.setString(3, 'null');
    		pstmtCallSTATE.setString(4, '0');
    		pstmtCallSTATE.setString(5, 'ADMIN');
    		pstmtCallSTATE.setString(6, dateFunction());
    		pstmtCallSTATE.setString(7, ' ');
    		pstmtCallSTATE.setString(8, dateFunction());
    		pstmtCallSTATE.setString(9, 'SELECTSTATE');
    		pstmtCallSTATE.execute();
    		var rCallProSTATE = pstmtCallSTATE.getResultSet();
    		connection.commit();
    		while (rCallProSTATE.next()) {
    		recordState = {};
			recordState.STATECODE = rCallProSTATE.getString(1);
			recordState.STATENAME = rCallProSTATE.getString(2);
			stateArray.push(recordState);
			
			var CallProDISTRICT = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallDISTRICT = connection.prepareCall(CallProDISTRICT);
    		pstmtCallDISTRICT.setString(1,recordState.STATECODE);
    		pstmtCallDISTRICT.setString(2, 'null');
    		pstmtCallDISTRICT.setString(3, 'null');
    		pstmtCallDISTRICT.setString(4, '0');
    		pstmtCallDISTRICT.setString(5, 'ADMIN');
    		pstmtCallDISTRICT.setString(6, dateFunction());
    		pstmtCallDISTRICT.setString(7, ' ');
    		pstmtCallDISTRICT.setString(8, dateFunction());
    		pstmtCallDISTRICT.setString(9, 'SELECTDISTRICT');
    		pstmtCallDISTRICT.execute();
    		var rCallProDISTRICT = pstmtCallDISTRICT.getResultSet();
    		connection.commit();
    		while (rCallProDISTRICT.next()) {
    		recordDistrict = {};
			recordDistrict.DISTRICTCODE = rCallProDISTRICT.getString(1);
			recordDistrict.DISTRICTNAME = rCallProDISTRICT.getString(2);
			districtArray.push(recordDistrict);
			
			var CallProAREA = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallAREA = connection.prepareCall(CallProAREA);
    		pstmtCallAREA.setString(1,recordDistrict.DISTRICTCODE);
    		pstmtCallAREA.setString(2, 'null');
    		pstmtCallAREA.setString(3, 'null');
    		pstmtCallAREA.setString(4, '0');
    		pstmtCallAREA.setString(5, 'ADMIN');
    		pstmtCallAREA.setString(6, dateFunction());
    		pstmtCallAREA.setString(7, ' ');
    		pstmtCallAREA.setString(8, dateFunction());
    		pstmtCallAREA.setString(9, 'SELECTAREA');
    		pstmtCallAREA.execute();
    		var rCallProAREA = pstmtCallAREA.getResultSet();
    		connection.commit();
    		while (rCallProAREA.next()) {
    		recordArea = {};
			recordArea.AREACODE = rCallProAREA.getString(1);
			recordArea.AREANAME = rCallProAREA.getString(2);
			areaArray.push(recordArea);
			
				
			var CallProZONE = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallZONE = connection.prepareCall(CallProZONE);
    		pstmtCallZONE.setString(1,recordArea.AREACODE);
    		pstmtCallZONE.setString(2, 'null');
    		pstmtCallZONE.setString(3, 'null');
    		pstmtCallZONE.setString(4, '0');
    		pstmtCallZONE.setString(5, 'ADMIN');
    		pstmtCallZONE.setString(6, dateFunction());
    		pstmtCallZONE.setString(7, ' ');
    		pstmtCallZONE.setString(8, dateFunction());
    		pstmtCallZONE.setString(9, 'SELECTZONE');
      		pstmtCallZONE.execute();
    		var rCallProZONE = pstmtCallZONE.getResultSet();
    		connection.commit();
    		while (rCallProZONE.next()) {
    		recordZone = {};
			recordZone.ZONECODE = rCallProZONE.getString(1);
			recordZone.ZONENAME = rCallProZONE.getString(2);
			zoneArray.push(recordZone);
			
				
			var CallProBRANCH = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
    		var pstmtCallBRANCH = connection.prepareCall(CallProBRANCH);
    		pstmtCallBRANCH.setString(1,recordZone.ZONECODE);
    		pstmtCallBRANCH.setString(2, 'null');
    		pstmtCallBRANCH.setString(3, 'null');
    		pstmtCallBRANCH.setString(4, '0');
    		pstmtCallBRANCH.setString(5, 'ADMIN');
    		pstmtCallBRANCH.setString(6, dateFunction());
    		pstmtCallBRANCH.setString(7, ' ');
    		pstmtCallBRANCH.setString(8, dateFunction());
    		pstmtCallBRANCH.setString(9, 'SELECTBRANCH');
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
// 			recordRegion.STATE = stateArray;
// 			regionArray.push(recordRegion);
    		
			record.STATE = stateArray;  
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
 * This is a function which is called  getRegionHierarchyDetails(), to getregionhierarchy any region from region master
 * @Param {String} regioncode.
 * @returns {output} Array of resultset.
 * @author Shriyansi.
 */

function getRegionHierarchy(){
    var output = {
		results: []
	};

    var regionCode = $.request.parameters.get('regionCode');
	try {

		if (regionCode !== null && regionCode !== "") {
		    getRegionHierarchyDetails(regionCode, output);
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

function fetchRegion(inputData,connection){
    var queryselectRegion = 'select * from "MDB_TEST_INTEGRATION"."MST_REGION" where SOFT_DEL is not null ';
    var whereClause = "";
    if(inputData.countryName !== ''){
        whereClause += " AND REGION_CODE='" + inputData.regionCode + "'";
    }
    if(inputData.countryName !== ''){
        whereClause += " AND REGION_NAME='" + inputData.regionName + "'";
    }
    if(inputData.countryCode !== ''){
        whereClause += " AND COUNTRY_CODE='" + inputData.countryCode + "'";
    }
     queryselectRegion += whereClause; 
	var pstmtSelectRegion = connection.prepareStatement(queryselectRegion);
	var rsSelectRegion = pstmtSelectRegion.executeQuery();
	return rsSelectRegion;
}

function addRegion(inputData,connection,record) {
			var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::GetRegion"(?,?,?,?,?,?,?,?,?)';
			var pstmtCallPro = connection.prepareCall(CallPro);
			pstmtCallPro.setString(1, inputData.regionCode);
			pstmtCallPro.setString(2, inputData.regionName);
			pstmtCallPro.setString(3, inputData.countryCode);
			pstmtCallPro.setString(4, '0');
			pstmtCallPro.setString(5, inputData.createby);
			pstmtCallPro.setString(6, dateFunction());
			pstmtCallPro.setString(7, ' ');
			pstmtCallPro.setString(8, dateFunction());
			pstmtCallPro.setString(9, 'INSERT');
			pstmtCallPro.execute();
			var rsInsert = pstmtCallPro.getParameterMetaData();
			connection.commit();
			if (rsInsert.getParameterCount() > 0) {
				record.status = 1;
				record.Message = "Record Successfully inserted";

			} else {
				record.status = 0;
				record.Message = "Record Successfully  inserted";
			}
}

function validateRegion(){
	var record;
	var Output = {
		results: []
	};
	  var inputData = {};
	var connection = $.db.getConnection();
	var regionCode = $.request.parameters.get('REGION_CODE');
	var regionName = $.request.parameters.get('REGION_NAME');
	var countryCode = $.request.parameters.get('COUNTRY_CODE');
	var createby = $.request.parameters.get('createby');
    inputData.regionCode = regionCode;
	inputData.regionName = regionName;
	inputData.countryCode = countryCode;
	inputData.createby = createby;
	try {
	    var	record = {};
	    var rsRegionValidation = fetchRegion(inputData,connection);
		if (rsRegionValidation.next()) {
		    var softDel = rsRegionValidation.getString(4);
		    if(softDel === "0"){
		        record.status = 1;
				record.Message = "Region already present in our System!!! Kindly add another Region.";
		    }else{
		       record.status = 1;
			   record.Message = "Region is inactive in our System!!! Kindly use edit functionality to activate it."; 
		    }
		} else {
		  addRegion(inputData,connection,record);
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
    case "deleteRegion":
        deleteRegion();
        break;
	case "getRegion":
		getRegion();
		break;
	case "addRegion":
		addRegion();
		break;
	case "getRegions":
		getRegions();
		break;
	case "updateRegion":
		updateRegion();
		break;
	case "getRegionHierarchy":
	    getRegionHierarchy();
	    break;
	case "getRegionHierarchyDetails":
	    getRegionHierarchyDetails();
	    break;
	case "validateRegion":
	    validateRegion();
	    break;
	case "fetchRegion":
	    fetchRegion();
	     break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}