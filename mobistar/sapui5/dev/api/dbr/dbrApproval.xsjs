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
	//var date = record.CREATE_DATE;
	var date = record.STATUS_DATE;
	if (date) {
		record.STATUS_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.STATUS_DATE;
	}
}

/**
To fetch all areas.
 * @Param {string} areaCode .
 * @Param [] output .
 * @return {String} array  .
 * @author - shriyansi.
 */
function getAreaDetails(areaCode, output) {
	var arearecord = {};
	var recordZone;
	var zoneArray = [];
	var recordBranch;
	var branchArray = [];
	try {
		var connection = $.db.getConnection();
		var CallArea = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Area_CRUD"(?,?,?,?);';
		var pstmtCallArea = connection.prepareCall(CallArea);
		pstmtCallArea.setString(1, areaCode);
		pstmtCallArea.setString(2, ' ');
		pstmtCallArea.setString(3, ' ');
		pstmtCallArea.setString(4, 'FINANCEAREAINFO');
		pstmtCallArea.execute();
		var rsCallArea = pstmtCallArea.getResultSet();
		connection.commit();
		while (rsCallArea.next()) {
			arearecord = {};
			arearecord.COUNTRY = rsCallArea.getString(10);
			arearecord.COUNTRYCODE = rsCallArea.getString(9);
			arearecord.REGION = rsCallArea.getString(8);
			arearecord.REGIONCODE = rsCallArea.getString(7);
			arearecord.STATE = rsCallArea.getString(6);
			arearecord.STATECODE = rsCallArea.getString(5);
			arearecord.DISTRICT = rsCallArea.getString(4);
			arearecord.DISTRICCODE = rsCallArea.getString(3);
			arearecord.AREACODE = rsCallArea.getString(1);
			arearecord.AREADESC = rsCallArea.getString(2);
			arearecord.AREANAME = rsCallArea.getString(11);

		}

		/*var CallProZONE = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Area_CRUD"(?,?,?,?)';
		var pstmtCallProZONE = connection.prepareCall(CallProZONE);
		pstmtCallProZONE.setString(1, record.AREACODE);
		pstmtCallProZONE.setString(2, 'null');
		pstmtCallProZONE.setString(3, 'null');
		pstmtCallProZONE.setString(4, 'AREAZONE');
		pstmtCallProZONE.execute();
		var rsCallProZONE = pstmtCallProZONE.getResultSet();
		connection.commit();
		while (rsCallProZONE.next()) {
			recordZone = {};
			recordZone.ZONECODE = rsCallProZONE.getString(1);
			recordZone.ZONENAME = rsCallProZONE.getString(2);

			var CallProBRANCH = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Area_CRUD"(?,?,?,?)';
			var pstmtCallProBRANCH = connection.prepareCall(CallProBRANCH);
			pstmtCallProBRANCH.setString(1, recordZone.ZONECODE);
			pstmtCallProBRANCH.setString(2, 'null');
			pstmtCallProBRANCH.setString(3, 'null');
			pstmtCallProBRANCH.setString(4, 'AREABRANCH');
			pstmtCallProBRANCH.execute();
			var rsCallProBRANCH = pstmtCallProBRANCH.getResultSet();
			connection.commit();
			while (rsCallProBRANCH.next()) {
				recordBranch = {};
				recordBranch.BRANCHCODE = rsCallProBRANCH.getString(1);
				recordBranch.BRANCHNAME = rsCallProBRANCH.getString(2);
				branchArray.push(recordBranch);
				recordZone.BRANCH = branchArray;
			}

			zoneArray.push(recordZone);
			record.ZONE = zoneArray;
		}*/
		output.results.push(arearecord);
		connection.close();
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
}

function emailQueryDBR(apprecord) {
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

function addCustRemarks(status, userCode, remarks, formId, connection, record) {

	var qryaddCustRemarks = 'INSERT INTO "MDB_DEV"."REMARKS_HISTORY" (DBR_FORM_ID,APPROVAL_ID,REMARKS, STATUS) VALUES (?,?,?,?)';
	var pstmtaddCustRemarks = connection.prepareStatement(qryaddCustRemarks);
	pstmtaddCustRemarks.setString(1, formId);
	pstmtaddCustRemarks.setString(2, userCode);
	pstmtaddCustRemarks.setString(3, remarks);
	pstmtaddCustRemarks.setString(4, status);

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
/*CHANGES MADE BY SATISH AFTER CHANGE OF POSITION*/
function getParentEmp(userCode, connection, record) {
	var querygetParentEmp;
	var pstmtgetParentEmp;
	var query;
	try {

		querygetParentEmp =
			'select m.POSITION_VALUE_ID,p.POSITION_NAME,m.role_position_id from "MDB_DEV"."MST_EMPLOYEE" as m inner join "MDB_DEV"."MAP_ROLE_POSITION" as mp ' +
			' on m.ROLE_POSITION_ID = mp.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."POSITION_HIERARCHY" as h on h.POSITION_ID = mp.POSITION_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as p on p.POSITION_ID = h.PARENT_POSITION_ID ' +
			' where m.EMPLOYEE_CODE=? AND m.SOFT_DEL=0 AND mp.SOFT_DEL=0 AND h.SOFT_DEL=0 AND p.SOFT_DEL=0';

		pstmtgetParentEmp = connection.prepareStatement(querygetParentEmp);
		pstmtgetParentEmp.setString(1, userCode);

		var rsgetParentEmp = pstmtgetParentEmp.executeQuery();

		while (rsgetParentEmp.next()) {
			record.PositionValue = rsgetParentEmp.getString(1);
			record.ParentPosition = rsgetParentEmp.getString(2);
			record.RolePositionId = rsgetParentEmp.getString(3);

		}
		switch (record.ParentPosition) {
			case "BRANCH":
				query = 'Select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "REGION":
				//query = ' Select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
				query = ' Select D.REGIONAL_CODE from "MDB_DEV"."MST_DISTRICT" AS D  where D.DISTRICT_CODE = ? ';
				break;
			case "ZONE":
				//	query = ' Select REGION_CODE from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
				query = ' Select ZONE_CODE from "MDB_DEV"."MST_REGIONAL" where REGIONAL_CODE = ? ';
				break;
			case "COUNTRY":
				var querygetConditionalRolePositionID = 'select VALUE from "MDB_DEV"."APPLICATION_PARAMETER" WHERE NAME=?';
				var pstmtgetConditionalRolePositionID = connection.prepareStatement(querygetConditionalRolePositionID);
				pstmtgetConditionalRolePositionID.setString(1, 'CONDITIONAL_ROLE_POSITION_ID');
				var rsgetConditionalRolePositionID = pstmtgetConditionalRolePositionID.executeQuery();
				while (rsgetConditionalRolePositionID.next()) {
					record.ConditionalRolePositionID = rsgetConditionalRolePositionID.getString(1);
				}
				if (record.RolePositionId === record.ConditionalRolePositionID) {
					query = ' Select ZONE_CODE from "MDB_DEV"."MST_REGIONAL" where ZONE_CODE = ? ';
				} else {
					query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				}
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
			var qryParentRolePositionHie =
				'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=' +
				'(Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE =? )' +
				+' AND ROLE_POSITION_ID=( ' +
				'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
				' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
			var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
			pstmtParentRolePositionHie.setString(1, record.PositionValue);
			pstmtParentRolePositionHie.setString(2, userCode);
			var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
			while (rsParentRolePositionHie.next()) {
				record.ParentEmpCode = rsParentRolePositionHie.getString(1);
				record.ParentEmpName = rsParentRolePositionHie.getString(2);
				record.ParentEmpEmail = rsParentRolePositionHie.getString(3);

			}
		} else {
			var qryParentEmpInfo = 'select  EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=?';

			var pstmtParentEmpInfo = connection.prepareStatement(qryParentEmpInfo);
			pstmtParentEmpInfo.setString(1, record.ParentPositionValue);

			var rsParentEmpInfo = pstmtParentEmpInfo.executeQuery();
			connection.commit();
			var countdata = 0;

			while (rsParentEmpInfo.next()) {
				++countdata;
				record.ParentEmpCode = rsParentEmpInfo.getString(1);
				record.ParentEmpName = rsParentEmpInfo.getString(2);
				record.ParentEmpEmail = rsParentEmpInfo.getString(3);
			}

			if (countdata > 1) {
				var qryParentRolePositionHie =
					'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
					'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
					' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
				var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
				pstmtParentRolePositionHie.setString(1, record.ParentPositionValue);
				pstmtParentRolePositionHie.setString(2, userCode);
				var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
				while (rsParentRolePositionHie.next()) {
					record.ParentEmpCode = rsParentRolePositionHie.getString(1);
					record.ParentEmpName = rsParentRolePositionHie.getString(2);
					record.ParentEmpEmail = rsParentRolePositionHie.getString(3);
				}

			}
		}

	} catch (e) {

		return;
	}

}

function addNextLevelCustApproval(formIdObj, connection, record, userCode) {

	//getParentEmp(userCode, connection, record);

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
		' Select CAPP.CUSTOMER_APPROVAL_ID,CAPP.DBR_FORM_ID,CAPP.APPROVAL_TYPE,CAPP.APPROVAL_NAME,CAPP.STATUS,CAPP.STATUS_DATE, ' +
			' CAPP.APPROVAL_ID,CAPP.SAPUSER_ID,CAPP.APPROVAL_LEVEL,CAPP.REMARKS,DBRP.FIRM_NAME,DBRP.EMAIL_ID,DBRP.CITY_DISTRICT, ' +
			' DBRP.STATE,DBRP.CREATE_DATE,DBRP.PARENT_CODE,DBRP.LOCALITY,DBRP.POSTAL_CODE,DBRP.OFFICE_SPACE,DBRP.PREMISES_NO,DBRP.TOWN_VILL,DBRP.WAREHOUSE_SPACE                 ' +
			' from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
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
			record.FIRM_NAME = rsGetPendingDBR.getString(11);
			record.EMAIL_ID = rsGetPendingDBR.getString(12);
			record.CITY_DISTRICT = rsGetPendingDBR.getString(13);
			record.STATE = rsGetPendingDBR.getString(14);
			record.CREATE_DATE = rsGetPendingDBR.getString(15);
			record.PARENT_CODE = rsGetPendingDBR.getString(16);
			record.LOCALITY = rsGetPendingDBR.getString(17);
			record.POSTAL_CODE = rsGetPendingDBR.getString(18);
			record.OFFICE_SPACE = rsGetPendingDBR.getString(19);
			record.PREMISES_NO = rsGetPendingDBR.getString(20);
			record.TOWN_VILL = rsGetPendingDBR.getString(21);
			record.WAREHOUSE_SPACE = rsGetPendingDBR.getString(22);

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

function emailContentForNextApprover(apprecord, record) {

	apprecord.EmailContent = "<h3> Hello " + record.ParentEmpName + "</h3>" + "<p> Kindly Approve the DBR Form ID " + apprecord.DBR_FORM_ID +
		".</p></br><Table>" + "<tr>" + "<td>Name of Distributor : " + apprecord.FIRM_NAME + "</td></tr>" + "<tr>" + "</Table></br>" +
		"<p>Thanks & Regards,</p>" + "<p>" + apprecord.APPROVAL_NAME + "</p>";

	return apprecord;
}

function emailDBRForNextApprover(apprecord, record) {
	emailContentForNextApprover(apprecord, record);
	try {
		var mail = new $.net.Mail({
			sender: {
				address: apprecord.AppMailId
			},
			to: [{
				address: record.ParentEmpEmail
			}],
			subject: "DBR Form ID " + apprecord.DBR_FORM_ID + " form approval request",
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

function getEmployeeEmailId(apprecord) {
	var connection = $.db.getConnection();
	var queryEmpEmail = 'select EMAIL,EMPLOYEE_NAME from "MDB_DEV"."MST_EMPLOYEE" where EMPLOYEE_CODE = ?';
	var pstmtEmpEmail = connection.prepareStatement(queryEmpEmail);
	pstmtEmpEmail.setString(1, apprecord.APPROVAL_CODE);
	var rsEmpEmail = pstmtEmpEmail.executeQuery();
	connection.commit();
	if (rsEmpEmail.next()) {
		apprecord.AppMailId = rsEmpEmail.getString(1);
		apprecord.APPROVAL_NAME = rsEmpEmail.getString(2);
	}
	connection.close();
	return apprecord;
}

function emailContentForNextApproverForFinance(apprecord) {

	apprecord.EmailContent = "<h2> Dear M/s " + apprecord.FIRM_NAME + "</h2>" +
		"<p> We are pleased to welcome you to the Mobiistar family as our esteemed Distributor Partner." +
		" We hope to make this association a long and fruitful one with both of us giving our best to create" +
		" new benchmarks in your assigned distribution territory.</p></br><h3> An Overview </h3>" +
		"<p> Mobiistar, a Vietnamese smartphone brand was founded by Mr. Carl Ngo in 2009 with a vision" +
		" to ‘Enjoy More’ by bringing uncompromised user experience. Mobiistar established itself as a leading" +
		" brand in Vietnam and recently expanded to South East Asia and GCC countries. </p></br>" +
		"<h4> What makes us different? </h4> " +
		"<p> Mobiistar believes that consumers should not compromise in accessing technology and" +
		" should definitely be offered more for less. The mission of Mobiistar is to expand the horizons" +
		" of mobile technology adoption by providing affordable and uncompromised user experience for " +
		"our end consumers.</p></br><h4> Shared below are important details for your reference: </h4> </br>" +
		"<Table><tr><td>Name of Distributor : " + apprecord.FIRM_NAME + "</td></tr>" +
		"<tr><td> Account No's: " + apprecord.ACCOUNT_NO + "</td></tr><tr>" +
		"<td> Bank Name: " + apprecord.BANK_NAME + "</td></tr>" +
		"<tr><td> IFSC Code: " + apprecord.IFSC_CODE + "</td></tr>" +
		"<tr><td> Sales Manager: " + apprecord.SMNAME + "</td></tr>" +
		"<tr><td> Contact No.: " + apprecord.SMPHONE_NO + "</td></tr>" +
		"<tr><td> Branch Manager: " + apprecord.BRANCHHEADNAME + "</td></tr>" +
		"<tr><td> Contact No.: " + apprecord.BRANCHPHONE + "</td></tr>" +
		"<tr><td> Regional Sales Manager: " + apprecord.REGIONALSALESMANAGERNAME + "</td></tr>" +
		"<tr><td> Contact No.: " + apprecord.REGIONALSALESMANAGERPHONE + "</td></tr>" +
		"<tr><td> Head of sales: " + apprecord.HEADOFSALESNAME + "</td></tr>" +
		"<tr><td> Contact No.: " + apprecord.HEADOFSALESPHONE + "</td></tr>" +
		"</Table></br><p>Thanks & Regards,</p>" + "<p>" + apprecord.APPROVAL_NAME + "</p>";

	return apprecord;
}

function getempApprovalDetails(roleName, positionValueId, connection, emprecord) {
	var queryempdetails =
		'select e.phone_number ,e.employee_name ,e.employee_code from "MDB_DEV"."MST_EMPLOYEE" as e where e.position_value_id=? ';
	var pstmtempdetails = connection.prepareStatement(queryempdetails);
	pstmtempdetails.setString(1, positionValueId);
	var rsempdetails = pstmtempdetails.executeQuery();
	connection.commit();
	//var apprecord = {};
	var count = 0;
	while (rsempdetails.next()) {
		++count;
		emprecord.EMP_PHONE = rsempdetails.getString(1);
		emprecord.EMP_NAME = rsempdetails.getString(2);
		emprecord.EMP_CODE = rsempdetails.getString(3);
	}
	if (count > 1) {
		var queryCount =
			'select e.phone_number ,e.employee_name , e.employee_code from "MDB_DEV"."MST_EMPLOYEE" as e  where e.position_value_id=?' +
			' AND e.ROLE_POSITION_ID=(SELECT ROLE_POS_ID FROM "MDB_DEV"."MAP_ROLE_POSITION" AS MRP INNER JOIN ' +
			' "MDB_DEV"."MST_ROLE" AS MR ON MRP.ROLE_ID=MR.ROLE_ID  WHERE MR.ROLE_NAME=?)';
		var pstmtCount = connection.prepareStatement(queryCount);
		pstmtCount.setString(1, positionValueId);
		pstmtCount.setString(2, roleName);

		var rsCount = pstmtCount.executeQuery();
		connection.commit();
		while (rsCount.next()) {

			emprecord.EMP_PHONE = rsCount.getString(1);
			emprecord.EMP_NAME = rsCount.getString(2);
			emprecord.EMP_CODE = rsCount.getString(3);
		}

	}
	//return record;
}

function getEmpDetails(formIdObj, connection, userCode, record, apprecord) {
	var output = {
		results: []
	};
	var queryDSTBRegs = ' select e.phone_number ,e.employee_name ,e.employee_code , e.role_position_id, e.position_value_id ,c.ifsc_code ' +
		'from "MDB_DEV"."DBR_PROFILE" as d inner join "MDB_DEV"."MST_EMPLOYEE" as e on  d.create_by = e.employee_code ' +
		' inner join "MDB_DEV"."CUSTOMER_LEGAL_INFO" as c on d.dbr_form_id = c.dbr_form_id  ' +
		' where  d.dbr_form_id =? and c.ifsc_code !=\'\' and c.ifsc_code !=\'undefined\' ';
	//select e.phone_number ,e.employee_name ,e.employee_code , e.role_position_id, e.position_value_id from "MDB_DEV"."DBR_PROFILE" as d inner join "MDB_DEV"."MST_EMPLOYEE" as e on d.create_by = e.employee_code where  d.dbr_form_id =?';
	var pstmtDSTBRegs = connection.prepareStatement(queryDSTBRegs);
	pstmtDSTBRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsDSTBRegs = pstmtDSTBRegs.executeQuery();
	connection.commit();

	//	var apprecord = {};
	apprecord.DBR_FORM_ID = formIdObj.DBR_FORM_ID;
	while (rsDSTBRegs.next()) {
		apprecord.SMPHONE_NO = rsDSTBRegs.getString(1);
		apprecord.SMNAME = rsDSTBRegs.getString(2);
		apprecord.SMCODE = rsDSTBRegs.getString(3);
		apprecord.SMROLE_POS = rsDSTBRegs.getString(4);
		apprecord.SMPOS_VALUE = rsDSTBRegs.getString(5);
		apprecord.IFSC_CODE = rsDSTBRegs.getString(6);
	}
	getAreaDetails(apprecord.SMPOS_VALUE, output);
	apprecord.BRANCH_POS_VALUE_NAME = output.results[0].DISTRICT;
	apprecord.BRANCH_POS_VALUE_CODE = output.results[0].DISTRICCODE;
	apprecord.REGION_POS_VALUE_NAME = output.results[0].STATE;
	apprecord.REGION_POS_VALUE_CODE = output.results[0].STATECODE;
	apprecord.ZONE_POS_VALUE_NAME = output.results[0].REGION;
	apprecord.ZONE_POS_VALUE_CODE = output.results[0].REGIONCODE;
	apprecord.COUNTRY_POS_VALUE_NAME = output.results[0].COUNTRY;
	apprecord.COUNTRY_POS_VALUE_CODE = output.results[0].COUNTRYCODE;
	var emprecord = {};
	getempApprovalDetails("BRANCHHEAD", apprecord.BRANCH_POS_VALUE_CODE, connection, emprecord);
	apprecord.BRANCHHEADNAME = emprecord.EMP_NAME;
	apprecord.BRANCHPHONE = emprecord.EMP_PHONE;
	apprecord.BRANCHCODE = emprecord.EMP_CODE;
	emprecord = {};
	getempApprovalDetails("REGIONALSALESMANAGER", apprecord.REGION_POS_VALUE_CODE, connection, emprecord);
	apprecord.REGIONALSALESMANAGERNAME = emprecord.EMP_NAME;
	apprecord.REGIONALSALESMANAGERPHONE = emprecord.EMP_PHONE;
	apprecord.REGIONALSALESMANAGERCODE = emprecord.EMP_CODE;
	emprecord = {};
	getempApprovalDetails("S&DCOORDINATOR", apprecord.ZONE_POS_VALUE_CODE, connection, emprecord);
	apprecord.SDCOORDINATORNAME = emprecord.EMP_NAME;
	apprecord.SDCOORDINATORPHONE = emprecord.EMP_PHONE;
	apprecord.SDCOORDINATORCODE = emprecord.EMP_CODE;
	emprecord = {};
	getempApprovalDetails("HEADOFSALES", apprecord.COUNTRY_POS_VALUE_CODE, connection, emprecord);
	apprecord.HEADOFSALESNAME = emprecord.EMP_NAME;
	apprecord.HEADOFSALESPHONE = emprecord.EMP_PHONE;
	apprecord.HEADOFSALESCODE = emprecord.EMP_CODE;

}

function getDBRRegistration(formIdObj, connection, userCode, record) {

	var queryDSTBRegs = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
	var pstmtDSTBRegs = connection.prepareStatement(queryDSTBRegs);
	pstmtDSTBRegs.setString(1, formIdObj.DBR_FORM_ID);
	var rsDSTBRegs = pstmtDSTBRegs.executeQuery();
	connection.commit();

	var apprecord = {};
	apprecord.DBR_FORM_ID = formIdObj.DBR_FORM_ID;
	while (rsDSTBRegs.next()) {
		apprecord.EMAIL_ID = rsDSTBRegs.getString(1);
		apprecord.FIRM_NAME = rsDSTBRegs.getString(2);
	}

	apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
	apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
	apprecord.APPROVAL_CODE = userCode;
	apprecord.ACCOUNT_NO = formIdObj.CURRENT_ACCOUNT_NUMBER;
	apprecord.BANK_NAME = formIdObj.BANK_NAME;
	//getEmpDetails(formIdObj, connection, userCode, record, apprecord);
	getEmployeeEmailId(apprecord);
	if (formIdObj.APPROVAL_TYPE.toUpperCase() === "FINANCE") {
		getEmpDetails(formIdObj, connection, userCode, record, apprecord);
		emailContentForNextApproverForFinance(apprecord, record);
		emailQueryDBR(apprecord);
	} else {

		//emailDBR(apprecord);
		emailDBRForNextApprover(apprecord, record);
	}
}

function  getNextApprovalDetail(userCode,connection,record){
    var qryNextRolePositionId = 'select tbl.PARENT_ID,tbl.ROLE_POSITION_ID,MRP.POSITION_ID,P.POSITION_NAME from ' +
                                  ' (select PARENT_ID,ROLE_POSITION_ID from "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" where ROLE_POSITION_ID=(select PARENT_ID ' +
                                  ' from "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" where ROLE_POSITION_ID=?))tbl join "MDB_DEV"."MAP_ROLE_POSITION" as MRP ' +
                                  ' on MRP.ROLE_POS_ID=tbl.PARENT_ID join "MDB_DEV"."MST_POSITION" AS P on MRP.POSITION_ID=P.POSITION_ID';
    var pstmtNextRolePositionId = connection.prepareStatement(qryNextRolePositionId);
	pstmtNextRolePositionId.setString(1, record.RolePositionId);
	var rsNextRolePositionId = pstmtNextRolePositionId.executeQuery();
	connection.commit();
	while(rsNextRolePositionId.next()){
	    record.NextParentRolePositionId = rsNextRolePositionId.getString(1);
	    record.ParentRolePositionId = rsNextRolePositionId.getString(2);
	    record.NextParentPositionId     = rsNextRolePositionId.getString(3); 
	    record.NextParentPositionName   = rsNextRolePositionId.getString(4); 
	}
	
	var query = "",zone="";
	switch (record.NextParentPositionName){
			case "REGION":
				query = ' Select D.REGIONAL_CODE from "MDB_DEV"."MST_DISTRICT" AS D  where D.DISTRICT_CODE = ? ';
				break;
			case "ZONE":
			    zone = "zone";
				query = ' Select ZONE_CODE from "MDB_DEV"."MST_REGIONAL" where REGIONAL_CODE = ? ';
				break;
			case "COUNTRY":
				query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				break;

			default:
				return;
		}
	 var pstmt = connection.prepareStatement(query);
	 pstmt.setString(1, record.ParentPositionValue);
	var rs = pstmt.executeQuery();
	connection.commit();
	while(rs.next()){
	    record.ParentPositionValue = rs.getString(1);
	}
	var qryFindEmp = '';
	if(zone === "zone"){
	     qryFindEmp = 'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL  from "MDB_DEV"."MST_EMPLOYEE" where position_value_id=? and role_position_id=?';
	     var pstmtFindEmp = connection.prepareStatement(qryFindEmp);
	     pstmtFindEmp.setString(1, record.ParentPositionValue);
	     pstmtFindEmp.setString(2, "21");
    	var rsFindEmp = pstmtFindEmp.executeQuery();
	connection.commit();
	if(rsFindEmp.next()){
	    record.ParentEmpCode = rsFindEmp.getString(1);
	    record.ParentEmpName = rsFindEmp.getString(2);
	    record.ParentEmpEmail     = rsFindEmp.getString(3); 
	    return;
	}else{
	    qryFindEmp = 'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL  from "MDB_DEV"."MST_EMPLOYEE" where position_value_id=? and role_position_id=?';
	     var pstmtHSFindEmp = connection.prepareStatement(qryFindEmp);
	     pstmtHSFindEmp.setString(1, record.ParentPositionValue);
	     pstmtHSFindEmp.setString(2, "22");
    	var rsHSFindEmp = pstmtHSFindEmp.executeQuery();
	connection.commit();
	if(rsHSFindEmp.next()){
	    record.ParentEmpCode = rsHSFindEmp.getString(1);
	    record.ParentEmpName = rsHSFindEmp.getString(2);
	    record.ParentEmpEmail     = rsHSFindEmp.getString(3); 
	    return;
	    
	}else{
	    record.RolePositionId = record.ParentRolePositionId;
	    getNextApprovalDetail(userCode,connection,record);
	}
	}
	}
	else{
	     qryFindEmp = 'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL  from "MDB_DEV"."MST_EMPLOYEE" where position_value_id=?';
	     var pstmtEmpFindEmp = connection.prepareStatement(qryFindEmp);
	     pstmtEmpFindEmp.setString(1, record.ParentPositionValue);
    	var rsEmpFindEmp = pstmtEmpFindEmp.executeQuery();
	connection.commit();
	if(rsEmpFindEmp.next()){
	    record.ParentEmpCode = rsEmpFindEmp.getString(1);
	    record.ParentEmpName = rsEmpFindEmp.getString(2);
	    record.ParentEmpEmail     = rsEmpFindEmp.getString(3); 
	    return;
	}else{
	    record.RolePositionId = record.ParentRolePositionId;
	    getNextApprovalDetail(userCode,connection,record);
	}
	}
}
function testNextApproval(){
    	var userCode = $.request.parameters.get('userCode');
    	var record = $.request.parameters.get('record');
	var connection = $.db.getConnection();
record = 	JSON.parse(record.replace(/\\r/g, ""));
	getNextApprovalDetail(userCode,connection,record);
}
function dbrFormApprovalProcessModification(formIdObj, userCode, remarks, connection, Output) {
	try {
		var pstmtUpdDBRForm;
		var qryUpdDBRForm;

		var record = {};
		record.ParentEmpCode = "";
		getParentEmp(userCode, connection, record);
		var approveStatus = '3';
		
		if ((record.ParentEmpCode === undefined || record.ParentEmpCode === null || record.ParentEmpCode === "" ) &&
		((formIdObj.APPROVAL_TYPE).toUpperCase() !== "FINANCE")) {
		    getNextApprovalDetail(userCode,connection,record);
		}
		
			qryUpdDBRForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=?,APPROVAL_TYPE=? WHERE DBR_FORM_ID=? and APPROVAL_ID=?';

			pstmtUpdDBRForm = connection.prepareStatement(qryUpdDBRForm);
			pstmtUpdDBRForm.setString(1, approveStatus);
			pstmtUpdDBRForm.setString(2, formIdObj.APPROVAL_TYPE);
			pstmtUpdDBRForm.setString(3, formIdObj.DBR_FORM_ID);
			pstmtUpdDBRForm.setString(4, formIdObj.APPROVAL_ID);

			var rsUpdDBRForm = pstmtUpdDBRForm.executeUpdate();
			connection.commit();

			if (rsUpdDBRForm > 0) {

				addCustRemarks(approveStatus, userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
				if ((formIdObj.APPROVAL_TYPE).toUpperCase() !== "FINANCE") {
					addNextLevelCustApproval(formIdObj, connection, record, userCode);
				}
				getDBRRegistration(formIdObj, connection, userCode, record);

				record.status = 0;
				record.message = 'Successfully Approved the selected form';
				Output.results.push(record);

			} else {
				record.status = 1;
				record.message = 'There is some issue.Kindly contact Admin!!!';
				Output.results.push(record);

			}
		/*} else {
			record.status = 1;
			record.message = 'Please assign next approver first!!!';
			Output.results.push(record);
		}*/

	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
}

function dbrFormApprovalProcess(formIdObj, userCode, remarks, connection, Output) {
	try {
		var pstmtUpdDBRForm;
		var qryUpdDBRForm;

		var record = {};
		record.ParentEmpCode = "";
		getParentEmp(userCode, connection, record);
		var approveStatus = '3';
		//if ((record.ParentEmpCode !== "" && record.ParentEmpCode !== null) || ((formIdObj.APPROVAL_TYPE).toUpperCase() === "FINANCE")) {
		if ((record.ParentEmpCode === undefined || record.ParentEmpCode === null || record.ParentEmpCode === "" ) &&
		((formIdObj.APPROVAL_TYPE).toUpperCase() !== "FINANCE")) {
		    getNextApprovalDetail(userCode,connection,record);
		}
		
			qryUpdDBRForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=?,APPROVAL_TYPE=? WHERE DBR_FORM_ID=? and APPROVAL_ID=?';

			pstmtUpdDBRForm = connection.prepareStatement(qryUpdDBRForm);
			pstmtUpdDBRForm.setString(1, approveStatus);
			pstmtUpdDBRForm.setString(2, formIdObj.APPROVAL_TYPE);
			pstmtUpdDBRForm.setString(3, formIdObj.DBR_FORM_ID);
			pstmtUpdDBRForm.setString(4, formIdObj.APPROVAL_ID);

			var rsUpdDBRForm = pstmtUpdDBRForm.executeUpdate();
			connection.commit();

			if (rsUpdDBRForm > 0) {

				addCustRemarks(approveStatus, userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
				if ((formIdObj.APPROVAL_TYPE).toUpperCase() !== "FINANCE") {
					addNextLevelCustApproval(formIdObj, connection, record, userCode);
				}
				getDBRRegistration(formIdObj, connection, userCode, record);

				record.status = 0;
				record.message = 'Successfully Approved the selected form';
				Output.results.push(record);

			} else {
				record.status = 1;
				record.message = 'There is some issue.Kindly contact Admin!!!';
				Output.results.push(record);

			}
		/*} else {
			record.status = 1;
			record.message = 'Please assign next approver first!!!';
			Output.results.push(record);
		}*/

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
		formIdObj.APPROVAL_ID = userCode;
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
			record.message = "Record Successfully inserted";
		} else {
			record.status = 0;
			record.message = "Record not insert";
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
			dbrFormApprovalProcess(StateformIdObj, StateformIdObj.APPROVAL_ID, StateformIdObj.REMARKS, connection, Output);

			if (Output.results[0].ParentEmpCode !== "" && Output.results[0].ParentEmpCode !== null) {

				var qryGetStateHead = 'select * from "MDB_DEV"."STATE_HEAD_APPROVAL" where DBR_FORM_ID=?';
				var paramGetStateHead = connection.prepareStatement(qryGetStateHead);
				paramGetStateHead.setString(1, StateformIdObj.DBR_FORM_ID);
				var rsGetStateHead = paramGetStateHead.executeQuery();
				if (rsGetStateHead.next()) {
					record.status = 0;
					record.message = "Record  Already  Exist into database";
				} else {
					var qryAddStateHead =
						/*'insert into  "MDB_DEV"."DBR_STATE_HEAD_INFO" ("DBR_FORM_ID","APPROVAL_ID","PLANNED_BUSINESS_VOLUME","PLANNED_BUSINESS_WOD","MARKET_REPUTATION","NO_OF_OUTLETSURVEYED","REPLACEMENT","OLD_DISTRIBUTOR_CODE","MARKET_TO_BE_COVERED","NO_OF_OUTLETS_TO_BE_COVERED","MANPOWER_DEPLOYMENT","INFRASTRUCTURE_REQUIRED","FINANCIAL_INVESTMENT","DOCUMENTATION_AND_FORMALITIES","CAPABILITY_OF_LONG_TERM_RELATIONSHIP","SYSTEMATIC_AND_OBJECTIVE_APPROACH","ENTREPRENEURIAL_SPIRIT","PEOPLE_MANAGEMENT_SKILLS","RELATIONSHIP_DEVELOPMANT_SKILLS","INITIAL_INVESTMENT_STOCK","MARKET_CREDIT","CLAIMS","1ST_QUARTER_ONLY","2ND_QUARTER_ONLY","3RD_QUARTER_ONLY","4TH_QUARTER_ONLY","OWN_FUNDS","BORROWED_FUNDS","TOTAL","OWN_TO_TOTAL","FEETS_ON_STREET","ACCOUNTS","LOGISTICS","BACK_END_SUPPORT") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';*/
						'insert into  "MDB_DEV"."STATE_HEAD_APPROVAL" ("DBR_FORM_ID","APPROVAL_ID","NAME_OF_PREMISES","LOCALITY","DISTRICT","POSTAL_CODE","OFFICE_SPACE","PREMISES_NO","VILLAGE","STATE","EMAIL_ID","WAREHOUSE_SPACE","PLANNED_BUSINESS_VOLUME","PLANNED_BUSINESS_WOD","MARKET_REPUTATION","NO_OF_OUTLETSURVEYED","REPLACEMENT","OLD_DISTRIBUTOR_CODE","MARKET_TO_BE_COVERED","NO_OF_OUTLETS_TO_BE_COVERED","MANPOWER_DEPLOYMENT","INFRASTRUCTURE_REQUIRED","FINANCIAL_INVESTMENT","DOCUMENTATION_AND_FORMALITIES","CAPABILITY_OF_LONG_TERM_RELATIONSHIP","SYSTEMATIC_AND_OBJECTIVE_APPROACH","ENTREPRENEURIAL_SPIRIT","PEOPLE_MANAGEMENT_SKILLS","RELATIONSHIP_DEVELOPMANT_SKILLS","INITIAL_INVESTMENT_STOCK","MARKET_CREDIT","CLAIMS","FIRST_QUARTER_ONLY","SECOND_QUARTER_ONLY","THIRD_QUARTER_ONLY","FORTH_QUARTER_ONLY","OWN_FUNDS","BORROWED_FUNDS","TOTAL","OWN_TO_TOTAL","FEETS_ON_STREET","ACCOUNTS","LOGISTICS","BACK_END_SUPPORT") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';

					//'insert into  "MDB_DEV"."STATE_HEAD_APPROVAL" ("DBR_FORM_ID","APPROVAL_ID","NAME_OF_PREMISES","LOCALITY","DISTRICT","POSTAL_CODE","OFFICE_SPACE","PREMISES_NO","VILLAGE","STATE","EMAIL_ID","WAREHOUSE_SPACE","PLANNED_BUSINESS_VOLUME","PLANNED_BUSINESS_WOD","MARKET_REPUTATION","NO_OF_OUTLETSURVEYED","REPLACEMENT","OLD_DISTRIBUTOR_CODE","MARKET_TO_BE_COVERED","NO_OF_OUTLETS_TO_BE_COVERED","MANPOWER_DEPLOYMENT","INFRASTRUCTURE_REQUIRED","FINANCIAL_INVESTMENT","DOCUMENTATION_AND_FORMALITIES","CAPABILITY_OF_LONG_TERM_RELATIONSHIP","SYSTEMATIC_AND_OBJECTIVE_APPROACH","ENTREPRENEURIAL_SPIRIT","PEOPLE_MANAGEMENT_SKILLS","RELATIONSHIP_DEVELOPMANT_SKILLS","INITIAL_INVESTMENT_STOCK","MARKET_CREDIT","CLAIMS","1ST_QUARTER_ONLY","2ND_QUARTER_ONLY","3RD_QUARTER_ONLY","4TH_QUARTER_ONLY","OWN_FUNDS","BORROWED_FUNDS","TOTAL","OWN_TO_TOTAL","FEETS_ON_STREET","ACCOUNTS","LOGISTICS","BACK_END_SUPPORT") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
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
						record.message = "Record Successfully inserted";
					} else {
						record.status = 0;
						record.message = "Record not insert";
					}

					var employeeListArray = StateformIdObj.employeeList;
					for (var k = 0; k < employeeListArray.length; k++) {
						var employeeListObj = employeeListArray[k];
						addStateHeadLoginMeeting(StateformIdObj, employeeListObj, connection, record);
					}
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

function getOnHoldDBR() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	var pstmtgetOnHoldDBR;
	var querygetOnHoldDBR;
	try {

		querygetOnHoldDBR =
		/*	' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';*/
		' Select CAPP.CUSTOMER_APPROVAL_ID,CAPP.DBR_FORM_ID,CAPP.APPROVAL_TYPE,CAPP.APPROVAL_NAME,CAPP.STATUS,CAPP.STATUS_DATE, ' +
			' CAPP.APPROVAL_ID,CAPP.SAPUSER_ID,CAPP.APPROVAL_LEVEL,CAPP.REMARKS,DBRP.FIRM_NAME,DBRP.EMAIL_ID,DBRP.CITY_DISTRICT,DBRP.STATE,DBRP.CREATE_DATE,DBRP.PARENT_CODE ' +
			' from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';
		pstmtgetOnHoldDBR = connection.prepareStatement(querygetOnHoldDBR);
		pstmtgetOnHoldDBR.setString(1, '4');
		pstmtgetOnHoldDBR.setString(2, userCode);

		var rsgetOnHoldDBR = pstmtgetOnHoldDBR.executeQuery();
		connection.commit();
		while (rsgetOnHoldDBR.next()) {
			var record = {};
			SN = SN + 1;
			record.CUSTOMER_APPROVAL_ID = rsgetOnHoldDBR.getString(1);
			record.DBR_FORM_ID = rsgetOnHoldDBR.getString(2);
			record.APPROVAL_TYPE = rsgetOnHoldDBR.getString(3);
			record.APPROVAL_NAME = rsgetOnHoldDBR.getString(4);
			record.STATUS = rsgetOnHoldDBR.getString(5);
			record.STATUS_DATE = rsgetOnHoldDBR.getString(6);
			record.APPROVAL_ID = rsgetOnHoldDBR.getString(7);
			record.SAPUSER_ID = rsgetOnHoldDBR.getString(8);
			record.APPROVAL_LEVEL = rsgetOnHoldDBR.getString(9);
			record.REMARKS = rsgetOnHoldDBR.getString(10);
			record.FIRM_NAME = rsgetOnHoldDBR.getString(11);
			record.EMAIL_ID = rsgetOnHoldDBR.getString(12);
			record.CITY_DISTRICT = rsgetOnHoldDBR.getString(13);
			record.STATE = rsgetOnHoldDBR.getString(14);
			record.CREATE_DATE = rsgetOnHoldDBR.getString(15);
			record.PARENT_CODE = rsgetOnHoldDBR.getString(16);

			/*	record.CUSTOMER_APPROVAL_ID = rsgetApproveDBR.getString(1);
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
			record.CREATE_DATE = rsgetApproveDBR.getString(37);*/

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
		/*	' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';*/
		' Select CAPP.CUSTOMER_APPROVAL_ID,CAPP.DBR_FORM_ID,CAPP.APPROVAL_TYPE,CAPP.APPROVAL_NAME,CAPP.STATUS,CAPP.STATUS_DATE, ' +
			' CAPP.APPROVAL_ID,CAPP.SAPUSER_ID,CAPP.APPROVAL_LEVEL,CAPP.REMARKS,DBRP.FIRM_NAME,DBRP.EMAIL_ID,DBRP.CITY_DISTRICT,DBRP.STATE,DBRP.CREATE_DATE,DBRP.PARENT_CODE ' +
			' from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
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
			record.FIRM_NAME = rsgetApproveDBR.getString(11);
			record.EMAIL_ID = rsgetApproveDBR.getString(12);
			record.CITY_DISTRICT = rsgetApproveDBR.getString(13);
			record.STATE = rsgetApproveDBR.getString(14);
			record.CREATE_DATE = rsgetApproveDBR.getString(15);
			record.PARENT_CODE = rsgetApproveDBR.getString(16);

			/*	record.CUSTOMER_APPROVAL_ID = rsgetApproveDBR.getString(1);
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
			record.CREATE_DATE = rsgetApproveDBR.getString(37);*/

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
		/*' Select * from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
			' where CAPP.STATUS=? and CAPP.APPROVAL_ID=? and DBRP.PARENT_CODE is null';*/
		' Select CAPP.CUSTOMER_APPROVAL_ID,CAPP.DBR_FORM_ID,CAPP.APPROVAL_TYPE,CAPP.APPROVAL_NAME,CAPP.STATUS,CAPP.STATUS_DATE, ' +
			' CAPP.APPROVAL_ID,CAPP.SAPUSER_ID,CAPP.APPROVAL_LEVEL,CAPP.REMARKS,DBRP.FIRM_NAME,DBRP.EMAIL_ID,DBRP.CITY_DISTRICT,DBRP.STATE,DBRP.CREATE_DATE,DBRP.PARENT_CODE ' +
			' from "MDB_DEV"."CUSTOMER_APPROVAL" as CAPP inner join "MDB_DEV"."DBR_PROFILE" as DBRP on CAPP.DBR_FORM_ID=DBRP.DBR_FORM_ID ' +
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
			record.FIRM_NAME = rsgetRejectDBR.getString(11);
			record.EMAIL_ID = rsgetRejectDBR.getString(12);
			record.CITY_DISTRICT = rsgetRejectDBR.getString(13);
			record.STATE = rsgetRejectDBR.getString(14);
			record.CREATE_DATE = rsgetRejectDBR.getString(15);
			record.PARENT_CODE = rsgetRejectDBR.getString(16);

			/*	record.CUSTOMER_APPROVAL_ID = rsgetRejectDBR.getString(1);
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
			record.CREATE_DATE = rsgetRejectDBR.getString(37);*/

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
		"</h3>" + "<p> Reason: -  " + apprecord.remarks +
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

function getRejectRegistration(formIdObj, connection, userCode, userType, remarks) {

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
	apprecord.remarks = remarks;

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
		record.message = 'Successfully Rejected the selected form';
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
		record.message = 'Successfully Rejected the selected form';
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
		var rejectStatus = '5';
		for (var i = 0; i < dbrFormIdArray.length; i++) {
			var formIdObj = dbrFormIdArray[i];
			var record = {};

			qryRejDBRForm = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=? WHERE DBR_FORM_ID=?';
			pstmtRejDBRForm = connection.prepareStatement(qryRejDBRForm);
			pstmtRejDBRForm.setString(1, rejectStatus);
			pstmtRejDBRForm.setString(2, formIdObj.DBR_FORM_ID);

			var rsRejDBRForm = pstmtRejDBRForm.executeUpdate();
			connection.commit();
			if (rsRejDBRForm > 0) {
				updDbrFormReject(userCode, formIdObj, connection, record);
				record.status = 0;
				record.message = 'Successfully Rejected the selected form';
				Output.results.push(record);
				getRejectRegistration(formIdObj, connection, userCode, userType, remarks);
				addCustRemarks(rejectStatus, userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
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
	var qryUpdDirc = 'update "MDB_DEV"."DIRECTOR_PROFILE" set DMS_CUST_CODE=? where DBR_FORM_ID=?';
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
	return;
}

function updateBussProfileSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdBussProfile = 'update "MDB_DEV"."DBR_BUSI_PROFILE" set DMS_CUST_CODE=? where DBR_FORM_ID=?';
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
	return;
}

function updateCustLegalSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdCustLegal = 'update "MDB_DEV"."CUSTOMER_LEGAL_INFO" set DMS_CUST_CODE=? where DBR_FORM_ID=?';
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
	return;
}

function updateFosSapId(sapId, userId, record) {
	var connection = $.db.getConnection();
	var qryUpdFos = 'update "MDB_DEV"."DBR_FOS_DETAILS" set DMS_CUST_CODE=? where DBR_FORM_ID=?';
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
	return;
}
function getStateCode(records){
    var connection = $.db.getConnection();
	var qry = 'select state_code,GST_CODE from "MDB_DEV"."STATESDATA" where state_name = ?';
	var pstmtUpdFos = connection.prepareStatement(qry);
	pstmtUpdFos.setString(1, records.STATE);
	var rsUpdFos = pstmtUpdFos.executeQuery();
	connection.commit();
	if (rsUpdFos.next()) {
		records.STATE_CODE = rsUpdFos.getString(1);
		records.GST_CODE = rsUpdFos.getString(2);
	} 
	connection.close();
	return;
}
function getDRBDetails(userId, records) {
	var connection = $.db.getConnection();
	var qrydbr = 'Select * from "MDB_DEV"."DBR_PROFILE" where DBR_FORM_ID=?';
	var pstmtdbr = connection.prepareStatement(qrydbr);
	pstmtdbr.setString(1, userId);
	var rgetdbr = pstmtdbr.executeQuery();
	connection.commit();
	if (rgetdbr.next()) {
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
		records.CUST_TYPE = rgetdbr.getString(37);
		records.SUB_AREA = rgetdbr.getString(39);
		records.SUB_URB = rgetdbr.getString(40);
		getStateCode(records);
	}
	connection.close();
	return records;
}

function updateSAP(sapId) {
	var connection = $.db.getConnection();
	var id = parseInt(sapId, 10);
	id = id + 1;
	var querySAPID = 'UPDATE "MDB_DEV"."APPLICATION_PARAMETER" SET value = ? WHERE name = ?';
	var pstmtUpdateSAPID = connection.prepareStatement(querySAPID);
	pstmtUpdateSAPID.setString(1, id.toString());
	pstmtUpdateSAPID.setString(2, 'SAPID');
	var rUpdateSAPID = pstmtUpdateSAPID.executeUpdate();
	connection.commit();
	if (rUpdateSAPID > 0) {}
	connection.close();
}

/*
 * To generate dmsCustCode.
 * input : user_code
 * output : a code
 * @author shriyansi
 * @updated by satish on 19th July 2018
 */

function updateSAPIDInCustomer(userId) {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var record = {};
	//var userCode = $.request.parameters.get('User_Code');
	try {
		var dmsCustCode = ""; //getSAPId(User_Code);
		var queryCustDetails =
		//	'select c.cust_type , s.STATE_code , c.FIRM_NAME from "MDB_DEV"."DBR_PROFILE" as c inner join "MDB_DEV"."STATESDATA" as s on s.state_name=c.state where DBR_FORM_ID=? ';
				'select c.cust_type , c.REGIONAL_CODE , c.FIRM_NAME from "MDB_DEV"."DBR_PROFILE" as c where c.DBR_FORM_ID=? ';
		var pstmtCustDetails = connection.prepareStatement(queryCustDetails);
		pstmtCustDetails.setString(1, userId);
		var rsCustDetails = pstmtCustDetails.executeQuery();
		connection.commit();
		while (rsCustDetails.next()) {
			//var record = {};
			record.CUST_TYPE = rsCustDetails.getString(1);
			record.REGIONALCode = rsCustDetails.getString(2);
			record.CUST_NAME = rsCustDetails.getString(3);
			record.CUST_NAME = record.CUST_NAME.replace(/\s/g, '');

		}
		record.CUST_NAME= record.CUST_NAME.replace(/[.*+?^${}(),:'"!@#%|[\]\\]/g, "");
		dmsCustCode = record.REGIONALCode.substring(0,2) + record.CUST_TYPE.substring(0, 1) + record.CUST_NAME.substring(0, 5);
		dmsCustCode = dmsCustCode.toUpperCase();
		var qryCountCust = "SELECT Count(DMS_CUST_CODE) FROM \"MDB_DEV\".\"MST_CUSTOMER\" WHERE DMS_CUST_CODE Like '" + dmsCustCode + "%'";
		var custNameCount = 0;
		var pstmtCountCust = connection.prepareStatement(qryCountCust);
		var rsCountCust = pstmtCountCust.executeQuery();
		connection.commit();
		while (rsCountCust.next()) {
			custNameCount = rsCountCust.getInteger(1);
		}
		if (record.CUST_TYPE === 'DSTB') {
			if (custNameCount <= 9) {
				dmsCustCode = dmsCustCode + "0" + (custNameCount + 1);
			} else {
				dmsCustCode = dmsCustCode + (custNameCount + 1);

			}
		} else if (record.CUST_TYPE === 'RETL') {
			if (custNameCount <= 9) {
				dmsCustCode = dmsCustCode + "000" + (custNameCount + 1);
			} else {
				dmsCustCode = dmsCustCode + "00" + (custNameCount + 1);

			}
		}
		Output.results.push(dmsCustCode);

		connection.close();
		return dmsCustCode;
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

function getParentSAPid(ParentCode, records) {
	var connection = $.db.getConnection();
	var qryGetCust = 'select SAPUSER_ID,CUST_NAME from "MDB_DEV"."MST_CUSTOMER" where DBR_FORM_ID=?';
	var pstmtGetCust = connection.prepareStatement(qryGetCust);
	pstmtGetCust.setString(1, ParentCode);
	//	pstmtGetCust.setString(2, userId);
	var rgetGetCust = pstmtGetCust.executeQuery();
	connection.commit();
	if (rgetGetCust.next()) {
		records.ParentSapId = rgetGetCust.getString(1);
		records.ParentName = rgetGetCust.getString(2);
	}
	connection.close();
	return;
}

function updateCustomerData(sapId, userId, record) {
	var connection = $.db.getConnection();
	var records = {};
	getDRBDetails(userId, records);

	var qryGetCust = 'select * from "MDB_DEV"."MST_CUSTOMER" where DMS_CUST_CODE=? and DBR_FORM_ID=?';
	var pstmtGetCust = connection.prepareStatement(qryGetCust);
	pstmtGetCust.setString(1, sapId);
	pstmtGetCust.setString(2, userId);
	var rgetGetCust = pstmtGetCust.executeQuery();
	connection.commit();
	if (rgetGetCust.next()) {
		record.status = '0';
		record.messageCustomer = 'Data Allready Insert';
		return;
	} else {
		var queryCust = 'insert into  "MDB_DEV"."MST_CUSTOMER" ' +
			' ("CUST_TYPE","DMS_CUST_CODE","DBR_FORM_ID","CUST_NAME","PARENT_CUST_CODE","PARENT_CUST_NAME","FIRM_NAME","NATURE", ' +
			' "EMAIL_ID","REGION","REMARKS","PREMISES_NATURE","PREMISES_NO","LOCALITY","TOWN_VILL","CITY_DISTRICT", ' +
			' "STATE","POSTAL_CODE","OFFICE_SPACE","WAREHOUSE_SPACE","COMPANY_PROFILE","OWNERSHIP_SINCE","CURRENT_INVESTMENT","BANK_LOAN", ' +
			' "BANK_LIMIT","BANK_NAME","CURRENT_ACCOUNT_NUMBER","STATUS","SOFT_DEL","CREATE_BY","RETAILER_TYPE","RETAILER_WEEKLY_DAY_OFF", ' +
			'  "RETAILER_SHOP_SIZE","RETAILER_TOWN_TIER","RETAILER_XIAOMI_PREF_PARTNER","RETAILER_MOTO_PREF_PARTNER","RETAILER_OTHER_PREF","AREA","SUB_AREA","SUB_URB","STATE_CODE") ' +
			' values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	}
	var pstmtCust = connection.prepareStatement(queryCust);
	pstmtCust.setString(1, records.CUST_TYPE); //records.CUST_TYPE
	pstmtCust.setString(2, sapId);
	pstmtCust.setString(3, records.DBR_FORM_ID);
	pstmtCust.setString(4, records.FIRM_NAME);
	/*pstmtCust.setString(5, ''); //PARENT_CUST_CODE
	pstmtCust.setString(6, ''); //PARENT_CUST_NAME*/
	pstmtCust.setString(7, records.FIRM_NAME);
	pstmtCust.setString(8, records.NATURE);
	pstmtCust.setString(9, records.EMAIL_ID);
	/*pstmtCust.setString(10, records.REGION);//retailer
	pstmtCust.setString(11, records.REMARKS);//retailer*/
	pstmtCust.setString(12, records.PREMISES_NATURE);
	pstmtCust.setString(13, records.PREMISES_NO);
	pstmtCust.setString(14, records.LOCALITY);
	pstmtCust.setString(15, records.TOWN_VILL);
	pstmtCust.setString(16, records.CITY_DISTRICT);
	pstmtCust.setString(17, records.STATE);
	pstmtCust.setString(18, records.POSTAL_CODE);
	pstmtCust.setString(19, records.OFFICE_SPACE);
	pstmtCust.setString(21, records.COMPANY_PROFILE);
	pstmtCust.setString(22, records.OWNERSHIP_SINCE);
	/*	pstmtCust.setString(23, records.CURRENT_INVESTMENT);
	pstmtCust.setString(24, records.BANK_LOAN);
	pstmtCust.setString(25, records.BANK_LIMIT);
	pstmtCust.setString(26, records.BANK_NAME);
	pstmtCust.setString(27, records.CURRENT_ACCOUNT_NUMBER);
*/
	pstmtCust.setString(28, records.STATUS);
	pstmtCust.setString(29, records.SOFT_DEL);
	pstmtCust.setString(30, records.CREATE_BY);
	pstmtCust.setString(41, records.STATE_CODE);
	if (records.CUST_TYPE === "DSTB") {
		pstmtCust.setString(5, ''); //PARENT_CUST_CODE
		pstmtCust.setString(6, ''); //PARENT_CUST_NAME
		pstmtCust.setString(10, records.REGION); //retailer
		pstmtCust.setString(11, records.REMARKS); //retailer
		pstmtCust.setString(23, records.CURRENT_INVESTMENT);
		pstmtCust.setString(24, records.BANK_LOAN);
		pstmtCust.setString(25, records.BANK_LIMIT);
		pstmtCust.setString(26, records.BANK_NAME);
		pstmtCust.setString(27, records.CURRENT_ACCOUNT_NUMBER);
		pstmtCust.setString(20, records.WAREHOUSE_SPACE);
		pstmtCust.setString(31, ''); //records.RETAILER_TYPE
		pstmtCust.setString(32, ''); //records.RETAILER_WEEKLY_DAY_OFF
		pstmtCust.setString(33, ''); //records.RETAILER_SHOP_SIZE
		pstmtCust.setString(34, ''); //records.RETAILER_TOWN_TIER
		pstmtCust.setString(35, ''); //records.RETAILER_XIAOMI_PREF_PARTNER
		pstmtCust.setString(36, ''); //records.RETAILER_MOTO_PREF_PARTNER
		pstmtCust.setString(37, ''); //records.RETAILER_OTHER_PREF
		pstmtCust.setString(38, records.SUB_AREA.split("_")[0]);
		pstmtCust.setString(39, records.SUB_AREA); //records.SUB_AREA
		pstmtCust.setString(40, ''); //records.SUB_URB
	} else if (records.CUST_TYPE === "RETL") {
		getParentSAPid(records.PARENT, records);
		pstmtCust.setString(5, records.PARENT); //PARENT_CUST_CODE
		pstmtCust.setString(6, records.ParentName);
		pstmtCust.setString(10, '');
		pstmtCust.setString(11, '');
		pstmtCust.setString(23, '');
		pstmtCust.setString(24, '');
		pstmtCust.setString(25, '');
		pstmtCust.setString(26, '');
		pstmtCust.setString(27, '');
		pstmtCust.setString(20, '');
		pstmtCust.setString(31, records.RETAILER_TYPE); //records.RETAILER_TYPE
		pstmtCust.setString(32, records.RETAILER_WEEKLY_DAY_OFF); //records.RETAILER_WEEKLY_DAY_OFF
		pstmtCust.setString(33, records.RETAILER_SHOP_SIZE); //records.RETAILER_SHOP_SIZE
		pstmtCust.setString(34, records.RETAILER_TOWN_TIER); //records.RETAILER_TOWN_TIER
		pstmtCust.setString(35, records.RETAILER_XIAOMI_PREF_PARTNER); //records.RETAILER_XIAOMI_PREF_PARTNER
		pstmtCust.setString(36, records.RETAILER_MOTO_PREF_PARTNER); //records.RETAILER_MOTO_PREF_PARTNER
		pstmtCust.setString(37, records.RETAILER_OTHER_PREF); //records.RETAILER_OTHER_PREF
		pstmtCust.setString(38, '');
		pstmtCust.setString(39, ''); //records.SUB_AREA
		if (records.SUB_URB === null || records.SUB_URB === "") {
			pstmtCust.setString(40, ""); //records.SUB_URB
		} else {
			pstmtCust.setString(40, records.SUB_URB); //records.SUB_URB
		}
	}
	var rsCust = pstmtCust.executeUpdate();
	connection.commit();
	if (rsCust > 0) {
		record.status = '0';
		record.message = 'Successfully Insert';
		updateSAP(sapId);
			record.GST_CODE = records.GST_CODE;
	} else {
		record.status = '1';
		record.message = 'failed to insert customer';
			record.GST_CODE = records.GST_CODE;
	}
	connection.close();
}

function getSAPId(sapId) {
	var connection = $.db.getConnection();
	var querySAPID = 'select name,VALUE from "MDB_DEV"."APPLICATION_PARAMETER" where name = ? ';
	var pstmtSAPID = connection.prepareStatement(querySAPID);
	pstmtSAPID.setString(1, 'SAPID');
	var rSAPID = pstmtSAPID.executeQuery();
	connection.commit();
	if (rSAPID.next()) {
		//dicLine.RETLNAME = rSAPID.getString(1);
		sapId = rSAPID.getString(2);
	}
	connection.close();
	return sapId;
}

function updateSAPID() {
	var Output = {
		results: []
	};
	var record = {};
	var sapId; //= $.request.parameters.get('SAP_ID');
	var userId = $.request.parameters.get('User_Code');
	try {
		sapId = updateSAPIDInCustomer(userId);
		updateCustomerData(sapId, userId, record);
		updateDirectorSapId(sapId, userId, record);
		updateBussProfileSapId(sapId, userId, record);
		updateCustLegalSapId(sapId, userId, record);
		updateFosSapId(sapId, userId, record);
		record.CustId = sapId;
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

function getApprovalRemarks() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var queryremarks =
			'select RH.DBR_FORM_ID,RH.REMARKS_DATE,RH.APPROVAL_ID,RH.REMARKS,ME.EMPLOYEE_NAME,ST.STATUS_NAME from "MDB_DEV"."REMARKS_HISTORY" as RH inner join "MDB_DEV"."MST_EMPLOYEE" as ME on RH.APPROVAL_ID = ME.EMPLOYEE_CODE inner join "MDB_DEV"."DBR_PROFILE" as DR on RH.DBR_FORM_ID = DR.DBR_FORM_ID inner join "MDB_DEV"."DBST_STATUS" as ST on RH.STATUS = ST.STATUS_CODE where RH.DBR_FORM_ID= ?';
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

function emailQueryContent(apprecord) {

	apprecord.EmailContent = "<h3> Hello " + apprecord.FIRM_NAME + "</h3>" + "<p> " + apprecord.APPROVAL_TYPE +
		" have query for " + apprecord.remarks + " </p></br></br>" + "<p>Thanks & Regards,</p>" + "<p>" + apprecord.APPROVAL_NAME + "</p>";

	return apprecord;
}

function emailQueryDBR(apprecord) {
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

function dbrFormQuery() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var formIdArray = $.request.parameters.get('formIdArray');
	var remarks = $.request.parameters.get('remarks');

	var dbrFormIdArray = JSON.parse(formIdArray.replace(/\\r/g, ""));
	var remarks = $.request.parameters.get('remarks');
	var connection = $.db.getConnection();
	var pstmtQryDBRForm;
	var qryQryDBRForm;
	try {

		for (var i = 0; i < dbrFormIdArray.length; i++) {
			var formIdObj = dbrFormIdArray[i];
			var record = {};
			// Change the on Call Location
			//addCustRemarks(status, userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);

			qryQryDBRForm = 'UPDATE "MDB_DEV"."DBR_PROFILE" SET STATUS=? WHERE DBR_FORM_ID=?';
			pstmtQryDBRForm = connection.prepareStatement(qryQryDBRForm);
			pstmtQryDBRForm.setString(1, '1');
			pstmtQryDBRForm.setString(2, formIdObj.DBR_FORM_ID);
			var rsQryDBRForm = pstmtQryDBRForm.executeUpdate();
			connection.commit();
			//sendMail
			var apprecord = {};
			var queryStatus = '4';
			var qryQryDBRFormUpdateApproval = 'UPDATE "MDB_DEV"."CUSTOMER_APPROVAL" SET STATUS=? WHERE DBR_FORM_ID=? AND APPROVAL_ID=?';
			var pstmtQryDBRFormUpdateApproval = connection.prepareStatement(qryQryDBRFormUpdateApproval);
			pstmtQryDBRFormUpdateApproval.setString(1, queryStatus);
			pstmtQryDBRFormUpdateApproval.setString(2, formIdObj.DBR_FORM_ID);
			pstmtQryDBRFormUpdateApproval.setString(3, userCode);
			var rsDBRFormUpdateApproval = pstmtQryDBRFormUpdateApproval.executeUpdate();
			connection.commit();
			if (rsDBRFormUpdateApproval > 0) {
				addCustRemarks(queryStatus, userCode, remarks, formIdObj.DBR_FORM_ID, connection, record);
				var queryDSTBRegsInfo = 'select email_id,firm_name  from "MDB_DEV"."DBR_PROFILE" where  dbr_form_id = ?';
				var pstmtDSTBRegsInfo = connection.prepareStatement(queryDSTBRegsInfo);
				pstmtDSTBRegsInfo.setString(1, formIdObj.DBR_FORM_ID);
				var rsDSTBRegs = pstmtDSTBRegsInfo.executeQuery();
				connection.commit();

				apprecord.DBR_FORM_ID = formIdObj.DBR_FORM_ID;
				while (rsDSTBRegs.next()) {
					apprecord.EMAIL_ID = rsDSTBRegs.getString(1);
					apprecord.FIRM_NAME = rsDSTBRegs.getString(2);
				}
				apprecord.APPROVAL_TYPE = formIdObj.APPROVAL_TYPE;
				apprecord.APPROVAL_NAME = formIdObj.APPROVAL_NAME;
				apprecord.APPROVAL_CODE = userCode;
				getEmployeeEmailId(apprecord);
				apprecord.remarks = remarks;
				emailQueryContent(apprecord);
				emailQueryDBR(apprecord);
			}
		}
		connection.close();
		output.results.push(record);
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

function getDBRApprovalRemarks() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var queryremarks =
			/*	'select RH.DBR_FORM_ID,RH.REMARKS_DATE,RH.APPROVAL_ID,RH.REMARKS,ME.EMPLOYEE_NAME from "MDB_DEV"."REMARKS_HISTORY" ' +
			' as RH inner join "MDB_DEV"."MST_EMPLOYEE" as ME on RH.APPROVAL_ID = ME.EMPLOYEE_CODE inner join "MDB_DEV"."DBR_PROFILE" ' +
			' as DR on RH.DBR_FORM_ID = DR.DBR_FORM_ID where RH.DBR_FORM_ID= ? ORDER BY RH.REMARKS_DATE DESC';
	*/
			'SELECT RH.dbr_form_id,' + ' RH.remarks_date, ' + '  RH.approval_id, ' + '  RH.remarks, ' + '  ME.employee_name, ' + '   D.status_name ' +
			' FROM  "MDB_DEV"."REMARKS_HISTORY" AS RH ' + '  INNER JOIN "MDB_DEV"."MST_EMPLOYEE" AS ME ' +
			'       ON RH.approval_id = ME.employee_code ' + ' INNER JOIN "MDB_DEV"."DBR_PROFILE" AS DR ' +
			'        ON RH.dbr_form_id = DR.dbr_form_id ' + ' INNER JOIN "MDB_DEV"."DBST_STATUS" AS D ' + '       ON D.status_code = RH.status ' +
			' WHERE  RH.dbr_form_id = ? ' + ' ORDER  BY RH.remarks_date DESC ';
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
			record.STATUS = rgetRemarks.getString(6);
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
 * To fetch Status Desc behalf of Status Id.
 * @Param {Integer} Status in record {}.
 * @Param record is dictionary that's hold Status
 * @return {record} in that put StatusDesc.
 * @author shriyansi
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
 * fetch all customers data including retl and dstb.
 * @return {results} Array of Customers record
 * @author shriyansi
 */
function getCustomerAtApprovalLevel() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var queryGetCustomer = 'select  c.CUST_TYPE , c.FIRM_NAME ,c.dbr_form_id ,c.state, c.CITY_DISTRICT,' +
			'c.EMAIL_ID, c.SOFT_DEL,c.DMS_CUST_CODE from "MDB_DEV"."MST_CUSTOMER" as c inner join "MDB_DEV"."MST_STATE" as s on  s.state_name=c.state where c.create_by=?';
		//'select * from "MDB_DEV"."MST_CUSTOMER" ';
		var pstmtGetCustomer = connection.prepareStatement(queryGetCustomer);
		pstmtGetCustomer.setString(1, userCode);
		var rGetCustomer = pstmtGetCustomer.executeQuery();
		connection.commit();
		while (rGetCustomer.next()) {
			var record = {};
			record.CUST_TYPE = rGetCustomer.getString(1);
			record.CUST_NAME = rGetCustomer.getString(2);
			record.DBR_FORM_ID = rGetCustomer.getString(3);
			record.STATE = rGetCustomer.getString(4);
			record.CITY_DISTRICT = rGetCustomer.getString(5);
			record.EMAIL_ID = rGetCustomer.getString(6);
			record.Status = rGetCustomer.getString(7);
			record.DMS_CUST_CODE = rGetCustomer.getString(8);
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

function getDBRStateHeadMeetingTable() {
	var output = {
		results: []
	};
	var userCode = $.request.parameters.get('userCode');
	var connection = $.db.getConnection();
	try {
		var qryStateHeadTable =
			' select employee_name,date from "MDB_DEV"."STATE_HEAD_MEETING_INFO" where dbr_form_id=? ';
		var pstmtStateHeadTable = connection.prepareStatement(qryStateHeadTable);
		pstmtStateHeadTable.setString(1, userCode);
		var rsgetStateHeadTable = pstmtStateHeadTable.executeQuery();
		connection.commit();
		while (rsgetStateHeadTable.next()) {
			var record = {};
			record.EMPLOYEE_NAME = rsgetStateHeadTable.getString(1);
			record.DATE = rsgetStateHeadTable.getString(2);

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

	case "getPendDBRRequest":
		getPendDBRRequest();
		break;
	case "getCustomerAtApprovalLevel":
		getCustomerAtApprovalLevel();
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
	case "dbrFormQuery":
		dbrFormQuery();
		break;
	case "getDBRApprovalRemarks":
		getDBRApprovalRemarks();
		break;
	case "getOnHoldDBR":
		getOnHoldDBR();
		break;
	case "getDBRStateHeadMeetingTable":
		getDBRStateHeadMeetingTable();
		break;
    case "testNextApproval" :
        testNextApproval();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}