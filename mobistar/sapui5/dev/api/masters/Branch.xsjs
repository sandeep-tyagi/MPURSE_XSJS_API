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
 * To delete any Branch on the behalf of Branch id.
 * @Param {String} Branch id as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function deleteBranch() {
var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var branchCode = $.request.parameters.get('branchCode');
	var record = {};
	try {
			var qrydeleteBranch = 'delete  from "MDB_DEV"."MST_BRANCH" where BRANCH_CODE=?';
			var pstmtdeleteBranch = connection.prepareStatement(qrydeleteBranch);
			pstmtdeleteBranch.setString(1, branchCode);
			var rsdeleteBranch = pstmtdeleteBranch.executeUpdate();
			connection.commit();
			if (rsdeleteBranch > 0) {
				record.status = '0';
				record.message = 'Successfully deleted Branch';
			} else {
				record.status = '1';
				record.message = 'failed to delete Branch.Kindly contact to Admin!!! ';
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
 * To Update any Branch on the behalf of Branch id.
 * @Param {String} Branch id as an input.
 * @return {output} success or failure.
 *  @author name : shriyansi
 */
function updateBranch() {
var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var branchCode = $.request.parameters.get('branchCode');
	var branchDesc = $.request.parameters.get('branchDesc');
	var zoneCode = $.request.parameters.get('zoneCode');
	var modifiedBy =  $.request.parameters.get('modifiedBy');
	var softDel =  $.request.parameters.get('softDel');
	
	var record = {};
	try {
			var qryupdateBranch = 'update "MDB_DEV"."MST_BRANCH" set BRANCH_DESC=?,MODIFIED_BY=?,MODIFIED_DATE=? , SOFT_DEL=? where BRANCH_CODE=? and ZONE_CODE=?';
			var pstmtupdateBranch = connection.prepareStatement(qryupdateBranch);
			pstmtupdateBranch.setString(1, branchDesc);
			pstmtupdateBranch.setString(2, modifiedBy);
			pstmtupdateBranch.setString(3, dateFunction());
			pstmtupdateBranch.setString(4, softDel);
			pstmtupdateBranch.setString(5, branchCode );
			pstmtupdateBranch.setString(6, zoneCode);
			var rsupdateBranch = pstmtupdateBranch.executeUpdate();
			connection.commit();
			if (rsupdateBranch > 0) {
				record.status = '0';
				record.message = 'Successfully update Branch';
			} else {
				record.status = '1';
				record.message = 'failed to update  Branch.Kindly contact to Admin!!! ';
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
 * To fetch any Branch on the behalf of Branch code.
 * @Param {String} Branch id as an input.
 * @return {output} row of resultset.
 *  @author name : shriyansi
 */
function getBranch() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var BranchCode = $.request.parameters.get('BranchCode');
	try {
		var query = 'Select BRANCH_CODE ,BRANCH_DESC,ZONE_CODE from "MDB_DEV"."MST_BRANCH" where BRANCH_CODE = ?';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, BranchCode);
		var r = pstmt.executeQuery();
		connection.commit();
		while (r.next()) {
			var record = {};
			record.BranchCode = r.getString(1);
			record.BranchName = r.getString(2);
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
 * To fetch All Branch .
 * @Param {String} Branch id as an input.
 * @return {output} row of resultset.
 *  @author name : shriyansi
 */
function getBranchs() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var queryBranch = 
		'Select mb.BRANCH_CODE ,mb.BRANCH_DESC,mb.ZONE_CODE ,mb.SOFT_DEL ,mb.CREATE_BY,mb.CREATE_DATE, '
 + ' mz.ZONE_DESC,ma.AREA_DESC,md.DISTRICT_NAME,ms.STATE_NAME,mr.REGION_NAME ,tr.REGIONAL_CODE '
 + ' from "MDB_DEV"."MST_BRANCH" as mb '
+ ' inner join "MDB_DEV"."MST_ZONE" as mz on mb.ZONE_CODE = mz.ZONE_CODE '
+ ' inner join "MDB_DEV"."MST_AREA" as ma on mz.AREA_CODE = ma.AREA_CODE '
+ ' inner join "MDB_DEV"."MST_DISTRICT" as md on ma.DISTRICT_CODE = md.DISTRICT_CODE ' 
+ ' inner join  "MDB_DEV"."TRN_REGIONAL" as tr on md.STATE_CODE = tr.STATE_CODE '
+ ' inner join "MDB_DEV"."STATESDATA" as ms on tr.STATE_CODE = ms.STATE_CODE '
+ ' inner join "MDB_DEV"."MST_REGION" as mr on ms.REGIONCODE = mr.REGION_CODE ';
		/*'Select mb.BRANCH_CODE ,mb.BRANCH_DESC,mb.ZONE_CODE ,mb.SOFT_DEL ,mb.CREATE_BY,mb.CREATE_DATE, '
+ ' mz.ZONE_DESC,ma.AREA_DESC,md.DISTRICT_NAME,ms.STATE_NAME,mr.REGION_NAME '
+ ' from "MDB_DEV"."MST_BRANCH" as mb '
+ ' inner join "MDB_DEV"."MST_ZONE" as mz on mb.ZONE_CODE = mz.ZONE_CODE '
+ ' inner join "MDB_DEV"."MST_AREA" as ma on mz.AREA_CODE = ma.AREA_CODE '
+ ' inner join "MDB_DEV"."MST_DISTRICT" as md on ma.DISTRICT_CODE = md.DISTRICT_CODE '
+ ' inner join "MDB_DEV"."MST_STATE" as ms on md.STATE_CODE = ms.STATE_CODE '
+ ' inner join "MDB_DEV"."MST_REGION" as mr on ms.REGION_CODE = mr.REGION_CODE ';*/
		var pstmtBranch = connection.prepareStatement(queryBranch);
		var rsBranch = pstmtBranch.executeQuery();
		connection.commit();
		while (rsBranch.next()) {
			var record = {};
			record.BranchCode = rsBranch.getString(1);
			record.BranchName = rsBranch.getString(2);
			record.ZoneCode = rsBranch.getString(3);
			record.SOFT_DEL = rsBranch.getString(4);
			record.CREATE_BY = rsBranch.getString(5);
			record.CREATE_DATE = rsBranch.getString(6);
			record.ZoneDesc = rsBranch.getString(7);
			record.AreaDesc = rsBranch.getString(8);
			record.District = rsBranch.getString(9);
			record.State = rsBranch.getString(10);
			record.Region = rsBranch.getString(11);
			record.REGIONAL_CODE = rsBranch.getString(12);
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
 * To add Branch into Branch master table.
 * @Param {dataLine} as object variable.
 * @return {String} integer.
 *  @author name : shriyansi
 */
function addBranch() {
	var output = {
		results: []
	};
	var records;
	var datasLine = $.request.parameters.get('OrderLine');
	var records = {};
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));

	var conn1 = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				var queryBranch = 'select BRANCH_CODE  from "MDB_DEV"."MST_BRANCH" where BRANCH_CODE = ?';
				var pstmtBranch = conn1.prepareStatement(queryBranch);
				pstmtBranch.setString(1, dicLine.BRANCH_CODE);
				var rBranch = pstmtBranch.executeQuery();
				if (rBranch.next()) {
					records.status = 0;
					records.message = 'Record Allready inserted!';
				} else {
					var queryInsertBranch =
						'insert into  "MDB_DEV"."MST_BRANCH"("BRANCH_CODE","BRANCH_DESC","ZONE_CODE","CREATE_BY") values(?,?,?,?)';
					var pstmtInsertBranch = conn1.prepareStatement(queryInsertBranch);
					pstmtInsertBranch.setString(1, dicLine.BRANCHCODE);
					pstmtInsertBranch.setString(2, dicLine.BRANCHDESC);
					pstmtInsertBranch.setString(3, dicLine.ZONECODE);
			    	pstmtInsertBranch.setString(4, dicLine.createby);
					var rsInsertBranch = pstmtInsertBranch.executeUpdate();
					conn1.commit();
					records = {};
					if (rsInsertBranch > 0) {
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
		conn1.close();
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
 * To get all Branch Hierarchy on the behalf of Branchcode.
 * @Param {String} Branchcode as an input.
 * @return {output} success or failure.
 * @author name :  Shriyansi
 */
function getBranchHierarchyDetails(branchCode, output) {
var record;
// 	var recordZone;
// 	var zoneArray = [];
// 	var recordBranch;
// 	var branchArray = [];
	try {
		var connection = $.db.getConnection();
		var CallBranch = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Branch_CRUD"(?,?,?,?);';
		var pstmtCallBrach = connection.prepareCall(CallBranch);
		pstmtCallBrach.setString(1, branchCode);
		pstmtCallBrach.setString(2, ' ');
		pstmtCallBrach.setString(3, ' ');
		pstmtCallBrach.setString(4, 'SELECT');
		pstmtCallBrach.execute();
		var rsCallBranch = pstmtCallBrach.getResultSet();
		connection.commit();
		while (rsCallBranch.next()) {
			record = {};
			record.BRANCHCODE = rsCallBranch.getString(1);
			record.BRANCHNAME = rsCallBranch.getString(2);
			record.ZONECODE = rsCallBranch.getString(3);
			record.ZONENAME = rsCallBranch.getString(4);
			record.AREACODE = rsCallBranch.getString(5);
			record.AREADESC = rsCallBranch.getString(6);
			record.DISTRICTCODE = rsCallBranch.getString(7);
			record.DISTRICNAME = rsCallBranch.getString(8);
			record.STATECODE = rsCallBranch.getString(9);
			record.STATENAME = rsCallBranch.getString(10);
			record.REGIONCODE = rsCallBranch.getString(11);
			record.REGIONNAME = rsCallBranch.getString(12);
			record.COUNTRYCODE = rsCallBranch.getString(13);
			record.COUNTRYNAME = rsCallBranch.getString(14);
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
 * This  is a function which call getBranchHierarchyDetails to get all branch hierarchy on the behalf of branch code
 * @Param {String} Branchcode as an input.
 * @return {output} success or failure.
 * @author name :  Shriyansi
 */
function getBranchHierarchy() {
    var output = {
		results: []
	};

	var branchCode = $.request.parameters.get('branchCode');
	try {

	if (branchCode !== null && branchCode !== "") {
			getBranchHierarchyDetails(branchCode, output);
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

	case "getBranchs":
		getBranchs();
		break;
	case "getBranch":
		getBranch();
		break;
	case "addBranch":
		addBranch();
		break;
    case "updateBranch":
        updateBranch();
        break;
    case "deleteBranch":
        deleteBranch();
        break;
    case "getBranchHierarchyDetails":
        getBranchHierarchyDetails();
        break;
    case "getBranchHierarchy":
        getBranchHierarchy();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}