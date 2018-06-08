 /**
  * To get the current date in db format.
  * @Param {String} output.
  * @return {String} yyyymmddp  .
  */
 function checkStatusDescription(record) {
	if (record.SOFT_DEL === '0') {
		record.SOFT_DEL_DESC = 'Active';
	} else if (record.SOFT_DEL === '1') {
		record.SOFT_DEL_DESC = 'Inactive';
	}
	return record;
}
 /**
  * To get the current date in db format.
  * @Param {String} output.
  * @return {String} yyyymmddp  .
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
  * To get the current date in db format.
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
  * To fetch all CustomerLevel. on the behalf of Id.
  * @Param [] output .
  * @return {String} array of CustLevelMap .
  * @author: Tushar.
  */

function getMapCustomerLevels() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();

	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_CUST_LEVEL"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, 0);
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, ' ');
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
			record.CUSTOMERTYPE_ID = rCallPro.getString(2);
			record.CUST_TYPE = rCallPro.getString(3);
			record.LEVEL_ID = rCallPro.getString(4);
			record.LEVEL = rCallPro.getString(5);
			record.CUST_DESC = rCallPro.getString(6);
			record.SOFT_DEL = rCallPro.getString(7);
			record.CREATE_BY = rCallPro.getString(8);
			record.CREATE_DATE = rCallPro.getString(9);
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
/**
  * To fetch all CustomerLevelMap.
  * @Param [] output .
  * @Param {Integer} CustTypeId
  * @Param {Integer } LevelId
  * @return {String} array of CustLevelMap .
  * @author: Tushar.
  */
function getMapCustomerLevel() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	var CustTypeId = $.request.parameters.get('CustTypeId');
	var LevelId = $.request.parameters.get('LevelId');
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_CUST_LEVEL"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(CustTypeId, 10));
		pstmtCallPro.setInteger(3, parseInt(LevelId, 10));
		pstmtCallPro.setString(4, ' ');
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
			record.CUSTOMERTYPE_ID = rCallPro.getString(2);
			record.CUST_TYPE = rCallPro.getString(3);
			record.LEVEL_ID = rCallPro.getString(4);
			record.LEVEL = rCallPro.getString(5);
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
  * Insert new  CustLevel.
  * @Param {Integer} CustTypeId
  * @Param {Integer} LevelId.
  * @Param [] output  .
  * @return {String} Empty message .
  * @author : Tushar.
  */
function addMapCustomerLevel() {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	var CustTypeId = $.request.parameters.get('CustTypeId');
	var LevelId = $.request.parameters.get('LevelId');
var createby = $.request.parameters.get('createby');
	try {
		record = {};

		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_CUST_LEVEL"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setInteger(2, parseInt(CustTypeId, 10));
		pstmtCallPro.setInteger(3, parseInt(LevelId, 10));
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, createby);
		pstmtCallPro.setString(6, dateFunction());
		pstmtCallPro.setString(7, '');
		pstmtCallPro.setString(8, dateFunction());
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
 /**
  * To update custLevel.
  * @Param {Integer} MapCustLevIDEdit ,
  * @Param {Integer} MapCustLevCustTypeIDEdit,
  * @Param {Integer} MapCustLevLevIDEdit.
  * @Param {string} SoftDel.
  * @Param [] output .
  * @return {String} message .
  * @author: Tushar.
  */
function updateCustomerLevel() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var MapCustLevIDEdit = $.request.parameters.get('MapCustLevIDEdit');
	var MapCustLevCustTypeIDEdit = $.request.parameters.get('MapCustLevCustTypeIDEdit');
	var MapCustLevLevIDEdit = $.request.parameters.get('MapCustLevLevIDEdit');
    var SoftDel = $.request.parameters.get('SoftDel');
	try {
		var UpdCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_CUST_LEVEL"(?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallPro = conn.prepareCall(UpdCallPro);
		pstmtUpdCallPro.setInteger(1, parseInt(MapCustLevIDEdit, 10));
		pstmtUpdCallPro.setInteger(2, parseInt(MapCustLevCustTypeIDEdit, 10));
		pstmtUpdCallPro.setInteger(3, parseInt(MapCustLevLevIDEdit, 10));
		pstmtUpdCallPro.setString(4, SoftDel);
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
  * To delete existing custlevel.
  * @Param {Integer} CustlevIDEdit .
  * @Param [] output .
  * @return {String} message .
  * @author: Tushar.
  */
function deleteCustomerLevel() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var CustlevIDEdit = $.request.parameters.get('CustlevIDEdit');

	try {
		var DelCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_CUST_LEVEL"(?,?,?,?,?,?,?,?,?);';
		var pstmtDelCallPro = conn.prepareCall(DelCallPro);
		pstmtDelCallPro.setInteger(1, parseInt(CustlevIDEdit, 10));
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
var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getMapCustomerLevels":
		getMapCustomerLevels();
		break;
	case "getMapCustomerLevel":
		getMapCustomerLevel();
		break;
	case "addMapCustomerLevel":
		addMapCustomerLevel();
		break;
	case "updateCustomerLevel":
		updateCustomerLevel();
		break;
	case "deleteCustomerLevel":
		deleteCustomerLevel();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}