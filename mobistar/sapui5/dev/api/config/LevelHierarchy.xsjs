/**
 *  To get the current date in db format .
 * @Param {String} Date.
 * @return {String} yyyymmddp  .
 * @author Shriyansi.
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
 * To get the status of soft_del in the form of Active or inactive.
 * @Param {String} output.
 * @return {String} SOFT_DEL_DESC  .
 */
function checkStatusDescription(record){
    if(record.SOFT_DEL === '0'){
        record.SOFT_DEL_DESC = 'Active';
    }else  if(record.SOFT_DEL === '1'){
        record.SOFT_DEL_DESC = 'Inactive';
    }
    return record;
}

/**.
 * To get date  format for paticular date
 * @Param {String} output.
 * @return {String} yyyymmddp  .
 */
function dateFormat(record) {
    var date = record.CREATE_DATE;
			if (date) {
				record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
				return record.CREATE_DATE;
			}
		}
/**
 * To get the details of LevelHierarchy .
 * @Param {Integer} posId,LevelId.
 * @Param [] output .
 * @return {String} array of Level .
 * @author: Shriyansi.
 */

function getLevelHierarchy() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	var LevelId = $.request.parameters.get('LevelId');

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::LEVEL_HIERARCHY"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1,0);
		pstmtCallPro.setInteger(2,parseInt(LevelId,10));
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, '');
		pstmtCallPro.setString(5, 'null');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, 'null');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECTID');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.ID = rCallPro.getString(1);
			record.LEVEL_ID = rCallPro.getString(2);
			record.LEVEL = rCallPro.getString(3);
			record.PARENT_ID = rCallPro.getString(4);
			record.PARENTLEVEL = rCallPro.getString(5);
			record.SOFT_DEL = rCallPro.getString(6);
			record.CREATE_BY = rCallPro.getString(7);
			record.CREATE_DATE = rCallPro.getString(8);
			record.MODIFIED_BY = rCallPro.getString(9);
			record.MODIFIED_DATE = rCallPro.getString(10);
			
			output.results.push(record);
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
 * To get the details of LevelHierarchies .
 ** @Param [] output .
 * @return {String} array of Level .
 * @author: Shriyansi.
 */
function getLevelHierarchies() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
//	var levelHier = $.request.parameters.get('levelHier');

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::LEVEL_HIERARCHY"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1,0);
		pstmtCallPro.setInteger(2,  0);
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, '');
		pstmtCallPro.setString(5, 'null');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, 'null');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECT');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.ID = rCallPro.getString(1);
			record.LEVEL_ID = rCallPro.getString(2);
			record.LEVEL = rCallPro.getString(3);
			record.PARENT_ID = rCallPro.getString(4);
			record.PARENTLEVEL = rCallPro.getString(5);
			record.SOFT_DEL = rCallPro.getString(9);
			record.CREATE_BY = rCallPro.getString(10);
			record.CREATE_DATE = rCallPro.getString(11);
			record.MODIFIED_BY = rCallPro.getString(12);
			record.MODIFIED_DATE = rCallPro.getString(13);
			checkStatusDescription(record);
            dateFormat(record);
			output.results.push(record);
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

/*
 * Insert all  fields  Level Id,parentId Id.
 * @Param {record} hold data in array [].
 * @Param [] output to put the data in it.
 * @return {output} Array ofLevelHierarchy record.
 * @author Shriyansi.
 */

function addLevelHierarchy() {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	var levelID = $.request.parameters.get('levelID');
	var parentId = $.request.parameters.get('parentId');

	try {
		record = {};
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::LEVEL_HIERARCHY"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2,parseInt(levelID,10));
		pstmtCallPro.setInteger(3,parseInt(parentId,10));
    	pstmtCallPro.setString(4, '');
		pstmtCallPro.setString(5, '');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, '');
		pstmtCallPro.setString(8,dateFunction());
		pstmtCallPro.setString(9, 'INSERT');
		pstmtCallPro.execute();
		pstmtCallPro.getResultSet();
		conn.commit();

		Output.results.push(record);
		conn.close();
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

/*
 * Update selected fields .
 * @Param {Integer} levIDEdit.
 * @Param {Integer} levHierIDEdit.
 * @Param {Integer}  levHierParrentIDEdit .
 * @Param {Integer}  SoftDel.
 * @return {output} Message display.
 * @author Shriyansi.
 */

function updateLevelHierarchy() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var levIDEdit = $.request.parameters.get('levIDEdit');
	var levHierIDEdit = $.request.parameters.get('levHierIDEdit');
	var levHierParrentIDEdit = $.request.parameters.get('levHierParrentIDEdit');
	var editSoftDel = $.request.parameters.get('editSoftDel');

	try {
		var UpdCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::LEVEL_HIERARCHY"(?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
	   	pstmtUpdCallPro.setInteger(1, parseInt(levIDEdit,10));
		pstmtUpdCallPro.setInteger(2, parseInt(levHierIDEdit,10));
		pstmtUpdCallPro.setInteger(3, parseInt(levHierParrentIDEdit,10));
		pstmtUpdCallPro.setString(4, editSoftDel);
		pstmtUpdCallPro.setString(5, 'ADMIN');
		pstmtUpdCallPro.setString(6, dateFunction());
		pstmtUpdCallPro.setString(7, ' ');
		pstmtUpdCallPro.setString(8, dateFunction());
		pstmtUpdCallPro.setString(9, 'UPDATE');
		pstmtUpdCallPro.execute();
		var rsUpdCallPro = pstmtUpdCallPro.getParameterMetaData();
		conn.commit();

		if (rsUpdCallPro.getParameterCount() > 0) {
			record.status = 0;
			record.message = 'Success';
			Output.results.push(record);

		} else {
			record.status = 1;
			record.message = 'failed';
			Output.results.push(record);

		}

		conn.close();

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

/*
 * delete selected fields .
 * @Param {Integer} levIDEdit.
 * @return {output} Message display.
 * @author Shriyansi.
 */

function deleteLevelHierarchy() {
    	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var levIDEdit = $.request.parameters.get('levIDEdit');

	try {
		var DelCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::LEVEL_HIERARCHY"(?,?,?,?,?,?,?,?,?);';
		var pstmtDelCallPro = conn.prepareCall(DelCallPro);
		pstmtDelCallPro.setInteger(1, parseInt(levIDEdit,10));
		pstmtDelCallPro.setInteger(2, 0);
		pstmtDelCallPro.setInteger(3, 0 );
		pstmtDelCallPro.setString(4, '1');
		pstmtDelCallPro.setString(5, 'ADMIN');
		pstmtDelCallPro.setString(6, dateFunction());
		pstmtDelCallPro.setString(7, ' ');
		pstmtDelCallPro.setString(8, dateFunction());
		pstmtDelCallPro.setString(9, 'DELETE');
		pstmtDelCallPro.execute();
		var rsDelCallPro = pstmtDelCallPro.getParameterMetaData();
		conn.commit();

		if (rsDelCallPro.getParameterCount() > 0) {
			record.status = 0;
			record.message = 'Success';
			Output.results.push(record);

		} else {
			record.status = 1;
			record.message = 'failed';
			Output.results.push(record);

		}

		conn.close();

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

	case "getLevelHierarchies":
		getLevelHierarchies();
		break;
		
	case 'getLevelHierarchy':
	    getLevelHierarchy();
	    break;
	case "addLevelHierarchy":
		addLevelHierarchy();
		break;
    case "updateLevelHierarchy":
		updateLevelHierarchy();
		break;
	case "deleteLevelHierarchy":
		deleteLevelHierarchy();
		break;	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}