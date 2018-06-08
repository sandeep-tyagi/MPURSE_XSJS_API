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

function addCustRemarks(userCode, remarks, formId, connection, record) {

	var qryaddCustRemarks = 'INSERT INTO "MDB_DEV"."REMARKS_HISTORY" (DBR_FORM_ID,APPROVAL_ID,REMARKS) VALUES (?,?,?)';
	var pstmtaddCustRemarks = connection.prepareStatement(qryaddCustRemarks);
	pstmtaddCustRemarks.setString(1, formId);
	pstmtaddCustRemarks.setString(2, userCode);
	pstmtaddCustRemarks.setString(3, remarks);
	var rsaddCustRemarks = pstmtaddCustRemarks.executeUpdate();
	connection.commit();
	if (rsaddCustRemarks > 0) {
		record.status = '0';
		record.message = 'Remarks Successfully Captured';
	} else {
		record.status = '1';
		record.message = 'failed to Capture Remarks.Kindly contact to Admin!!! ';
	}
}

//working before shubham
/*function addNextLevelCustApproval(formIdObj,connection,record) {
    
    	var qryaddNextLevel = 'INSERT INTO "MDB_DEV"."CUSTOMER_APPROVAL"(DBR_FORM_ID,APPROVAL_TYPE,APPROVAL_NAME,STATUS,APPROVAL_ID,APPROVAL_LEVEL) VALUES (?,?,?,?,?,?)';
		var pstmtaddNextLevel = connection.prepareStatement(qryaddNextLevel);
		pstmtaddNextLevel.setString(1, formIdObj.DBR_FORM_ID);
		pstmtaddNextLevel.setString(2, formIdObj.APPROVAL_TYPE);
		pstmtaddNextLevel.setString(3, formIdObj.APPROVAL_NAME);
		pstmtaddNextLevel.setString(4, formIdObj.STATUS);
		pstmtaddNextLevel.setString(5, 'EMP272018');
		pstmtaddNextLevel.setString(6, (parseInt(formIdObj.APPROVAL_LEVEL,10)+1)+"");
       	var rsaddNextLevel = pstmtaddNextLevel.executeUpdate();
		connection.commit();
		if (rsaddNextLevel > 0) {
			record.status = '0';
			record.message = 'Successfully Added Next Level Approval';
		} else {
			record.status = '1';
			record.message = 'failed to Add Next Level Approval.Kindly contact to Admin!!! ';
		}	
    
}*/

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
			' where m.EMPLOYEE_CODE=? AND m.SOFT_DEL=0 AND mp.SOFT_DEL=0 AND h.SOFT_DEL=0 AND p.SOFT_DEL=0';

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

function addNextLevelCustApproval(formIdObj, connection, record, userCode) {

	getParentEmp(userCode, connection, record);

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

function getPendDBRRequest() {
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
		// 			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
		//           ' inner join "MDB_DEV"."DIRECTOR_PROFILE" as DIRP on DBRP.DBR_FORM_ID=DIRP.DBR_FORM_ID where CAPP.STATUS=? and CAPP.APPROVAL_ID=? ';
		/*' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' inner join "MDB_DEV"."DIRECTOR_PROFILE" as DIRP on DBRP.DBR_FORM_ID=DIRP.DBR_FORM_ID ' +
			' inner join "MDB_DEV"."DBR_BUSI_PROFILE" as DBRB on DIRP.DBR_FORM_ID=DBRB.DBR_FORM_ID where CAPP.STATUS=? and CAPP.APPROVAL_ID=? ';*/
			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';     
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
			// record.STATUS = rsGetPendingDBR.getString(34);
			record.SOFT_DEL = rsGetPendingDBR.getString(35);
			record.CREATE_BY = rsGetPendingDBR.getString(36);
			record.CREATE_DATE = rsGetPendingDBR.getString(37);
// 			record.PARENT_CODE = rsGetPendingDBR.getString(46);
// 			record.DIR_PROFILE_ID = rsGetPendingDBR.getString(47);
// 			record.CONTACT_INFO_NAME = rsGetPendingDBR.getString(48);
// 			record.FATHER_NAME = rsGetPendingDBR.getString(49);
// 			record.CONTACT_NUMBER = rsGetPendingDBR.getString(50);
// 			record.DESIGNATION = rsGetPendingDBR.getString(51);
// 			record.COMPANY_NAME = rsGetPendingDBR.getString(57);
// 			record.ASSOCIATED_FROM = rsGetPendingDBR.getString(58);
// 			record.INDUSTRY_CATEGORY = rsGetPendingDBR.getString(59);
// 			record.SP_VOLUME_AVG = rsGetPendingDBR.getString(60);
// 			record.SP_VALUE_AVG = rsGetPendingDBR.getString(61);

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

function getDBRRegistration(formIdObj, connection,userCode) {

	var queryDSTBRegs = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
	var pstmtDSTBRegs = connection.prepareStatement(queryDSTBRegs);
	pstmtDSTBRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsDSTBRegs = pstmtDSTBRegs.executeQuery();
	connection.commit();

	var apprecord = {};
	while (rsDSTBRegs.next()) {
		apprecord.EMAIL_ID = rsDSTBRegs.getString(1);
		apprecord.FIRM_NAME = rsDSTBRegs.getString(2);
	}
	apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
	apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
	apprecord.APPROVAL_CODE = userCode;
	

    getEmployeeEmailId(apprecord);
	emailDBR(apprecord);

}

function dbrFormApprovalProcess(formIdObj, userCode, remarks, connection, Output) {
	try {
		var pstmtUpdDBRForm;
		var qryUpdDBRForm;

		var record = {};

		qryUpdDBRForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=?,APPROVAL_TYPE=? WHERE DBR_FORM_ID=? and APPROVAL_ID=?';
		pstmtUpdDBRForm = connection.prepareStatement(qryUpdDBRForm);
		pstmtUpdDBRForm.setString(1, '3');
		pstmtUpdDBRForm.setString(2, formIdObj.APPROVAL_TYPE);
		pstmtUpdDBRForm.setString(3, formIdObj.DBR_FORM_ID);
		pstmtUpdDBRForm.setString(4, formIdObj.APPROVAL_ID);

		var rsUpdDBRForm = pstmtUpdDBRForm.executeUpdate();
		connection.commit();
		if (rsUpdDBRForm > 0) {

			addCustRemarks(userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
			addNextLevelCustApproval(formIdObj, connection, record, userCode);
			getDBRRegistration(formIdObj, connection,userCode);

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

function dbrFormApprove() {

	var Output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var formIdArray = $.request.parameters.get('formIdArray');
	var remarks = $.request.parameters.get('remarks');
	var dbrFormIdArray = JSON.parse(formIdArray.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	for (var i = 0; i < dbrFormIdArray.length; i++) {
		var formIdObj = dbrFormIdArray[i];

		dbrFormApprovalProcess(formIdObj, userCode, remarks, connection, Output);
	}
	connection.close();
	var body = JSON.stringify(Output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;

}

function addStateHeadLoginMeeting(StateformIdObj, employeeListObj, connection, record) {

	try {
		var qryAddStateHeadMeeting =
			'insert into "MDB_DEV"."STATE_HEAD_MEETING_INFO" (DBR_FORM_ID,APPROVAL_ID,EMPLOYEE_NAME,DATE) values (?,?,?,?)';
		var pstmtAddStateHeadMeeting = connection.prepareStatement(qryAddStateHeadMeeting);
		pstmtAddStateHeadMeeting.setString(1, StateformIdObj.DBR_FORM_ID);
		pstmtAddStateHeadMeeting.setString(2, StateformIdObj.APPROVAL_ID);
		pstmtAddStateHeadMeeting.setString(3, employeeListObj.employee_Name);
		pstmtAddStateHeadMeeting.setString(4, employeeListObj.date);

		var rsAddStateHeadMeeting = pstmtAddStateHeadMeeting.executeUpdate();
		connection.commit();
		if (rsAddStateHeadMeeting > 0) {
			record.status = 1;
			record.Message = "Record Successfully inserted";
		} else {
			record.status = 0;
			record.Message = "Record not insert";
		}

	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}

}

function addStateHeadLoginApproval() {

	var Output = {
		results: []
	};
	var StateHeadformArray = $.request.parameters.get('StateHeadformArray');
	var dbrStateIdArray = JSON.parse(StateHeadformArray.replace(/\\r/g, ""));
	var connection = $.db.getConnection();

	try {
		for (var i = 0; i < dbrStateIdArray.length; i++) {
			var StateformIdObj = dbrStateIdArray[i];
			var record = {};
			var qryGetStateHead = 'select * from "MDB_DEV"."STATE_HEAD_APPROVAL" where DBR_FORM_ID=?';
			var paramGetStateHead = connection.prepareStatement(qryGetStateHead);
			paramGetStateHead.setString(1, StateformIdObj.DBR_FORM_ID);
			var rsGetStateHead = paramGetStateHead.executeQuery();
			if (rsGetStateHead.next()) {
				record.status = 0;
				record.Message = "Record  Already  Exist into database";
			} else {
				var qryAddStateHead =
					'insert into  "MDB_DEV"."STATE_HEAD_APPROVAL" ("DBR_FORM_ID","APPROVAL_ID","NAME_OF_PREMISES","LOCALITY","DISTRICT","POSTAL_CODE","OFFICE_SPACE","PREMISES_NO","VILLAGE","STATE","EMAIL_ID","WAREHOUSE_SPACE","PLANNED_BUSINESS_VOLUME","PLANNED_BUSINESS_WOD","MARKET_REPUTATION","NO_OF_OUTLETSURVEYED","REPLACEMENT","OLD_DISTRIBUTOR_CODE","MARKET_TO_BE_COVERED","NO_OF_OUTLETS_TO_BE_COVERED","MANPOWER_DEPLOYMENT","INFRASTRUCTURE_REQUIRED","FINANCIAL_INVESTMENT","DOCUMENTATION_AND_FORMALITIES","CAPABILITY_OF_LONG_TERM_RELATIONSHIP","SYSTEMATIC_AND_OBJECTIVE_APPROACH","ENTREPRENEURIAL_SPIRIT","PEOPLE_MANAGEMENT_SKILLS","RELATIONSHIP_DEVELOPMANT_SKILLS","INITIAL_INVESTMENT_STOCK","MARKET_CREDIT","CLAIMS","1ST_QUARTER_ONLY","2ND_QUARTER_ONLY","3RD_QUARTER_ONLY","4TH_QUARTER_ONLY","OWN_FUNDS","BORROWED_FUNDS","TOTAL","OWN_TO_TOTAL","FEETS_ON_STREET","ACCOUNTS","LOGISTICS","BACK_END_SUPPORT") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
				var pstmtAddStateHead = connection.prepareStatement(qryAddStateHead);
				pstmtAddStateHead.setString(1, StateformIdObj.DBR_FORM_ID);
				pstmtAddStateHead.setString(2, StateformIdObj.APPROVAL_ID);
				pstmtAddStateHead.setString(3, StateformIdObj.FIRM_NAME);
				pstmtAddStateHead.setString(4, StateformIdObj.LOCALITY);
				pstmtAddStateHead.setString(5, StateformIdObj.CITY_DISTRICT);
				pstmtAddStateHead.setString(6, StateformIdObj.POSTAL_CODE);
				pstmtAddStateHead.setString(7, StateformIdObj.OFFICE_SPACE);
				pstmtAddStateHead.setString(8, StateformIdObj.PREMISES_NO);
				pstmtAddStateHead.setString(9, StateformIdObj.TOWN_VILL);
				pstmtAddStateHead.setString(10, StateformIdObj.STATE);
				pstmtAddStateHead.setString(11, StateformIdObj.EMAIL_ID);
				pstmtAddStateHead.setString(12, StateformIdObj.WAREHOUSE_SPACE);
				pstmtAddStateHead.setString(13, StateformIdObj.PLANNED_BUSINESS_VOLUME);
				pstmtAddStateHead.setString(14, StateformIdObj.PLANNED_BUSINESS_WOD);
				pstmtAddStateHead.setString(15, StateformIdObj.MARKET_REPUTATION);
				pstmtAddStateHead.setString(16, StateformIdObj.NO_OF_OUTLETSURVEYED);
				pstmtAddStateHead.setString(17, StateformIdObj.REPLACEMENT);
				pstmtAddStateHead.setString(18, StateformIdObj.OLD_DISTRIBUTOR_CODE);
				pstmtAddStateHead.setString(19, StateformIdObj.MARKET_TO_BE_COVERED);
				pstmtAddStateHead.setString(20, StateformIdObj.NO_OF_OUTLETS_TO_BE_COVERED);
				pstmtAddStateHead.setString(21, StateformIdObj.MANPOWER_DEPLOYMENT);
				pstmtAddStateHead.setString(22, StateformIdObj.INFRASTRUCTURE_REQUIRED);
				pstmtAddStateHead.setString(23, StateformIdObj.FINANCIAL_INVESTMENT);
				pstmtAddStateHead.setString(24, StateformIdObj.DOCUMENTATION_AND_FORMALITIES);
				pstmtAddStateHead.setString(25, StateformIdObj.CAPABILITY_OF_LONG_TERM_RELATIONSHIP);
				pstmtAddStateHead.setString(26, StateformIdObj.SYSTEMATIC_AND_OBJECTIVE_APPROACH);
				pstmtAddStateHead.setString(27, StateformIdObj.ENTREPRENEURIAL_SPIRIT);
				pstmtAddStateHead.setString(28, StateformIdObj.PEOPLE_MANAGEMENT_SKILLS);
				pstmtAddStateHead.setString(29, StateformIdObj.RELATIONSHIP_DEVELOPMANT_SKILLS);
				pstmtAddStateHead.setString(30, StateformIdObj.INITIAL_INVESTMENT_STOCK);
				pstmtAddStateHead.setString(31, StateformIdObj.MARKET_CREDIT);
				pstmtAddStateHead.setString(32, StateformIdObj.CLAIMS);
				pstmtAddStateHead.setString(33, StateformIdObj.FIRST_QUARTER_ONLY);
				pstmtAddStateHead.setString(34, StateformIdObj.SECOND_QUARTER_ONLY);
				pstmtAddStateHead.setString(35, StateformIdObj.THIRD_QUARTER_ONLY);
				pstmtAddStateHead.setString(36, StateformIdObj.FOURTH_QUARTER_ONLY);
				pstmtAddStateHead.setString(37, StateformIdObj.OWN_FUNDS);
				pstmtAddStateHead.setString(38, StateformIdObj.BORROWED_FUNDS);
				pstmtAddStateHead.setString(39, StateformIdObj.TOTAL);
				pstmtAddStateHead.setString(40, StateformIdObj.OWN_TO_TOTAL);
				pstmtAddStateHead.setString(41, StateformIdObj.FEETS_ON_STREET);
				pstmtAddStateHead.setString(42, StateformIdObj.ACCOUNTS);
				pstmtAddStateHead.setString(43, StateformIdObj.LOGISTICS);
				pstmtAddStateHead.setString(44, StateformIdObj.BACK_END_SUPPORT);

				var rsAddStateHead = pstmtAddStateHead.executeUpdate();
				connection.commit();
				if (rsAddStateHead > 0) {
					record.status = 1;
					record.Message = "Record Successfully inserted";
				} else {
					record.status = 0;
					record.Message = "Record not insert";
				}

				var employeeListArray = StateformIdObj.employeeList;
				for (var k = 0; k < employeeListArray.length; k++) {
					var employeeListObj = employeeListArray[k];
					addStateHeadLoginMeeting(StateformIdObj, employeeListObj, connection, record);
				}
				dbrFormApprovalProcess(StateformIdObj, StateformIdObj.APPROVAL_ID, StateformIdObj.REMARKS, connection, Output);
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

function getApprovedDBR() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	var pstmtgetApproveDBR;
	var querygetApproveDBR;
	try {

		querygetApproveDBR =
			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';
		pstmtgetApproveDBR = connection.prepareStatement(querygetApproveDBR);
		pstmtgetApproveDBR.setString(1, '3');
		pstmtgetApproveDBR.setString(2, userCode);

		var rsgetApproveDBR = pstmtgetApproveDBR.executeQuery();
		connection.commit();
		while (rsgetApproveDBR.next()) {
			var record = {};
			SN = SN + 1;
			record.CUSTOMER_APPROVAL_ID = rsgetApproveDBR.getString(1);
			record.DBR_FORM_ID = rsgetApproveDBR.getString(2);
			record.APPROVAL_TYPE = rsgetApproveDBR.getString(3);
			record.APPROVAL_NAME = rsgetApproveDBR.getString(4);
			record.STATUS = rsgetApproveDBR.getString(5);
			record.STATUS_DATE = rsgetApproveDBR.getString(6);
			record.APPROVAL_ID = rsgetApproveDBR.getString(7);
			record.SAPUSER_ID = rsgetApproveDBR.getString(8);
			record.APPROVAL_LEVEL = rsgetApproveDBR.getString(9);
			record.REMARKS = rsgetApproveDBR.getString(10);
			record.DBR_PROFILE_ID = rsgetApproveDBR.getString(11);
			record.DBR_FORM_ID = rsgetApproveDBR.getString(12);
			record.FIRM_NAME = rsgetApproveDBR.getString(13);
			record.NATURE = rsgetApproveDBR.getString(14);
			record.EMAIL_ID = rsgetApproveDBR.getString(15);
			record.REGION = rsgetApproveDBR.getString(16);
			record.REMARKS = rsgetApproveDBR.getString(17);
			record.PREMISES_NATURE = rsgetApproveDBR.getString(18);
			record.PREMISES_NO = rsgetApproveDBR.getString(19);
			record.LOCALITY = rsgetApproveDBR.getString(20);
			record.TOWN_VILL = rsgetApproveDBR.getString(21);
			record.CITY_DISTRICT = rsgetApproveDBR.getString(22);
			record.STATE = rsgetApproveDBR.getString(23);
			record.POSTAL_CODE = rsgetApproveDBR.getString(24);
			record.OFFICE_SPACE = rsgetApproveDBR.getString(25);
			record.WAREHOUSE_SPACE = rsgetApproveDBR.getString(26);
			record.COMPANY_PROFILE = rsgetApproveDBR.getString(27);
			record.OWNERSHIP_SINCE = rsgetApproveDBR.getString(28);
			record.CURRENT_INVESTMENT = rsgetApproveDBR.getString(29);
			record.BANK_LOAN = rsgetApproveDBR.getString(30);
			record.BANK_LIMIT = rsgetApproveDBR.getString(31);
			record.BANK_NAME = rsgetApproveDBR.getString(32);
			record.CURRENT_ACCOUNT_NUMBER = rsgetApproveDBR.getString(33);
			//	record.STATUS = rsgetApproveDBR.getString(34);
			record.SOFT_DEL = rsgetApproveDBR.getString(35);
			record.CREATE_BY = rsgetApproveDBR.getString(36);
			record.CREATE_DATE = rsgetApproveDBR.getString(37);

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

function getRejectDBRRequest() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	var pstmtgetRejectDBR;
	var querygetRejectDBR;
	try {

		querygetRejectDBR =
			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';
		pstmtgetRejectDBR = connection.prepareStatement(querygetRejectDBR);
		pstmtgetRejectDBR.setString(1, '5');
		pstmtgetRejectDBR.setString(2, userCode);

		var rsgetRejectDBR = pstmtgetRejectDBR.executeQuery();
		connection.commit();
		while (rsgetRejectDBR.next()) {
			var record = {};
			SN = SN + 1;
			record.CUSTOMER_APPROVAL_ID = rsgetRejectDBR.getString(1);
			record.DBR_FORM_ID = rsgetRejectDBR.getString(2);
			record.APPROVAL_TYPE = rsgetRejectDBR.getString(3);
			record.APPROVAL_NAME = rsgetRejectDBR.getString(4);
			record.STATUS = rsgetRejectDBR.getString(5);
			record.STATUS_DATE = rsgetRejectDBR.getString(6);
			record.APPROVAL_ID = rsgetRejectDBR.getString(7);
			record.SAPUSER_ID = rsgetRejectDBR.getString(8);
			record.APPROVAL_LEVEL = rsgetRejectDBR.getString(9);
			record.REMARKS = rsgetRejectDBR.getString(10);
			record.DBR_PROFILE_ID = rsgetRejectDBR.getString(11);
			record.DBR_FORM_ID = rsgetRejectDBR.getString(12);
			record.FIRM_NAME = rsgetRejectDBR.getString(13);
			record.NATURE = rsgetRejectDBR.getString(14);
			record.EMAIL_ID = rsgetRejectDBR.getString(15);
			record.REGION = rsgetRejectDBR.getString(16);
			record.REMARKS = rsgetRejectDBR.getString(17);
			record.PREMISES_NATURE = rsgetRejectDBR.getString(18);
			record.PREMISES_NO = rsgetRejectDBR.getString(19);
			record.LOCALITY = rsgetRejectDBR.getString(20);
			record.TOWN_VILL = rsgetRejectDBR.getString(21);
			record.CITY_DISTRICT = rsgetRejectDBR.getString(22);
			record.STATE = rsgetRejectDBR.getString(23);
			record.POSTAL_CODE = rsgetRejectDBR.getString(24);
			record.OFFICE_SPACE = rsgetRejectDBR.getString(25);
			record.WAREHOUSE_SPACE = rsgetRejectDBR.getString(26);
			record.COMPANY_PROFILE = rsgetRejectDBR.getString(27);
			record.OWNERSHIP_SINCE = rsgetRejectDBR.getString(28);
			record.CURRENT_INVESTMENT = rsgetRejectDBR.getString(29);
			record.BANK_LOAN = rsgetRejectDBR.getString(30);
			record.BANK_LIMIT = rsgetRejectDBR.getString(31);
			record.BANK_NAME = rsgetRejectDBR.getString(32);
			record.CURRENT_ACCOUNT_NUMBER = rsgetRejectDBR.getString(33);
			// record.STATUS = rsGetPendingDBR.getString(34);
			record.SOFT_DEL = rsgetRejectDBR.getString(35);
			record.CREATE_BY = rsgetRejectDBR.getString(36);
			record.CREATE_DATE = rsgetRejectDBR.getString(37);

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

	var queryDSTBRegs = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
	var pstmtDSTBRegs = connection.prepareStatement(queryDSTBRegs);
	pstmtDSTBRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsDSTBRegs = pstmtDSTBRegs.executeQuery();
	connection.commit();

	var apprecord = {};
	while (rsDSTBRegs.next()) {
		apprecord.EMAIL_ID = rsDSTBRegs.getString(1);
		apprecord.FIRM_NAME = rsDSTBRegs.getString(2);
	}
	apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
	apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
	apprecord.APPROVAL_CODE = userCode;
	apprecord.APPROVAL_TYPE = userType;
	
    getEmployeeEmailId(apprecord);
	emailRejectDBR(apprecord);

}

function updDbrFormReject(userCode, formIdObj, connection, record) {

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

function delDbrStateHeadMeeting(formId, connection, record) {

	var qryDelSHM = 'DELETE FROM "MDB_DEV"."STATE_HEAD_MEETING_INFO" WHERE DBR_FORM_ID=?';
	var pstmtDelSHM = connection.prepareStatement(qryDelSHM);
	pstmtDelSHM.setString(1, formId);
	var rsDelSHM = pstmtDelSHM.executeUpdate();
	connection.commit();
	if (rsDelSHM > 0) {
		record.status = '0';
		record.message = 'Successfully Deleted the selected form';
	} else {
		record.status = '1';
		record.message = 'There is some issue.Kindly contact Admin!!! ';
	}
}

function delDbrStateHeadApproval(formId, connection, record) {

	var qryDelDbrSHA = 'DELETE FROM "MDB_DEV"."STATE_HEAD_APPROVAL" WHERE DBR_FORM_ID=?';
	var pstmtDelSHA = connection.prepareStatement(qryDelDbrSHA);
	pstmtDelSHA.setString(1, formId);
	var rsDelSHA = pstmtDelSHA.executeUpdate();
	connection.commit();
	if (rsDelSHA > 0) {
	    delDbrStateHeadMeeting(formId, connection, record);
		record.status = '0';
		record.message = 'Successfully Deleted the selected form';
	} else {
		record.status = '1';
		record.message = 'There is some issue.Kindly contact Admin!!! ';
	}
}

function dbrFormReject() {

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
			    updDbrFormReject(userCode, formIdObj, connection, record);
				record.status = 0;
				record.message = 'Successfully Rejected the selected form';
				Output.results.push(record);
				getRejectRegistration(formIdObj, connection, userCode,userType);
				addCustRemarks(userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
				delDbrStateHeadApproval(formIdObj.DBR_FORM_ID, connection, record);

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

function getDBRForm() {
	var output = {
		results: []
	};
	var SN = 0;
	var dbrFormId = $.request.parameters.get('dbrFormId');
	var connection = $.db.getConnection();
	var pstmtgetPendingDBR;
	var querygetPendingDBR;
	try {

		querygetPendingDBR =
			' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' inner join "MDB_DEV"."DIRECTOR_PROFILE" as DIRP on DBRP.DBR_FORM_ID=DIRP.DBR_FORM_ID ' +
			' inner join "MDB_DEV"."DBR_BUSI_PROFILE" as DBRB on DIRP.DBR_FORM_ID=DBRB.DBR_FORM_ID where CAPP.STATUS=? and DBRP.DBR_FORM_ID=? ';
		pstmtgetPendingDBR = connection.prepareStatement(querygetPendingDBR);

		pstmtgetPendingDBR.setString(1, '2');
		pstmtgetPendingDBR.setString(2, dbrFormId);

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
			// record.STATUS = rsGetPendingDBR.getString(34);
			record.SOFT_DEL = rsGetPendingDBR.getString(35);
			record.CREATE_BY = rsGetPendingDBR.getString(36);
			record.CREATE_DATE = rsGetPendingDBR.getString(37);
			record.PARENT_CODE = rsGetPendingDBR.getString(46);
			record.DIR_PROFILE_ID = rsGetPendingDBR.getString(47);
			record.CONTACT_INFO_NAME = rsGetPendingDBR.getString(48);
			record.FATHER_NAME = rsGetPendingDBR.getString(49);
			record.CONTACT_NUMBER = rsGetPendingDBR.getString(50);
			record.DESIGNATION = rsGetPendingDBR.getString(51);
			record.COMPANY_NAME = rsGetPendingDBR.getString(56);
			record.ASSOCIATED_FROM = rsGetPendingDBR.getString(57);
			record.INDUSTRY_CATEGORY = rsGetPendingDBR.getString(58);
			record.SP_VOLUME_AVG = rsGetPendingDBR.getString(59);
			record.SP_VALUE_AVG = rsGetPendingDBR.getString(60);

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

function updateDirectorSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdDirc = 'update "MDB_DEV"."DIRECTOR_PROFILE" set SAPUSER_ID=? where DBR_FORM_ID=?';
	var pstmtUpdDirc = connection.prepareStatement(qryUpdDirc);
	pstmtUpdDirc.setString(1, sapId);
	pstmtUpdDirc.setString(2, userId);
	var rsUpdUpdDirc = pstmtUpdDirc.executeUpdate();
	connection.commit();
	if (rsUpdUpdDirc > 0) {
		record.status = '0';
		record.messageDirector = 'Successfully Update Directors';
	} else {
		record.status = '1';
		record.messageDirector = 'failed to update Directors';
	}
	connection.close();
}

function updateBussProfileSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdBussProfile = 'update "MDB_DEV"."DBR_BUSI_PROFILE" set SAPUSER_ID=? where DBR_FORM_ID=?';
	var pstmtUpdBussProfile = connection.prepareStatement(qryUpdBussProfile);
	pstmtUpdBussProfile.setString(1, sapId);
	pstmtUpdBussProfile.setString(2, userId);
	var rsUpdUpdBussProfile = pstmtUpdBussProfile.executeUpdate();
	connection.commit();
	if (rsUpdUpdBussProfile > 0) {
		record.status = '0';
		record.messageBussProfile = 'Successfully Update Bussness Profile';
	} else {
		record.status = '1';
		record.messageBussProfile = 'failed to update Bussness Profile';
	}
	connection.close();
}

function updateCustLegalSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdCustLegal = 'update "MDB_DEV"."CUSTOMER_LEGAL_INFO" set SAPUSER_ID=? where DBR_FORM_ID=?';
	var pstmtUpdCustLegal = connection.prepareStatement(qryUpdCustLegal);
	pstmtUpdCustLegal.setString(1, sapId);
	pstmtUpdCustLegal.setString(2, userId);
	var rsUpdCustLegal = pstmtUpdCustLegal.executeUpdate();
	connection.commit();
	if (rsUpdCustLegal > 0) {
		record.status = '0';
		record.messageCustLegal = 'Successfully Update Customer Legal';
	} else {
		record.status = '1';
		record.messageCustLegal = 'failed to update Customer Legal';
	}
	connection.close();
}

function updateFosSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdFos = 'update "MDB_DEV"."DBR_FOS_DETAILS" set SAPUSER_ID=? where DBR_FORM_ID=?';
	var pstmtUpdFos = connection.prepareStatement(qryUpdFos);
	pstmtUpdFos.setString(1, sapId);
	pstmtUpdFos.setString(2, userId);
	var rsUpdFos = pstmtUpdFos.executeUpdate();
	connection.commit();
	if (rsUpdFos > 0) {
		record.status = '0';
		record.messageFos = 'Successfully Update FOS Details';
	} else {
		record.status = '1';
		record.messageFos = 'failed to update FOS Details';
	}
	connection.close();
}

function getDRBDetails(userId, records) {
	var connection = $.db.getConnection();
	var qrydbr = 'Select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID=?';
	var pstmtdbr = connection.prepareStatement(qrydbr);
	pstmtdbr.setString(1, userId);
	var rgetdbr = pstmtdbr.executeQuery();
	connection.commit();
	while (rgetdbr.next()) {
		//var record = {};
		records.DBR_FORM_ID = rgetdbr.getString(2);
		records.FIRM_NAME = rgetdbr.getString(3);
		records.NATURE = rgetdbr.getString(4);
		records.EMAIL_ID = rgetdbr.getString(5);
		records.REGION = rgetdbr.getString(6);
		records.REMARK = rgetdbr.getString(7);
		records.PREMISES_NATURE = rgetdbr.getString(8);
		records.PREMISES_NO = rgetdbr.getString(9);
		records.LOCALITY = rgetdbr.getString(10);
		records.TOWN_VILL = rgetdbr.getString(11);
		records.CITY_DISTRICT = rgetdbr.getString(12);
		records.STATE = rgetdbr.getString(13);
		records.POSTAL_CODE = rgetdbr.getString(14);
		records.OFFICE_SPACE = rgetdbr.getString(15);
		records.WAREHOUSE_SPACE = rgetdbr.getString(16);
		records.COMPANY_NAME = rgetdbr.getString(17);
		records.OWNERSHIP_SINCE = rgetdbr.getString(18);
		records.CURRENT_INVESTMENT = rgetdbr.getString(19);
		records.BANK_LOAN = rgetdbr.getString(20);
		records.BANK_LIMIT = rgetdbr.getString(21);
		records.BANK_NAME = rgetdbr.getString(22);
		records.CURRENT_ACCOUNT_NUMBER = rgetdbr.getString(23);
		records.STATUS = rgetdbr.getString(24);
		records.SOFT_DEL = rgetdbr.getString(25);
		records.CREATE_BY = rgetdbr.getString(26);
		records.CREATE_DATE = rgetdbr.getString(27);
		records.RETAILER_TYPE = rgetdbr.getString(28);
		records.RETAILER_WEEKLY_DAY_OFF = rgetdbr.getString(29);
		records.RETAILER_SHOP_SIZE = rgetdbr.getString(30);
		records.RETAILER_TOWN_TIER = rgetdbr.getString(31);
		records.RETAILER_XIAOMI_PREF_PARTNER = rgetdbr.getString(33);
		records.RETAILER_MOTO_PREF_PARTNER = rgetdbr.getString(34);
		records.RETAILER_OTHER_PREF = rgetdbr.getString(35);
		records.PARENT = rgetdbr.getString(36);
	}
	connection.close();
	return records;
}

function updateCustomerData(sapId, userId, record) {
	var connection = $.db.getConnection();
	var records = {};
	getDRBDetails(userId, records);

	var qryGetCust = 'select * from "MDB_DEV"."MST_CUSTOMER" where SAPUSER_ID=? and DBR_FORM_ID=?';
	var pstmtGetCust = connection.prepareStatement(qryGetCust);
	pstmtGetCust.setString(1, sapId);
	pstmtGetCust.setString(2, userId);
	var rgetGetCust = pstmtGetCust.executeQuery();
	connection.commit();
	if (rgetGetCust.next()) {
		record.status = '0';
		record.messageCustomer = 'Data Allready Insert';
	} else {
		var queryCust = 'insert into  "MDB_DEV"."MST_CUSTOMER" ' +
			' ("CUST_TYPE","SAPUSER_ID","DBR_FORM_ID","CUST_NAME","PARENT_CUST_CODE","PARENT_CUST_NAME","FIRM_NAME","NATURE", ' +
			' "EMAIL_ID","REGION","REMARKS","PREMISES_NATURE","PREMISES_NO","LOCALITY","TOWN_VILL","CITY_DISTRICT", ' +
			' "STATE","POSTAL_CODE","OFFICE_SPACE","WAREHOUSE_SPACE","COMPANY_PROFILE","OWNERSHIP_SINCE","CURRENT_INVESTMENT","BANK_LOAN", ' +
			' "BANK_LIMIT","BANK_NAME","CURRENT_ACCOUNT_NUMBER","STATUS","SOFT_DEL","CREATE_BY","RETAILER_TYPE","RETAILER_WEEKLY_DAY_OFF", ' +
			'  "RETAILER_SHOP_SIZE","RETAILER_TOWN_TIER","RETAILER_XIAOMI_PREF_PARTNER","RETAILER_MOTO_PREF_PARTNER","RETAILER_OTHER_PREF") ' +
			' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	}
	var pstmtCust = connection.prepareStatement(queryCust);
	pstmtCust.setString(1, 'DSTB'); //records.CUST_TYPE
	pstmtCust.setString(2, sapId);
	pstmtCust.setString(3, records.DBR_FORM_ID);
	pstmtCust.setString(4, records.FIRM_NAME);
	pstmtCust.setString(5, ''); //PARENT_CUST_CODE
	pstmtCust.setString(6, ''); //PARENT_CUST_NAME
	pstmtCust.setString(7, records.FIRM_NAME);
	pstmtCust.setString(8, records.NATURE);
	pstmtCust.setString(9, records.EMAIL_ID);
	pstmtCust.setString(10, records.REGION);
	pstmtCust.setString(11, records.REMARKS);
	pstmtCust.setString(12, records.PREMISES_NATURE);
	pstmtCust.setString(13, records.PREMISES_NO);
	pstmtCust.setString(14, records.LOCALITY);
	pstmtCust.setString(15, records.TOWN_VILL);
	pstmtCust.setString(16, records.CITY_DISTRICT);
	pstmtCust.setString(17, records.STATE);
	pstmtCust.setString(18, records.POSTAL_CODE);
	pstmtCust.setString(19, records.OFFICE_SPACE);
	pstmtCust.setString(20, records.WAREHOUSE_SPACE);
	pstmtCust.setString(21, records.COMPANY_PROFILE);
	pstmtCust.setString(22, records.OWNERSHIP_SINCE);
	pstmtCust.setString(23, records.CURRENT_INVESTMENT);
	pstmtCust.setString(24, records.BANK_LOAN);
	pstmtCust.setString(25, records.BANK_LIMIT);
	pstmtCust.setString(26, records.BANK_NAME);
	pstmtCust.setString(27, records.CURRENT_ACCOUNT_NUMBER);
	pstmtCust.setString(28, records.STATUS);
	pstmtCust.setString(29, records.SOFT_DEL);
	pstmtCust.setString(30, records.CREATE_BY);
	pstmtCust.setString(31, ''); //records.RETAILER_TYPE
	pstmtCust.setString(32, ''); //records.RETAILER_WEEKLY_DAY_OFF
	pstmtCust.setString(33, ''); //records.RETAILER_SHOP_SIZE
	pstmtCust.setString(34, ''); //records.RETAILER_TOWN_TIER
	pstmtCust.setString(35, ''); //records.RETAILER_XIAOMI_PREF_PARTNER
	pstmtCust.setString(36, ''); //records.RETAILER_MOTO_PREF_PARTNER
	pstmtCust.setString(37, ''); //records.RETAILER_OTHER_PREF
	var rsCust = pstmtCust.executeUpdate();
	connection.commit();
	if (rsCust > 0) {
		record.status = '0';
		record.messageFos = 'Successfully Insert';
	} else {
		record.status = '1';
		record.messageFos = 'failed to insert customer';
	}
	connection.close();
}

function updateSAPID() {
	var Output = {
		results: []
	};
	var record = {};
	var sapId = $.request.parameters.get('SAP_ID');
	var userId = $.request.parameters.get('User_Code');
	try {
		updateDirectorSapId(sapId, userId, record);
		updateBussProfileSapId(sapId, userId, record);
		updateCustLegalSapId(sapId, userId, record);
		updateFosSapId(sapId, userId, record);
		updateCustomerData(sapId, userId, record);
		Output.results.push(record);
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

	case "getPendDBRRequest":
		getPendDBRRequest();
		break;

	case "dbrFormApprove":
		dbrFormApprove();
		break;

	case "getApprovedDBR":
		getApprovedDBR();
		break;

	case "getRejectDBRRequest":
		getRejectDBRRequest();
		break;

	case "dbrFormReject":
		dbrFormReject();
		break;

	case "getDBRForm":
		getDBRForm();
		break;

	case "addStateHeadLoginApproval":
		addStateHeadLoginApproval();
		break;
	case "updateSAPID":
		updateSAPID();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}