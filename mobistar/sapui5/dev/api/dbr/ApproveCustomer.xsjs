function dispayCustomers(rgetDBRRegist, output) {
	while (rgetDBRRegist.next()) {
		var record = {};
		record.DBR_FORM_ID = rgetDBRRegist.getString(2);
		record.FIRM_NAME = rgetDBRRegist.getString(3);
		record.NATURE = rgetDBRRegist.getString(4);
		record.EMAIL_ID = rgetDBRRegist.getString(5);
		record.REGION = rgetDBRRegist.getString(6);
		record.REMARK = rgetDBRRegist.getString(7);
		record.PREMISES_NATURE = rgetDBRRegist.getString(8);
		record.PREMISES_NO = rgetDBRRegist.getString(9);
		record.LOCALITY = rgetDBRRegist.getString(10);
		record.TOWN_VILL = rgetDBRRegist.getString(11);
		record.CITY_DISTRICT = rgetDBRRegist.getString(12);
		record.STATE = rgetDBRRegist.getString(13);
		record.POSTAL_CODE = rgetDBRRegist.getString(14);
		record.OFFICE_SPACE = rgetDBRRegist.getString(15);
		record.WAREHOUSE_SPACE = rgetDBRRegist.getString(16);
		record.COMPANY_NAME = rgetDBRRegist.getString(17);
		record.OWNERSHIP_SINCE = rgetDBRRegist.getString(18);
		record.CURRENT_INVESTMENT = rgetDBRRegist.getString(19);
		record.BANK_LOAN = rgetDBRRegist.getString(20);
		record.BANK_LIMIT = rgetDBRRegist.getString(21);
		record.BANK_NAME = rgetDBRRegist.getString(22);
		record.CURRENT_ACCOUNT_NUMBER = rgetDBRRegist.getString(23);
		record.STATUS = rgetDBRRegist.getString(24);
		record.SOFT_DEL = rgetDBRRegist.getString(25);
		record.CREATE_BY = rgetDBRRegist.getString(26);
		record.CREATE_DATE = rgetDBRRegist.getString(27);
		record.CUST_TYPE = rgetDBRRegist.getString(37);
		output.results.push(record);
	}
}

function getBranchHeadTSM(connection, userCode) {
	var query = 'select ME.EMPLOYEE_NAME,MP.POSITION_NAME,MRP.POSITION_ID,ME.POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
		' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
		' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' + ' where ME.EMPLOYEE_CODE=?';
	var pstmt = connection.prepareStatement(query);
	pstmt.setString(1, userCode);
	var r = pstmt.executeQuery();
	connection.commit();
	if (r.next()) {
		var record = {};
		record.EMPLOYEE_NAME = r.getString(1);
		record.POSITION_NAME = r.getString(2);
		record.POSITION_ID = r.getString(3);
		record.POSITION_VALUE_ID = r.getString(4);
	}
	switch (record.POSITION_NAME) {
		case "DISTRICT":

			//query = 'select EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID = (Select AREA_CODE from "MDB_DEV"."MST_AREA" where DISTRICT_CODE= ?) ';
			query =
				'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID = (Select AREA_CODE from "MDB_DEV"."MST_AREA" where DISTRICT_CODE= ?))) and Status = ?';
			//'Select AREA_CODE from "MDB_DEV"."MST_AREA" where DISTRICT_CODE=?';
			//' + record.POSITION_VALUE_ID + '
			record.Query = query;
			break;
		case "STATE":
			query = ' Select DISTRICT_CODE  from "MDB_DEV"."MST_DISTRICT" where STATE_CODE = ? ';
			break;
		case "REGION":
			query = ' Select STATE_CODE from "MDB_DEV"."MST_STATE" where REGION_CODE = ? ';
			break;
		case "COUNTRY":
			query = ' Select REGION_CODE from "MDB_DEV"."MST_REGION" where COUNTRY_CODE = ? ';
			break;

		default:
			return;
	}
	return record;
}

function getPendingRetailerCustomers() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var usertype = $.request.parameters.get('usertype');
	var connection = $.db.getConnection();
	try {
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ? and Status = ?)';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, userCode);
		pstmtCustConstant.setString(2, '2');
		var rgetDBRRegist = pstmtCustConstant.executeQuery();
		connection.commit();

		dispayCustomers(rgetDBRRegist, output);
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

function getApproveRetailerCustomers() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var usertype = $.request.parameters.get('usertype');
	var connection = $.db.getConnection();
	var Status;
	try {
		if (usertype === "TSM") {
			Status = '11';
		} else if (usertype === "BranchHead") {
			Status = '12';
		} else if (usertype === "HO DSTB CORD") {
			Status = '13';
		} else if (usertype === "StateHead") {
			Status = '14';
		} else if (usertype === "Sales Crd") {
			Status = '15';
		} else if (usertype === "NationalSls") {
			Status = '16';
		} else if (usertype === "Finance") {
			Status = '17';
		}
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ?) and Status = ?';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		//'Select * from "MDB_DEV"."DBR_PROFILE" as DBRP inner join "MDB_DEV"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, userCode);
		pstmtCustConstant.setString(2, Status);
		var rgetDBRRegist = pstmtCustConstant.executeQuery();
		connection.commit();
		dispayCustomers(rgetDBRRegist, output);

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

function getRejectRetailerCustomers() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var usertype = $.request.parameters.get('usertype');
	var Status;
	var connection = $.db.getConnection();
	try {
		if (usertype === "TSM") {
			Status = '21';
		} else if (usertype === "BranchHead") {
			Status = '22';
		} else if (usertype === "HO DSTB CORD") {
			Status = '23';
		} else if (usertype === "StateHead") {
			Status = '24';
		} else if (usertype === "Sales Crd") {
			Status = '25';
		} else if (usertype === "NationalSls") {
			Status = '26';
		} else if (usertype === "Finance") {
			Status = '27';
		}
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ?) and Status = ?';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		//'Select * from "MDB_DEV"."DBR_PROFILE" as DBRP inner join "MDB_DEV"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, userCode);
		pstmtCustConstant.setString(2, Status);
		var rgetDBRRegist = pstmtCustConstant.executeQuery();
		connection.commit();
		dispayCustomers(rgetDBRRegist, output);
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

function addCustRemarks(Customer, connection, record) {

	var qryaddCustRemarks = 'INSERT INTO "MDB_DEV"."REMARKS_HISTORY" (DBR_FORM_ID,APPROVAL_ID,REMARKS) VALUES (?,?,?)';
	var pstmtaddCustRemarks = connection.prepareStatement(qryaddCustRemarks);
	pstmtaddCustRemarks.setString(1, Customer.DBR_FORM_ID);
	pstmtaddCustRemarks.setString(2, Customer.ApproverId);
	pstmtaddCustRemarks.setString(3, Customer.Remarks);
	var rsaddCustRemarks = pstmtaddCustRemarks.executeUpdate();
	connection.commit();
	if (rsaddCustRemarks > 0) {
		record.status = '04';
		record.message = 'Remarks Successfully Captured';
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
}

function postApprovals(Customer, record) {
	var connection = $.db.getConnection();
	var qryaddCustPost =
		'Insert into "MDB_DEV"."CUSTOMER_APPROVAL" (DBR_FORM_ID,APPROVAL_TYPE,APPROVAL_NAME,STATUS,APPROVAL_ID) values (?,?,?,?,?)';
	var pstmtaddCustPost = connection.prepareStatement(qryaddCustPost);
	pstmtaddCustPost.setString(1, Customer.DBR_FORM_ID);
	pstmtaddCustPost.setString(2, Customer.ROLE_NAME);
	pstmtaddCustPost.setString(3, Customer.APPROVER_NAME);
	pstmtaddCustPost.setString(4, '2');
	pstmtaddCustPost.setString(5, Customer.APPROVER_CODE);
	var rsaddCustPost = pstmtaddCustPost.executeUpdate();
	connection.commit();
	if (rsaddCustPost > 0) {
		record.status = '03';
		record.message = 'Approver Insert Successfully Updated';
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
}

function updateCustomerApproval(Customer, record) {
	var connection = $.db.getConnection();
	var qryaddCustUpdate = 'update "MDB_DEV"."CUSTOMER_APPROVAL" set STATUS = ? where APPROVAL_ID = ? and DBR_FORM_ID = ?';
	var pstmtaddCustUpdate = connection.prepareStatement(qryaddCustUpdate);
	pstmtaddCustUpdate.setString(1, '3');
	pstmtaddCustUpdate.setString(2, Customer.ApproverId);
	pstmtaddCustUpdate.setString(3, Customer.DBR_FORM_ID);
	var rsaddCustUpdate = pstmtaddCustUpdate.executeUpdate();
	connection.commit();
	if (rsaddCustUpdate > 0) {
		record.status = '02';
		record.message = 'Approver Successfully Updated';
		if(Customer.ApproverType !== "Finance"){
		    postApprovals(Customer, record);
		}
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
}

function getApproverDetails(CustRecord) {
	var connection = $.db.getConnection();
	var query, pstmt, r;
	if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "HO DSTB CORD")) {
		query = 'select ME.EMPLOYEE_NAME,MR.ROLE_NAME,ME.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_ROLE" as MR on MRP.ROLE_ID = MR.ROLE_ID ' + ' where MR.ROLE_NAME = ?';
		pstmt = connection.prepareStatement(query);
		pstmt.setString(1, 'Finance');
		r = pstmt.executeQuery();
		connection.commit();
		if (r.next()) {
			CustRecord.APPROVER_NAME = r.getString(1);
			CustRecord.ROLE_NAME = r.getString(2);
			CustRecord.APPROVER_CODE = r.getString(3);
		}
	} else {
		query =
			'select ME1.EMPLOYEE_NAME,MR.ROLE_NAME,ME1.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME1 ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on ME1.ROLE_POSITION_ID = MRP1.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_ROLE" as MR on MRP1.ROLE_ID = MR.ROLE_ID ' +
			' where ME1.ROLE_POSITION_ID in (select MRP1.ROLE_POS_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID  ' +
			' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' +
			' inner join "MDB_DEV"."POSITION_HIERARCHY" as PH on MRP.POSITION_ID = PH.POSITION_ID ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on PH.PARENT_POSITION_ID = MRP1.POSITION_ID ' + ' where ME.EMPLOYEE_CODE=?)';
		pstmt = connection.prepareStatement(query);
		pstmt.setString(1, CustRecord.ApproverId);
		r = pstmt.executeQuery();
		connection.commit();

		/* if (CustRecord.CUST_TYPE === "RETL") {
        
    } else {
        
    }*/
		while (r.next()) {
			CustRecord.ROLE_NAME = r.getString(2);
			if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "BranchHead")) {
				if (CustRecord.ROLE_NAME === "HO DSTB CORD") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			}
			/*	else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "HO DSTB CORD")) {
			if (CustRecord.ROLE_NAME === "Finance") {
				CustRecord.APPROVER_NAME = r.getString(1);
				CustRecord.APPROVER_CODE = r.getString(3);
				break;
			}
		} */
			else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "TSM")) {
				if (CustRecord.ROLE_NAME === "BranchHead") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "BranchHead")) {
				if (CustRecord.ROLE_NAME === "StateHead") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "StateHead")) {
				if (CustRecord.ROLE_NAME === "Sales Crd") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "Sales Crd")) {
				if (CustRecord.ROLE_NAME === "NationalSls") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "NationalSls")) {
				if (CustRecord.ROLE_NAME === "Finance") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "TSM")) {
				if (CustRecord.ROLE_NAME === "BranchHead") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			}
		}
	}
	connection.close();
	return CustRecord;
}

function approveCustomer() {
	var record;
	var Output = {
		results: []
	};
	var Status;
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Customers');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var CustRecord = {};
	if (dicLine[0].ApproverType === "TSM") {
		Status = '11';
	} else if (dicLine[0].ApproverType === "BranchHead") {
		Status = '12';
	} else if (dicLine[0].ApproverType === "HO DSTB CORD") {
		Status = '13';
	} else if (dicLine[0].ApproverType === "StateHead") {
		Status = '14';
	} else if (dicLine[0].ApproverType === "Sales Crd") {
		Status = '15';
	} else if (dicLine[0].ApproverType === "NationalSls") {
		Status = '16';
	} else if (dicLine[0].ApproverType === "Finance") {
		Status = '17';
	}
	try {

		for (var i = 0; i < dicLine.length; i++) {
			var Customer = dicLine[i];
			getApproverDetails(Customer);
			record = {};
			var qryUpdateDBR = 'update  "MDB_DEV"."DBR_PROFILE"  set Status=?  where DBR_FORM_ID=? ';
			var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDBR);
			pstmtUpdateDbrDetails.setString(1, Status);
			pstmtUpdateDbrDetails.setString(2, Customer.DBR_FORM_ID);
			var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
			connection.commit();
			if (rsUpdateDbrDetails > 0) {
				updateCustomerApproval(Customer, record);
				addCustRemarks(Customer, connection, record);
				record.status = '01';
				record.message = 'Data Uploaded Sucessfully';
			} else {
				record.status = '0';
				record.message = 'Some Issues!';
			}
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

function rejectCustomer() {
	var record;
	var Output = {
		results: []
	};
	var Status;
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Customers');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	if (dicLine[0].ApproverType === "TSM") {
		Status = '21';
	} else if (dicLine[0].ApproverType === "BranchHead") {
		Status = '22';
	} else if (dicLine[0].ApproverType === "HO DSTB CORD") {
		Status = '23';
	} else if (dicLine[0].ApproverType === "StateHead") {
		Status = '24';
	} else if (dicLine[0].ApproverType === "Sales Crd") {
		Status = '25';
	} else if (dicLine[0].ApproverType === "NationalSls") {
		Status = '26';
	} else if (dicLine[0].ApproverType === "Finance") {
		Status = '27';
	}
	try {
		for (var i = 0; i < dicLine.length; i++) {
			var Customer = dicLine[i];
			record = {};
			var qryUpdateDBR = 'update  "MDB_DEV"."DBR_PROFILE"  set Status=?  where DBR_FORM_ID=? ';
			var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDBR);
			pstmtUpdateDbrDetails.setString(1, Status);
			pstmtUpdateDbrDetails.setString(2, Customer.DBR_FORM_ID);
			var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
			connection.commit();
			if (rsUpdateDbrDetails > 0) {
				addCustRemarks(Customer, connection, record);
				record.status = 1;
				record.message = 'Data Uploaded Sucessfully';
			} else {
				record.status = 0;
				record.message = 'Some Issues!';
			}
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

function getApprovalRemarks() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var queryremarks =
			'select RH.DBR_FORM_ID,RH.REMARKS_DATE,RH.APPROVAL_ID,RH.REMARKS,ME.EMPLOYEE_NAME,ST.STATUS_NAME from "MDB_DEV"."REMARKS_HISTORY" as RH inner join "MDB_DEV"."MST_EMPLOYEE" as ME on RH.APPROVAL_ID = ME.EMPLOYEE_CODE inner join "MDB_DEV"."DBR_PROFILE" as DR on RH.DBR_FORM_ID = DR.DBR_FORM_ID inner join "MDB_DEV"."DBST_STATUS" as ST on DR.STATUS = ST.STATUS_CODE where RH.DBR_FORM_ID= ?';
		var pstmtRemarks = connection.prepareStatement(queryremarks);
		pstmtRemarks.setString(1, userCode);
		var rgetRemarks = pstmtRemarks.executeQuery();
		connection.commit();
		while (rgetRemarks.next()) {
			var record = {};
			record.DBR_FORM_ID = rgetRemarks.getString(1);
			record.REMARKS_DATE = rgetRemarks.getString(2);
			record.APPROVAL_ID = rgetRemarks.getString(3);
			record.REMARKS = rgetRemarks.getString(4);
			record.APPROVAL_NAME = rgetRemarks.getString(5);
			record.APPROVAL_BY = rgetRemarks.getString(6);
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
	case "getPendingRetailerCustomers":
		getPendingRetailerCustomers();
		break;
	case "approveCustomer":
		approveCustomer();
		break;
	case "getApproveRetailerCustomers":
		getApproveRetailerCustomers();
		break;
	case "getRejectRetailerCustomers":
		getRejectRetailerCustomers();
		break;
	case "rejectCustomer":
		rejectCustomer();
		break;
	case "getApprovalRemarks":
		getApprovalRemarks();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}