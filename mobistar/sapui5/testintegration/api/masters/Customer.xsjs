/**
 * To get the current date in db format.
 * @return {String} yyyymmddp  .
 * @author laxmi
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

/*
 * To fetch Status Desc behalf of Status Id.
 * @Param {Integer} Status in record {}.
 * @Param record is dictionary that's hold Status
 * @return {record} in that put StatusDesc.
 * @author laxmi
 */

function getStatusDesc(record) {
	var connection = $.db.getConnection();
	if (record.Status !== undefined && record.Status !== null && record.Status !== '') {
		var queryStatus = 'select STATUS_CODE,STATUS_DESC from "MDB_TEST_INTEGRATION"."MST_STATUS" where STATUS_CODE = ?';
		var pstmtStatus = connection.prepareStatement(queryStatus);
		pstmtStatus.setInteger(1, record.Status);
		var rStatus = pstmtStatus.executeQuery();
		connection.commit();
		while (rStatus.next()) {
			record.ID = rStatus.getInteger(1);
			record.StatusDesc = rStatus.getString(2);
		}
		connection.close();
	}
	return record;
}

/*
 * To fetch Customers data.
 * @Param [] output to put the data in it
 * @return {output} Array of Customers record
 * @author laxmi
 */

function getCustomers() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallProCustomers = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUSTOMER"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtCustomers = connection.prepareCall(CallProCustomers);
		pstmtCustomers.setString(1, 'null');
		pstmtCustomers.setString(2, 'null');
		pstmtCustomers.setString(3, 'null');
		pstmtCustomers.setString(4, 'null');
		pstmtCustomers.setString(5, 'null');
		pstmtCustomers.setString(6, 'null');
		pstmtCustomers.setString(7, 'null');
		pstmtCustomers.setString(8, 'null');
		pstmtCustomers.setString(9, 'null');
		pstmtCustomers.setString(10, 'null');
		pstmtCustomers.setString(11, 'null');
		pstmtCustomers.setString(12, 'null');
		pstmtCustomers.setString(13, 'null');
		pstmtCustomers.setString(14, 'null');
		pstmtCustomers.setString(15, 'null');
		pstmtCustomers.setString(16, 'null');
		pstmtCustomers.setString(17, 'null');
		pstmtCustomers.setString(18, 'null');
		pstmtCustomers.setString(19, 'n');
		pstmtCustomers.setInteger(20, 0);
		pstmtCustomers.setString(21, dateFunction());
		pstmtCustomers.setString(22, '00:00:00');
		pstmtCustomers.setString(23, dateFunction());
		pstmtCustomers.setString(24, dateFunction());
		pstmtCustomers.setString(25, dateFunction());
		pstmtCustomers.setString(26, 'null');
		pstmtCustomers.setString(27, 'null');
		pstmtCustomers.setString(28, '0');
		pstmtCustomers.setString(29, 'null');
		pstmtCustomers.setString(30, dateFunction());
		pstmtCustomers.setString(31, 'null');
		pstmtCustomers.setString(32, dateFunction());
		pstmtCustomers.setString(33, 'SELECT');
		pstmtCustomers.execute();
		var rCustomers = pstmtCustomers.getResultSet();
		connection.commit();
		while (rCustomers.next()) {
			var record = {};
			record.TYPE = rCustomers.getString(1);
			record.CODE = rCustomers.getString(2);
			record.NAME = rCustomers.getString(3);
			record.PARENT_CUST_CODE = rCustomers.getString(4);
			record.PARENT_CUST_NAME = rCustomers.getString(5);
			record.ADDRESS1 = rCustomers.getString(6);
			record.ADDRESS2 = rCustomers.getString(7);
			record.ADDRESS3 = rCustomers.getString(8);
			record.DISTRICT = rCustomers.getString(9);
			record.STATE = rCustomers.getString(10);
			record.REGION = rCustomers.getString(11);
			record.COUNTRY = rCustomers.getString(12);
			record.EMAIL = rCustomers.getString(13);
			record.PHONE_NUMBER = rCustomers.getString(14);
			record.PINCODE = rCustomers.getString(15);
			record.TINNO = rCustomers.getString(16);
			record.PLANT_CODE = rCustomers.getString(17);
			record.Status = rCustomers.getInteger(18);
			record.LEVEL = rCustomers.getString(19);
			record.LevelValue = rCustomers.getString(20);
			record.CustTypeDesc = rCustomers.getString(21);
			record.UserType = "Customer";
			getStatusDesc(record);
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

/*
 * To fetch Customer behalf of CustCode.
 * @Param {String} CustCode.
 * @Param [] output to put the data in it
 * @return {output} Array of Customers record
 * @author laxmi
 */

function getCustomer() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var CustCode = $.request.parameters.get('CustCode');
	try {
		var queryGetCustomer = 'select * from "MDB_TEST_INTEGRATION"."MST_CUSTOMER" where CUST_CODE = ? and SOFT_DEL = ?';
		var pstmtGetCustomer = connection.prepareStatement(queryGetCustomer);
		pstmtGetCustomer.setString(1, CustCode);
		pstmtGetCustomer.setString(2, '0');
		var rGetCustomer = pstmtGetCustomer.executeQuery();
		connection.commit();
		while (rGetCustomer.next()) {
			var record = {};
			record.TYPE = rGetCustomer.getString(1);
			record.CODE = rGetCustomer.getString(2);
			record.NAME = rGetCustomer.getString(3);
			record.PARENT_CUST_CODE = rGetCustomer.getString(4);
			record.PARENT_CUST_NAME = rGetCustomer.getString(5);
			record.ADDRESS1 = rGetCustomer.getString(6);
			record.ADDRESS2 = rGetCustomer.getString(7);
			record.ADDRESS3 = rGetCustomer.getString(8);
			record.DISTRICT = rGetCustomer.getString(9);
			record.STATE = rGetCustomer.getString(10);
			record.REGION = rGetCustomer.getString(11);
			record.COUNTRY = rGetCustomer.getString(12);
			record.EMAIL = rGetCustomer.getString(13);
			record.PHONE_NUMBER = rGetCustomer.getString(14);
			record.PINCODE = rGetCustomer.getString(15);
			record.TINNO = rGetCustomer.getString(16);
			record.PLANT_CODE = rGetCustomer.getString(19);
			record.Status = rGetCustomer.getInteger(20);
			record.LEVEL = rGetCustomer.getString(26);
			record.UserType = "Customer";
			getStatusDesc(record);
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

/*
 * To fetch Cust Code in CustRange.
 * @Param {} record to put the data in it
 * @author laxmi
 */

function getGenerateCUSTCode(record) {
	var today = new Date();
	var yyyy = today.getFullYear();
	record = {};
	var connection = $.db.getConnection();
	var queryRange = 'select ID,name from "MDB_TEST_INTEGRATION"."CUST_RANGE"';
	var pstmtRange = connection.prepareStatement(queryRange);
	var rrange = pstmtRange.executeQuery();
	connection.commit();
	while (rrange.next()) {
		record.ID = rrange.getInteger(1);
	}
	record.CustNO = record.name + (record.ID).toString() + yyyy;
	connection.close();
	return record;
}

/*
 * Use to update Cust Code in CustRange.
 * @Param {} record holds status id , value and name
 * @output return in record
 * @author laxmi
 */

function updateCUSTNo(record) {
	var connection = $.db.getConnection();
	var id = parseInt(record.ID, 10);
	id = id + 1;
	var queryUpdateCustRange = 'UPDATE "MDB_TEST_INTEGRATION"."CUST_RANGE" SET ID = ?,value = ? WHERE name = ?';
	var pstmtUpdateCustRange = connection.prepareStatement(queryUpdateCustRange);
	pstmtUpdateCustRange.setInteger(1, id);
	pstmtUpdateCustRange.setString(2, record.CustNO);
	pstmtUpdateCustRange.setString(3, record.name);
	var rUpdateCustRange = pstmtUpdateCustRange.executeUpdate();
	connection.commit();
	if (rUpdateCustRange > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
	connection.close();
}

/*
 * Insert all mandatory fields.
 * and check record is already insert or not.
 * @Param {datasLine} hold data in array [].
 * @Param [] output to put the data in it
 * @return {output} Array of Customers record
 * @author laxmi
 */

function addCustomers() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				record = getGenerateCUSTCode(record);
				var CallProAddCust = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUSTOMER"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
				var pstmtAddCust = connection.prepareCall(CallProAddCust);
				pstmtAddCust.setString(1, dicLine.CUST_TYPE);
				pstmtAddCust.setString(2, record.CustNO);
				pstmtAddCust.setString(3, dicLine.CUST_NAME);
				pstmtAddCust.setString(4, dicLine.ParentCode);
				pstmtAddCust.setString(5, dicLine.ParentName);
				pstmtAddCust.setString(6, dicLine.Add1);
				pstmtAddCust.setString(7, dicLine.Add2);
				pstmtAddCust.setString(8, dicLine.Add3);
				pstmtAddCust.setString(9, dicLine.DISTRICT);
				pstmtAddCust.setString(10, dicLine.STATE);
				pstmtAddCust.setString(11, dicLine.REGION);
				pstmtAddCust.setString(12, dicLine.COUNTRY);
				pstmtAddCust.setString(13, dicLine.EMAIL);
				pstmtAddCust.setString(14, dicLine.PHONE1);
				pstmtAddCust.setString(15, dicLine.PINCODE);
				pstmtAddCust.setString(16, dicLine.TINNO);
				pstmtAddCust.setString(17, 'null');
				pstmtAddCust.setString(18, 'null');
				pstmtAddCust.setString(19, dicLine.PLANT_CODE);
				pstmtAddCust.setInteger(20, 0);
				pstmtAddCust.setString(21, dateFunction());
				pstmtAddCust.setString(22, '00:00:00');
				pstmtAddCust.setString(23, dateFunction());
				pstmtAddCust.setString(24, dateFunction());
				pstmtAddCust.setString(25, dateFunction());
				pstmtAddCust.setString(26, dicLine.LEVEL);
				pstmtAddCust.setString(27, 'null');
				pstmtAddCust.setString(28, '0');
				pstmtAddCust.setString(29, 'null');
				pstmtAddCust.setString(30, dateFunction());
				pstmtAddCust.setString(31, 'null');
				pstmtAddCust.setString(32, dateFunction());
				pstmtAddCust.setString(33, 'INSERT');
				pstmtAddCust.execute();
				var rAddCust = pstmtAddCust.getResultSet();
				connection.commit();
				if (rAddCust > 0) {
					updateCUSTNo(record);
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
				} else {
					updateCUSTNo(record);
					record.status = 0;
					record.message = 'Some Issues!';
				}
			}
			Output.results.push(record);
			connection.close();
		}
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
	case "addMSTCUSTOMER":
		addCustomers();
		break;
	case "getCustomers":
		getCustomers();
		break;
	case "getCustomer":
		getCustomer();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}