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
 * To fetch Employees data.
 * @Param [] output to put the data in it
 * @return {output} Array of Employees record
 * @author laxmi
 */
 
function getEmployees() {
	var output = {
		results: []
	};
	var Connection = $.db.getConnection();
	try {
		var CallProGetEmp = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_EMPLOYEE"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtGetEmp = Connection.prepareCall(CallProGetEmp);
		pstmtGetEmp.setInteger(1, 0);
		pstmtGetEmp.setString(2, 'null');
		pstmtGetEmp.setString(3, 'null');
		pstmtGetEmp.setString(4, 'null');
		pstmtGetEmp.setString(5, 'null');
		pstmtGetEmp.setString(6, 'null');
		pstmtGetEmp.setString(7, 'null');
		pstmtGetEmp.setString(8, 'null');
		pstmtGetEmp.setString(9, 'null');
		pstmtGetEmp.setString(10, 'null');
		pstmtGetEmp.setInteger(11, 0);
		pstmtGetEmp.setString(12, '0');
		pstmtGetEmp.setString(13, '0');
		pstmtGetEmp.setString(14, dateFunction());
		pstmtGetEmp.setString(15, dateFunction());
		pstmtGetEmp.setString(16, '0');
		pstmtGetEmp.setString(17, '');
		pstmtGetEmp.setString(18, dateFunction());
		pstmtGetEmp.setString(19, '');
		pstmtGetEmp.setString(20, dateFunction());
		pstmtGetEmp.setString(21, 'SELECT');
		pstmtGetEmp.execute();
		var rGetEmp = pstmtGetEmp.getResultSet();
		Connection.commit();
		while (rGetEmp.next()) {
			var record = {};
			record.CODE = rGetEmp.getString(1);
			record.NAME = rGetEmp.getString(2);
			record.ADDRESS1 = rGetEmp.getString(3);
			record.ADDRESS2 = rGetEmp.getString(4);
			record.COUNTRY = rGetEmp.getString(5);
			record.STATE = rGetEmp.getString(6);
			record.DISTRICT = rGetEmp.getString(7);
			record.PHONE_NUMBER = rGetEmp.getString(8);
			record.EMAIL = rGetEmp.getString(9);
			record.ROLE_ID = rGetEmp.getString(10);
			record.POSITION_ID = rGetEmp.getString(11);
			record.Status = rGetEmp.getInteger(12);
			record.ROLE_ID_NAME = rGetEmp.getString(15);
			record.POSITION_ID_NAME = rGetEmp.getString(16);
			//record.Status = rGetEmp.getInteger(12);
			record.UserType = "Employee";
			getStatusDesc(record);
			output.results.push(record);
		}

		Connection.close();
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
 * To fetch Employee behalf of CustCode.
 * @Param {String} EmployeeCode.
 * @Param [] output to put the data in it
 * @return {output} Array of Employee record
 * @author laxmi
 */
 
function MDB_TEST_INTEGRATION() {
	var output = {
		results: []
	};
	var Connection = $.db.getConnection();
	var EmployeeCode = $.request.parameters.get('EmployeeCode');

	try {
		var queryEmployee = 'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MS.REGION_CODE,MR.REGION_NAME from "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as MSE inner join "MDB_TEST_INTEGRATION"."MST_STATE" as MS on MSE.STATE = MS.STATE_CODE inner join "MDB_TEST_INTEGRATION"."MST_REGION" as MR on  MS.REGION_CODE = MR.REGION_CODE where MSE.EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?';
		var pstmtEmployee = Connection.prepareStatement(queryEmployee);
		pstmtEmployee.setString(1, EmployeeCode);
		pstmtEmployee.setString(2, '0');
		var rEmployee = pstmtEmployee.executeQuery();
		Connection.commit();
		while (rEmployee.next()) {
			var record = {};
			record.ID = rEmployee.getString(1);
			record.CODE = rEmployee.getString(2);
			record.NAME = rEmployee.getString(3);
			record.ADDRESS1 = rEmployee.getString(4);
			record.ADDRESS2 = rEmployee.getString(5);
			record.COUNTRY = rEmployee.getString(6);
			record.STATE = rEmployee.getString(7);
			record.DISTRICT = rEmployee.getString(8);
			record.PHONE_NUMBER = rEmployee.getString(9);
			record.EMAIL = rEmployee.getString(10);
			record.ROLE_ID = rEmployee.getString(11);
			record.POSITION_ID = rEmployee.getString(12);
			record.Status = rEmployee.getInteger(13);
			record.REGION_CODE = rEmployee.getString(14);
			record.REGION = rEmployee.getString(15);
			record.UserType = "Employee";
			getStatusDesc(record);
			output.results.push(record);
		}

		Connection.close();
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
 * To fetch Emp Code in EmpRange.
 * @Param {} record to put the data in it
 * @author laxmi
 */
 
function getGenerateEMPCode(record) {
	var today = new Date();
	var yyyy = today.getFullYear();
	record = {};
	var Connection = $.db.getConnection();
	var queryRange = 'select ID,name from "MDB_TEST_INTEGRATION"."EMP_RANGE"';
	var pstmtRange = Connection.prepareStatement(queryRange);
	var rrange = pstmtRange.executeQuery();
	Connection.commit();
	while (rrange.next()) {
		record.ID = rrange.getInteger(1);
		record.name = rrange.getString(2);
	}
	record.EmpNO = record.name + (record.ID).toString() + yyyy;
	Connection.close();
	return record;
}

/*
 * Use to update Emp Code in EmpRange.
 * @Param {} record holds status id , value and name
 * @output return in record
 * @author laxmi
 */

function updateEmpNo(record) {
	var Connection = $.db.getConnection();
	var id = parseInt(record.ID, 10);
	id = id + 1;
	var queryUpdateEmpRange = 'UPDATE "MDB_TEST_INTEGRATION"."EMP_RANGE" SET ID = ?,value = ? WHERE name = ?';
	var pstmtUpdateEmpRange = Connection.prepareStatement(queryUpdateEmpRange);
	pstmtUpdateEmpRange.setInteger(1, id);
	pstmtUpdateEmpRange.setString(2, record.EmpNO);
	pstmtUpdateEmpRange.setString(3, record.name);
	var rUpdateEmpRange = pstmtUpdateEmpRange.executeUpdate();
	Connection.commit();
	if (rUpdateEmpRange > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
}

/*
 * Insert all mandatory fields.
 * and check record is already insert or not.
 * @Param {datasLine} hold data in array [].
 * @Param [] output to put the data in it
 * @return {output} Array of Employees record
 * @author laxmi
 */
 
function addEmployee() {
	var record;
	var Output = {
		results: []
	};
	var Connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var empcode = getGenerateEMPCode(record);
				var CallProAddEmp = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_EMPLOYEE"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
				var pstmtAddEmp = Connection.prepareCall(CallProAddEmp);
				pstmtAddEmp.setInteger(1, 0);
				pstmtAddEmp.setString(2, empcode.EmpNO);
				pstmtAddEmp.setString(3, dicLine.EMPLOYEE_NAME);
				pstmtAddEmp.setString(4, dicLine.ADDRESS1);
				pstmtAddEmp.setString(5, dicLine.ADDRESS2);
				pstmtAddEmp.setString(6, dicLine.COUNTRY);
				pstmtAddEmp.setString(7, dicLine.STATE);
				pstmtAddEmp.setString(8, dicLine.DISTRICT);
				pstmtAddEmp.setString(9, dicLine.PHONE_NUMBER);
				pstmtAddEmp.setString(10, dicLine.EMAIL);
				pstmtAddEmp.setInteger(11, parseInt(dicLine.ROLE_DEPENDENT_POS_ID, 10));// ROLE_ID
				pstmtAddEmp.setString(12, dicLine.POSITION_ID);
				pstmtAddEmp.setInteger(13, 0);
				pstmtAddEmp.setString(14, dateFunction());
				pstmtAddEmp.setString(15, dateFunction());
				pstmtAddEmp.setString(16, '0');
				pstmtAddEmp.setString(17, dicLine.createby);
				pstmtAddEmp.setString(18, dateFunction());
				pstmtAddEmp.setString(19, '');
				pstmtAddEmp.setString(20, dateFunction());
				pstmtAddEmp.setString(21, 'INSERT');
				pstmtAddEmp.execute();
				var rAddEmp = pstmtAddEmp.getParameterMetaData();
				Connection.commit();
				if (rAddEmp.getParameterCount() > 0) {
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
					updateEmpNo(empcode);
				} else {
					record.status = 0;
					record.message = 'Some Issues!';
					updateEmpNo(empcode);
				}
			}
			Output.results.push(record);
			Connection.close();
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


function getEmployee() {
	var output = {
		results: []
	};
	var Connection = $.db.getConnection();
	var EmployeeCode = $.request.parameters.get('EmployeeCode');

	try {
		var queryEmployee = 'select MSE.EMPLOYEE_ID,MSE.EMPLOYEE_CODE,MSE.EMPLOYEE_NAME,MSE.ADDRESS1,MSE.ADDRESS2,MSE.COUNTRY,MSE.STATE,MSE.DISTRICT,MSE.PHONE_NUMBER,MSE.EMAIL,MSE.ROLE_POSITION_ID,MSE.POSITION_VALUE_ID,MSE.STATUS,MS.REGION_CODE,MR.REGION_NAME from "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as MSE inner join "MDB_TEST_INTEGRATION"."MST_STATE" as MS on MSE.STATE = MS.STATE_CODE inner join "MDB_TEST_INTEGRATION"."MST_REGION" as MR on  MS.REGION_CODE = MR.REGION_CODE where MSE.EMPLOYEE_CODE = ? and MSE.SOFT_DEL=?';
		var pstmtEmployee = Connection.prepareStatement(queryEmployee);
		pstmtEmployee.setString(1, EmployeeCode);
		pstmtEmployee.setString(2, '0');
		var rEmployee = pstmtEmployee.executeQuery();
		Connection.commit();
		while (rEmployee.next()) {
			var record = {};
			record.ID = rEmployee.getString(1);
			record.CODE = rEmployee.getString(2);
			record.NAME = rEmployee.getString(3);
			record.ADDRESS1 = rEmployee.getString(4);
			record.ADDRESS2 = rEmployee.getString(5);
			record.COUNTRY = rEmployee.getString(6);
			record.STATE = rEmployee.getString(7);
			record.DISTRICT = rEmployee.getString(8);
			record.PHONE_NUMBER = rEmployee.getString(9);
			record.EMAIL = rEmployee.getString(10);
			record.ROLE_ID = rEmployee.getString(11);
			record.POSITION_ID = rEmployee.getString(12);
			record.Status = rEmployee.getInteger(13);
			record.REGION_CODE = rEmployee.getString(14);
			record.REGION = rEmployee.getString(15);
			record.UserType = "Employee";
			getStatusDesc(record);
			output.results.push(record);
		}

		Connection.close();
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
	case "addMSTEMPLOYEE":
		addEmployee();
		break;
	case "getEmployees":
		getEmployees();
		break;
	case "getEmployee":
		getEmployee();
		break;

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}