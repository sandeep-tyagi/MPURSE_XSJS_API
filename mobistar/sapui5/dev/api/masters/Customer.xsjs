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
		var queryStatus = 'select STATUS_CODE,STATUS_DESC from "MDB_DEV"."MST_STATUS" where STATUS_CODE = ?';
		var pstmtStatus = connection.prepareStatement(queryStatus);
		pstmtStatus.setInteger(1, parseInt(record.Status, 10));
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
		var CallProCustomers =
			'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUSTOMER"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
		var queryGetCustomer = 'select * from "MDB_DEV"."MST_CUSTOMER" where CUST_CODE = ? and SOFT_DEL = ?';
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
	var queryRange = 'select ID,name from "MDB_DEV"."CUST_RANGE"';
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
	var queryUpdateCustRange = 'UPDATE "MDB_DEV"."CUST_RANGE" SET ID = ?,value = ? WHERE name = ?';
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
				var CallProAddCust =
					'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_CUSTOMER"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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

function getApproverdetail() {
	var connection = $.db.getConnection();
	var query;
	var output = {
		results: []
	};
	var AreaCode = $.request.parameters.get('AreaCode');
	//	var connection = $.db.getConnection();
	try {
		query =
			'select ME.EMPLOYEE_CODE,ME.EMPLOYEE_NAME,MR.ROLE_NAME,MP.POSITION_NAME,ME.POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_ROLE" as MR on MRP.ROLE_ID = MR.ROLE_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' + ' where ME.POSITION_VALUE_ID = ?';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, AreaCode);
		var rGetCustomer = pstmt.executeQuery();
		connection.commit();
		while (rGetCustomer.next()) {
			var record = {};
			record.POSITION_VALUE_ID = rGetCustomer.getString(5);
			if (record.POSITION_VALUE_ID === "REGIONALSALESMANAGER") {
				record.EMPLOYEE_CODE = rGetCustomer.getString(1);
				record.EMPLOYEE_NAME = rGetCustomer.getString(2);
				record.ROLE_NAME = rGetCustomer.getString(3);
				record.POSITION_NAME = rGetCustomer.getString(4);
				record.POSITION_VALUE_ID = rGetCustomer.getString(5);
				return;
			} else {
				record.EMPLOYEE_CODE = rGetCustomer.getString(1);
				record.EMPLOYEE_NAME = rGetCustomer.getString(2);
				record.ROLE_NAME = rGetCustomer.getString(3);
				record.POSITION_NAME = rGetCustomer.getString(4);
				record.POSITION_VALUE_ID = rGetCustomer.getString(5);
			}
			output.results.push(record);
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

function getApproverDetails(record) {
	var connection = $.db.getConnection();
	var query = 'select distinct MR.ROLE_NAME from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
		' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
		' inner join "MDB_DEV"."MST_ROLE" as MR on MRP.ROLE_ID = MR.ROLE_ID where ME.EMPLOYEE_CODE = ?';
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, record.NXTAPPROVERID);
	var rGetCustomer = pstmt.executeQuery();
	connection.commit();
	if (rGetCustomer.next()) {
		record.ApproverType = rGetCustomer.getString(1);
		if (record.Status === '2') {
			record.ApproverPending = "Pending with " + record.ApproverType;
		} else if (record.Status === '4') {
			record.ApproverPending = "Query send by " + record.ApproverType;
		}
		/*else if(record.Status === '5'){
	        record.ApproverPending = "Reject by " + record.ApproverType;
	    }*/
	}
	connection.close();
}

function filterCustomers(output, data) {
	var connection = $.db.getConnection();
	var query, pstmt;
	if (data.Status === '2' || data.Status === '5' || data.Status === '4') {
		query =
			'select distinct CA.DBR_FORM_ID,ME.POSITION_VALUE_ID,MA.AREA_DESC,MD.DISTRICT_NAME,MD.DISTRICT_CODE,MS.STATE_NAME,MS.STATE_CODE,MR.REGIONAL_NAME,MR.REGIONAL_CODE,CA.DBR_FORM_ID,CA.APPROVAL_ID,MR.ZONE_CODE,MZ.REGION_NAME,MC.FIRM_NAME,ME.EMPLOYEE_CODE,ME.EMPLOYEE_NAME,ME.PHONE_NUMBER,UR.PASSWORD  from "MDB_DEV"."CUSTOMER_APPROVAL" as CA ' +
			' inner join "MDB_DEV"."DBR_PROFILE" as MC on CA.DBR_FORM_ID = MC.DBR_FORM_ID ' +
			' inner join "MDB_DEV"."MST_EMPLOYEE" as ME on MC.CREATE_BY = ME.EMPLOYEE_CODE  ' +
			' inner join "MDB_DEV"."MST_AREA" as MA on ME.POSITION_VALUE_ID = MA.AREA_CODE ' +
			' inner join "MDB_DEV"."MST_DISTRICT" as MD on MA.DISTRICT_CODE = MD.DISTRICT_CODE ' +
			' inner join "MDB_DEV"."STATESDATA" as MS on MD.STATE_CODE = MS.STATE_CODE ' +
			' inner join "MDB_DEV"."MST_REGIONAL" as MR on MD.REGIONAL_CODE = MR.REGIONAL_CODE inner join "MDB_DEV"."MST_REGION" as MZ on MR.ZONE_CODE = MZ.REGION_CODE ' +
	        ' inner join "MDB_DEV"."USER_REGISTRATION" as UR on MC.DBR_FORM_ID = UR.USER_CODE ' +
			' where CA.status = ? ';
		pstmt = connection.prepareStatement(query);
		pstmt.setString(1, data.Status);
	}
	if (data.Status === '3') {
		query =
			'select distinct CA.DBR_FORM_ID,ME.POSITION_VALUE_ID,MA.AREA_DESC,MD.DISTRICT_NAME,MD.DISTRICT_CODE,MS.STATE_NAME,MS.STATE_CODE,MR.REGIONAL_NAME,MR.REGIONAL_CODE,MC.DMS_CUST_CODE,CA.DBR_FORM_ID,MR.ZONE_CODE,MZ.REGION_NAME,MC.CUST_NAME,ME.EMPLOYEE_CODE,ME.EMPLOYEE_NAME,ME.PHONE_NUMBER,UR.PASSWORD  from "MDB_DEV"."MST_CUSTOMER" as MC ' +
			' inner join "MDB_DEV"."CUSTOMER_APPROVAL" as CA on MC.DBR_FORM_ID = CA.DBR_FORM_ID' +
			' inner join "MDB_DEV"."MST_EMPLOYEE" as ME on MC.CREATE_BY = ME.EMPLOYEE_CODE  ' +
			' inner join "MDB_DEV"."MST_AREA" as MA on ME.POSITION_VALUE_ID = MA.AREA_CODE ' +
			' inner join "MDB_DEV"."MST_DISTRICT" as MD on MA.DISTRICT_CODE = MD.DISTRICT_CODE ' +
			' inner join "MDB_DEV"."STATESDATA" as MS on MD.STATE_CODE = MS.STATE_CODE ' +
			' inner join "MDB_DEV"."MST_REGIONAL" as MR on MD.REGIONAL_CODE = MR.REGIONAL_CODE inner join "MDB_DEV"."MST_REGION" as MZ on MR.ZONE_CODE = MZ.REGION_CODE' +
			' inner join "MDB_DEV"."USER_REGISTRATION" as UR on MC.DBR_FORM_ID = UR.USER_CODE ' +
			' where CA.status = ?';
		pstmt = connection.prepareStatement(query);
		pstmt.setString(1, data.Status);
	}
	if (data.Status === '0') {
		var statuses = "('0','1')";
		query = 'select DP.DBR_FORM_ID,DP.FIRM_NAME,DP.EMAIL_ID,DP.STATE,DS.STATUS_NAME,DP.CREATE_BY, ' +
			' ME.POSITION_VALUE_ID,MA.AREA_DESC,MD.DISTRICT_NAME,MD.DISTRICT_CODE,MS.STATE_NAME,MS.STATE_CODE,MR.REGIONAL_NAME,MR.REGIONAL_CODE,MR.ZONE_CODE,MZ.REGION_NAME,ME.EMPLOYEE_NAME,ME.PHONE_NUMBER,ME.EMAIL,UR.PASSWORD ' +
			' from "MDB_DEV"."DBR_PROFILE" as DP ' + ' inner join "MDB_DEV"."MST_EMPLOYEE" as ME on DP.CREATE_BY = ME.EMPLOYEE_CODE ' +
			' inner join "MDB_DEV"."MST_AREA" as MA on ME.POSITION_VALUE_ID = MA.AREA_CODE  ' +
			' inner join "MDB_DEV"."MST_DISTRICT" as MD on MA.DISTRICT_CODE = MD.DISTRICT_CODE ' +
			' inner join "MDB_DEV"."STATESDATA" as MS on MD.STATE_CODE = MS.STATE_CODE ' +
			' inner join "MDB_DEV"."MST_REGIONAL" as MR on MD.REGIONAL_CODE = MR.REGIONAL_CODE inner join "MDB_DEV"."MST_REGION" as MZ on MR.ZONE_CODE = MZ.REGION_CODE' +
			' inner join "MDB_DEV"."DBST_STATUS" as DS on DP.status = DS.status_code inner join "MDB_DEV"."USER_REGISTRATION" as UR on DP.DBR_FORM_ID=UR.USER_CODE where DP.STATUS in ' + statuses;
		/*'select DP.DBR_FORM_ID,DP.FIRM_NAME,DP.EMAIL_ID,DP.STATE,DS.STATUS_NAME,DP.CREATE_BY,ME.EMPLOYEE_NAME,ME.PHONE_NUMBER,ME.EMAIL from "MDB_DEV"."DBR_PROFILE" as DP inner join "MDB_DEV"."MST_EMPLOYEE" as ME on DP.CREATE_BY = ME.EMPLOYEE_CODE'
        + ' inner join "MDB_DEV"."DBST_STATUS" as DS on DP.status = DS.status_code where DP.STATUS in ' + statuses;*/
		pstmt = connection.prepareStatement(query);
	}
	var rGetCustomer = pstmt.executeQuery();
	connection.commit();
	while (rGetCustomer.next()) {
		var record = {};
		if (data.Status === '0') {
			record.DBR_FORM_ID = rGetCustomer.getString(1);
			record.FIRM_NAME = rGetCustomer.getString(2);
			record.Email = rGetCustomer.getString(3);
			record.State = rGetCustomer.getString(4);
			record.status = rGetCustomer.getString(5);
			record.NXTAPPROVERID = rGetCustomer.getString(6);
			record.AREA_CODE = rGetCustomer.getString(7);
			record.AREA_DESC = rGetCustomer.getString(8);
			record.DISTRICT_DESC = rGetCustomer.getString(9);
			record.DISTRICT_CODE = rGetCustomer.getString(10);
			record.STATE_DESC = rGetCustomer.getString(11);
			record.STATE_CODE = rGetCustomer.getString(12);
			record.REGION_DESC = rGetCustomer.getString(13);
			record.REGION_CODE = rGetCustomer.getString(14);
			record.ZONE_DESC = rGetCustomer.getString(16);
			record.ZONE_CODE = rGetCustomer.getString(15);
			record.ApproverName = rGetCustomer.getString(17);
			record.ApproverNumber = rGetCustomer.getString(18);
			record.ApproverEmail = rGetCustomer.getString(19);
			record.Password = rGetCustomer.getString(20);
		} else {
			record.DBR_FORM_ID = rGetCustomer.getString(1);
			record.AREA_CODE = rGetCustomer.getString(2);
			record.AREA_DESC = rGetCustomer.getString(3);
			record.DISTRICT_DESC = rGetCustomer.getString(4);
			record.DISTRICT_CODE = rGetCustomer.getString(5);
			record.STATE_DESC = rGetCustomer.getString(6);
			record.STATE_CODE = rGetCustomer.getString(7);
			record.REGION_DESC = rGetCustomer.getString(8);
			record.REGION_CODE = rGetCustomer.getString(9);
			record.DMS_CUST_CODE = rGetCustomer.getString(10);
			record.ZONE_DESC = rGetCustomer.getString(13);
			record.ZONE_CODE = rGetCustomer.getString(12);
			record.FIRM_NAME = rGetCustomer.getString(14);
			record.ApproverCode = rGetCustomer.getString(15);
			record.ApproverName = rGetCustomer.getString(16);
			record.ApproverNumber = rGetCustomer.getString(17);
			record.Password = rGetCustomer.getString(18);
			record.Status = data.Status;
			if (data.Status === '2' || data.Status === '4') {
				record.NXTAPPROVERID = rGetCustomer.getString(11);
				getApproverDetails(record);
			}
		}
		output.results.push(record);
	}

	connection.close();
}

/*
 * fetch all customers data including retl and dstb.
 * @return {results} Array of Customers record
 * @author shriyansi
 */

function ViewCustomers() {
	var output = {
		results: []
	};
	var data = {};
	data.StatusType = $.request.parameters.get('Status');
	//	var connection = $.db.getConnection();
	try {
		if (data.StatusType === "Pending") {
			data.Status = '2';
		} else if (data.StatusType === "Reject") {
			data.Status = '5';
		} else if (data.StatusType === "Query") {
			data.Status = '4';
		} else if (data.StatusType === "Approve") {
			data.Status = '3';
		} else if (data.StatusType === "Save as Draft") {
			data.Status = '0';
		}
		filterCustomers(output, data);
		/*var queryGetCustomer = 'select  c.CUST_TYPE , c.FIRM_NAME ,  c.PARENT_CUST_NAME ,s.country_code,c.state, c.CITY_DISTRICT,c.POSTAL_CODE' +
			',c.EMAIL_ID, c.SOFT_DEL from "MDB_DEV"."MST_CUSTOMER" as c inner join "MDB_DEV"."MST_STATE" as s on  s.state_name=c.state';
		var pstmtGetCustomer = connection.prepareStatement(queryGetCustomer);
		var rGetCustomer = pstmtGetCustomer.executeQuery();
		connection.commit();
		while (rGetCustomer.next()) {
			var record = {};
			record.CUST_TYPE = rGetCustomer.getString(1);
			record.CUST_NAME = rGetCustomer.getString(2);
			record.PARENT_CUST_NAME = rGetCustomer.getString(3);
			record.COUNTRY = rGetCustomer.getString(4);
			record.STATE = rGetCustomer.getString(5);
			record.CITY_DISTRICT = rGetCustomer.getString(6);
			record.PHONE_NUMBER = rGetCustomer.getInteger(7);
			record.EMAIL_ID = rGetCustomer.getString(8);
			record.Status = rGetCustomer.getString(9);
			getStatusDesc(record);
			output.results.push(record);
		}

		connection.close();*/
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
	case "addMSTCUSTOMER":
		addCustomers();
		break;
	case "getCustomers":
		getCustomers();
		break;
	case "getCustomer":
		getCustomer();
		break;
	case "ViewCustomers":
		ViewCustomers();
		break;
	case "getApproverdetail":
		getApproverdetail();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}