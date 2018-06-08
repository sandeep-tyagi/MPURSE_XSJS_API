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
function checkStatusDescription(record) {
	if (record.SOFT_DEL === '0') {
		record.SOFT_DEL_DESC = 'Active';
	} else if (record.SOFT_DEL === '1') {
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
 * To get the details of PosHierarchy .
 * @Param {Integer} posId,AttributeId.
 * @Param {Integer} parentPosId.
 * @Param [] output .
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */

function getPosHierarchy() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var posId = $.request.parameters.get('posId');
	var parentPosId = $.request.parameters.get('parentPosId');
	if (posId === undefined || posId === null || posId === '') {

		posId = 0;
	}
	if (parentPosId === undefined || parentPosId === null || parentPosId === '') {
		parentPosId = 0;
	}

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(posId, 10));
		pstmtCallPro.setInteger(3, parseInt(parentPosId, 10));
		pstmtCallPro.setInteger(4, 0);
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
			record.POSITION_NAME = rCallPro.getString(1);
			record.POSITION_ID = rCallPro.getString(2);
			record.PARENT_POS_NAME = rCallPro.getString(3);
			record.PARENT_POSITION_ID = rCallPro.getString(4);
			record.POS_HIE_ID = rCallPro.getString(5);

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
 * To get all the details of PosHierarchies .
 ** @Param [] output .
 * @return {String} array of PosHierarchies .
 * @author: Shriyansi.
 */
function getPosHierarchies() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, 0);
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, '0');
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECTALL');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.POSITION_NAME = rCallPro.getString(1);
			record.POSITION_ID = rCallPro.getString(2);
			record.PARENT_POS_NAME = rCallPro.getString(3);
			record.PARENT_POSITION_ID = rCallPro.getString(4);
			record.POS_HIE_ID = rCallPro.getString(5);
			record.SOFT_DEL = rCallPro.getString(6);
			record.CREATE_BY = rCallPro.getString(7);
			record.CREATE_DATE = rCallPro.getString(8);
			record.MODIFIED_BY = rCallPro.getString(9);
			record.MODIFIED_DATE = rCallPro.getString(10);
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
 * Insert new records in PosHierarchy on the behalf of posId ,parentPosId.
 ** @Param [] output .
 ** @return {String} message .
 * @author : Shriyansi.
 */
function addPosHierarchy() {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	var posId = $.request.parameters.get('posId');
	var parentLocId = $.request.parameters.get('parentLocId');

	try {
		record = {};
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(posId, 10));
		pstmtCallPro.setInteger(3, parseInt(parentLocId, 10));
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, ' ');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, '');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'INSERT');
		pstmtCallPro.execute();
		var rsm = pstmtCallPro.getParameterMetaData();
		conn.commit();
		if (rsm.getParameterCount() > 0) {
			record.status = 1;
			record.Message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.Message = 'Some Issues!';
		}
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

/**
 * To update PosHierarchy.
 * @Param {string} editPosHierId ,
 * @Param {string} editPosId,
 * @Param {string} editPosHierParent.
 * @Param {string} editSoftDel
 * @Param [] output .
 * @return {String} message .
 * @author: Shriyansi.
 */
function updatePosHierarchy() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var editPosHierId = $.request.parameters.get('editPosHierId');
	var editPosId = $.request.parameters.get('editPosId');
	var editPosHierParent = $.request.parameters.get('editPosHierParent');
	var editSoftDel = $.request.parameters.get('editSoftDel');
	try {
		var UpdCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
		pstmtUpdCallPro.setInteger(1, parseInt(editPosHierId, 10));
		pstmtUpdCallPro.setInteger(2, parseInt(editPosId, 10));
		pstmtUpdCallPro.setInteger(3, parseInt(editPosHierParent, 10));
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

/**
 * To delete PosHierarchy.
 * @Param {string} PosHieId ,
 * @Param [] output .
 * @return {String} message .
 * @author: Shriyansi.
 */
function deletePosHierarchy() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var PosHieId = $.request.parameters.get('PosHieId');

	try {
		var DelCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtDelCallPro = conn.prepareCall(DelCallPro);
		pstmtDelCallPro.setInteger(1, parseInt(PosHieId, 10));
		pstmtDelCallPro.setInteger(2, 0);
		pstmtDelCallPro.setInteger(3, 0);
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

/**
 * To fetch all posHierarchy on the behalf of posId and pareantPosId
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */
function searchPosHierarchy() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var posId = $.request.parameters.get('posId');
	var parentPosId = $.request.parameters.get('parentPosId');
	if (posId === undefined || posId === null || posId === '') {

		posId = 0;
	}
	if (parentPosId === undefined || parentPosId === null || parentPosId === '') {
		parentPosId = 0;
	}

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::PositionHierarchy"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = connection.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(posId, 10));
		pstmtCallPro.setInteger(3, parseInt(parentPosId, 10));
		pstmtCallPro.setInteger(4, 0);
		pstmtCallPro.setString(5, 'ADMIN');
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, ' ');
		pstmtCallPro.setString(8, dateFunction());
		pstmtCallPro.setString(9, 'SELECTPOSITION');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		connection.commit();
		while (rCallPro.next()) {
			var record = {};
			record.POSITION_NAME = rCallPro.getString(1);
			record.POSITION_ID = rCallPro.getString(2);
			record.PARENT_POS_NAME = rCallPro.getString(3);
			record.PARENT_POSITION_ID = rCallPro.getString(4);
			record.POS_HIE_ID = rCallPro.getString(5);

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

	case "getPosHierarchy":
		getPosHierarchy();
		break;
	case "getPosHierarchies":
		getPosHierarchies();
		break;
	case "addPosHierarchy":
		addPosHierarchy();
		break;
	case "updatePosHierarchy":
		updatePosHierarchy();
		break;
	case "deletePosHierarchy":
		deletePosHierarchy();
		break;
	case "searchPosHierarchy":
		searchPosHierarchy();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}