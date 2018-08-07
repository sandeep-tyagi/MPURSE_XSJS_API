function dateFormat(record) {
	var date = record.CREATE_DATE;
	if (date) {
		record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.CREATE_DATE;
	}
}

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
		record.Date = dateFormat(rgetDBRRegist.getString(27));
		record.CUST_TYPE = rgetDBRRegist.getString(37);
		
		output.results.push(record);
	}
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
			'select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ? and Status = ?) and cust_type = ?';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, userCode);
		pstmtCustConstant.setString(2, '2');
		pstmtCustConstant.setString(3, 'RETL');
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
	//var usertype = $.request.parameters.get('usertype');
	var connection = $.db.getConnection();
	var Status;
	try {
		/*if (usertype === "SALESMANAGER") {
			Status = "('11','12','13','14','15','16','17')";
		} else if (usertype === "BRANCHHEAD") {
			Status = "('12','13','14','15','16','17')";
		} else if (usertype === "HODCORDINATOR") {
			Status = "('13','14','15','16','17')";
		} else if (usertype === "StateHead") {
			Status = "('14','15','16','17')";
		} else if (usertype === "SalesCoOrdinator") {
			Status = "('15','16','17')";
		} else if (usertype === "NationalSalesHead") {
			Status = "('16','17')";
		} else if (usertype === "FINANCE") {
			Status = "('17')";
		}*/
		Status = "('3')";
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where CUST_TYPE = ? and DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ? and Status in ' +
			Status + ')';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		//'Select * from "MDB_DEV"."DBR_PROFILE" as DBRP inner join "MDB_DEV"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, 'RETL');
		pstmtCustConstant.setString(2, userCode);
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
		/*if (usertype === "SALESMANAGER") {
			Status = "('21','22','23','24','25','26','27')";
		} else if (usertype === "BRANCHHEAD") {
			Status = "('22','23','24','25','26','27')";
		} else if (usertype === "HODCORDINATOR") {
			Status = "('23','24','25','26','27')";
		} else if (usertype === "StateHead") {
			Status = "('24','25','26','27')";
		} else if (usertype === "SalesCoOrdinator") {
			Status = "('25','26','27')";
		} else if (usertype === "NationalSalesHead") {
			Status = "('26','27')";
		} else if (usertype === "FINANCE") {
			Status = "('27')";
		}*/
		Status = "('5')";
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where CUST_TYPE = ? and DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ? and Status in ' + Status + ')';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		//'Select * from "MDB_DEV"."DBR_PROFILE" as DBRP inner join "MDB_DEV"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
		pstmtCustConstant.setString(1, 'RETL');
		pstmtCustConstant.setString(2, userCode);
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
function getQueryRetailerCustomers() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var usertype = $.request.parameters.get('usertype');
	var Status;
	var connection = $.db.getConnection();
	try {
		/*if (usertype === "SALESMANAGER") {
			Status = "('31','32','33','34','35','36','37')";
		} else if (usertype === "BRANCHHEAD") {
			Status = "('32','33','34','35','36','37')";
		} else if (usertype === "HODCORDINATOR") {
			Status = "('33','34','35','36','37')";
		} else if (usertype === "StateHead") {
			Status = "('34','35','36','37')";
		} else if (usertype === "SalesCoOrdinator") {
			Status = "('35','36','37')";
		} else if (usertype === "NationalSalesHead") {
			Status = "('36','37')";
		} else if (usertype === "FINANCE") {
			Status = "('37')";
		}*/
		Status = "('4')";
		var queryCustConstant =
			'select * from "MDB_DEV"."DBR_PROFILE" where CUST_TYPE = ? and  DBR_FORM_ID in (select DBR_FORM_ID from "MDB_DEV"."CUSTOMER_APPROVAL" where APPROVAL_ID = ? and Status in ' + Status + ')';
		//'select * from "MDB_DEV"."DBR_PROFILE" where CREATE_BY in (select DBR_FORM_ID from "MDB_DEV"."DBR_PROFILE" where CREATE_BY=?) and Status = ?';
		//'Select * from "MDB_DEV"."DBR_PROFILE" as DBRP inner join "MDB_DEV"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtCustConstant = connection.prepareStatement(queryCustConstant);
	pstmtCustConstant.setString(1, 'RETL');
		pstmtCustConstant.setString(2, userCode);
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

	var qryaddCustRemarks = 'INSERT INTO "MDB_DEV"."REMARKS_HISTORY" (DBR_FORM_ID,APPROVAL_ID,REMARKS,STATUS) VALUES (?,?,?,?)';
	var pstmtaddCustRemarks = connection.prepareStatement(qryaddCustRemarks);
	pstmtaddCustRemarks.setString(1, Customer.DBR_FORM_ID);
	pstmtaddCustRemarks.setString(2, Customer.ApproverId);
	pstmtaddCustRemarks.setString(3, Customer.Remarks);
	pstmtaddCustRemarks.setString(4, Customer.Status);
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
		if (Customer.Action === "Submit" && Customer.ApproverType !== "FINANCE") {
		        postApprovals(Customer, record);
		} else if (Customer.Action === "Reject" || Customer.Action === "Query" || Customer.ApproverType === "FINANCE") {
            connection.close();
            return;
		}
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	    connection.close();
		return;
	}
}

function updateCustomerReject(Customer, record) {
	var connection = $.db.getConnection();
	var qryaddCustUpdate = 'update "MDB_DEV"."CUSTOMER_APPROVAL" set STATUS = ? where APPROVAL_ID = ? and DBR_FORM_ID = ?';
	var pstmtaddCustUpdate = connection.prepareStatement(qryaddCustUpdate);
	pstmtaddCustUpdate.setString(1, '5');
	pstmtaddCustUpdate.setString(2, Customer.ApproverId);
	pstmtaddCustUpdate.setString(3, Customer.DBR_FORM_ID);
	var rsaddCustUpdate = pstmtaddCustUpdate.executeUpdate();
	connection.commit();
	if (rsaddCustUpdate > 0) {
		record.status = '02';
		record.message = 'Deleted Successfully Updated';
	
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	    connection.close();
		return;
	}
}

function getApproverDetails(CustRecord) {
	var connection = $.db.getConnection();
	var query, pstmt, r;
	if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "HODCORDINATOR")) {
		query = 'select ME.EMPLOYEE_NAME,MR.ROLE_NAME,ME.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_ROLE" as MR on MRP.ROLE_ID = MR.ROLE_ID ' + ' where MR.ROLE_NAME = ?';
		pstmt = connection.prepareStatement(query);
		pstmt.setString(1, 'FINANCE');
		r = pstmt.executeQuery();
		connection.commit();
		if (r.next()) {
			CustRecord.APPROVER_NAME = r.getString(1);
			CustRecord.ROLE_NAME = r.getString(2);
			CustRecord.APPROVER_CODE = r.getString(3);
		}
	} else {
		if (CustRecord.ApproverType === "SALESMANAGER") {
			query = 'select ME1.EMPLOYEE_NAME,MR.ROLE_NAME,ME1.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME1 ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on ME1.ROLE_POSITION_ID = MRP1.ROLE_POS_ID ' +
				'   inner join "MDB_DEV"."MST_ROLE" as MR on MRP1.ROLE_ID = MR.ROLE_ID ' +
				'   where ME1.ROLE_POSITION_ID in (select MRP1.ROLE_POS_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
				'   inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' +
				'   inner join "MDB_DEV"."POSITION_HIERARCHY" as PH on MRP.POSITION_ID = PH.POSITION_ID  ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on PH.PARENT_POSITION_ID = MRP1.POSITION_ID ' +
				'   where ME.EMPLOYEE_CODE=?) and ME1.POSITION_VALUE_ID in ( select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE in ( ' +
				'   select ME.POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
				' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' + ' where ME.EMPLOYEE_CODE=?)) ';
	            pstmt = connection.prepareStatement(query);
		        pstmt.setString(1, CustRecord.ApproverId);
		        pstmt.setString(2, CustRecord.ApproverId);
		} else if (CustRecord.ApproverType === "BRANCHHEAD") {
		    query = 'select ME1.EMPLOYEE_NAME,MR.ROLE_NAME,ME1.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME1 ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on ME1.ROLE_POSITION_ID = MRP1.ROLE_POS_ID ' +
				'   inner join "MDB_DEV"."MST_ROLE" as MR on MRP1.ROLE_ID = MR.ROLE_ID ' +
				'   where  ME1.POSITION_VALUE_ID in ( select distinct TR.ZONE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				'  inner join "MDB_DEV"."MST_DISTRICT" as MD on ME.POSITION_VALUE_ID = MD.DISTRICT_CODE ' +
				'   inner join "MDB_DEV"."TRN_REGIONAL" as TR on  MD.REGIONAL_CODE = TR.REGIONAL_CODE ' +
				'   where ME.EMPLOYEE_CODE= ?) ';
				pstmt = connection.prepareStatement(query);
		pstmt.setString(1, CustRecord.ApproverId);
			/*query = 'select ME1.EMPLOYEE_NAME,MR.ROLE_NAME,ME1.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME1 ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on ME1.ROLE_POSITION_ID = MRP1.ROLE_POS_ID ' +
				'   inner join "MDB_DEV"."MST_ROLE" as MR on MRP1.ROLE_ID = MR.ROLE_ID ' +
				'   where ME1.ROLE_POSITION_ID in (select MRP1.ROLE_POS_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
				'   inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' +
				'   inner join "MDB_DEV"."POSITION_HIERARCHY" as PH on MRP.POSITION_ID = PH.POSITION_ID  ' +
				'   inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on PH.PARENT_POSITION_ID = MRP1.POSITION_ID ' +
				'   where ME.EMPLOYEE_CODE=?) and ME1.POSITION_VALUE_ID in ( select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE in ( ' +
				'   select ME.POSITION_VALUE_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
				' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID ' +
				' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' + ' where ME.EMPLOYEE_CODE=?)) ';*/
		}
		/*	query =
			'select ME1.EMPLOYEE_NAME,MR.ROLE_NAME,ME1.EMPLOYEE_CODE from "MDB_DEV"."MST_EMPLOYEE" as ME1 ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on ME1.ROLE_POSITION_ID = MRP1.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."MST_ROLE" as MR on MRP1.ROLE_ID = MR.ROLE_ID ' +
			' where ME1.ROLE_POSITION_ID in (select MRP1.ROLE_POS_ID from "MDB_DEV"."MST_EMPLOYEE" as ME ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP on ME.ROLE_POSITION_ID = MRP.ROLE_POS_ID  ' +
			' inner join "MDB_DEV"."MST_POSITION" as MP on MRP.POSITION_ID = MP.POSITION_ID ' +
			' inner join "MDB_DEV"."POSITION_HIERARCHY" as PH on MRP.POSITION_ID = PH.POSITION_ID ' +
			' inner join "MDB_DEV"."MAP_ROLE_POSITION" as MRP1 on PH.PARENT_POSITION_ID = MRP1.POSITION_ID ' + ' where ME.EMPLOYEE_CODE=?)';
		*/
		r = pstmt.executeQuery();
		connection.commit();
		while (r.next()) {
		    CustRecord.ROLE_NAME = r.getString(2);
			CustRecord.ROLE_NAME = CustRecord.ROLE_NAME.trim();
			CustRecord.APPROVER_CODE = "";
			CustRecord.APPROVER_NAME = "";
			if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "SALESMANAGER")) {
				if (CustRecord.ROLE_NAME === "BRANCHHEAD") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			}
			else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "BRANCHHEAD")) {
				if (CustRecord.ROLE_NAME === "HODCORDINATOR") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} 
			else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "HODCORDINATOR")) {
			if (CustRecord.ROLE_NAME === "FINANCE") {
				CustRecord.APPROVER_NAME = r.getString(1);
				CustRecord.APPROVER_CODE = r.getString(3);
				break;
			}
		}
			/*	else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "HODCORDINATOR")) {
			if (CustRecord.ROLE_NAME === "FINANCE") {
				CustRecord.APPROVER_NAME = r.getString(1);
				CustRecord.APPROVER_CODE = r.getString(3);
				break;
			}
		} */
		/*	else if ((CustRecord.CUST_TYPE === "RETL") && (CustRecord.ApproverType === "SALESMANAGER")) {
				if (CustRecord.ROLE_NAME === "BRANCHHEAD") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} 
			else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "BRANCHHEAD")) {
				if (CustRecord.ROLE_NAME === "StateHead") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "StateHead")) {
				if (CustRecord.ROLE_NAME === "SalesCoOrdinator") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "SalesCoOrdinator")) {
				if (CustRecord.ROLE_NAME === "NationalSalesHead") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "NationalSalesHead")) {
				if (CustRecord.ROLE_NAME === "FINANCE") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			} else if ((CustRecord.CUST_TYPE === "DSTB") && (CustRecord.ApproverType === "SALESMANAGER")) {
				if (CustRecord.ROLE_NAME === "BRANCHHEAD") {
					CustRecord.APPROVER_NAME = r.getString(1);
					CustRecord.APPROVER_CODE = r.getString(3);
					break;
				}
			}*/
		}
	}
	connection.close();
	return CustRecord;
}
function updateCustomerQuery(Customer, record) {
	var connection = $.db.getConnection();
	var qryaddCustUpdate = 'update "MDB_DEV"."CUSTOMER_APPROVAL" set STATUS = ? where APPROVAL_ID = ? and DBR_FORM_ID = ?';
	var pstmtaddCustUpdate = connection.prepareStatement(qryaddCustUpdate);
	pstmtaddCustUpdate.setString(1, '4');
	pstmtaddCustUpdate.setString(2, Customer.ApproverId);
	pstmtaddCustUpdate.setString(3, Customer.DBR_FORM_ID);
	var rsaddCustUpdate = pstmtaddCustUpdate.executeUpdate();
	connection.commit();
	if (rsaddCustUpdate > 0) {
		record.status = '02';
		record.message = 'Approver Successfully Updated';
		
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
	connection.close();
		return;
}
function queryCustomer() {
	var record;
	var Output = {
		results: []
	};
	var Status;
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Customers');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var CustRecord = {};
	/*if (dicLine[0].ApproverType === "SALESMANAGER") {
		Status = '31';
	} else if (dicLine[0].ApproverType === "BRANCHHEAD") {
		Status = '32';
	} else if (dicLine[0].ApproverType === "HODCORDINATOR") {
		Status = '33';
	} else if (dicLine[0].ApproverType === "StateHead") {
		Status = '34';
	} else if (dicLine[0].ApproverType === "SalesCoOrdinator") {
		Status = '35';
	} else if (dicLine[0].ApproverType === "NationalSalesHead") {
		Status = '36';
	} else if (dicLine[0].ApproverType === "FINANCE") {
		Status = '37';
	}*/
	Status = '4';
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
				Customer.Action = "Query";
				updateCustomerQuery(Customer, record);
				Customer.Status = Status;
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

function approveCustomer() {
	var record = {};
	var Output = {
		results: []
	};
	var Status;
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Customers');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var CustRecord = {};
	/*if (dicLine[0].ApproverType === "SALESMANAGER") {
		Status = '11';
	} else if (dicLine[0].ApproverType === "BRANCHHEAD") {
		Status = '12';
	} else if (dicLine[0].ApproverType === "HODCORDINATOR") {
		Status = '13';
	} else if (dicLine[0].ApproverType === "StateHead") {
		Status = '14';
	} else if (dicLine[0].ApproverType === "SalesCoOrdinator") {
		Status = '15';
	} else if (dicLine[0].ApproverType === "NationalSalesHead") {
		Status = '16';
	} else if (dicLine[0].ApproverType === "FINANCE") {
		Status = '17';
	}*/
	Status = '3';
	try {

		for (var i = 0; i < dicLine.length; i++) {
			var Customer = dicLine[i];
			if (Customer.ApproverType !== "FINANCE") {
					getApproverDetails(Customer);
				}
			if(Customer.APPROVER_NAME === "" || Customer.APPROVER_CODE === ""){
			    record.status = '0';
				record.message = 'Next Approval is not Available !!';
			}else{
			var qryUpdateDBR = 'update  "MDB_DEV"."DBR_PROFILE"  set Status=?  where DBR_FORM_ID=? ';
			var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDBR);
			pstmtUpdateDbrDetails.setString(1, Status);
			pstmtUpdateDbrDetails.setString(2, Customer.DBR_FORM_ID);
			var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
			connection.commit();
			if (rsUpdateDbrDetails > 0) {
				Customer.Action = "Submit";
				updateCustomerApproval(Customer, record);
				Customer.Status = Status;
				addCustRemarks(Customer, connection, record);
				record.status = '01';
				record.message = 'Data Uploaded Sucessfully';
			} else {
				record.status = '0';
				record.message = 'Some Issues!';
			}
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
/*	if (dicLine[0].ApproverType === "SALESMANAGER") {
		Status = '21';
	} else if (dicLine[0].ApproverType === "BRANCHHEAD") {
		Status = '22';
	} else if (dicLine[0].ApproverType === "HODCORDINATOR") {
		Status = '23';
	} else if (dicLine[0].ApproverType === "StateHead") {
		Status = '24';
	} else if (dicLine[0].ApproverType === "SalesCoOrdinator") {
		Status = '25';
	} else if (dicLine[0].ApproverType === "NationalSalesHead") {
		Status = '26';
	} else if (dicLine[0].ApproverType === "FINANCE") {
		Status = '27';
	}*/
	Status = '5';
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
				Customer.Status = Status;
				Customer.Action = "Reject";
				updateCustomerReject(Customer, record);
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
function convertUTCDateToLocalDate(date) {
    var dates = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    //var datess = date.toISOString();
    return date;
}

function getApprovalRemarks() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var queryremarks =
			'select RH.DBR_FORM_ID,RH.REMARKS_DATE,RH.APPROVAL_ID,RH.REMARKS,ME.EMPLOYEE_NAME,ST.STATUS_NAME '
			+'  from "MDB_DEV"."REMARKS_HISTORY" as RH inner join "MDB_DEV"."MST_EMPLOYEE" as ME' 
            + ' on RH.APPROVAL_ID = ME.EMPLOYEE_CODE inner join "MDB_DEV"."DBR_PROFILE" as '
            + ' DR on RH.DBR_FORM_ID = DR.DBR_FORM_ID inner join "MDB_DEV"."DBST_STATUS" as ST '
            + ' on RH.STATUS = ST.STATUS_CODE where RH.DBR_FORM_ID= ? order by RH.REMARKS_DATE desc';
		var pstmtRemarks = connection.prepareStatement(queryremarks);
		pstmtRemarks.setString(1, userCode);
		var rgetRemarks = pstmtRemarks.executeQuery();
		connection.commit();
		while (rgetRemarks.next()) {
			var record = {};
			record.DBR_FORM_ID = rgetRemarks.getString(1);
			record.REMARKS_DATE = rgetRemarks.getString(2);
			record.local = convertUTCDateToLocalDate(record.REMARKS_DATE);
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

function dispayStateHead(rgetDBRRegist, output){
    while (rgetDBRRegist.next()) {
		var record = {};
		record.PLANNED_BUSINESS_VOLUME = rgetDBRRegist.getString(1);
		record.PLANNED_BUSINESS_WOD = rgetDBRRegist.getString(2);
		record.EMPLOYEE_NAME = rgetDBRRegist.getString(3);
		record.DATE = rgetDBRRegist.getString(4);
		record.MARKET_REPUTATION = rgetDBRRegist.getString(5);
		record.NO_OF_OUTLETSURVEYED = rgetDBRRegist.getString(6);
		record.REPLACEMENT = rgetDBRRegist.getString(7);
		record.OLD_DISTRIBUTOR_CODE = rgetDBRRegist.getString(8);
		record.MARKET_TO_BE_COVERED = rgetDBRRegist.getString(9);
		record.NO_OF_OUTLETS_TO_BE_COVERED = rgetDBRRegist.getString(10);
		record.MANPOWER_DEPLOYMENT = rgetDBRRegist.getString(11);
		record.INFRASTRUCTURE_REQUIRED = rgetDBRRegist.getString(12);
		record.FINANCIAL_INVESTMENT = rgetDBRRegist.getString(13);
		record.DOCUMENTATION_AND_FORMALITIES = rgetDBRRegist.getString(14);
		record.CAPABILITY_OF_LONG_TERM_RELATIONSHIP = rgetDBRRegist.getString(15);
		record.SYSTEMATIC_AND_OBJECTIVE_APPROACH = rgetDBRRegist.getString(16);
		record.ENTREPRENEURIAL_SPIRIT = rgetDBRRegist.getString(17);
		record.PEOPLE_MANAGEMENT_SKILLS = rgetDBRRegist.getString(18);
		//record.RELATIONSHIP_DEVELOPMANT_SKILLS = rgetDBRRegist.getString(19);
		record.INITIAL_INVESTMENT_STOCK = rgetDBRRegist.getString(19);
		record.MARKET_CREDIT = rgetDBRRegist.getString(20);
		record.FST_QUARTER_ONLY = rgetDBRRegist.getString(21);
		record.SND_QUARTER_ONLY = rgetDBRRegist.getString(22);
		record.TRD_QUARTER_ONLY = rgetDBRRegist.getString(23);
		record.FOTH_QUARTER_ONLY = rgetDBRRegist.getString(24);
		record.OWN_FUNDS = rgetDBRRegist.getString(25);
		record.BORROWED_FUNDS = rgetDBRRegist.getString(26);
		record.TOTAL = rgetDBRRegist.getString(27);
		record.OWN_TO_TOTAL = rgetDBRRegist.getString(28);
		record.FEETS_ON_STREET = rgetDBRRegist.getString(29);
		record.ACCOUNTS = rgetDBRRegist.getString(30);
		record.LOGISTICS = rgetDBRRegist.getString(31);
		record.BACK_END_SUPPORT = rgetDBRRegist.getString(32);
		
		
		output.results.push(record);
	}
    
}

function getStateHeadDetails(){
    var output = {
		results: []
	};
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var queryStateHead ='SELECT SH.PLANNED_BUSINESS_VOLUME,' 
      + ' SH.PLANNED_BUSINESS_WOD,' 
      +' SM.EMPLOYEE_NAME, '
      + ' SM.DATE, '
      + ' SH.MARKET_REPUTATION, '
      + ' SH.NO_OF_OUTLETSURVEYED,' 
      + ' SH.REPLACEMENT, '
      + ' SH.OLD_DISTRIBUTOR_CODE, '
      + ' SH.MARKET_TO_BE_COVERED, '
       + 'SH.NO_OF_OUTLETS_TO_BE_COVERED,' 
      + ' SH.MANPOWER_DEPLOYMENT, '
       + ' SH.INFRASTRUCTURE_REQUIRED,' 
      +' SH.FINANCIAL_INVESTMENT, '
      + ' SH.DOCUMENTATION_AND_FORMALITIES, '
       + ' SH.CAPABILITY_OF_LONG_TERM_RELATIONSHIP,' 
       + ' SH.SYSTEMATIC_AND_OBJECTIVE_APPROACH, '
       + 'SH.ENTREPRENEURIAL_SPIRIT, '
      + ' SH.PEOPLE_MANAGEMENT_SKILLS, '
      + ' SH.INITIAL_INVESTMENT_STOCK, '
       + ' SH.MARKET_CREDIT, '
       + ' SH.FIRST_QUARTER_ONLY, '
      + ' SH.SECOND_QUARTER_ONLY, '
      + ' SH.THIRD_QUARTER_ONLY, '
      + ' SH.FORTH_QUARTER_ONLY, '
      + ' SH.OWN_FUNDS, '
      + ' SH.BORROWED_FUNDS, ' 
      + ' SH.TOTAL, '
      + ' SH.OWN_TO_TOTAL, ' 
      + ' SH.FEETS_ON_STREET, ' 
      + ' SH.ACCOUNTS, '
      + ' SH.LOGISTICS, '
       + ' BACK_END_SUPPORT, ' 
      + ' BACK_END_SUPPORT '
    + ' FROM   "MDB_DEV"."STATE_HEAD_APPROVAL" AS SH '
    + '   INNER JOIN "MDB_DEV"."STATE_HEAD_MEETING_INFO" AS SM '
       + '  ON SH.DBR_FORM_ID = SM.DBR_FORM_ID '
    + ' WHERE  SH.DBR_FORM_ID = ? ';
		//'SELECT * FROM "MDB_DEV"."STATE_HEAD_APPROVAL" AS SH INNER JOIN "MDB_DEV"."STATE_HEAD_MEETING_INFO" AS SM ON SH.DBR_FORM_ID=SM.DBR_FORM_ID where SH.DBR_FORM_ID = ?';
		var pstmtStateHead = connection.prepareStatement(queryStateHead);
		pstmtStateHead.setString(1, DBR_FORM_ID);
		var rgetDBRRegist = pstmtStateHead.executeQuery();
		connection.commit();

		dispayStateHead(rgetDBRRegist, output);
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
	case "getQueryRetailerCustomers":
	    getQueryRetailerCustomers();
	    break;
	case "rejectCustomer":
		rejectCustomer();
		break;
	case "getApprovalRemarks":
		getApprovalRemarks();
		break;
	case "queryCustomer":
	    queryCustomer();
	    break;
	case "getStateHeadDetails":
	    getStateHeadDetails();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}