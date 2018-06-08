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
 * To delete any Zone on the behalf of Zonecode.
 * @Param {String} Zone id as an input.
 * @return {output} success or failure.
 * @author Shriyansi.
 */
function deleteZone() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var zoneCode = $.request.parameters.get('zoneCode');
	var record = {};
	try {
			var qryDeleteZone = 'update "MDB_TEST_INTEGRATION"."MST_ZONE" set SOFT_DEL=? where ZONE_CODE=?';
			var pstmtDeleteZone = connection.prepareStatement(qryDeleteZone);
			pstmtDeleteZone.setString(1, '1');
			pstmtDeleteZone.setString(2, zoneCode);
			var rsDeleteRegion = pstmtDeleteZone.executeUpdate();
			connection.commit();
			if (rsDeleteRegion > 0) {
				record.status = '0';
				record.message = 'Successfully deleted Zone';
			} else {
				record.status = '1';
				record.message = 'failed to delete Zone.Kindly contact to Admin!!! ';
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
 * To Update any Zone on the behalf of Zonecode.
 * @Param {String} Zone id as an input.
 * @return {output} success or failure.
 * @author  shriyansi.
 */
function updateZone() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var zoneCode = $.request.parameters.get('zoneCode');
	var zoneName = $.request.parameters.get('zoneName');
	var areaCode = $.request.parameters.get('areaCode');
	var softDel =  $.request.parameters.get('softDel');
	  var modifiedBy =  $.request.parameters.get('modifiedBy');
	
	var record = {};
	try {
			var qryDeleteRegion = 'update  "MDB_TEST_INTEGRATION"."MST_ZONE"  set ZONE_DESC=? , SOFT_DEL=?,MODIFIED_BY=?,MODIFIED_DATE=? where ZONE_CODE=? and AREA_CODE=?';
			var pstmtDeleteRegion = connection.prepareStatement(qryDeleteRegion);
			pstmtDeleteRegion.setString(1, zoneName);
			pstmtDeleteRegion.setString(2, softDel);
			pstmtDeleteRegion.setString(3, modifiedBy);
			pstmtDeleteRegion.setString(4, dateFunction());
			pstmtDeleteRegion.setString(6, areaCode);
			pstmtDeleteRegion.setString(5, zoneCode);
			var rsDeleteRegion = pstmtDeleteRegion.executeUpdate();
			connection.commit();
			if (rsDeleteRegion > 0) {
				record.status = '0';
				record.message = 'Successfully deleted Zone';
			} else {
				record.status = '1';
				record.message = 'failed to delete Zone.Kindly contact to Admin!!! ';
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
 * To fetch any Zone on the behalf of Zone code.
 * @Param {String} Zone id as an input.
 * @return {output} row of resultset.
 * author: Shriyansi.
 */
function getZone() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var zone = $.request.parameters.get('zone');
	try {
		var query = 'Select ZONE_CODE ,ZONE_DESC,AREA_CODE from "MDB_TEST_INTEGRATION"."MST_ZONE" where ZONE_CODE = ?';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, zone);
		var r = pstmt.executeQuery();
		connection.commit();
		while (r.next()) {
			var record = {};
			record.ZoneCode = r.getString(1);
			record.ZoneName = r.getString(2);
			record.AreaCode = r.getString(3);
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
 * To fetch All Zone .
 * @Param {String} Zone id as an input.
 * @return {output} row of resultset.
 * @author Shriyansi.
 */
function getZones() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var query = 'Select mz.ZONE_CODE ,mz.ZONE_DESC,mz.AREA_CODE,mz.SOFT_DEL ,mz.CREATE_BY,mz.CREATE_DATE, '
+ ' ma.AREA_DESC,md.DISTRICT_NAME,ms.STATE_NAME,mr.REGION_NAME '
+ ' from "MDB_TEST_INTEGRATION"."MST_ZONE" as mz '
+ ' inner join "MDB_TEST_INTEGRATION"."MST_AREA" as ma on mz.AREA_CODE = ma.AREA_CODE '
+ ' inner join "MDB_TEST_INTEGRATION"."MST_DISTRICT" as md on ma.DISTRICT_CODE = md.DISTRICT_CODE '
+ ' inner join "MDB_TEST_INTEGRATION"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE '
+ ' inner join "MDB_TEST_INTEGRATION"."MST_REGION" as mr on ms.REGION_CODE = mr.REGION_CODE ';
		var pstmt = connection.prepareStatement(query);
		var r = pstmt.executeQuery();
		connection.commit();
		while (r.next()) {
			var record = {};
			record.ZoneCode = r.getString(1);
			record.ZoneName = r.getString(2);
			record.AreaCode = r.getString(3);
	        record.SOFT_DEL = r.getString(4);
			record.CREATE_BY = r.getString(5);
			record.CREATE_DATE = r.getString(6);
			record.AreaDesc = r.getString(7);
			record.District = r.getString(8);
			record.State = r.getString(9);
			record.Region = r.getString(10);
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
 * To add Zone into Zone master table.
 * @Param {dataLine} string variable.
 * @return {String} integer.
 */
function addZone() {
	var output = {
		results: []
	};
	var records;
	var datasLine = $.request.parameters.get('OrderLine');
	var records = {};
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));

	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				var queryZone = 'select ZONE_CODE  from "MDB_TEST_INTEGRATION"."MST_ZONE" where ZONE_CODE = ?';
				var pstmtZone = connection.prepareStatement(queryZone);
				pstmtZone.setString(1, dicLine.ZONECODE);
				var rZone = pstmtZone.executeQuery();
				if (rZone.next()) {
					records.status = 0;
					records.message = 'Record Allready inserted!';
				} else {
					var queryaddZone =
						'insert into  "MDB_TEST_INTEGRATION"."MST_ZONE"("ZONE_CODE","ZONE_DESC","AREA_CODE","CREATE_BY") values(?,?,?,?)';
					var pstmtaddZone = connection.prepareStatement(queryaddZone);
					pstmtaddZone.setString(1, dicLine.ZONECODE);
					pstmtaddZone.setString(2, dicLine.ZONEDESC);
					pstmtaddZone.setString(3, dicLine.AREACODE);
					pstmtaddZone.setString(4, dicLine.createby);
					var rsaddZone = pstmtaddZone.executeUpdate();
					connection.commit();
					records = {};
					if (rsaddZone > 0) {
						records.status = 1;
						records.message = 'Data Uploaded Sucessfully';
					} else {
						records.status = 0;
						records.message = 'Some Issues!';
					}
				}
				output.results.push(records);

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

/**
 * This is a fucntion which is called by getZoneHierarchy() to fetch zoneHierarchy on the behalf of zoneCode.
 * @Param {String} zonecode as an input.
 * @return {output} row of resultset.
 * @Author: Shriyansi.
 */

function getZoneDetails(zoneCode, output) {
	var record;
	var recordBranch;
	var branchArray = [];
	try {
		var connection = $.db.getConnection();
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.dev.procedure::Zone_CRUD"(?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setString(1, zoneCode);
		pstmtCallPro.setString(2, ' ');
		pstmtCallPro.setString(3, ' ');
		pstmtCallPro.setString(4, 'SELECT');
		pstmtCallPro.execute();
		var rsCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rsCallPro.next()) {
			record = {};
			record.COUNTRY = rsCallPro.getString(1);
			record.COUNTRYCODE = rsCallPro.getString(2);
			record.REGION = rsCallPro.getString(3);
			record.REGIONCODE = rsCallPro.getString(4);
			record.STATE = rsCallPro.getString(5);
			record.STATECODE = rsCallPro.getString(6);
			record.DISTRICT = rsCallPro.getString(7);
			record.DISTRICCODE = rsCallPro.getString(8);
			record.AREACODE = rsCallPro.getString(9);
			record.AREADESC = rsCallPro.getString(10);
			record.ZONECODE = rsCallPro.getString(11);
			record.ZONENAME = rsCallPro.getString(12);
		}

			var CallProBRANCH = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.dev.procedure::Zone_CRUD"(?,?,?,?)';
			var pstmtCallProBRANCH = connection.prepareCall(CallProBRANCH);
			pstmtCallProBRANCH.setString(1, zoneCode);
			pstmtCallProBRANCH.setString(2, 'null');
			pstmtCallProBRANCH.setString(3, 'null');
			pstmtCallProBRANCH.setString(4, 'ZONEBRANCH');
			pstmtCallProBRANCH.execute();
			var rsCallProBRANCH = pstmtCallProBRANCH.getResultSet();
			connection.commit();
			while (rsCallProBRANCH.next()) {
				recordBranch = {};
				recordBranch.BRANCHCODE = rsCallProBRANCH.getString(1);
				recordBranch.BRANCHNAME = rsCallProBRANCH.getString(2);
				branchArray.push(recordBranch);
				record.BRANCH = branchArray;	
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
 * This is a fucntion which is called  getZoneDetails() to fetch zoneHierarchy on the behalf of zoneCode.
 * @Param {String} zonecode as an input.
 * @return {output} row of resultset.
 * @Author: Shriyansi.
 */

function getZoneHierarchy(){
    var output = {
		results: []
	};

	var zoneCode = $.request.parameters.get('zoneCode');
	try {

	if (zoneCode !== null && zoneCode !== "") {
			getZoneDetails(zoneCode, output);
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
    case "deleteZone":
        deleteZone();
        break;
    case "updateZone":
        updateZone();
        break;
	case "getZones":
		getZones();
		break;
	case "getZone":
		getZone();
		break;
	case "addZone":
		addZone();
		break;
	case "getZoneDetails":
	    getZoneDetails();
	    break;
    case "getZoneHierarchy":
        getZoneHierarchy();
        break;
        

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}