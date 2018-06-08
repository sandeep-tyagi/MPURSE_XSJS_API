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

function addRETLRemarks(userCode, remarks, formId, connection, record) {

	var qryaddRETLRemarks = 'INSERT INTO "MDB_DEV"."REMARKS_HISTORY" (DBR_FORM_ID,APPROVAL_ID,REMARKS) VALUES (?,?,?)';
	var pstmtaddRETLRemarks = connection.prepareStatement(qryaddRETLRemarks);
	pstmtaddRETLRemarks.setString(1, formId);
	pstmtaddRETLRemarks.setString(2, userCode);
	pstmtaddRETLRemarks.setString(3, remarks);
	var rsaddRETLRemarks = pstmtaddRETLRemarks.executeUpdate();
	connection.commit();
	if (rsaddRETLRemarks > 0) {
		record.status = '0';
		record.message = 'Remarks Successfully Captured';
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
}

function getParentEmp(userCode, connection, record) {
	var querygetParentEmp;
	var pstmtgetParentEmp;
	var query;
	try {

		querygetParentEmp =
			'select * from "MDB_DEV"."MST_EMPLOYEE" as m inner join "MDB_DEV"."MAP_ROLE_POSITION" as mp ' +
			' on m.ROLE_POSITION_ID = mp.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."POSITION_HIERARCHY" as h on h.POSITION_ID = mp.POSITION_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as p on p.POSITION_ID = h.PARENT_POSITION_ID ' +
			' where m.EMPLOYEE_CODE=?';

		pstmtgetParentEmp = connection.prepareStatement(querygetParentEmp);
		pstmtgetParentEmp.setString(1, userCode);

		var rsgetParentEmp = pstmtgetParentEmp.executeQuery();

		while (rsgetParentEmp.next()) {
			record.PositionValue = rsgetParentEmp.getString(12);
			record.ParentPosition = rsgetParentEmp.getString(38);

		}
		switch (record.ParentPosition) {
			case "DISTRICT":
				query = 'Select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "STATE":
				query = ' Select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
				break;
			case "REGION":
				query = ' Select REGION_CODE from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
				break;
			case "COUNTRY":
				query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				break;

			default:
				return;
		}
		var pstmtgetParentInfo = connection.prepareStatement(query);
		pstmtgetParentInfo.setString(1, record.PositionValue);

		var rsgetParentInfo = pstmtgetParentInfo.executeQuery();
		connection.commit();
		record.ParentPositionValue = "";
		while (rsgetParentInfo.next()) {
			record.ParentPositionValue = rsgetParentInfo.getString(1);

		}
		if (record.ParentPositionValue === "") {
			var qryParentRolePositionHie = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
				'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
				' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
			var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
			pstmtParentRolePositionHie.setString(1, record.PositionValue);
			pstmtParentRolePositionHie.setString(2, userCode);
			var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
			while (rsParentRolePositionHie.next()) {
				record.ParentEmpCode = rsParentRolePositionHie.getString(2);
				record.ParentEmpName = rsParentRolePositionHie.getString(3);
			}
		} else {
			var qryParentEmpInfo = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=?';

			var pstmtParentEmpInfo = connection.prepareStatement(qryParentEmpInfo);
			pstmtParentEmpInfo.setString(1, record.ParentPositionValue);

			var rsParentEmpInfo = pstmtParentEmpInfo.executeQuery();
			connection.commit();
			var countdata = 0;

			while (rsParentEmpInfo.next()) {
				++countdata;
				record.ParentEmpCode = rsParentEmpInfo.getString(2);
				record.ParentEmpName = rsParentEmpInfo.getString(3);
			}

			if (countdata > 1) {
				var qryParentRolePositionHie = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
					'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
					' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
				var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
				pstmtParentRolePositionHie.setString(1, record.ParentPositionValue);
				pstmtParentRolePositionHie.setString(2, userCode);
				var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
				while (rsParentRolePositionHie.next()) {
					record.ParentEmpCode = rsParentRolePositionHie.getString(2);
					record.ParentEmpName = rsParentRolePositionHie.getString(3);
				}

			}
		}

	} catch (e) {

		return;
	}

}

/*function findHODC(userCode, connection, record) {
    
    var querygetHODC;
	var pstmtgetHODC;
	try {

		querygetHODC =
			'select * from "MDB_DEV"."MAP_ROLE_POSITION" as m inner join "MDB_DEV"."MST_ROLE" as r ' +
			' on m.ROLE_ID = r.ROLE_ID WHERE r.ROLE_NAME=?' ;
			
	
		pstmtgetHODC = connection.prepareStatement(querygetHODC);
		pstmtgetHODC.setString(1, "HO DSTB CORD");

		var rsgetParentHODC = pstmtgetHODC.executeQuery();

		while (rsgetParentHODC.next()) {
			record.PositionValue = rsgetParentEmp.getString(12);
			record.ParentPosition = rsgetParentEmp.getString(38);

		}
		switch (record.ParentPosition) {
			case "DISTRICT":
				query = 'Select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "STATE":
				query = ' Select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
				break;
			case "REGION":
				query = ' Select REGION_CODE from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
				break;
			case "COUNTRY":
				query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				break;

			default:
				return;
		}
		var pstmtgetParentInfo = connection.prepareStatement(query);
		pstmtgetParentInfo.setString(1, record.PositionValue);

		var rsgetParentInfo = pstmtgetParentInfo.executeQuery();
		connection.commit();
		record.ParentPositionValue = "";
		while (rsgetParentInfo.next()) {
			record.ParentPositionValue = rsgetParentInfo.getString(1);

		}
		if (record.ParentPositionValue === "") {
			var qryParentRolePositionHie = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
				'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
				' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
			var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
			pstmtParentRolePositionHie.setString(1, record.PositionValue);
			pstmtParentRolePositionHie.setString(2, userCode);
			var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
			while (rsParentRolePositionHie.next()) {
				record.ParentEmpCode = rsParentRolePositionHie.getString(2);
				record.ParentEmpName = rsParentRolePositionHie.getString(3);
			}
		} else {
			var qryParentEmpInfo = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=?';

			var pstmtParentEmpInfo = connection.prepareStatement(qryParentEmpInfo);
			pstmtParentEmpInfo.setString(1, record.ParentPositionValue);

			var rsParentEmpInfo = pstmtParentEmpInfo.executeQuery();
			connection.commit();
			var countdata = 0;

			while (rsParentEmpInfo.next()) {
				++countdata;
				record.ParentEmpCode = rsParentEmpInfo.getString(2);
				record.ParentEmpName = rsParentEmpInfo.getString(3);
			}

			if (countdata > 1) {
				var qryParentRolePositionHie = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
					'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
					' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
				var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
				pstmtParentRolePositionHie.setString(1, record.ParentPositionValue);
				pstmtParentRolePositionHie.setString(2, userCode);
				var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
				while (rsParentRolePositionHie.next()) {
					record.ParentEmpCode = rsParentRolePositionHie.getString(2);
					record.ParentEmpName = rsParentRolePositionHie.getString(3);
				}

			}
	//	}

	} catch (e) {

		return;
	}
    
}*/

function addNextLevelRETLApproval(formIdObj, connection, record, userCode, userType) {

  //if (userType !== 'FINANCE') {
	getParentEmp(userCode, connection, record);
  /*} 
  else {
      
      findHODC(userCode, connection, record);
  }*/
  

	var qryaddNextLevel =
		'INSERT INTO "MDB_DEV"."CUSTOMER_APPROVAL"(DBR_FORM_ID,APPROVAL_TYPE,APPROVAL_NAME,STATUS,APPROVAL_ID,APPROVAL_LEVEL) VALUES (?,?,?,?,?,?)';
	var pstmtaddNextLevel = connection.prepareStatement(qryaddNextLevel);
	pstmtaddNextLevel.setString(1, formIdObj.DBR_FORM_ID);
	pstmtaddNextLevel.setString(2, formIdObj.APPROVAL_TYPE);
	pstmtaddNextLevel.setString(3, record.ParentEmpName);
	pstmtaddNextLevel.setString(4, formIdObj.STATUS);
	pstmtaddNextLevel.setString(5, record.ParentEmpCode);
	pstmtaddNextLevel.setString(6, (parseInt(formIdObj.APPROVAL_LEVEL, 10) + 1) + "");
	var rsaddNextLevel = pstmtaddNextLevel.executeUpdate();
	connection.commit();
	if (rsaddNextLevel > 0) {
		record.status = '0';
		record.message = 'Successfully Added Next Level Approval';
	} else {
		record.status = '1';
		record.message = 'failed to Add Next Level Approval.Kindly contact to Admin!!! ';
	}

}

function getEmployeeEmailId(apprecord){
    var connection = $.db.getConnection();
	var queryEmpEmail = 'select EMAIL from "MDB_DEV"."MST_EMPLOYEE" where EMPLOYEE_CODE = ?';
	var pstmtEmpEmail = connection.prepareStatement(queryEmpEmail);
	pstmtEmpEmail.setString(1, apprecord.APPROVAL_CODE);
	var rsEmpEmail = pstmtEmpEmail.executeQuery();
	connection.commit();
	if (rsEmpEmail.next()) {
		apprecord.AppMailId = rsEmpEmail.getString(1);
	}
	connection.close();
	return apprecord;
}

function emailContent(apprecord) {

	apprecord.EmailContent = "<h3> Hello " + apprecord.FIRM_NAME + "</h3>" + "<p> Your Form is Approved By " + apprecord.APPROVAL_TYPE +
		".</p></br></br>" + "<p>Thanks & Regards,</p>" + "<p>" + apprecord.APPROVAL_NAME + "</p>";

	return apprecord;
}

function emailDBR(apprecord) {
	emailContent(apprecord);
	try {
		var mail = new $.net.Mail({
			sender: {
				address: apprecord.AppMailId
			},
			to: [{
				address: apprecord.EMAIL_ID
			}],
			subject: "Form Status",
			subjectEncoding: "UTF-8",
			parts: [new $.net.Mail.Part({
				type: $.net.Mail.Part.TYPE_TEXT,
				text: apprecord.EmailContent,
				contentType: "HTML",
				encoding: "UTF-8"
			})]
		});
		var returnValue = mail.send();
		var response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
		$.response.status = $.net.http.OK;
		$.response.contentType = 'text/html';
		$.response.setBody(response);
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
}

function getRETLRegistration(formIdObj, connection,userCode) {

	var queryRETLRegs = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
	var pstmtRETLRegs = connection.prepareStatement(queryRETLRegs);
	pstmtRETLRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsRETLRegs = pstmtRETLRegs.executeQuery();
	connection.commit();

	var apprecord = {};
	while (rsRETLRegs.next()) {
		apprecord.EMAIL_ID = rsRETLRegs.getString(1);
		apprecord.FIRM_NAME = rsRETLRegs.getString(2);
	}
	apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
	apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
	apprecord.APPROVAL_CODE = userCode;
	

    getEmployeeEmailId(apprecord);
	emailDBR(apprecord);

}

function retlApprovalProcess(formIdObj, userCode, userType, remarks, connection, Output) {
	try {
		var pstmtUpdRETLForm;
		var qryUpdRETLForm;

		var record = {};

		qryUpdRETLForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=?,APPROVAL_TYPE=? WHERE DBR_FORM_ID=? and APPROVAL_ID=?';
		pstmtUpdRETLForm = connection.prepareStatement(qryUpdRETLForm);
		pstmtUpdRETLForm.setString(1, '3');
		pstmtUpdRETLForm.setString(2, formIdObj.APPROVAL_TYPE);
		pstmtUpdRETLForm.setString(3, formIdObj.DBR_FORM_ID);
		pstmtUpdRETLForm.setString(4, formIdObj.APPROVAL_ID);

		var rsUpdRETLForm = pstmtUpdRETLForm.executeUpdate();
		connection.commit();
		if (rsUpdRETLForm > 0) {

			addRETLRemarks(userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
			addNextLevelRETLApproval(formIdObj, connection, record, userCode, userType);
			getRETLRegistration(formIdObj, connection,userCode);

			record.status = 0;
			record.message = 'Successfully Approved the selected form';
			Output.results.push(record);

		} else {
			record.status = 1;
			record.message = 'There is some issue.Kindly contact Admin!!!';
			Output.results.push(record);

		}

	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
}

function retlFormApprove() {

	var Output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var userType = $.request.parameters.get('userType');
	var formIdArray = $.request.parameters.get('formIdArray');
	var remarks = $.request.parameters.get('remarks');
	var dbrFormIdArray = JSON.parse(formIdArray.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	for (var i = 0; i < dbrFormIdArray.length; i++) {
		var formIdObj = dbrFormIdArray[i];

		retlApprovalProcess(formIdObj, userCode, userType, remarks, connection, Output);
	}
	connection.close();
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;

}



/*-----------------------For Reject for Retailer-------------------*/

function updRETLFormReject(userCode, formIdObj, connection, record) {

	var qryDbrRej = 'UPDATE "MDB_DEV"."DBR_PROFILE" SET STATUS=? WHERE DBR_FORM_ID=?';
	var pstmtDbrRej = connection.prepareStatement(qryDbrRej);
	pstmtDbrRej.setString(1, '1');
	pstmtDbrRej.setString(2, formIdObj.DBR_FORM_ID);
	var rsDbrRej = pstmtDbrRej.executeUpdate();
	connection.commit();
	if (rsDbrRej > 0) {
		record.status = '0';
		record.message = 'Successfully Rejected the selected form';
	} else {
		record.status = '1';
		record.message = 'There is some issue.Kindly contact Admin!!! ';
	}
}

function emailRejectContent(apprecord) {

	apprecord.EmailContent = "<h3> Hello " + apprecord.FIRM_NAME + "</h3>" + "<p> Your Form has been Rejected By " + apprecord.APPROVAL_TYPE +
		".</p></br></br>" + "<p>Thanks & Regards,</p>" + "<p>" + apprecord.APPROVAL_NAME + "</p>";

	return apprecord;
}

function emailRejectDBR(apprecord) {
	emailRejectContent(apprecord);
	try {
		var mail = new $.net.Mail({
			sender: {
				address: apprecord.AppMailId
			},
			to: [{
				address: apprecord.EMAIL_ID
			}],
			subject: "Form Status",
			subjectEncoding: "UTF-8",
			parts: [new $.net.Mail.Part({
				type: $.net.Mail.Part.TYPE_TEXT,
				text: apprecord.EmailContent,
				contentType: "HTML",
				encoding: "UTF-8"
			})]
		});
		var returnValue = mail.send();
		var response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
		$.response.status = $.net.http.OK;
		$.response.contentType = 'text/html';
		$.response.setBody(response);
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
}

function getRejectRegistration(formIdObj, connection, userCode,userType) {

	var queryRETLRegs = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
	var pstmtRETLRegs = connection.prepareStatement(queryRETLRegs);
	pstmtRETLRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsRETLRegs = pstmtRETLRegs.executeQuery();
	connection.commit();

	var apprecord = {};
	while (rsRETLRegs.next()) {
		apprecord.EMAIL_ID = rsRETLRegs.getString(1);
		apprecord.FIRM_NAME = rsRETLRegs.getString(2);
	}
	apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
	apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
	apprecord.APPROVAL_CODE = userCode;
	apprecord.APPROVAL_TYPE = userType;
	
    getEmployeeEmailId(apprecord);
	emailRejectDBR(apprecord);

}

function dbrRETLFormReject() {

	var Output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var userType = $.request.parameters.get('userType');
	var formIdArray = $.request.parameters.get('formIdArray');
	var dbrFormIdArray = JSON.parse(formIdArray.replace(/\\r/g, ""));
	var remarks = $.request.parameters.get('remarks');
	var connection = $.db.getConnection();
	var pstmtRejDBRForm;
	var qryRejDBRForm;
	try {

		for (var i = 0; i < dbrFormIdArray.length; i++) {
			var formIdObj = dbrFormIdArray[i];
			var record = {};

			qryRejDBRForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=? WHERE DBR_FORM_ID=?';
			pstmtRejDBRForm = connection.prepareStatement(qryRejDBRForm);
			pstmtRejDBRForm.setString(1, '5');
			pstmtRejDBRForm.setString(2, formIdObj.DBR_FORM_ID);


			var rsRejDBRForm = pstmtRejDBRForm.executeUpdate();
			connection.commit();
			if (rsRejDBRForm > 0) {
			    updRETLFormReject(userCode, formIdObj, connection, record);
				record.status = 0;
				record.message = 'Successfully Rejected the selected form';
				Output.results.push(record);
				getRejectRegistration(formIdObj, connection, userCode,userType);
				addRETLRemarks(userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);

			} else {
				record.status = 1;
				record.message = 'There is some issue.Kindly contact Admin!!!';
				Output.results.push(record);

			}

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


/*---------------------For Getting Retailer-----------------------*/

function getPendRETLRequest() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	var pstmtgetPendingDBR;
	var querygetPendingDBR;
	try {

		querygetPendingDBR =
			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is not null';     
		pstmtgetPendingDBR = connection.prepareStatement(querygetPendingDBR);
		pstmtgetPendingDBR.setString(1, '2');
		pstmtgetPendingDBR.setString(2, userCode);

		var rsGetPendingDBR = pstmtgetPendingDBR.executeQuery();
		connection.commit();
		while (rsGetPendingDBR.next()) {
			var record = {};
			SN = SN + 1;
			record.CUSTOMER_APPROVAL_ID = rsGetPendingDBR.getString(1);
			record.DBR_FORM_ID = rsGetPendingDBR.getString(2);
			record.APPROVAL_TYPE = rsGetPendingDBR.getString(3);
			record.APPROVAL_NAME = rsGetPendingDBR.getString(4);
			record.STATUS = rsGetPendingDBR.getString(5);
			record.STATUS_DATE = rsGetPendingDBR.getString(6);
			record.APPROVAL_ID = rsGetPendingDBR.getString(7);
			record.SAPUSER_ID = rsGetPendingDBR.getString(8);
			record.APPROVAL_LEVEL = rsGetPendingDBR.getString(9);
			record.REMARKS = rsGetPendingDBR.getString(10);
			record.DBR_PROFILE_ID = rsGetPendingDBR.getString(11);
			record.DBR_FORM_ID = rsGetPendingDBR.getString(12);
			record.FIRM_NAME = rsGetPendingDBR.getString(13);
			record.NATURE = rsGetPendingDBR.getString(14);
			record.EMAIL_ID = rsGetPendingDBR.getString(15);
			record.REGION = rsGetPendingDBR.getString(16);
			record.REMARKS = rsGetPendingDBR.getString(17);
			record.PREMISES_NATURE = rsGetPendingDBR.getString(18);
			record.PREMISES_NO = rsGetPendingDBR.getString(19);
			record.LOCALITY = rsGetPendingDBR.getString(20);
			record.TOWN_VILL = rsGetPendingDBR.getString(21);
			record.CITY_DISTRICT = rsGetPendingDBR.getString(22);
			record.STATE = rsGetPendingDBR.getString(23);
			record.POSTAL_CODE = rsGetPendingDBR.getString(24);
			record.OFFICE_SPACE = rsGetPendingDBR.getString(25);
			record.WAREHOUSE_SPACE = rsGetPendingDBR.getString(26);
			record.COMPANY_PROFILE = rsGetPendingDBR.getString(27);
			record.OWNERSHIP_SINCE = rsGetPendingDBR.getString(28);
			record.CURRENT_INVESTMENT = rsGetPendingDBR.getString(29);
			record.BANK_LOAN = rsGetPendingDBR.getString(30);
			record.BANK_LIMIT = rsGetPendingDBR.getString(31);
			record.BANK_NAME = rsGetPendingDBR.getString(32);
			record.CURRENT_ACCOUNT_NUMBER = rsGetPendingDBR.getString(33);
			record.SOFT_DEL = rsGetPendingDBR.getString(35);
			record.CREATE_BY = rsGetPendingDBR.getString(36);
			record.CREATE_DATE = rsGetPendingDBR.getString(37);

			dateFormat(record);
			record.SerialNo = SN;
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

	case "retlFormApprove":
		retlFormApprove();
		break;
		
	case "dbrRETLFormReject":
		dbrRETLFormReject();
		break;	
		
	case "getPendRETLRequest":
		getPendRETLRequest();
		break;	
		
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}