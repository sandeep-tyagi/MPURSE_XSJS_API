function checkStatusDescription(record){
    if(record.SOFT_DEL === '0'){
        record.SOFT_DEL_DESC = 'Active';
    }else  if(record.SOFT_DEL === '1'){
        record.SOFT_DEL_DESC = 'Inactive';
    }
    return record;
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
 * To fetch getCustomerType on the behalf of custtype.
 * @return {output} array as output .
 * @author: Shriyansi.
 */

function getCustomerType() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var CustType = $.request.parameters.get('CustType');

	try {
		var CallgetCustomerType = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?)';
		var pstmtCallgetCustomerType = connection.prepareCall(CallgetCustomerType);
		pstmtCallgetCustomerType.setInteger(1, 0);
		pstmtCallgetCustomerType.setString(2, CustType);
		pstmtCallgetCustomerType.setString(3, 'null');
		pstmtCallgetCustomerType.setString(4, '');
		pstmtCallgetCustomerType.setString(5, 'null');
		pstmtCallgetCustomerType.setString(6, dateFunction());
		pstmtCallgetCustomerType.setString(7, 'null');
		pstmtCallgetCustomerType.setString(8, dateFunction());
		pstmtCallgetCustomerType.setString(9, 'SELECT');
		pstmtCallgetCustomerType.execute();
		var rCallgetCustomerType = pstmtCallgetCustomerType.getResultSet();
		connection.commit();
		while (rCallgetCustomerType.next()) {
			var record = {};
			record.CUSTOMERTYPE_ID = rCallgetCustomerType.getString(1);
			record.CUST_TYPE = rCallgetCustomerType.getString(2);
			record.CUST_TYPE_DESC = rCallgetCustomerType.getString(3);
			record.SOFT_DEL = rCallgetCustomerType.getString(4);
			record.CREATE_BY = rCallgetCustomerType.getString(5);
			record.CREATE_DATE = rCallgetCustomerType.getString(6);
			record.MODIFIED_BY = rCallgetCustomerType.getString(7);
			record.MODIFIED_DATE = rCallgetCustomerType.getString(8);
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
 * To fetch getCustomerTypes.
 * @return {output} array as output .
 * @author: Shriyansi.
 */

function getCustomerTypes() {
	var output = {
		results: []
	};

	var connection = $.db.getConnection();
	var qryCustType = null;
	var custTypeStatus = $.request.parameters.get('Status');

	if (custTypeStatus === "Deleted") {
		qryCustType = 'SELECT * from "MDB_TEST_INTEGRATION"."MST_CUST_TYPE" where SOFT_DEL =\'1\'';
	} else if (custTypeStatus === "Active") {
		qryCustType = 'SELECT * from "MDB_TEST_INTEGRATION"."MST_CUST_TYPE" where SOFT_DEL=\'0\'';
	} else {
		qryCustType = 'SELECT * from "MDB_TEST_INTEGRATION"."MST_CUST_TYPE"';
	}

	var pstmtCustType = connection.prepareStatement(qryCustType);
	var rsCustType = pstmtCustType.executeQuery();

	try {
		//var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.dev.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?)';
		//var pstmtCallPro = conn1.prepareCall(CallPro);

		connection.commit();
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
			checkStatusDescription(record);
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
 * To fetch CustomerType in the customertype master .
 * @return {output} array as output .
 * @author: Shubham.
 */

function fetchCustomerType(inputData, connection) {
	var querySelectCustType = 'select * from "MDB_TEST_INTEGRATION"."MST_CUST_TYPE" where SOFT_DEL is not null ';
	var whereClause = "";
	if (inputData.CustType !== '') {
		whereClause += " AND CUST_TYPE='" + inputData.CustType + "'";
	}
	querySelectCustType += whereClause;
	var pstmtSelectCustType = connection.prepareStatement(querySelectCustType);
	var rsSelectCustType = pstmtSelectCustType.executeQuery();
	return rsSelectCustType;
}
/**
 * To add CustomerType in the customertype master .
 * @return {output} array as output .
 * @author: Shubham.
 */

function validateCustomerType(inputData, connection, record) {
	var CalladdCustomerType = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
	var pstmtCalladdCustomerType = connection.prepareCall(CalladdCustomerType);
	pstmtCalladdCustomerType.setInteger(1, 0);
	pstmtCalladdCustomerType.setString(2, inputData.CustType);
	pstmtCalladdCustomerType.setString(3, inputData.CustTypeDesc);
	pstmtCalladdCustomerType.setString(4, '');
	pstmtCalladdCustomerType.setString(5, inputData.createby);
	pstmtCalladdCustomerType.setString(6, dateFunction());
	pstmtCalladdCustomerType.setString(7, '');
	pstmtCalladdCustomerType.setString(8, dateFunction());
	pstmtCalladdCustomerType.setString(9, 'INSERT');
	pstmtCalladdCustomerType.execute();
	var rCalladdCustomerType = pstmtCalladdCustomerType.getResultSet();
	connection.commit();
	if (rCalladdCustomerType > 0) {
		record.status = 1;
		record.Message = "Record Successfully inserted";
	} else {
		record.status = 0;
		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
	}

}

/**
 * To delete CustomerType.
 * @Param {string} CUSTOMERTYPEId ,
 * @Param [] output .
 * @return {String} message .
 * @author: Shriyansi.
 */

function updateCustomerType() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var idCustTypeEdit = $.request.parameters.get('idCustTypeEdit');
	var custTypeEdit = $.request.parameters.get('custTypeEdit');
	var CustTypeDescEdit = $.request.parameters.get('CustTypeDescEdit');
	var CustTypeStatusEdit = $.request.parameters.get('CustTypeStatusEdit');
	var modifyby = $.request.parameters.get('modifyby');

	try {
		var UpdCallCustomerType = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
		var pstmtCustomerType = conn.prepareCall(UpdCallCustomerType);
		pstmtCustomerType.setInteger(1, parseInt(idCustTypeEdit, 10));
		pstmtCustomerType.setString(2, custTypeEdit);
		pstmtCustomerType.setString(3, CustTypeDescEdit);
		pstmtCustomerType.setString(4, CustTypeStatusEdit);
		pstmtCustomerType.setString(5, 'ADMIN');
		pstmtCustomerType.setString(6, dateFunction());
		pstmtCustomerType.setString(7, modifyby);
		pstmtCustomerType.setString(8, dateFunction());
		pstmtCustomerType.setString(9, 'UPDATE');
		pstmtCustomerType.execute();
		var rsCustomerType = pstmtCustomerType.getParameterMetaData();
		conn.commit();

		if (rsCustomerType.getParameterCount() > 0) {
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
 * To update CustomerType.
 * @Param {string} CUSTOMERTYPEId ,
 * @Param [] output .
 * @return {String} message .
 * @author: Shriyansi.
 */

function deleteCustomerType() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var custTypeID = $.request.parameters.get('custTypeID');

	try {
		var CalldeleteCustomerType = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUST_TYPE"(?,?,?,?,?,?,?,?,?);';
		var pstmtdeleteCustomerType = conn.prepareCall(CalldeleteCustomerType);
		pstmtdeleteCustomerType.setInteger(1, parseInt(custTypeID, 10));
		pstmtdeleteCustomerType.setString(2, '0');
		pstmtdeleteCustomerType.setString(3, '0');
		pstmtdeleteCustomerType.setString(4, '1');
		pstmtdeleteCustomerType.setString(5, 'ADMIN');
		pstmtdeleteCustomerType.setString(6, dateFunction());
		pstmtdeleteCustomerType.setString(7, ' ');
		pstmtdeleteCustomerType.setString(8, dateFunction());
		pstmtdeleteCustomerType.setString(9, 'DELETE');
		pstmtdeleteCustomerType.execute();
		var rsdeleteCustomerType = pstmtdeleteCustomerType.getParameterMetaData();
		conn.commit();

		if (rsdeleteCustomerType.getParameterCount() > 0) {
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
 * To validate CustomerType.
 * @Param {string} CUSTOMERTYPEId ,
 * @Param [] output .
 * @return {String} message .
 * @author: Shriyansi.
 */

function addCustomerType() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var inputData = {};
	var CustType = $.request.parameters.get('CustType');
	var CustTypeDesc = $.request.parameters.get('CustTypeDesc');
	var createby = $.request.parameters.get('createby');
	inputData.CustType = CustType;
	inputData.CustTypeDesc = CustTypeDesc;
inputData.createby = createby;
	try {
		var record = {};
		var rsCustTypeValidation = fetchCustomerType(inputData, connection);
		if (rsCustTypeValidation.next()) {
			var softDel = rsCustTypeValidation.getString(4);
			if (softDel === "0") {
				record.status = 1;
				record.Message = "CustType already present in our System!!! Kindly add another CustType";

			} else {
				record.status = 1;
				record.Message = "CustType is inactive in our System!!! Kindly use edit functionality to activate it.";
			}
		} else {
			validateCustomerType(inputData, connection, record);
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
    case "validateCustomerType":
		validateCustomerType();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}