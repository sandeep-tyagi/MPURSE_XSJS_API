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

function dateFormat(record) {
    var date = record.CREATE_DATE;
   if (date) {
    record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    return record.CREATE_DATE;
   }
  }
/**
 * To get the details of a particular Custtype on the behalf of CustType.
 * @Param {String} CustType as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function getCustomerType() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	var CustType = $.request.parameters.get('CustType');

	try {
		var CallCustType = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallCustType = conn1.prepareCall(CallCustType);
		pstmtCallCustType.setInteger(1, 0);
		pstmtCallCustType.setString(2, CustType);
		pstmtCallCustType.setString(3, 'null');
		pstmtCallCustType.setString(4, '');
		pstmtCallCustType.setString(5, 'null');
		pstmtCallCustType.setString(6, dateFunction());
		pstmtCallCustType.setString(7, 'null');
		pstmtCallCustType.setString(8, dateFunction());
		pstmtCallCustType.setString(9, 'SELECT');
		pstmtCallCustType.execute();
		var rCallcustType = pstmtCallCustType.getResultSet();
		conn1.commit();
		while (rCallcustType.next()) {
			var record = {};
			record.CUSTOMERTYPE_ID = rCallcustType.getString(1);
			record.CUST_TYPE = rCallcustType.getString(2);
			record.CUST_TYPE_DESC = rCallcustType.getString(3);
			record.SOFT_DEL = rCallcustType.getString(4);
			record.CREATE_BY = rCallcustType.getString(5);
			record.CREATE_DATE = rCallcustType.getString(6);
			record.MODIFIED_BY = rCallcustType.getString(7);
			record.MODIFIED_DATE = rCallcustType.getString(8);
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
 * To get the details of type on the behalf of CustType.
 * @Param {String} CustType as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function getCustomerTypes() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();

	try {
		var CallCustType = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?)';
		var pstmtCustType = conn1.prepareCall(CallCustType);
		pstmtCustType.setInteger(1, 0);
		pstmtCustType.setString(2, '');
		pstmtCustType.setString(3, 'null');
		pstmtCustType.setString(4, '');
		pstmtCustType.setString(5, 'null');
		pstmtCustType.setString(6, dateFunction());
		pstmtCustType.setString(7, 'null');
		pstmtCustType.setString(8, dateFunction());
		pstmtCustType.setString(9, 'SELECTTYPES');
		pstmtCustType.execute();
		var rsCustType = pstmtCustType.getResultSet();
		conn1.commit();
		while (rsCustType.next()) {
			var record = {};
			record.CUSTOMERTYPE_ID = rsCustType.getString(1);
			record.CUST_TYPE = rsCustType.getString(2);
			record.CUST_TYPE_DESC = rsCustType.getString(3);
			record.SOFT_DEL = rsCustType.getString(4);
			record.CREATE_BY = rsCustType.getString(5);
			record.CREATE_DATE = rsCustType.getString(6);
			record.MODIFIED_BY = rsCustType.getString(7);
			record.MODIFIED_DATE = rsCustType.getString(8);
			dateFormat(record) ;
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
 * To add the details of custtype on the behalf of CustType and custTypeDesc.
 * @Param {String} Branch id as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function addCustomerType() {

	var record;
	var Output = {
		results: []
	};

	var connection = $.db.getConnection();
	var CustType = $.request.parameters.get('CustType');
	var CustTypeDesc = $.request.parameters.get('CustTypeDesc');

	try {
		record = {};
		var CallCustType = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
		var pstmtCustType = connection.prepareCall(CallCustType);
		pstmtCustType.setInteger(1, 0);
		pstmtCustType.setString(2, CustType);
		pstmtCustType.setString(3, CustTypeDesc);
		pstmtCustType.setString(4, '');
		pstmtCustType.setString(5, '');
		pstmtCustType.setString(6, dateFunction());
		pstmtCustType.setString(7, '');
		pstmtCustType.setString(8, dateFunction());
		pstmtCustType.setString(9, 'INSERT');
		pstmtCustType.execute();
		pstmtCustType.getResultSet();
		connection.commit();

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
 * To delete any Branch on the behalf of Branch id.
 * @Param {String} Branch id as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function updateCustomerType() {
	var Output = {
		results: []

	};
	var record = {};
	var connection = $.db.getConnection();
	var idCustTypeEdit = $.request.parameters.get('idCustTypeEdit');
	var editCustType = $.request.parameters.get('CustType_EditCustType');
	var editCustTypeDesc = $.request.parameters.get('CustTypeDesc_EditCustTypeDesc');

	try {
		var UpdCallCustType = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallCustType = connection.prepareCall(UpdCallCustType);
		pstmtUpdCallCustType.setInteger(1, parseInt(idCustTypeEdit, 10));
		pstmtUpdCallCustType.setString(2, editCustType);
		pstmtUpdCallCustType.setString(3, editCustTypeDesc);
		pstmtUpdCallCustType.setInteger(4, 0);
		pstmtUpdCallCustType.setString(5, 'ADMIN');
		pstmtUpdCallCustType.setString(6, dateFunction());
		pstmtUpdCallCustType.setString(7, ' ');
		pstmtUpdCallCustType.setString(8, dateFunction());
		pstmtUpdCallCustType.setString(9, 'UPDATE');
		pstmtUpdCallCustType.execute();
		var rsUpdCallCustType = pstmtUpdCallCustType.getParameterMetaData();
		connection.commit();

		if (rsUpdCallCustType.getParameterCount() > 0) {
			record.status = 0;
			record.message = 'Success';
			Output.results.push(record);

		} else {
			record.status = 1;
			record.message = 'failed';
			Output.results.push(record);

		}

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
 * To delete any CustTypeID on the behalf of editCustTypeID.
 * @Param {String} editCustTypeID as an input.
 * @return {output} success or failure.
 * @author name : shriyansi
 */
function deleteCustomerType() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var editCustTypeID = $.request.parameters.get('CustTypeID_EditCustType');

	try {
		var deleteCallCustType = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
		var pstmtdeleteCallCustType = conn.prepareCall(deleteCallCustType);
		pstmtdeleteCallCustType.setInteger(1, parseInt(editCustTypeID, 10));
		pstmtdeleteCallCustType.setString(2, '0');
		pstmtdeleteCallCustType.setString(3, '0');
		pstmtdeleteCallCustType.setString(4, '1');
		pstmtdeleteCallCustType.setString(5, 'ADMIN');
		pstmtdeleteCallCustType.setString(6, dateFunction());
		pstmtdeleteCallCustType.setString(7, ' ');
		pstmtdeleteCallCustType.setString(8, dateFunction());
		pstmtdeleteCallCustType.setString(9, 'DELETE');
		pstmtdeleteCallCustType.execute();
		var rsdeleteCallCustType = pstmtdeleteCallCustType.getParameterMetaData();
		conn.commit();

		if (rsdeleteCallCustType.getParameterCount() > 0) {
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

	case "getCustomerType":
		getCustomerType();
		break;
	case "getCustomerTypes":
		getCustomerTypes();
		break;	
	case "addCustomerType":
		addCustomerType();
		break;
	case "updateCustomerType":
		updateCustomerType();
		break;
	case "deleteCustomerType":
		deleteCustomerType();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}