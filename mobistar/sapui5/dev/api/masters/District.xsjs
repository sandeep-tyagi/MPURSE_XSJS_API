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
 * This is a checkStatusDescription() return Status as Active and  inactive form.
 * @author name : shriyansi
 */

  function checkStatusDescription(record){
    if(record.SOFT_DEL === '0'){
        record.SOFT_DEL_DESC = 'Active';
    }else  if(record.SOFT_DEL === '1'){
        record.SOFT_DEL_DESC = 'Inactive';
    }
    return record;
}

/**
 * This is a DateFunction() return particular Date Formate.
 * @author name : shriyansi
 */
function dateFormat(record) {
    var date = record.CREATE_DATE;
   if (date) {
    record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    return record.CREATE_DATE;
   }
  }
  



/**
 * fetch District from district master on the behalf of districtcode
 * @Param {} inputData.
 * @returns {output} resultset of District
 * @author: Shriyansi
 */
 

  
function getDistrict() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var DState = $.request.parameters.get('DState');
	try {
		var CallDistrict = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::District_CRUD"(?,?,?,?);';
		var pstmtCallDistrict = connection.prepareCall(CallDistrict);
		pstmtCallDistrict.setString(1, 'null');
		pstmtCallDistrict.setString(2, 'null');
		pstmtCallDistrict.setString(3, DState);
		pstmtCallDistrict.setString(4, 'SELECT');
		pstmtCallDistrict.execute();
		var rsCallDistrict = pstmtCallDistrict.getResultSet();
		connection.commit();
		while (rsCallDistrict.next()) {
			var record = {};
			record.DistrictCode = rsCallDistrict.getString(1);
			record.DistrictName = rsCallDistrict.getString(2);
			record.StateCode = rsCallDistrict.getString(3);
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
 * This is a function which is called by getDistDetails() to  fetch Districthierarchy  from district master on the behalf of districtcode
 * @Param {} inputData.
 * @returns {output} resultset of District
 * @author: Shriyansi
 */

function getDistDetails(distCode, output){
	var record;
	var recordZone;
	var zoneArray = [];
	var recordBranch;
	var branchArray = [];
	try {
		var connection = $.db.getConnection();
		var CallDistDetails = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::District_CRUD"(?,?,?,?);';
		var pstmtDistDetails = connection.prepareCall(CallDistDetails);
		pstmtDistDetails.setString(1, distCode);
		pstmtDistDetails.setString(2, ' ');
		pstmtDistDetails.setString(3, ' ');
		pstmtDistDetails.setString(4, 'SELECTDIS');
		pstmtDistDetails.execute();
		var rsDistDetails = pstmtDistDetails.getResultSet();
		connection.commit();
		while (rsDistDetails.next()) {
			record = {};
			record.DISTRICT_CODE = rsDistDetails.getString(1);
			record.DISTRICT_NAME = rsDistDetails.getString(2);
			record.STATE_CODE = rsDistDetails.getString(3);
			record.STATE_NAME = rsDistDetails.getString(4);
			record.COUNTRY_CODE = rsDistDetails.getString(5);
			record.REGION_CODE = rsDistDetails.getString(6);
			record.REGION_NAME = rsDistDetails.getString(7);
		}

		var CallProAREA = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::District_CRUD"(?,?,?,?)';
		var pstmtCallProAREA = connection.prepareCall(CallProAREA);
		pstmtCallProAREA.setString(1, record.DISTRICT_CODE);
		pstmtCallProAREA.setString(2, 'null');
		pstmtCallProAREA.setString(3, 'null');
		pstmtCallProAREA.setString(4, 'DISTRICTAREA');
		pstmtCallProAREA.execute();
		var rsCallProAREA = pstmtCallProAREA.getResultSet();
		connection.commit();
		while (rsCallProAREA.next()) {
			recordZone = {};
			recordZone.AREA_CODE = rsCallProAREA.getString(1);

			var CallProZONE = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::District_CRUD"(?,?,?,?)';
			var pstmtCallProZONE = connection.prepareCall(CallProZONE);
			pstmtCallProZONE.setString(1, recordZone.AREA_CODE);
			pstmtCallProZONE.setString(2, 'null');
			pstmtCallProZONE.setString(3, 'null');
			pstmtCallProZONE.setString(4, 'DISTRICTZONE');
			pstmtCallProZONE.execute();
			var rsCallProZONE = pstmtCallProZONE.getResultSet();
			connection.commit();
			while (rsCallProZONE.next()) {
				recordBranch = {};
				recordBranch.BRANCHCODE = rsCallProZONE.getString(1);
				recordBranch.BRANCHNAME = rsCallProZONE.getString(2);
				branchArray.push(recordBranch);
				recordZone.ZONE = branchArray;
				var CallProBRANCH = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::District_CRUD"(?,?,?,?)';
			var pstmtCallProBRANCH = connection.prepareCall(CallProBRANCH);
			pstmtCallProBRANCH.setString(1, recordZone.ZONE_CODE);
			pstmtCallProBRANCH.setString(2, 'null');
			pstmtCallProBRANCH.setString(3, 'null');
			pstmtCallProBRANCH.setString(4, 'DISTRICTBRANCH');
			pstmtCallProBRANCH.execute();
			}

			zoneArray.push(recordZone);
			record.AREA = zoneArray;
		}
		output.results.push(record);
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
  
}

/**
 * To fetch All districthierarchy on the behalf of district.code
 *  @return {output} row of resultset.
 * @author : Shriyansi.
 */
function getDistricts() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var QuerygetDistricts =
			'select md.SOFT_DEL , md.CREATE_BY ,md.CREATE_DATE ,md.DISTRICT_CODE,md.DISTRICT_NAME, '
			+ ' ms.STATE_CODE,ms.STATE_NAME,ms.REGION_CODE,mr.REGION_NAME,ms.COUNTRY_CODE  from "MDB_DEV"."MST_DISTRICT" as md  '
			+ ' inner join "MDB_DEV"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE '
			+ ' inner join "MDB_DEV"."MST_REGION" as mr on ms.REGION_CODE = mr.REGION_CODE '
			+ ' inner join  "MDB_DEV"."MST_COUNTRY" as cm on ms.COUNTRY_CODE = cm.COUNTRY_CODE ';
		var pstmtgetDistricts = connection.prepareStatement(QuerygetDistricts);
		var rsgetDistricts = pstmtgetDistricts.executeQuery();
		connection.commit();
		while (rsgetDistricts.next()) {
			var record = {};
			record.DistrictCode = rsgetDistricts.getString(4);
			record.DistrictName = rsgetDistricts.getString(5);
			record.StateCode = rsgetDistricts.getString(6);
			record.StateName = rsgetDistricts.getString(7);
			record.RegionCode = rsgetDistricts.getString(8);
			record.RegionName = rsgetDistricts.getString(9);
			record.CountryCode = rsgetDistricts.getString(10);
			record.SOFT_DEL = rsgetDistricts.getString(1);
			record.CreatedBy = rsgetDistricts.getString(2);
			record.CREATE_DATE = rsgetDistricts.getString(3);
			
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
 * To  fetch District by statecode   from district master on the behalf of statecode
 * @Param {} inputData.
 * @returns {output} resultset of District
 * @author: Shriyansi
 */

function getDistrictByStateCountry() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var record;
	var StateCode = $.request.parameters.get('StateCode');
	try {
	    if(StateCode === '' || StateCode === undefined){
	        var qrygetDistrictByStateCountry =
			'select md.DISTRICT_CODE,md.DISTRICT_NAME,ms.STATE_CODE,ms.REGION_CODE,ms.COUNTRY_CODE  from "MDB_DEV"."MST_DISTRICT" as md inner join "MDB_DEV"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE inner join "MDB_DEV"."MST_COUNTRY" as cm on ms.COUNTRY_CODE = cm.COUNTRY_CODE where md.soft_del = ? ';
    		var pstmtgetDistrictByStateCountry = connection.prepareStatement(qrygetDistrictByStateCountry);
    		pstmtgetDistrictByStateCountry.setString(1,'0');
    		var rsgetDistrictByStateCountry = pstmtgetDistrictByStateCountry.executeQuery();
    		connection.commit();
    		while (rsgetDistrictByStateCountry.next()) {
    			record = {};
    			record.DistrictCode = rsgetDistrictByStateCountry.getString(1);
    			record.DistrictName = rsgetDistrictByStateCountry.getString(2);
    			record.StateCode = rsgetDistrictByStateCountry.getString(3);
    			record.RegionCode = rsgetDistrictByStateCountry.getString(4);
    			record.CountryCode = rsgetDistrictByStateCountry.getString(5);
    			output.results.push(record);
    		}
	    }
	    else{
	        var querygetDistrictRegion =
			'select md.DISTRICT_CODE,md.DISTRICT_NAME,ms.STATE_CODE,ms.REGION_CODE,ms.COUNTRY_CODE  from "MDB_DEV"."MST_DISTRICT" as md inner join "MDB_DEV"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE inner join "MDB_DEV"."MST_COUNTRY" as cm on ms.COUNTRY_CODE = cm.COUNTRY_CODE where md.STATE_CODE = ? and md.soft_del = ?  ';
    		var pstmtgetDistrictRegion = connection.prepareStatement(querygetDistrictRegion);
    		pstmtgetDistrictRegion.setString(1, StateCode);
    		pstmtgetDistrictRegion.setString(2,'0');
    		var rsgetDistrictRegion = pstmtgetDistrictRegion.executeQuery();
    		connection.commit();
    		while (rsgetDistrictRegion.next()) {
    			record = {};
    			record.DistrictCode = rsgetDistrictRegion.getString(1);
    			record.DistrictName = rsgetDistrictRegion.getString(2);
    			record.StateCode = rsgetDistrictRegion.getString(3);
    			record.ZoneCode = rsgetDistrictRegion.getString(5);
    			record.CountryCode = rsgetDistrictRegion.getString(4);
    			output.results.push(record);
    		}
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


function addDistrict() {

	var record;
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();
	var districtCode = $.request.parameters.get('districtCode');
	var districtName = $.request.parameters.get('districtName');
	var stateCode = $.request.parameters.get('stateCode');
	var countryCode = $.request.parameters.get('countryCode');
    var createby = $.request.parameters.get('createby');
	try {
		record = {};
		var queryselect = 'select * from "MDB_DEV"."MST_DISTRICT" where STATE_CODE=? and DISTRICT_CODE=?';
		var paramSelect = connection.prepareStatement(queryselect);
		paramSelect.setString(1, stateCode);
        paramSelect.setString(2, districtCode);
		var rsSelect = paramSelect.executeQuery();
		if (rsSelect.next()) {
			record.status = 0;
			record.Message = "Record  Already  inserted";
		} else {
			var CalladdDistrict = 'insert into  "MDB_DEV"."MST_DISTRICT"("DISTRICT_CODE","DISTRICT_NAME","STATE_CODE","CREATE_BY") values(?,?,?,?)';
			var pstmtCalladdDistrict = connection.prepareStatement(CalladdDistrict);
			pstmtCalladdDistrict.setString(1, districtCode);
			pstmtCalladdDistrict.setString(2, districtName);
			pstmtCalladdDistrict.setString(3, stateCode);
			pstmtCalladdDistrict.setString(4, createby);
		//	pstmtCalladdDistrict.execute();
			var rAddEmp = pstmtCalladdDistrict.executeUpdate();
				if (rAddEmp > 0) {
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
				} else {
					record.status = 0;
					record.message = 'Some Issues!';
				}
			connection.commit();
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
 * To delete district from district master
 * @Param {String} districtcode for deletion.
 * @returns {output} message
 * @author: Shriyansi
 */ 

function deletedistrict(){
	var record = {};
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();
	var districtCode = $.request.parameters.get('districtCode');
	try {
			var qryDeleteDistrict = 'update "MDB_DEV"."MST_DISTRICT" set SOFT_DEL=? where DISTRICT_CODE=?';
			var pstmtDeleteDistrict = connection.prepareStatement(qryDeleteDistrict);
			pstmtDeleteDistrict.setString(1, '1');
			pstmtDeleteDistrict.setString(2, districtCode);
			var rsDeleteDistrict = pstmtDeleteDistrict.executeUpdate();
			connection.commit();
			if (rsDeleteDistrict > 0) {
				record.status = '0';
				record.message = 'Successfully deleted District';
			} else {
				record.status = '1';
				record.message = 'failed to delete District.Kindly contact to Admin!!! ';
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
 * To update district from district master
 * @Param {String} districtcode  and statecode for update.
 * @returns {output} message
 * @author: Shriyansi.
 */ 
function updateDistrict(){
var record = {};
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();
	var districtCode = $.request.parameters.get('districtCode');
	var districtName = $.request.parameters.get('districtName');
	var stateCode = $.request.parameters.get('stateCode');
	var softDel =  $.request.parameters.get('softDel');
	var modifiedBy =  $.request.parameters.get('modifiedBy');
	try {
			var qryDeleteDistrict = 'update  "MDB_DEV"."MST_DISTRICT" set district_Name=?  , SOFT_DEL =?,MODIFIED_BY=?,MODIFIED_DATE=? where DISTRICT_CODE=? and STATE_CODE=?';
			var pstmtDeleteDistrict = connection.prepareStatement(qryDeleteDistrict);
			pstmtDeleteDistrict.setString(1, districtName);
			pstmtDeleteDistrict.setString(2, softDel);
			pstmtDeleteDistrict.setString(3, modifiedBy);
			pstmtDeleteDistrict.setString(4, dateFunction());
			pstmtDeleteDistrict.setString(5, districtCode);
			pstmtDeleteDistrict.setString(6, stateCode);
			
			var rsDeleteDistrict = pstmtDeleteDistrict.execute();
			connection.commit();
			if (rsDeleteDistrict > 0) {
				record.status = '0';
				record.message = 'Successfully update  District';
			} else {
				record.status = '1';
				record.message = 'failed to update  District.Kindly contact to Admin!!! ';
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
 * this is a function to fetch DistrictHierachy by statecode   from district master on the behalf of statecode
 * @Param {}. input data is district code.
 * @returns {output} resultset of District
 * @author: Shriyansi
 */
function getDistrictHierarchy() {
	var output = {
		results: []
	};

    var distCode = $.request.parameters.get('distCode');
	try {

		if (distCode !== null && distCode !== "") {
		    getDistDetails(distCode, output);
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



var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getDistrict":
		getDistrict();
		break;
	case "getDistricts":
	    getDistricts();
	    break;
	case "addDistrict":
		addDistrict();
		break;
	case "getDistrictByStateCountry":
		getDistrictByStateCountry();
		break;
	case "deletedistrict":
	    deletedistrict();
	    break;
	case "updateDistrict":
	    updateDistrict();
	    break;
	 case "getDistDetails":
	     getDistDetails();
	     break;
	 case "getDistrictHierarchy":
	     getDistrictHierarchy();
	     break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}