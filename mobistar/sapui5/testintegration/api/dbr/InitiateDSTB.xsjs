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
 * To delete any Distributor Registration on the behalf of DistRegicode.
 * @Param {String} DistRegicode as an input.
 * @return {output} success or failure.
 * @author Laxmi.
 */
function deleteDBRRegistration() {
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var DistRegicode = $.request.parameters.get('DistRegicode');
	var record = {};
	try {
		var qryDeleteDBRReg = 'update "MDB_TEST_INTEGRATION"."DBR_PROFILE" set SOFT_DEL=? where DBR_FORM_ID=?';
		var pstmtDeleteDBRReg = connection.prepareStatement(qryDeleteDBRReg);
		pstmtDeleteDBRReg.setString(1, '1');
		pstmtDeleteDBRReg.setString(2, DistRegicode);
		var rsDeleteDBRReg = pstmtDeleteDBRReg.executeUpdate();
		connection.commit();
		if (rsDeleteDBRReg > 0) {
			record.status = '0';
			record.message = 'Successfully deleted Distributor Registration';
		} else {
			record.status = '1';
			record.message = 'failed to delete Distributor Registration.Kindly contact to Admin!!! ';
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

function dateFormat(record) {
	var date = record.CREATE_DATE;
	if (date) {
		record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.CREATE_DATE;
	}
}

function getDBRCode(dicLine) {
	var connection = $.db.getConnection();
	var queryDBRCode = 'select name,VALUE from "MDB_TEST_INTEGRATION"."APPLICATION_PARAMETER" where name = ? ';
	var pstmtDBRCode = connection.prepareStatement(queryDBRCode);
	pstmtDBRCode.setString(1, 'DBR');
	var rDBRCode = pstmtDBRCode.executeQuery();
	if (rDBRCode.next()) {
		dicLine.DBRNAME = rDBRCode.getString(1);
		dicLine.DBRCODE = rDBRCode.getString(2);
	}
}

function getRETLCode(dicLine) {
	var connection = $.db.getConnection();
	var queryDBRCode = 'select name,VALUE from "MDB_TEST_INTEGRATION"."APPLICATION_PARAMETER" where name = ? ';
	var pstmtDBRCode = connection.prepareStatement(queryDBRCode);
	pstmtDBRCode.setString(1, 'RETL');
	var rDBRCode = pstmtDBRCode.executeQuery();
	if (rDBRCode.next()) {
		dicLine.RETLNAME = rDBRCode.getString(1);
		dicLine.RETLCODE = rDBRCode.getString(2);
	}
}

function updateRETLCode(dicLine) {
	var connection = $.db.getConnection();
	var id = parseInt(dicLine.RETLCODE, 10);
	id = id + 1;
	var queryUpdateDBRCode = 'UPDATE "MDB_TEST_INTEGRATION"."APPLICATION_PARAMETER" SET value = ? WHERE name = ?';
	var pstmtUpdateDBRCode = connection.prepareStatement(queryUpdateDBRCode);
	pstmtUpdateDBRCode.setString(1, id.toString());
	pstmtUpdateDBRCode.setString(2, dicLine.RETLNAME);
	var rUpdateDBRCode = pstmtUpdateDBRCode.executeUpdate();
	connection.commit();
	if (rUpdateDBRCode > 0) {}
	connection.close();
}

function updateDBRCode(dicLine) {
	var connection = $.db.getConnection();
	var id = parseInt(dicLine.DBRCODE, 10);
	id = id + 1;
	var queryUpdateDBRCode = 'UPDATE "MDB_TEST_INTEGRATION"."APPLICATION_PARAMETER" SET value = ? WHERE name = ?';
	var pstmtUpdateDBRCode = connection.prepareStatement(queryUpdateDBRCode);
	pstmtUpdateDBRCode.setString(1, id.toString());
	pstmtUpdateDBRCode.setString(2, dicLine.DBRNAME);
	var rUpdateDBRCode = pstmtUpdateDBRCode.executeUpdate();
	connection.commit();
	if (rUpdateDBRCode > 0) {}
	connection.close();
}

function randomPassword(length, dicLine) {
	var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()<>ABCDEFGHIJKLMNOP1234567890";
	dicLine.password = "";
	for (var x = 0; x < length; x++) {
		var i = Math.floor(Math.random() * chars.length);
		dicLine.password += chars.charAt(i);
	}
	return dicLine.password;
}

function emailContent(dicLine) {
	var password = 8;
	randomPassword(password, dicLine);
	var url = "https://webide-a0dc2b6c6.dispatcher.hana.ondemand.com";

	dicLine.EmailContent = "<h3> Hello " + dicLine.FramName + "</h3>" + "<p> Your Credentials are as follows.</p>" + "</br><Table>" + "<tr>" +
		"<td>User Id : " + dicLine.DBRCODE + "</td></tr>" + "<tr>" + "<td>Password : " + dicLine.password + "</td></tr>" + "</Table></br>" +
		"<p>Kindly logged in " + url + "and fill up your details.</p></br></br>" + "<p>Thanks & Regards,</p>" + "<p>" + dicLine.InputUser +
		"</p>";
	return dicLine;
}
function getTSMEmailId(dicLine){
    var connection = $.db.getConnection();
	var queryTSMEmail = 'select EMAIL from "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" where EMPLOYEE_CODE = ?';
	var pstmtTSMEmail = connection.prepareStatement(queryTSMEmail);
	pstmtTSMEmail.setString(1, dicLine.CREATE_BY);
	var rTSMEmail = pstmtTSMEmail.executeQuery();
	connection.commit();
	if (rTSMEmail.next()) {
		dicLine.AppMailId = rTSMEmail.getString(1);
	}
	connection.close();
	return dicLine;
}
function email(dicLine) {
	emailContent(dicLine);
	try {
		var mail = new $.net.Mail({
			sender: {
				address: dicLine.AppMailId
			},
			to: [{
				address: dicLine.Email
			}],
			subject: "Login Credentials",
			subjectEncoding: "UTF-8",
			parts: [new $.net.Mail.Part({
				type: $.net.Mail.Part.TYPE_TEXT,
				text: dicLine.EmailContent,
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

function addUserRegistration(dicLine) {

	var record;
	var Output = {
		results: []
	};

	var conn = $.db.getConnection();
	try {
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::USER_REGISTRATION"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setString(1, dicLine.DBRCODE);
		pstmtCallPro.setString(2, dicLine.password);
		pstmtCallPro.setString(3, dicLine.DBRCODE);
		pstmtCallPro.setString(4, "DSTB");
		pstmtCallPro.setInteger(5, 0);
		pstmtCallPro.setInteger(6, 0);
		pstmtCallPro.setString(7, "Create");
		pstmtCallPro.setString(8, '0');
		pstmtCallPro.setInteger(9, 0);
		pstmtCallPro.setString(10, dicLine.CREATE_BY);
		pstmtCallPro.setString(11, dateFunction());
		pstmtCallPro.setString(12, 'null');
		pstmtCallPro.setString(13, dateFunction());
		pstmtCallPro.setString(14, 'INSERT');
		pstmtCallPro.execute();
		var rsm = pstmtCallPro.getResultSet();
		conn.commit();
		if (rsm > 0) {
			record.status = 1;
			record.message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.message = 'Some Issues!';
		}
		Output.results.push(record);
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

function addDBRRegistration() {
	var output = {
		results: []
	};
	var datasLine = $.request.parameters.get('DSTBData');
	var records = {};
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				var queryDSTBRegs = 'select *  from "MDB_TEST_INTEGRATION"."DBR_PROFILE" where  EMAIL_ID = ?';
				var pstmtDSTBRegs = connection.prepareStatement(queryDSTBRegs);
				/*pstmtDSTBRegs.setString(1, dicLine.FramName);
				pstmtDSTBRegs.setString(2, dicLine.Nature);*/
				pstmtDSTBRegs.setString(1, dicLine.Email);
				//	pstmtDSTBRegs.setString(4, dicLine.Region);
				var rDSTBRegs = pstmtDSTBRegs.executeQuery();
				if (rDSTBRegs.next()) {
					records.status = 1;
					records.message = 'This Email Id Already inserted';
				} else {
					getDBRCode(dicLine);
					var queryaddDSTBRegs =
						'insert into  "MDB_TEST_INTEGRATION"."DBR_PROFILE"("DBR_FORM_ID","FIRM_NAME","NATURE","REGION","EMAIL_ID","REMARKS","STATUS","CREATE_BY") values(?,?,?,?,?,?,?,?)';
					var pstmtaddDSTBRegs = connection.prepareStatement(queryaddDSTBRegs);
					pstmtaddDSTBRegs.setString(1, dicLine.DBRCODE);
					pstmtaddDSTBRegs.setString(2, dicLine.FramName);
					pstmtaddDSTBRegs.setString(3, dicLine.Nature);
					pstmtaddDSTBRegs.setString(4, dicLine.Region);
					pstmtaddDSTBRegs.setString(5, dicLine.Email);
					pstmtaddDSTBRegs.setString(6, dicLine.Remarks);
					pstmtaddDSTBRegs.setString(7, '0');
					pstmtaddDSTBRegs.setString(8, dicLine.CREATE_BY);
					var rsaddDSTBRegs = pstmtaddDSTBRegs.executeUpdate();
					connection.commit();
					records = {};
					if (rsaddDSTBRegs > 0) {
						if (dicLine.InputUser === undefined || dicLine.InputUser === null || dicLine.InputUser === "") {
							dicLine.InputUser = "ADMIN";
						}
						getTSMEmailId(dicLine);
						updateDBRCode(dicLine);
						email(dicLine);
						addUserRegistration(dicLine);
						records.status = 1;
						records.message = 'Data Uploaded Sucessfully';
					} else {
						records.status = 0;
						records.message = 'Some Issues!';
					}
				}
				output.results.push(records);

			}
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

function getDBRRegistrations() {
	var output = {
		results: []
	};
	var SN = 0;
	var CREATE_BY = $.request.parameters.get('CREATE_BY');
	var connection = $.db.getConnection();
	try {
		//var querygetDBRRegist = 'Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" where SOFT_DEL = ? ';
		var querygetDBRRegist =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where SOFT_DEL = ? and CREATE_BY = ?';
		var pstmtgetDBRRegist = connection.prepareStatement(querygetDBRRegist);
		pstmtgetDBRRegist.setString(1, '0');
		pstmtgetDBRRegist.setString(2, CREATE_BY);
		var rgetDBRRegist = pstmtgetDBRRegist.executeQuery();
		connection.commit();
		while (rgetDBRRegist.next()) {
			var record = {};
			SN = SN + 1;
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

function getPendingDBRRequest() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	var pstmtgetTSM;
	var querygetTSM;
	try {
		if (userType === "TSM") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ? and DBRP.CREATE_BY=? and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, userCode);
			pstmtgetTSM.setString(3, '2');
		} else if (userType === "BRANCH HEAD") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '3');
		} else if (userType === "SALES COORDINATOR") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '6');
		}
		var rsGetTSM = pstmtgetTSM.executeQuery();
		connection.commit();
		while (rsGetTSM.next()) {
			var record = {};
			SN = SN + 1;
			record.DBR_FORM_ID = rsGetTSM.getString(2);
			record.FIRM_NAME = rsGetTSM.getString(3);
			record.NATURE = rsGetTSM.getString(4);
			record.PREMISES_NATURE = rsGetTSM.getString(5);
			record.PREMISES_NO = rsGetTSM.getString(6);
			record.REGION = rsGetTSM.getString(7);
			record.REMARK = rsGetTSM.getString(8);
			record.LOCALITY = rsGetTSM.getString(9);
			record.TOWN_VILL = rsGetTSM.getString(10);
			record.CITY_DISTRICT = rsGetTSM.getString(11);
			record.STATE = rsGetTSM.getString(12);
			record.POSTAL_CODE = rsGetTSM.getString(13);
			record.EMAIL = rsGetTSM.getString(14);
			record.OFFICE_SPACE = rsGetTSM.getString(15);
			record.WAREHOUSE_SPACE = rsGetTSM.getString(16);
			record.CONTACT_PERSON = rsGetTSM.getString(17);
			record.CONTACT_PERSON_MOBILE = rsGetTSM.getString(18);
			record.CONTACT_PERSON_DESIGNATION = rsGetTSM.getString(19);
			record.CIN_NUMBER = rsGetTSM.getString(20);
			record.PARTNERSHIP_DEED_NUMBER = rsGetTSM.getString(21);
			record.ADHAAR = rsGetTSM.getString(22);
			record.HUF_NUMBER = rsGetTSM.getString(23);
			record.COMPANY_PROFILE = rsGetTSM.getString(24);
			record.PAN_NUMBER = rsGetTSM.getString(25);
			record.PAN_NUMBER_DOC = rsGetTSM.getString(26);
			record.TAN_NUMBER = rsGetTSM.getString(27);
			record.TAN_NUMBER_DOC = rsGetTSM.getString(28);
			record.GSTIN_NUMBER = rsGetTSM.getString(29);
			record.GSTIN_CERTIFICATE = rsGetTSM.getString(30);
			record.BANK_ACCOUNT_NUMBER = rsGetTSM.getString(31);
			record.IFSC_CODE = rsGetTSM.getString(32);
			record.CANCELLED_CHEQUE_DOC = rsGetTSM.getString(33);
			record.MOA_COMPANY = rsGetTSM.getString(34);
			record.PARTNERSHIP_DEED = rsGetTSM.getString(35);
			record.IT_RETURNS = rsGetTSM.getString(36);
			record.HUF_AGREEMENT = rsGetTSM.getString(37);
			record.COMPANY_NAME = rsGetTSM.getString(38);
			record.ASSOCIATED_FROM_DATE = rsGetTSM.getString(39);
			record.INDUSTRY_CATEGORY = rsGetTSM.getString(40);
			record.TURNOVER_LAST_THREE_MONTH = rsGetTSM.getString(41);
			record.CURRENT_INVESTMENT = rsGetTSM.getString(42);
			record.BANK_LOAN = rsGetTSM.getString(43);
			record.BANK_LIMIT = rsGetTSM.getString(44);
			record.BANK_NAME = rsGetTSM.getString(45);
			record.CURRENT_ACCOUNT_NUMBER = rsGetTSM.getString(46);
			record.FIN_STMT_LAST_THREE_MONTH = rsGetTSM.getString(47);
			record.BANK_STMT_LAST_SIX_MONTH = rsGetTSM.getString(48);
			record.INCOME_TAX_RETURN = rsGetTSM.getString(49);
			record.APPROVAL_STATUS = rsGetTSM.getString(50);
			record.STATUS = rsGetTSM.getString(51);
			record.SOFT_DEL = rsGetTSM.getString(52);
			record.CREATE_BY = rsGetTSM.getString(53);
			record.CREATE_DATE = rsGetTSM.getString(54);
			record.MODIFIED_BY = rsGetTSM.getString(55);
			record.MODIFIED_DATE = rsGetTSM.getString(56);
			record.STATUS_CODE = rsGetTSM.getString(57);
			record.STATUS_NAME = rsGetTSM.getString(72);
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

function insertCurntBusinessProfile(dicLine, record) {
	var connection = $.db.getConnection();
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"("COMPANY_NAME" ,"ASSOCIATED_FROM" ,"INDUSTRY_CATEGORY", "SP_VOLUME_AVG" , "SP_VALUE_AVG" , "DBR_FORM_ID") values(?,?,?,?,?,?) ';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dicLine.CompanyName);
	pstmtUpdateDbrDetails.setString(2, dicLine.AssociateDate);
	/*var splitDate = dicLine.AssociateDate.split("-");
				pstmtUpdateDbrDetails.setString(splitDate[2] + "." + splitDate[1] + "." + splitDate[0]);*/
	pstmtUpdateDbrDetails.setString(3, dicLine.Industry);
	pstmtUpdateDbrDetails.setString(4, dicLine.AvgSPVolumn);
	pstmtUpdateDbrDetails.setString(5, dicLine.AvgSPValue);
	pstmtUpdateDbrDetails.setString(6, dicLine.inputDbr);

	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function getPendDBRRequest() {
	var output = {
		results: []
	};
	var SN = 0;
	// 	var userCode = $.request.parameters.get('userCode');
	// 	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	var pstmtgetTSM;
	var querygetTSM;
	try {

		querygetTSM =
		// ' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
		// ' DBRP.SOFT_DEL = ? and DBRP.CREATE_BY=? and DBRP.STATUS=? ';
		"Select * from \"MOBI\".\"CUSTOMER_APPROVAL\" where status=?";
		pstmtgetTSM = connection.prepareStatement(querygetTSM);
		pstmtgetTSM.setString(1, '2');
		// 			pstmtgetTSM.setString(2, userCode);
		// 			pstmtgetTSM.setString(3, '2');

		var rsGetTSM = pstmtgetTSM.executeQuery();
		connection.commit();
		while (rsGetTSM.next()) {
			var record = {};
			SN = SN + 1;
			record.DBR_FORM_ID = rsGetTSM.getString(2);
			record.FIRM_NAME = rsGetTSM.getString(4);
			record.STATUS_NAME = rsGetTSM.getString(5);
			record.CREATE_DATE = rsGetTSM.getString(6);
			record.CREATE_BY = rsGetTSM.getString(3);
			// 			record.REGION = rsGetTSM.getString(7);
			// 			record.REMARK = rsGetTSM.getString(8);
			// 			record.LOCALITY = rsGetTSM.getString(9);
			// 			record.TOWN_VILL = rsGetTSM.getString(10);
			// 			record.CITY_DISTRICT = rsGetTSM.getString(11);
			// 			record.STATE = rsGetTSM.getString(12);
			// 			record.POSTAL_CODE = rsGetTSM.getString(13);
			// 			record.EMAIL = rsGetTSM.getString(14);
			// 			record.OFFICE_SPACE = rsGetTSM.getString(15);
			// 			record.WAREHOUSE_SPACE = rsGetTSM.getString(16);
			// 			record.CONTACT_PERSON = rsGetTSM.getString(17);
			// 			record.CONTACT_PERSON_MOBILE = rsGetTSM.getString(18);
			// 			record.CONTACT_PERSON_DESIGNATION = rsGetTSM.getString(19);
			// 			record.CIN_NUMBER = rsGetTSM.getString(20);
			// 			record.PARTNERSHIP_DEED_NUMBER = rsGetTSM.getString(21);
			// 			record.ADHAAR = rsGetTSM.getString(22);
			// 			record.HUF_NUMBER = rsGetTSM.getString(23);
			// 			record.COMPANY_PROFILE = rsGetTSM.getString(24);
			// 			record.PAN_NUMBER = rsGetTSM.getString(25);
			// 			record.PAN_NUMBER_DOC = rsGetTSM.getString(26);
			// 			record.TAN_NUMBER = rsGetTSM.getString(27);
			// 			record.TAN_NUMBER_DOC = rsGetTSM.getString(28);
			// 			record.GSTIN_NUMBER = rsGetTSM.getString(29);
			// 			record.GSTIN_CERTIFICATE = rsGetTSM.getString(30);
			// 			record.BANK_ACCOUNT_NUMBER = rsGetTSM.getString(31);
			// 			record.IFSC_CODE = rsGetTSM.getString(32);
			// 			record.CANCELLED_CHEQUE_DOC = rsGetTSM.getString(33);
			// 			record.MOA_COMPANY = rsGetTSM.getString(34);
			// 			record.PARTNERSHIP_DEED = rsGetTSM.getString(35);
			// 			record.IT_RETURNS = rsGetTSM.getString(36);
			// 			record.HUF_AGREEMENT = rsGetTSM.getString(37);
			// 			record.COMPANY_NAME = rsGetTSM.getString(38);
			// 			record.ASSOCIATED_FROM_DATE = rsGetTSM.getString(39);
			// 			record.INDUSTRY_CATEGORY = rsGetTSM.getString(40);
			// 			record.TURNOVER_LAST_THREE_MONTH = rsGetTSM.getString(41);
			// 			record.CURRENT_INVESTMENT = rsGetTSM.getString(42);
			// 			record.BANK_LOAN = rsGetTSM.getString(43);
			// 			record.BANK_LIMIT = rsGetTSM.getString(44);
			// 			record.BANK_NAME = rsGetTSM.getString(45);
			// 			record.CURRENT_ACCOUNT_NUMBER = rsGetTSM.getString(46);
			// 			record.FIN_STMT_LAST_THREE_MONTH = rsGetTSM.getString(47);
			// 			record.BANK_STMT_LAST_SIX_MONTH = rsGetTSM.getString(48);
			// 			record.INCOME_TAX_RETURN = rsGetTSM.getString(49);
			// 			record.APPROVAL_STATUS = rsGetTSM.getString(50);
			// 			record.STATUS = rsGetTSM.getString(51);
			// 			record.SOFT_DEL = rsGetTSM.getString(52);
			// 			record.CREATE_BY = rsGetTSM.getString(53);
			// 			record.CREATE_DATE = rsGetTSM.getString(54);
			// 			record.MODIFIED_BY = rsGetTSM.getString(55);
			// 			record.MODIFIED_DATE = rsGetTSM.getString(56);
			// 			record.STATUS_CODE = rsGetTSM.getString(57);
			// 			record.STATUS_NAME = rsGetTSM.getString(72);
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

function getApprovedDBRRequest() {
	var output = {
		results: []
	};
	var SN = 0;
	var userCode = $.request.parameters.get('userCode');
	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	var pstmtgetTSM;
	var querygetTSM;
	try {
		if (userType === "TSM") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ? and DBRP.CREATE_BY=? and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, userCode);
			pstmtgetTSM.setString(3, '3');
		} else if (userType === "BRANCH HEAD") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '6');
		} else if (userType === "SALES COORDINATOR") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '9');
		}
		var rsGetTSM = pstmtgetTSM.executeQuery();
		connection.commit();
		while (rsGetTSM.next()) {
			var record = {};
			SN = SN + 1;
			record.DBR_FORM_ID = rsGetTSM.getString(2);
			record.FIRM_NAME = rsGetTSM.getString(3);
			record.NATURE = rsGetTSM.getString(4);
			record.PREMISES_NATURE = rsGetTSM.getString(5);
			record.PREMISES_NO = rsGetTSM.getString(6);
			record.REGION = rsGetTSM.getString(7);
			record.REMARK = rsGetTSM.getString(8);
			record.LOCALITY = rsGetTSM.getString(9);
			record.TOWN_VILL = rsGetTSM.getString(10);
			record.CITY_DISTRICT = rsGetTSM.getString(11);
			record.STATE = rsGetTSM.getString(12);
			record.POSTAL_CODE = rsGetTSM.getString(13);
			record.EMAIL = rsGetTSM.getString(14);
			record.OFFICE_SPACE = rsGetTSM.getString(15);
			record.WAREHOUSE_SPACE = rsGetTSM.getString(16);
			record.CONTACT_PERSON = rsGetTSM.getString(17);
			record.CONTACT_PERSON_MOBILE = rsGetTSM.getString(18);
			record.CONTACT_PERSON_DESIGNATION = rsGetTSM.getString(19);
			record.CIN_NUMBER = rsGetTSM.getString(20);
			record.PARTNERSHIP_DEED_NUMBER = rsGetTSM.getString(21);
			record.ADHAAR = rsGetTSM.getString(22);
			record.HUF_NUMBER = rsGetTSM.getString(23);
			record.COMPANY_PROFILE = rsGetTSM.getString(24);
			record.PAN_NUMBER = rsGetTSM.getString(25);
			record.PAN_NUMBER_DOC = rsGetTSM.getString(26);
			record.TAN_NUMBER = rsGetTSM.getString(27);
			record.TAN_NUMBER_DOC = rsGetTSM.getString(28);
			record.GSTIN_NUMBER = rsGetTSM.getString(29);
			record.GSTIN_CERTIFICATE = rsGetTSM.getString(30);
			record.BANK_ACCOUNT_NUMBER = rsGetTSM.getString(31);
			record.IFSC_CODE = rsGetTSM.getString(32);
			record.CANCELLED_CHEQUE_DOC = rsGetTSM.getString(33);
			record.MOA_COMPANY = rsGetTSM.getString(34);
			record.PARTNERSHIP_DEED = rsGetTSM.getString(35);
			record.IT_RETURNS = rsGetTSM.getString(36);
			record.HUF_AGREEMENT = rsGetTSM.getString(37);
			record.COMPANY_NAME = rsGetTSM.getString(38);
			record.ASSOCIATED_FROM_DATE = rsGetTSM.getString(39);
			record.INDUSTRY_CATEGORY = rsGetTSM.getString(40);
			record.TURNOVER_LAST_THREE_MONTH = rsGetTSM.getString(41);
			record.CURRENT_INVESTMENT = rsGetTSM.getString(42);
			record.BANK_LOAN = rsGetTSM.getString(43);
			record.BANK_LIMIT = rsGetTSM.getString(44);
			record.BANK_NAME = rsGetTSM.getString(45);
			record.CURRENT_ACCOUNT_NUMBER = rsGetTSM.getString(46);
			record.FIN_STMT_LAST_THREE_MONTH = rsGetTSM.getString(47);
			record.BANK_STMT_LAST_SIX_MONTH = rsGetTSM.getString(48);
			record.INCOME_TAX_RETURN = rsGetTSM.getString(49);
			record.APPROVAL_STATUS = rsGetTSM.getString(50);
			record.STATUS = rsGetTSM.getString(51);
			record.SOFT_DEL = rsGetTSM.getString(52);
			record.CREATE_BY = rsGetTSM.getString(53);
			record.CREATE_DATE = rsGetTSM.getString(54);
			record.MODIFIED_BY = rsGetTSM.getString(55);
			record.MODIFIED_DATE = rsGetTSM.getString(56);
			record.STATUS_CODE = rsGetTSM.getString(57);
			record.STATUS_NAME = rsGetTSM.getString(72);
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
	var userType = $.request.parameters.get('userType');
	var connection = $.db.getConnection();
	var pstmtgetTSM;
	var querygetTSM;
	try {
		if (userType === "TSM") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ? and DBRP.CREATE_BY=? and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, userCode);
			pstmtgetTSM.setString(3, '4');
		} else if (userType === "BRANCH HEAD") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '7');
		} else if (userType === "SALES COORDINATOR") {
			querygetTSM =
				' Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as DBRP inner join "MDB_TEST_INTEGRATION"."DBST_STATUS" as DBSTS on DBRP.STATUS=DBSTS.STATUS_CODE where ' +
				' DBRP.SOFT_DEL = ?  and DBRP.STATUS=? ';
			pstmtgetTSM = connection.prepareStatement(querygetTSM);
			pstmtgetTSM.setString(1, '0');
			pstmtgetTSM.setString(2, '10');
		}
		var rsGetTSM = pstmtgetTSM.executeQuery();
		connection.commit();
		while (rsGetTSM.next()) {
			var record = {};
			SN = SN + 1;
			record.DBR_FORM_ID = rsGetTSM.getString(2);
			record.FIRM_NAME = rsGetTSM.getString(3);
			record.NATURE = rsGetTSM.getString(4);
			record.PREMISES_NATURE = rsGetTSM.getString(5);
			record.PREMISES_NO = rsGetTSM.getString(6);
			record.REGION = rsGetTSM.getString(7);
			record.REMARK = rsGetTSM.getString(8);
			record.LOCALITY = rsGetTSM.getString(9);
			record.TOWN_VILL = rsGetTSM.getString(10);
			record.CITY_DISTRICT = rsGetTSM.getString(11);
			record.STATE = rsGetTSM.getString(12);
			record.POSTAL_CODE = rsGetTSM.getString(13);
			record.EMAIL = rsGetTSM.getString(14);
			record.OFFICE_SPACE = rsGetTSM.getString(15);
			record.WAREHOUSE_SPACE = rsGetTSM.getString(16);
			record.CONTACT_PERSON = rsGetTSM.getString(17);
			record.CONTACT_PERSON_MOBILE = rsGetTSM.getString(18);
			record.CONTACT_PERSON_DESIGNATION = rsGetTSM.getString(19);
			record.CIN_NUMBER = rsGetTSM.getString(20);
			record.PARTNERSHIP_DEED_NUMBER = rsGetTSM.getString(21);
			record.ADHAAR = rsGetTSM.getString(22);
			record.HUF_NUMBER = rsGetTSM.getString(23);
			record.COMPANY_PROFILE = rsGetTSM.getString(24);
			record.PAN_NUMBER = rsGetTSM.getString(25);
			record.PAN_NUMBER_DOC = rsGetTSM.getString(26);
			record.TAN_NUMBER = rsGetTSM.getString(27);
			record.TAN_NUMBER_DOC = rsGetTSM.getString(28);
			record.GSTIN_NUMBER = rsGetTSM.getString(29);
			record.GSTIN_CERTIFICATE = rsGetTSM.getString(30);
			record.BANK_ACCOUNT_NUMBER = rsGetTSM.getString(31);
			record.IFSC_CODE = rsGetTSM.getString(32);
			record.CANCELLED_CHEQUE_DOC = rsGetTSM.getString(33);
			record.MOA_COMPANY = rsGetTSM.getString(34);
			record.PARTNERSHIP_DEED = rsGetTSM.getString(35);
			record.IT_RETURNS = rsGetTSM.getString(36);
			record.HUF_AGREEMENT = rsGetTSM.getString(37);
			record.COMPANY_NAME = rsGetTSM.getString(38);
			record.ASSOCIATED_FROM_DATE = rsGetTSM.getString(39);
			record.INDUSTRY_CATEGORY = rsGetTSM.getString(40);
			record.TURNOVER_LAST_THREE_MONTH = rsGetTSM.getString(41);
			record.CURRENT_INVESTMENT = rsGetTSM.getString(42);
			record.BANK_LOAN = rsGetTSM.getString(43);
			record.BANK_LIMIT = rsGetTSM.getString(44);
			record.BANK_NAME = rsGetTSM.getString(45);
			record.CURRENT_ACCOUNT_NUMBER = rsGetTSM.getString(46);
			record.FIN_STMT_LAST_THREE_MONTH = rsGetTSM.getString(47);
			record.BANK_STMT_LAST_SIX_MONTH = rsGetTSM.getString(48);
			record.INCOME_TAX_RETURN = rsGetTSM.getString(49);
			record.APPROVAL_STATUS = rsGetTSM.getString(50);
			record.STATUS = rsGetTSM.getString(51);
			record.SOFT_DEL = rsGetTSM.getString(52);
			record.CREATE_BY = rsGetTSM.getString(53);
			record.CREATE_DATE = rsGetTSM.getString(54);
			record.MODIFIED_BY = rsGetTSM.getString(55);
			record.MODIFIED_DATE = rsGetTSM.getString(56);
			record.STATUS_CODE = rsGetTSM.getString(57);
			record.STATUS_NAME = rsGetTSM.getString(72);
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

function submitEmailContent(record) {

	record.EmailContent = "<h3> Hello " + record.EMPLOYEEE_NAME + "</h3></br>" + "<p> Please Approved my Request. </p>" +
		"</br></br>" + "<p>Thanks & Regards,</p>" + "<p>" + record.FIRM_NAME +
		"</p>";
	return record;
}

function submitApprovalMail(record) {

	var connection = $.db.getConnection();

	var querysubmitApprovalMail =
		'select d.EMAIL_ID , e.EMAIL,e.EMPLOYEE_NAME,d.FIRM_NAME from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as d  inner join "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as e on  e.EMPLOYEE_CODE=d.CREATE_BY ' +
		' where DBR_FORM_ID= ? ';
	var pstmtsubmitApprovalMail = connection.prepareStatement(querysubmitApprovalMail);
	pstmtsubmitApprovalMail.setString(1, record.DBR_FORM_ID);
	var rsubmitApprovalMail = pstmtsubmitApprovalMail.executeQuery();
	connection.commit();
	if (rsubmitApprovalMail.next() > 0) {
		record.FIRM_NAME = rsubmitApprovalMail.getString(4);
		record.EMPLOYEEE_NAME = rsubmitApprovalMail.getString(3);
		record.EMPLOYEEE_EMAIL = rsubmitApprovalMail.getString(2);
		record.DSTB_EMAIL_ID = rsubmitApprovalMail.getString(1);
	}
	connection.close();

	submitEmailContent(record);
	//try {
	var mail = new $.net.Mail({
		sender: {
			address: record.DSTB_EMAIL_ID
		},
		to: [{
			address: record.EMPLOYEEE_EMAIL
			}],
		subject: "Approved request",
		subjectEncoding: "UTF-8",
		parts: [new $.net.Mail.Part({
			type: $.net.Mail.Part.TYPE_TEXT,
			text: record.EmailContent,
			contentType: "HTML",
			encoding: "UTF-8"
		})]
	});
	mail.send();
	return;
	/*var response = "MessageId = " + returnValue.messageId + ", final reply = " + returnValue.finalReply;
		$.response.status = $.net.http.OK;
		$.response.contentType = 'text/html';
		$.response.setBody(response);
	} catch (e) {

		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}*/

}

function insertApproval(record) {
	var connection = $.db.getConnection();
	var qryUpdateApproval =
		'insert into  "MDB_TEST_INTEGRATION"."CUSTOMER_APPROVAL"("DBR_FORM_ID","APPROVAL_TYPE","APPROVAL_NAME","STATUS","APPROVAL_ID" , "APPROVAL_LEVEL" ,"REMARKS") values(?,?,?,?,?,?,?)';
	var pstmtaddApproval = connection.prepareStatement(qryUpdateApproval);
	pstmtaddApproval.setString(1, record.DBR_FORM_ID);
	pstmtaddApproval.setString(2, record.APPROVAL_TYPE);
	pstmtaddApproval.setString(3, record.APPROVAL_NAME);
	pstmtaddApproval.setString(4, record.STATUS);
	pstmtaddApproval.setString(5, record.APPROVAL_ID);
	pstmtaddApproval.setString(6, record.APPROVAL_LEVEL);
	pstmtaddApproval.setString(7, record.REMARKS);

	var rsaddApproval = pstmtaddApproval.executeUpdate();
	connection.commit();
	if (rsaddApproval > 0) {
		record.status = 1;
		submitApprovalMail(record);
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function approvalSubmit(dbrFormID, dbrStatus, record) {
	var output = {
		results: []
	};
	var approvalType = 'TSM';
	var approvalLevel = 'LEVEL1';
	var remarks = 'Sucessfully Submitted';
	var connection = $.db.getConnection();
	try {
		var querySubmitApproval =
			'select *  from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as d inner join "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as e on  e.EMPLOYEE_CODE=d.CREATE_BY ' +
			' where DBR_FORM_ID= ? ';
		var pstmtSubmitApproval = connection.prepareStatement(querySubmitApproval);
		pstmtSubmitApproval.setString(1, dbrFormID);
		var rSubmitApproval = pstmtSubmitApproval.executeQuery();
		connection.commit();
		while (rSubmitApproval.next()) {

			record.DBR_FORM_ID = rSubmitApproval.getString(2);
			record.APPROVAL_TYPE = approvalType;
			record.APPROVAL_NAME = rSubmitApproval.getString(38);
			record.STATUS = rSubmitApproval.getString(24);
			record.APPROVAL_ID = rSubmitApproval.getString(26);
			record.APPROVAL_LEVEL = approvalLevel;
			record.REMARKS = remarks;
			insertApproval(record);
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

function insertretlApproval(record) {
	var connection = $.db.getConnection();
	var qryUpdateApproval =
		'insert into  "MDB_TEST_INTEGRATION"."CUSTOMER_APPROVAL"("DBR_FORM_ID","APPROVAL_TYPE","APPROVAL_NAME","STATUS","APPROVAL_ID" , "APPROVAL_LEVEL" ,"REMARKS") values(?,?,?,?,?,?,?)';
	var pstmtaddApproval = connection.prepareStatement(qryUpdateApproval);
	pstmtaddApproval.setString(1, record.DBR_FORM_ID);
	pstmtaddApproval.setString(2, record.APPROVAL_TYPE);
	pstmtaddApproval.setString(3, record.APPROVAL_NAME);
	pstmtaddApproval.setString(4, record.STATUS);
	pstmtaddApproval.setString(5, record.APPROVAL_ID);
	pstmtaddApproval.setString(6, record.APPROVAL_LEVEL);
	pstmtaddApproval.setString(7, record.REMARKS);

	var rsaddApproval = pstmtaddApproval.executeUpdate();
	connection.commit();
	if (rsaddApproval > 0) {
		record.status = 1;
		submitApprovalMail(record);
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}


function retlApprovalSubmit(dbrFormID, dbrStatus, record) {
	var output = {
		results: []
	};
	var approvalType = 'TSM';
	var approvalLevel = 'LEVEL1';
	var remarks = 'Sucessfully Submitted';
	var connection = $.db.getConnection();
	try {
		var querySubmitApproval =
		'select d.create_by , e.EMPLOYEE_NAME from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as m inner join "MDB_TEST_INTEGRATION"."DBR_PROFILE" as d	on m.parent_code=d.dbr_form_id inner join "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as e on  e.EMPLOYEE_CODE=d.create_by '+
	'	where m.dbr_form_id = ?';
			/*'select *  from "MDB_TEST_INTEGRATION"."DBR_PROFILE" as d inner join "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" as e on  e.EMPLOYEE_CODE=d.CREATE_BY ' +
			' where DBR_FORM_ID= ? ';*/
			
		var pstmtSubmitApproval = connection.prepareStatement(querySubmitApproval);
		pstmtSubmitApproval.setString(1, dbrFormID);
		var rSubmitApproval = pstmtSubmitApproval.executeQuery();
		connection.commit();
		while (rSubmitApproval.next()) {

			record.DBR_FORM_ID = rSubmitApproval.getString(2);
			record.APPROVAL_TYPE = approvalType;
			record.APPROVAL_NAME = rSubmitApproval.getString(38);
			record.STATUS = rSubmitApproval.getString(24);
			record.APPROVAL_ID = rSubmitApproval.getString(26);
			record.APPROVAL_LEVEL = approvalLevel;
			record.REMARKS = remarks;
			insertretlApproval(record);
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

function updateDBRStatus() {
	var Output = {
		results: []

	};
	var record = {};
	var connection = $.db.getConnection();
	var dbrFormID = $.request.parameters.get('dbrFormID');
	var dbrStatus = $.request.parameters.get('dbrStatus');

	try {
		var qryUpdateDBR = 'update "MDB_TEST_INTEGRATION"."DBR_PROFILE" set STATUS=? where DBR_FORM_ID=?';
		var pstmtUpdateDBR = connection.prepareStatement(qryUpdateDBR);
		pstmtUpdateDBR.setString(1, dbrStatus);
		pstmtUpdateDBR.setInteger(2, parseInt(dbrFormID, 10));

	//	pstmtUpdateDBR.execute();
		var rsUpdDBR = pstmtUpdateDBR.executeUpdate();
		connection.commit();

		if (rsUpdDBR > 0) {
			record.status = 0;
			record.message = 'Success';
			approvalSubmit(dbrFormID, dbrStatus, record);

		} else {
			record.status = 1;
			record.message = 'failed';

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

function retlupdateDBRStatus() {
	var Output = {
		results: []

	};
	var record = {};
	var connection = $.db.getConnection();
	var dbrFormID = $.request.parameters.get('dbrFormID');
	var dbrStatus = $.request.parameters.get('dbrStatus');

	try {
		var qryUpdateDBR = 'update "MDB_TEST_INTEGRATION"."DBR_PROFILE" set STATUS=? where DBR_FORM_ID=?';
		var pstmtUpdateDBR = connection.prepareStatement(qryUpdateDBR);
		pstmtUpdateDBR.setString(1, dbrStatus);
		pstmtUpdateDBR.setString(2, dbrFormID);

	//	pstmtUpdateDBR.execute();
		var rsUpdDBR = pstmtUpdateDBR.executeUpdate();
		connection.commit();

		if (rsUpdDBR > 0) {
			record.status = 0;
			record.message = 'Success';
			retlApprovalSubmit(dbrFormID, dbrStatus, record);

		} else {
			record.status = 1;
			record.message = 'failed';

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
/**
 * To update  any Distributor Registration on the behalf of DbrFormno.
 * @Param {String} array of data elements as an input.
 * @return {output} success or failure.
 * @author Shriyansi.
 */
function updateDbrDetails() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('dbrProfile');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		//	if (dataLine.length > 0) {
		//	for (var i = 0; i < dataLine.length; i++) {
		//var dicLine = dataLine[i];
		record = {};
		var qryUpdateDbrDetails = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set FIRM_NAME=? ,NATURE=? ,PREMISES_NATURE =? ,' +
			' PREMISES_NO = ? ,LOCALITY= ? , TOWN_VILL = ? , CITY_DISTRICT = ? ,STATE = ? , POSTAL_CODE= ? ,' +
			' EMAIL_ID = ? , OFFICE_SPACE =? ,WAREHOUSE_SPACE = ? ,OWNERSHIP_SINCE = ? , STATUS = ? ,COMPANY_PROFILE = ? ' +
			'  where DBR_FORM_ID=? ';
		var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
		pstmtUpdateDbrDetails.setString(1, dicLine.txtFirmEvaluationNameID);
		pstmtUpdateDbrDetails.setString(2, dicLine.NatureID);
		pstmtUpdateDbrDetails.setString(3, dicLine.PremisesID);
		pstmtUpdateDbrDetails.setString(4, dicLine.PremisesNoID);
		pstmtUpdateDbrDetails.setString(5, dicLine.LocalityID);
		pstmtUpdateDbrDetails.setString(6, dicLine.TownID);
		pstmtUpdateDbrDetails.setString(7, dicLine.DistrictID);
		pstmtUpdateDbrDetails.setString(8, dicLine.StateID);
		pstmtUpdateDbrDetails.setString(9, dicLine.PostalCodeID);
		pstmtUpdateDbrDetails.setString(10, dicLine.EmailID);
		pstmtUpdateDbrDetails.setString(11, dicLine.OfficeSpaceID);
		pstmtUpdateDbrDetails.setString(12, dicLine.WarehouseID);
		pstmtUpdateDbrDetails.setString(13, dicLine.OwnerShipId);
		pstmtUpdateDbrDetails.setString(14, dicLine.Status);
		pstmtUpdateDbrDetails.setString(15, dicLine.CompanyprofileID);
		pstmtUpdateDbrDetails.setString(16, dicLine.inputDbr);
		var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
		connection.commit();
		if (rsUpdateDbrDetails > 0) {
			record.status = 1;
			record.message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.message = 'Some Issues!';
		}
		//	}
		Output.results.push(record);
		connection.close();
		//	}
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

/*function updateCurrBussProfile() {
	var Output = {
		results: []
	};
	var record = {};
	var connection = $.db.getConnection();
	var profileArray = $.request.parameters.get('profileArray');

	try {
		var dbrInfoObject = JSON.parse(profileArray);
		var oProfileArray = dbrInfoObject.currentBussinessProfile;

		for (var i = 0; i < oProfileArray.length; i++) {
			var item = oProfileArray[i];
			record = {};
			var qryUpdateDbrDetails = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set COMPANY_NAME=? ,ASSOCIATED_FROM_DATE=? ,INDUSTRY_CATEGORY =? ,' +
				' TURNOVER_LAST_THREE_MONTH = ? , STATUS = ? ' + '  where DBR_FORM_ID=? ';
			var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
			pstmtUpdateDbrDetails.setString(1, item.Company_Name);
			var splitDate = item.Associated_From_Date.split("-");
			pstmtUpdateDbrDetails.setString(2, splitDate[1] + "." + splitDate[0] + "." + splitDate[2]);
			pstmtUpdateDbrDetails.setString(3, item.Industry_category);
			pstmtUpdateDbrDetails.setString(4, item.TurnOver);
			pstmtUpdateDbrDetails.setString(5, item.Status);
			pstmtUpdateDbrDetails.setString(6, item.inputDbr);
			var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
			connection.commit();
			if (rsUpdateDbrDetails > 0) {
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
}*/
function getCurrntBusiDetails() {
	var output = {
		results: []
	};

	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"  where  DBR_FORM_ID = ?';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, DBR_FORM_ID);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetContact.getString(1);
			record.CompanyName = rgetContact.getString(3);
			record.AssociateDate = rgetContact.getString(4);
			record.Industry = rgetContact.getString(5);
			record.AvgSPVolumn = rgetContact.getString(6);
			record.AvgSPValue = rgetContact.getString(7);
			record.SAPUSER_ID = rgetContact.getString(8);
			record.DBR_FORM_ID = rgetContact.getString(2);
			//dateFormat(record);
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

function updateFosProfile() {
	var Output = {
		results: []
	};
	var record = {};
	var connection = $.db.getConnection();
	var ofosArray = $.request.parameters.get('ofosArray');

	try {
		var dbrInfoObject = JSON.parse(ofosArray);
		var oofosArray = dbrInfoObject.fosArray;
		for (var i = 0; i < oofosArray.length; i++) {
			var item = oofosArray[i];
			record = {};
			var qryupdateFosProfile = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set FOS_NAME=? ,FOS_ID_PROOF=? ,FOS_BANK_ACCOUNT_NO =? ,' +
				' FOS_IFSC_CODE = ? , STATUS = ? ' + '  where DBR_FORM_ID=? ';
			var pstmtupdateFosProfile = connection.prepareStatement(qryupdateFosProfile);
			pstmtupdateFosProfile.setString(1, item.Name);
			/*	var splitDate = item.Associated_From_Date.split("-");
				pstmtUpdateDbrDetails.setString(2, splitDate[1] + "." + splitDate[0] + "." + splitDate[2]);*/
			pstmtupdateFosProfile.setString(2, item.Id_Proof);
			pstmtupdateFosProfile.setString(3, item.Banl_Account);
			pstmtupdateFosProfile.setString(4, item.Ifsc_Code);
			pstmtupdateFosProfile.setString(5, item.Status);
			pstmtupdateFosProfile.setString(6, item.inputDbr);
			var rsUpdateDbrDetails = pstmtupdateFosProfile.executeUpdate();
			connection.commit();
			if (rsUpdateDbrDetails > 0) {
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

function updateAllData() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('finalArray');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		record = {};
		var qryUpdateDbrDetails = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set FIRM_NAME=? ,NATURE=? ,PREMISES_NATURE =? ,' +
			' PREMISES_NO = ? ,LOCALITY= ? , TOWN_VILL = ? , CITY_DISTRICT = ? ,STATE = ? , POSTAL_CODE= ? ,' +
			' EMAIL_ID = ? , OFFICE_SPACE =? ,WAREHOUSE_SPACE = ? ,CONTACT_PERSON = ? ,' +
			' CONTACT_PERSON_MOBILE = ? ,CONTACT_PERSON_DESIGNATION= ? ,CIN_NUMBER = ? ,COMPANY_PROFILE = ? , COMPANY_NAME=? ,ASSOCIATED_FROM_DATE=? ,INDUSTRY_CATEGORY =? ,' +
			' TURNOVER_LAST_THREE_MONTH = ? , FOS_NAME=? ,FOS_ID_PROOF=? ,FOS_BANK_ACCOUNT_NO =? ,' +
			' FOS_IFSC_CODE = ? , STATUS = ? ' + '  where DBR_FORM_ID=? ';
		var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
		pstmtUpdateDbrDetails.setString(1, dicLine.txtFirmEvaluationNameID);
		pstmtUpdateDbrDetails.setString(2, dicLine.NatureID);
		pstmtUpdateDbrDetails.setString(3, dicLine.PremisesID);
		pstmtUpdateDbrDetails.setString(4, dicLine.PremisesNoID);
		pstmtUpdateDbrDetails.setString(5, dicLine.LocalityID);
		pstmtUpdateDbrDetails.setString(6, dicLine.TownID);
		pstmtUpdateDbrDetails.setString(7, dicLine.DistrictID);
		pstmtUpdateDbrDetails.setString(8, dicLine.StateID);
		pstmtUpdateDbrDetails.setString(9, dicLine.PostalCodeID);
		pstmtUpdateDbrDetails.setString(10, dicLine.EmailID);
		pstmtUpdateDbrDetails.setString(11, dicLine.OfficeSpaceID);
		pstmtUpdateDbrDetails.setString(12, dicLine.WarehouseID);
		pstmtUpdateDbrDetails.setString(13, dicLine.ContactInfoID);
		pstmtUpdateDbrDetails.setString(14, dicLine.MobileID);
		pstmtUpdateDbrDetails.setString(15, dicLine.DesignationID);
		pstmtUpdateDbrDetails.setString(16, dicLine.CINID);
		pstmtUpdateDbrDetails.setString(17, dicLine.CompanyprofileID);
		pstmtUpdateDbrDetails.setString(18, dicLine.currentBussinessProfile[0].Company_Name);
		var splitDate = dicLine.currentBussinessProfile[0].Associated_From_Date.split("-");
		pstmtUpdateDbrDetails.setString(19, splitDate[1] + "." + splitDate[0] + "." + splitDate[2]);
		pstmtUpdateDbrDetails.setString(20, dicLine.currentBussinessProfile[0].Industry_category);
		pstmtUpdateDbrDetails.setString(21, dicLine.currentBussinessProfile[0].TurnOver);
		pstmtUpdateDbrDetails.setString(22, dicLine.fosArray[0].Name);
		pstmtUpdateDbrDetails.setString(23, dicLine.fosArray[0].Id_Proof);
		pstmtUpdateDbrDetails.setString(24, dicLine.fosArray[0].Banl_Account);
		pstmtUpdateDbrDetails.setString(25, dicLine.fosArray[0].Ifsc_Code);
		pstmtUpdateDbrDetails.setString(26, dicLine.Status);
		pstmtUpdateDbrDetails.setString(27, dicLine.inputDbr);

		var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
		connection.commit();
		if (rsUpdateDbrDetails > 0) {
			record.status = 1;
			record.message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.message = 'Some Issues!';
		}
		//	}
		Output.results.push(record);
		connection.close();
		//	}
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

function previewDetails() {
	var output = {
		results: []
	};
	//	var SN = 0;
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetDBRRegist =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE"  where  DBR_FORM_ID = ?';
		var pstmtgetDBRRegist = connection.prepareStatement(querygetDBRRegist);
		pstmtgetDBRRegist.setString(1, DBR_FORM_ID);
		var rgetDBRRegist = pstmtgetDBRRegist.executeQuery();
		connection.commit();
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
			dateFormat(record);
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

function uploadLegalDocuments(filename, dbrNo, docType, docNo, records,IFSC) {
	var connection = $.db.getConnection();
	var query =
		'INSERT INTO "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" (DBR_FORM_ID, DOCTYPE, DOC_ID,FILENAME, MIMETYPE , DOC_ATTACHMENT,PARENT_CODE,IFSC_CODE) VALUES (?,?,?,?,?,?,?,?)';
	var pstmt = connection.prepareStatement(query);
	/*	var pstmt = conn.prepareStatement(
			"INSERT INTO \"MOBI\".\"FILEUPLOADS\" (FROMNO, DOCTYPE, DOCNO,FILENAME, MINETYPE , FILEVALUE) VALUES (?,?,?,?,?,?)");*/
	if ($.request.entities.length > 0) {

		var fileBody = $.request.entities[0].body.asArrayBuffer(); //asString();
		var mimeType = $.request.entities[0].contentType;

		pstmt.setInteger(1, parseInt(dbrNo, 10));
		pstmt.setString(2, docType);
		pstmt.setString(3, docNo);
		pstmt.setString(4, filename);
		pstmt.setString(5, mimeType);
		pstmt.setBlob(6, fileBody);
		pstmt.setString(7, "");
		pstmt.setString(8, IFSC);
		pstmt.execute();
	} else {
		$.response.setBody("No Entries in request");
	}

	pstmt.close();
	connection.commit();
	connection.close();

	$.response.contentType = "text/html";
	$.response.setBody("[200]:Upload for file" + filename + " was successful!");
	return;
}

function fileUpload() {
	var filename = $.request.parameters.get('filename');
	var dbrNo = $.request.parameters.get('dbrNo');
	var docType = $.request.parameters.get('docType');
	var docNo = $.request.parameters.get('docNo');
	var IFSC = $.request.parameters.get('IFSC');
	var connection = $.db.getConnection();
	var pstmt;
	try {
	   var records = {};
		var queryfileUpload = 'select  DOCTYPE from "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" where  DBR_FORM_ID = ? and  DOCTYPE = ?';
		var pstmtfileUpload = connection.prepareStatement(queryfileUpload);
		pstmtfileUpload.setString(1, dbrNo);
		pstmtfileUpload.setString(2, docType);
		var rfileUpload = pstmtfileUpload.executeQuery();
		if (rfileUpload.next()) {
		    var checkDocType = rfileUpload.getString(1);
		    if(checkDocType === docType){
		        records.status = 1;
		        $.response.contentType = "text/html";
		        $.response.setBody("Record Allready inserted!!!! Kindly add another Record.");
				
		    }else {
		        uploadLegalDocuments(filename , dbrNo , docType,docNo, records,IFSC);
		        
			/*var query =
				'INSERT INTO "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" (DBR_FORM_ID, DOCTYPE, DOC_ID,FILENAME, MIMETYPE , DOC_ATTACHMENT) VALUES (?,?,?,?,?,?)';
			var pstmt = connection.prepareStatement(query);
			if ($.request.entities.length > 0) {

				var fileBody = $.request.entities[0].body.asArrayBuffer(); //asString();
				var mimeType = $.request.entities[0].contentType;

				pstmt.setInteger(1, parseInt(dbrNo, 10));
				pstmt.setString(2, docType);
				pstmt.setString(3, docNo);
				pstmt.setString(4, filename);
				pstmt.setString(5, mimeType);
				pstmt.setBlob(6, fileBody);
				pstmt.execute();
			} else {
				$.response.setBody("No Entries in request");
			}
			
			pstmt.close();
			connection.commit();
			connection.close();
		    }
			$.response.contentType = "text/html";
			$.response.setBody("[200]:Upload for file" + filename + " was successful!");*/
		}
		}
		else{
		    uploadLegalDocuments(filename , dbrNo , docType,docNo, records,IFSC);
		}

}	catch (err) {
		if (pstmt !== null) {
			pstmt.close();
		}
		$.response.contentType = "text/html";
		$.response.setBody("File could not be saved in the database.  Here is the error:" + err.message);
	}
}

function getfileUpload() {
	var query;
	var image;
	var conn = $.db.getConnection();
	try {

		query = 'select FILEVALUE from "MDB_TEST_INTEGRATION"."FILEUPLOADS" where SRNO = ?';
		var pstmt = conn.prepareStatement(query);
		pstmt.setInteger(1, 2);
		var rs = pstmt.executeQuery();
		if (rs.next()) {
			image = rs.getBlob(1);
		}
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	$.response.setBody(image);
	$.response.contentType = 'image/jpg';
	$.response.status = $.net.http.OK;

}

function getUpload() {
	var output = {
		results: []
	};
	var record;
	var dbrFormId = $.request.parameters.get('dbrNo');
	var connection = $.db.getConnection();
	try {

		var query = 'select FILENAME ,DOCTYPE , DOC_ID from "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" where DBR_FORM_ID = ?';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, dbrFormId);
		var rsgetFileName = pstmt.executeQuery();
		while (rsgetFileName.next()) {
			record = {};
			record.FILENAME = rsgetFileName.getString(1);
			record.DOCTYPE = rsgetFileName.getString(2);
			record.DOC_ID = rsgetFileName.getString(3);

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

function insertContactDetails(dicLine, records) {
	var connection = $.db.getConnection();
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DIRECTOR_PROFILE"("DBR_FORM_ID","CONTACT_INFO_NAME","FATHER_NAME","CONTACT_NUMBER","DESIGNATION" ,"PARENT_CODE") values(?,?,?,?,?,?)';
	var pstmtaddContact = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtaddContact.setString(1, dicLine.inputDbr);
	pstmtaddContact.setString(2, dicLine.ContactName);
	pstmtaddContact.setString(3, dicLine.FatherName);
	pstmtaddContact.setString(4, dicLine.ContactNo);
	pstmtaddContact.setString(5, dicLine.Designation);
	pstmtaddContact.setString(6, dicLine.parentCode);
	var rsaddContact = pstmtaddContact.executeUpdate();
	connection.commit();
	if (rsaddContact > 0) {
		records.status = 1;
		records.message = 'Data Uploaded Sucessfully';
	} else {
		records.status = 0;
		records.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function addContact() {
	var records = {};
	var output = {
		results: []
	};
	var datasLine = $.request.parameters.get('contactData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	var pstmtdelete, rsdelete;
	try {
		if (dataLine.length > 0) {
			var qryDel = ' delete from "MDB_TEST_INTEGRATION"."DIRECTOR_PROFILE" where DBR_FORM_ID=? ';
			pstmtdelete = connection.prepareStatement(qryDel);
			pstmtdelete.setString(1, dataLine[0].inputDbr);
			rsdelete = pstmtdelete.executeUpdate();
			connection.commit();
			if (rsdelete > 0) {}

			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				insertContactDetails(dicLine, records);
			}
			output.results.push(records);
			connection.close();
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

function getContact(){
 var output = {
		results: []
	};
	//	var SN = 0;
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."DIRECTOR_PROFILE"  where  DBR_FORM_ID = ?';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, DBR_FORM_ID);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetContact.getString(1);
			record.ContactName = rgetContact.getString(2);
			record.FatherName = rgetContact.getString(3);
			record.ContactNo = rgetContact.getString(4);
			record.Designation = rgetContact.getString(5);
			record.SAPUSER_ID = rgetContact.getString(6);
			record.DBR_FORM_ID = rgetContact.getString(7);
			//dateFormat(record);
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
/*function getContact() {
	var output = {
		results: []
	};
	var status ='1';
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."DIRECTOR_PROFILE" as d inner join "MDB_TEST_INTEGRATION"."DBR_PROFILE" as md on d.DBR_FORM_ID = md.DBR_FORM_ID where  d.PARENT_CODE = ? and md.status=? ';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, DBR_FORM_ID);
		pstmtgetContact.setString(2, status);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetContact.getString(1);
			record.ContactName = rgetContact.getString(2);
			record.FatherName = rgetContact.getString(3);
			record.ContactNo = rgetContact.getString(4);
			record.Designation = rgetContact.getString(5);
			record.SAPUSER_ID = rgetContact.getString(6);
			record.DBR_FORM_ID = rgetContact.getString(7);
			//dateFormat(record);
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
*/
function insertRETLCurntBusinessProfile(dicLine, record) {
	var connection = $.db.getConnection();
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"("COMPANY_NAME" ,"ASSOCIATED_FROM" ,"INDUSTRY_CATEGORY", "SP_VOLUME_AVG" , "SP_VALUE_AVG" , "DBR_FORM_ID" , "RETAILER_STATUS", "PARENT_CODE" ) values(?,?,?,?,?,?,?,?) ';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dicLine.CompanyName);
	pstmtUpdateDbrDetails.setString(2, dicLine.AssociateDate);
	/*var splitDate = dicLine.AssociateDate.split("-");
				pstmtUpdateDbrDetails.setString(splitDate[2] + "." + splitDate[1] + "." + splitDate[0]);*/
	pstmtUpdateDbrDetails.setString(3, dicLine.Industry);
	pstmtUpdateDbrDetails.setString(4, dicLine.AvgSPVolumn);
	pstmtUpdateDbrDetails.setString(5, dicLine.AvgSPValue);
	pstmtUpdateDbrDetails.setString(6, record.dataid);
	pstmtUpdateDbrDetails.setString(7, record.status);
	pstmtUpdateDbrDetails.setString(8, dicLine.user_code);
	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function addCurrBussProfile() {
	var Output = {
		results: []
	};
	var record = {};
	var datasLine = $.request.parameters.get('businessArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var queryselect = 'select * from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" where DBR_FORM_ID=? ';
				var paramSelect = connection.prepareStatement(queryselect);
				paramSelect.setString(1, dicLine.inputDbr);
				var rsSelect = paramSelect.executeQuery();
				connection.commit();
				if (rsSelect.next()) {
					var qryDel = ' delete from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" where DBR_FORM_ID=? ';
					var pstmtdelete = connection.prepareStatement(qryDel);
					pstmtdelete.setString(1, dicLine.inputDbr);
					var rsdelete = pstmtdelete.executeUpdate();
					connection.commit();
					if (rsdelete > 0) {
						insertCurntBusinessProfile(dicLine, record);
					}
				} else {
					insertCurntBusinessProfile(dicLine, record);
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

function updateInvestmentDetails() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('investmentArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var qryupdateInvestmentDetails = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set CURRENT_INVESTMENT=? ,BANK_LOAN=? ,BANK_LIMIT =? ,' +
					' BANK_NAME = ? ,CURRENT_ACCOUNT_NUMBER= ? ' + '  where DBR_FORM_ID=? ';
				var pstmtupdateInvestmentDetails = connection.prepareStatement(qryupdateInvestmentDetails);
				pstmtupdateInvestmentDetails.setString(1, dicLine.currentInvestment);
				pstmtupdateInvestmentDetails.setString(2, dicLine.bankLoan);
				pstmtupdateInvestmentDetails.setString(3, dicLine.bankLimit);
				pstmtupdateInvestmentDetails.setString(4, dicLine.bankName);
				pstmtupdateInvestmentDetails.setString(5, dicLine.accountNo);
				pstmtupdateInvestmentDetails.setString(6, dicLine.inputDbr);
				var rsupdateInvestmentDetails = pstmtupdateInvestmentDetails.executeUpdate();
				connection.commit();
				if (rsupdateInvestmentDetails > 0) {
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
				} else {
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

function addFosDetails(dicLine, record) {
	var connection = $.db.getConnection();
	var qryaddFosDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_FOS_DETAILS"("NAME" ,"DOC_ID" ,"DOC_TYPE", "BANK_ACCOUNT" , "IFSC_CODE" , "DBR_FORM_ID" ) values(?,?,?,?,?,?) ';
	var pstmtaddFosDetails = connection.prepareStatement(qryaddFosDetails);
	pstmtaddFosDetails.setString(1, dicLine.Name);
	pstmtaddFosDetails.setString(2, dicLine.Id_ProofNo);
	pstmtaddFosDetails.setString(3, dicLine.Id_ProofType);
	pstmtaddFosDetails.setString(4, dicLine.Banl_Account);
	pstmtaddFosDetails.setString(5, dicLine.Ifsc_Code);
	pstmtaddFosDetails.setString(6, dicLine.inputDbr);
	var rsaddFosDetails = pstmtaddFosDetails.executeUpdate();
	connection.commit();
	if (rsaddFosDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function validateFosDetails() {
	var Output = {
		results: []
	};
	var record = {};
	var datasLine = $.request.parameters.get('fosArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			var qryDel = ' delete from "MDB_TEST_INTEGRATION"."DBR_FOS_DETAILS" where DBR_FORM_ID=? ';
			var pstmtdelete = connection.prepareStatement(qryDel);
			pstmtdelete.setString(1, dataLine[0].inputDbr);
			var rsdelete = pstmtdelete.executeUpdate();
			connection.commit();
			if (rsdelete > 0) {}
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				addFosDetails(dicLine, record);
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

function getFosDetails() {
	var output = {
		results: []
	};
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_FOS_DETAILS"  where  DBR_FORM_ID = ?';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, DBR_FORM_ID);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetContact.getString(1);
			/*	record.ContactName = rgetContact.getString(2);*/
			record.Name = rgetContact.getString(3);
			record.Id_ProofNo = rgetContact.getString(4);
			record.Id_ProofType = rgetContact.getString(5);
			record.Banl_Account = rgetContact.getString(6);
			record.Ifsc_Code = rgetContact.getString(7);
			record.SAPUSER_ID = rgetContact.getString(8);
			record.DBR_FORM_ID = rgetContact.getString(2);
			//dateFormat(record);
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

function getParentEmp() {
	var output = {
		results: []
	};
	var EMPLOYEE_CODE = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_FOS_DETAILS"  where  DBR_FORM_ID = ?';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, EMPLOYEE_CODE);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetContact.getString(1);
			/*	record.ContactName = rgetContact.getString(2);*/
			record.Name = rgetContact.getString(3);
			record.Id_ProofNo = rgetContact.getString(4);
			record.Id_ProofType = rgetContact.getString(5);
			record.Banl_Account = rgetContact.getString(6);
			record.Ifsc_Code = rgetContact.getString(7);
			record.SAPUSER_ID = rgetContact.getString(8);
			record.DBR_FORM_ID = rgetContact.getString(2);
			//dateFormat(record);
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

function Otherpreferences() {

	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."PREFERRED PARTNER" ';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.NAME = rgetContact.getString(2);
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

function retailerTypes() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var queryretailerTypes =
			'Select * from "MDB_TEST_INTEGRATION"."RETAILER_TYPES" ';
		var pstmtretailerTypes = connection.prepareStatement(queryretailerTypes);
		var rretailerTypes = pstmtretailerTypes.executeQuery();
		connection.commit();
		while (rretailerTypes.next()) {
			var record = {};
			record.CODE = rretailerTypes.getString(2);
			record.NAME = rretailerTypes.getString(3);
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

function insertOtherDetails(dicLine, record) {
	var connection = $.db.getConnection();
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_PROFILE"("RETAILER_TYPE" ,"RETAILER_WEEKLY_DAY_OFF" ,"RETAILER_SHOP_SIZE", "RETAILER_TOWN_TIER" , "RETAILER_XIAOMI_PREF_PARTNER" , "RETAILER_MOTO_PREF_PARTNER" , "RETAILER_OTHER_PREF", "PARENT_CODE" ,"DBR_FORM_ID") values(?,?,?,?,?,?,?,?,?) ';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dicLine.retailerType);
	pstmtUpdateDbrDetails.setString(2, dicLine.IdWeekly);
	pstmtUpdateDbrDetails.setString(3, dicLine.IdBankLimit);
	pstmtUpdateDbrDetails.setString(4, dicLine.Town);
	pstmtUpdateDbrDetails.setString(5, dicLine.xiaomi);
	pstmtUpdateDbrDetails.setString(6, dicLine.moto);
	pstmtUpdateDbrDetails.setString(7, dicLine.others);
	pstmtUpdateDbrDetails.setString(8, dicLine.inputDbr);
	pstmtUpdateDbrDetails.setString(9, dicLine.dbrform);
	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function updateOtherDetails() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('investmentArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var qryupdateInvestmentDetails =
					'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set RETAILER_TYPE=? ,RETAILER_WEEKLY_DAY_OFF=? ,RETAILER_SHOP_SIZE =? ,' +
					' RETAILER_TOWN_TIER = ? ,RETAILER_XIAOMI_PREF_PARTNER= ? , RETAILER_MOTO_PREF_PARTNER = ? ,RETAILER_OTHER_PREF = ? , PARENT_CODE =? ' +
					'  where DBR_FORM_ID=? ';
				var pstmtupdateInvestmentDetails = connection.prepareStatement(qryupdateInvestmentDetails);
				pstmtupdateInvestmentDetails.setString(1, dicLine.retailerType);
				pstmtupdateInvestmentDetails.setString(2, dicLine.IdWeekly);
				pstmtupdateInvestmentDetails.setString(3, dicLine.IdBankLimit);
				pstmtupdateInvestmentDetails.setString(4, dicLine.Town);
				pstmtupdateInvestmentDetails.setString(5, dicLine.xiaomi);
				pstmtupdateInvestmentDetails.setString(6, dicLine.moto);
				pstmtupdateInvestmentDetails.setString(7, dicLine.others);
				pstmtupdateInvestmentDetails.setString(8, dicLine.inputDbr);
				pstmtupdateInvestmentDetails.setString(9, dicLine.dbrform);
				var rsupdateInvestmentDetails = pstmtupdateInvestmentDetails.executeUpdate();
				connection.commit();
				if (rsupdateInvestmentDetails > 0) {
					record.status = 1;
					record.message = 'Data Uploaded Sucessfully';
				} else {
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
/*function updateOtherDetails(){
    var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('investmentArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				var queryselect = 'select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" where DBR_FORM_ID=? ';
				var paramSelect = connection.prepareStatement(queryselect);
				paramSelect.setString(1, dicLine.inputDbr);
				var rsSelect = paramSelect.executeQuery();
				connection.commit();
				if (rsSelect.next()) {
					var qryDel = ' delete from "MDB_TEST_INTEGRATION"."DBR_PROFILE" where DBR_FORM_ID=? ';
					var pstmtdelete = connection.prepareStatement(qryDel);
					pstmtdelete.setString(1, dicLine.inputDbr);
					var rsdelete = pstmtdelete.executeUpdate();
					connection.commit();
					if (rsdelete > 0) {
						insertOtherDetails(dicLine, record);
					}
				} else {
					insertOtherDetails(dicLine, record);
				}
				Output.results.push(record);
				connection.close();
			}
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
}*/

function getOtherDetails() {
	var output = {
		results: []
	};
	//	var SN = 0;
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var connection = $.db.getConnection();
	try {
		var querygetOtherDetails =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE"  where  DBR_FORM_ID = ?';
		var pstmtgetOtherDetails = connection.prepareStatement(querygetOtherDetails);
		pstmtgetOtherDetails.setString(1, DBR_FORM_ID);
		var rgetOtherDetails = pstmtgetOtherDetails.executeQuery();
		connection.commit();
		while (rgetOtherDetails.next()) {
			var record = {};
			/*	record.DBR_FORM_ID = rgetOtherDetails.getString(1);*/
			record.RETAILER_TYPE = rgetOtherDetails.getString(28);
			record.RETAILER_WEEKLY_DAY_OFF = rgetOtherDetails.getString(29);
			record.RETAILER_SHOP_SIZE = rgetOtherDetails.getString(30);
			record.RETAILER_TOWN_TIER = rgetOtherDetails.getString(31);
			record.RETAILER_XIAOMI_PREF_PARTNER = rgetOtherDetails.getString(33);
			record.RETAILER_MOTO_PREF_PARTNER = rgetOtherDetails.getString(34);
			record.RETAILER_OTHER_PREF = rgetOtherDetails.getString(35);
			//dateFormat(record);
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

function insertRETLCurntBusinessProfileStatus(dataid, status,parentCode, record) {
	var connection = $.db.getConnection();
/*	var qrydeleteDbrDetails = 'delete from  "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" where DBR_FORM_ID=?';
	var pstmtdeleteDbrDetails = connection.prepareStatement(qrydeleteDbrDetails);
	pstmtdeleteDbrDetails.setString(1, dataid);
	var rsdeleteDbrDetails = pstmtdeleteDbrDetails.executeUpdate();
	connection.commit();*/
	
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"("DBR_FORM_ID" , "RETAILER_STATUS","PARENT_CODE") values(?,? ,?) ';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dataid);
	pstmtUpdateDbrDetails.setString(2, status);
	pstmtUpdateDbrDetails.setString(3, parentCode);
	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

/*function insertRETLCurntBusinessProfile(dicLine, record) {
	var connection = $.db.getConnection();
	var qryUpdateDbrDetails =
		'insert into  "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"("COMPANY_NAME" ,"ASSOCIATED_FROM" ,"INDUSTRY_CATEGORY", "SP_VOLUME_AVG" , "SP_VALUE_AVG" , "DBR_FORM_ID" , "RETAILER_STATUS" , "PARENT_CODE") values(?,?,?,?,?,?,?,?) ';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dicLine.CompanyName);
	pstmtUpdateDbrDetails.setString(2, dicLine.AssociateDate);
	/*var splitDate = dicLine.AssociateDate.split("-");
				pstmtUpdateDbrDetails.setString(splitDate[2] + "." + splitDate[1] + "." + splitDate[0]);*/
/*pstmtUpdateDbrDetails.setString(3, dicLine.Industry);
	pstmtUpdateDbrDetails.setString(4, dicLine.AvgSPVolumn);
	pstmtUpdateDbrDetails.setString(5, dicLine.AvgSPValue);
	pstmtUpdateDbrDetails.setString(6, dicLine.inputDbr);
	pstmtUpdateDbrDetails.setString(7, record.status);
		pstmtUpdateDbrDetails.setString(8, record.user_code);
	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}*/

function addRETLCurrBussProfile() {
	var Output = {
		results: []
	};
	var record = {};
	var status = $.request.parameters.get('retailerstatus');
	var dataid = $.request.parameters.get('dbrForm');
	var parentCode = $.request.parameters.get('parentCode');
	var datasLine = $.request.parameters.get('businessArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				record.status = status;
				record.dataid = dataid;
				var queryselect = 'select * from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" where DBR_FORM_ID=? ';
				var paramSelect = connection.prepareStatement(queryselect);
				paramSelect.setString(1, dataid);
				var rsSelect = paramSelect.executeQuery();
				connection.commit();
				if (rsSelect.next()) {
					var qryDel = ' delete from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" where DBR_FORM_ID=? ';
					var pstmtdelete = connection.prepareStatement(qryDel);
					pstmtdelete.setString(1, dataid);
					var rsdelete = pstmtdelete.executeUpdate();
					connection.commit();
					if (rsdelete > 0) {
						insertRETLCurntBusinessProfile(dicLine, record);
					}
				} else {
					insertRETLCurntBusinessProfile(dicLine, record);
				}
				
			}
		} else {
			insertRETLCurntBusinessProfileStatus(dataid, status, parentCode ,record);
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

function getRETLCurrntBusiDetails() {
	var output = {
		results: []
	};

	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var status ='1';
	var connection = $.db.getConnection();
	try {
		var queryRETLCurrntBusiDetails =
		//	'Select * from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE"  where  DBR_FORM_ID = ?';
		'Select * from "MDB_TEST_INTEGRATION"."DBR_BUSI_PROFILE" as b inner join "MDB_TEST_INTEGRATION"."DBR_PROFILE" as d on b.PARENT_CODE=d.PARENT_CODE where  b.DBR_FORM_ID =? and d.status=?'; 
		var pstmtRETLCurrntBusiDetails = connection.prepareStatement(queryRETLCurrntBusiDetails);
		pstmtRETLCurrntBusiDetails.setString(1, DBR_FORM_ID);
		pstmtRETLCurrntBusiDetails.setString(2, status);
		var rgetRETLCurrntBusiDetails = pstmtRETLCurrntBusiDetails.executeQuery();
		connection.commit();
		while (rgetRETLCurrntBusiDetails.next()) {
			var record = {};
			record.DIR_PROFILE_ID = rgetRETLCurrntBusiDetails.getString(1);
			record.CompanyName = rgetRETLCurrntBusiDetails.getString(3);
			record.AssociateDate = rgetRETLCurrntBusiDetails.getString(4);
			record.Industry = rgetRETLCurrntBusiDetails.getString(5);
			record.AvgSPVolumn = rgetRETLCurrntBusiDetails.getString(6);
			record.AvgSPValue = rgetRETLCurrntBusiDetails.getString(7);
			record.SAPUSER_ID = rgetRETLCurrntBusiDetails.getString(8);
			record.DBR_FORM_ID = rgetRETLCurrntBusiDetails.getString(2);
			record.RETAILER_STATUS = rgetRETLCurrntBusiDetails.getString(9);
			//dateFormat(record);
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

function RetlPreviewDetails() {
	var output = {
		results: []
	};
	//	var SN = 0;
	var DBR_FORM_ID = $.request.parameters.get('DBR_FORM_ID');
	var STATUS = '1';
	var connection = $.db.getConnection();
	try {
		var querygetDBRRegist =
			'Select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE"  where  	PARENT_CODE = ? and Status = ? ';
		var pstmtgetDBRRegist = connection.prepareStatement(querygetDBRRegist);
		pstmtgetDBRRegist.setString(1, DBR_FORM_ID);
		pstmtgetDBRRegist.setString(2, '1');

		var rgetDBRRegist = pstmtgetDBRRegist.executeQuery();
		connection.commit();
		while (rgetDBRRegist.next()) {
			var record = {};
			record.PARENT_CODE = rgetDBRRegist.getString(36);
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
			record.RETAILER_TYPE = rgetDBRRegist.getString(28);
			record.RETAILER_WEEKLY_DAY_OFF = rgetDBRRegist.getString(29);
			record.RETAILER_SHOP_SIZE = rgetDBRRegist.getString(30);
			record.RETAILER_TOWN_TIER = rgetDBRRegist.getString(31);
			record.RETAILER_XIAOMI_PREF_PARTNER = rgetDBRRegist.getString(33);
			record.RETAILER_MOTO_PREF_PARTNER = rgetDBRRegist.getString(34);
			record.RETAILER_OTHER_PREF = rgetDBRRegist.getString(35);

			dateFormat(record);
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

function addPromotorDetails(dicLine, record) {
	var connection = $.db.getConnection();
	var qryaddFosDetails =
		'insert into  "MDB_TEST_INTEGRATION"."PROMOTER_DETAILS"("BRAND_NAME" ,"PROMOTER_COUNT" , "DBR_PROFILE_ID" ,"PARENT_CODE") values(?,?,?,?) ';
	var pstmtaddFosDetails = connection.prepareStatement(qryaddFosDetails);
	pstmtaddFosDetails.setString(1, dicLine.Name);
	pstmtaddFosDetails.setString(2, dicLine.Id_ProofNo);
	pstmtaddFosDetails.setString(3, dicLine.dbrform);
	pstmtaddFosDetails.setString(4, dicLine.inputDbr);
	var rsaddFosDetails = pstmtaddFosDetails.executeUpdate();
	connection.commit();
	if (rsaddFosDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function validatePromotorDetails() {
	var Output = {
		results: []
	};
	var record = {};
	var datasLine = $.request.parameters.get('fosArray');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var connection = $.db.getConnection();
	try {
		if (dataLine.length > 0) {
			var qryDel = ' delete from "MDB_TEST_INTEGRATION"."PROMOTER_DETAILS" where DBR_PROFILE_ID=? ';
			var pstmtdelete = connection.prepareStatement(qryDel);
			pstmtdelete.setString(1, dataLine[0].dbrform);
			var rsdelete = pstmtdelete.executeUpdate();
			connection.commit();
			if (rsdelete > 0) {

			}
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				addPromotorDetails(dicLine, record);
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

function getRETLDetails() {
	var output = {
		results: []
	};
	var DBR_PROFILE_ID = $.request.parameters.get('DBR_PROFILE_ID');
	var connection = $.db.getConnection();
	try {
		var querygetContact =
			'Select * from "MDB_TEST_INTEGRATION"."PROMOTER_DETAILS"  where  DBR_PROFILE_ID = ?';
		var pstmtgetContact = connection.prepareStatement(querygetContact);
		pstmtgetContact.setString(1, DBR_PROFILE_ID);
		var rgetContact = pstmtgetContact.executeQuery();
		connection.commit();
		while (rgetContact.next()) {
			var record = {};
			record.DBR_PROFILE_ID = rgetContact.getString(2);
			record.Name = rgetContact.getString(3);
			record.Id_ProofNo = rgetContact.getString(4);
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

function insertFirstStagedata(dicLine, record) {
	var connection = $.db.getConnection();
	getRETLCode(dicLine);
	var qryUpdateDbrDetails =
		' insert  into  "MDB_TEST_INTEGRATION"."DBR_PROFILE"("DBR_FORM_ID","FIRM_NAME" ,"NATURE" ,"PREMISES_NATURE" , "PREMISES_NO" ,"LOCALITY" , "TOWN_VILL", "CITY_DISTRICT", "STATE" , "POSTAL_CODE" ,"EMAIL_ID" , "OFFICE_SPACE" ,"WAREHOUSE_SPACE" ,"OWNERSHIP_SINCE" , "STATUS" ,"COMPANY_PROFILE","PARENT_CODE","CREATE_BY") values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
	var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
	pstmtUpdateDbrDetails.setString(1, dicLine.RETLCODE);
	pstmtUpdateDbrDetails.setString(2, dicLine.txtFirmEvaluationNameID);
	pstmtUpdateDbrDetails.setString(3, dicLine.NatureID);
	pstmtUpdateDbrDetails.setString(4, dicLine.PremisesID);
	pstmtUpdateDbrDetails.setString(5, dicLine.PremisesNoID);
	pstmtUpdateDbrDetails.setString(6, dicLine.LocalityID);
	pstmtUpdateDbrDetails.setString(7, dicLine.TownID);
	pstmtUpdateDbrDetails.setString(8, dicLine.DistrictID);
	pstmtUpdateDbrDetails.setString(9, dicLine.StateID);
	pstmtUpdateDbrDetails.setString(10, dicLine.PostalCodeID);
	pstmtUpdateDbrDetails.setString(11, dicLine.EmailID);
	pstmtUpdateDbrDetails.setString(12, dicLine.OfficeSpaceID);
	pstmtUpdateDbrDetails.setString(13, dicLine.WarehouseID);
	pstmtUpdateDbrDetails.setString(14, dicLine.OwnerShipId);
	pstmtUpdateDbrDetails.setString(15, dicLine.Status);
	pstmtUpdateDbrDetails.setString(16, dicLine.CompanyprofileID);
	pstmtUpdateDbrDetails.setString(17, dicLine.ParentCode);
	pstmtUpdateDbrDetails.setString(18, dicLine.ParentCode);
	var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();

	connection.commit();
	if (rsUpdateDbrDetails > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
		updateRETLCode(dicLine);
	} else {
		record.status = 0;
		record.message = 'Some Issues!';
	}

	connection.close();
	return;
}

function updateRetlDetails() {
	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var quryCmd = $.request.parameters.get('quryCmd');
	var datasLine = $.request.parameters.get('dbrProfile');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {

		record = {};
		var queryselect = 'select * from "MDB_TEST_INTEGRATION"."DBR_PROFILE" where DBR_FORM_ID=? ';
		var paramSelect = connection.prepareStatement(queryselect);
		paramSelect.setString(1, dicLine.inputDbr);
		var rsSelect = paramSelect.executeQuery();
		connection.commit();
		if (rsSelect.next()) {
			var qryUpdateDbrDetails = 'update  "MDB_TEST_INTEGRATION"."DBR_PROFILE"  set  FIRM_NAME=? ,NATURE=? ,PREMISES_NATURE =? ,' +
				' PREMISES_NO = ? ,LOCALITY= ? , TOWN_VILL = ? , CITY_DISTRICT = ? ,STATE = ? , POSTAL_CODE= ? ,' +
				' EMAIL_ID = ? , OFFICE_SPACE =? ,WAREHOUSE_SPACE = ? ,OWNERSHIP_SINCE = ? , STATUS = ? ,COMPANY_PROFILE = ? ' +
				'  where  DBR_FORM_ID = ? ';
			var pstmtUpdateDbrDetails = connection.prepareStatement(qryUpdateDbrDetails);
			pstmtUpdateDbrDetails.setString(1, dicLine.txtFirmEvaluationNameID);
			pstmtUpdateDbrDetails.setString(2, dicLine.NatureID);
			pstmtUpdateDbrDetails.setString(3, dicLine.PremisesID);
			pstmtUpdateDbrDetails.setString(4, dicLine.PremisesNoID);
			pstmtUpdateDbrDetails.setString(5, dicLine.LocalityID);
			pstmtUpdateDbrDetails.setString(6, dicLine.TownID);
			pstmtUpdateDbrDetails.setString(7, dicLine.DistrictID);
			pstmtUpdateDbrDetails.setString(8, dicLine.StateID);
			pstmtUpdateDbrDetails.setString(9, dicLine.PostalCodeID);
			pstmtUpdateDbrDetails.setString(10, dicLine.EmailID);
			pstmtUpdateDbrDetails.setString(11, dicLine.OfficeSpaceID);
			pstmtUpdateDbrDetails.setString(12, dicLine.WarehouseID);
			pstmtUpdateDbrDetails.setString(13, dicLine.OwnerShipId);
			pstmtUpdateDbrDetails.setString(14, dicLine.Status);
			pstmtUpdateDbrDetails.setString(15, dicLine.CompanyprofileID);
			pstmtUpdateDbrDetails.setString(16, dicLine.inputDbr);
			var rsUpdateDbrDetails = pstmtUpdateDbrDetails.executeUpdate();
		} else {
			insertFirstStagedata(dicLine, record);
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

function retluploadLegalDocuments(filename, inputDbr, docType, docNo, records, PARENT_CODE) {
	var connection = $.db.getConnection();
	var query =
		'INSERT INTO "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" (DBR_FORM_ID, DOCTYPE, DOC_ID,FILENAME, MIMETYPE , DOC_ATTACHMENT ,PARENT_CODE) VALUES (?,?,?,?,?,?,?)';
	var pstmt = connection.prepareStatement(query);
	if ($.request.entities.length > 0) {

		var fileBody = $.request.entities[0].body.asArrayBuffer(); //asString();
		var mimeType = $.request.entities[0].contentType;

		pstmt.setInteger(1, parseInt(inputDbr, 10));
		pstmt.setString(2, docType);
		pstmt.setString(3, docNo);
		pstmt.setString(4, filename);
		pstmt.setString(5, mimeType);
		pstmt.setBlob(6, fileBody);
		pstmt.setInteger(7, parseInt(PARENT_CODE, 10));
		pstmt.execute();
	} else {
		$.response.setBody("No Entries in request");
	}

	pstmt.close();
	connection.commit();
	connection.close();

	$.response.contentType = "text/html";
	$.response.setBody("[200]:Upload for file" + filename + " was successful!");
	return;
}

function retlFileUpload() {
	var filename = $.request.parameters.get('filename');
	var PARENT_CODE = $.request.parameters.get('PARENT_CODE');
	var docType = $.request.parameters.get('docType');
	var docNo = $.request.parameters.get('docNo');
	var inputDbr = $.request.parameters.get('dbrno');
	var connection = $.db.getConnection();
	var pstmt;
	try {
		var records = {};
		var queryfileUpload = 'select  DOCTYPE from "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" where  DBR_FORM_ID = ? and  DOCTYPE = ?';
		var pstmtfileUpload = connection.prepareStatement(queryfileUpload);
		pstmtfileUpload.setString(1, inputDbr);
		pstmtfileUpload.setString(2, docType);
		var rfileUpload = pstmtfileUpload.executeQuery();
		if (rfileUpload.next()) {
			var checkDocType = rfileUpload.getString(1);
			if (checkDocType === docType) {
				records.status = 1;
				$.response.contentType = "text/html";
				$.response.setBody("Record Allready inserted!!!! Kindly add another Record.");

			} else {
				retluploadLegalDocuments(filename, inputDbr, docType, docNo, records, PARENT_CODE);

				/*var query =
				'INSERT INTO "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" (DBR_FORM_ID, DOCTYPE, DOC_ID,FILENAME, MIMETYPE , DOC_ATTACHMENT ,PARENT_CODE) VALUES (?,?,?,?,?,?,?)';
			var pstmt = connection.prepareStatement(query);
			if ($.request.entities.length > 0) {

				var fileBody = $.request.entities[0].body.asArrayBuffer(); //asString();
				var mimeType = $.request.entities[0].contentType;

				pstmt.setInteger(1, parseInt(dbrNo, 10));
				pstmt.setString(2, docType);
				pstmt.setString(3, docNo);
				pstmt.setString(4, filename);
				pstmt.setString(5, mimeType);
				pstmt.setBlob(6, fileBody);
				psmt.setInteger(7 , parseInt(PARENT_CODE ,10);
				pstmt.execute();
			} else {
				$.response.setBody("No Entries in request");
			}
			
			pstmt.close();
			connection.commit();
			connection.close();
		    }
			$.response.contentType = "text/html";
			$.response.setBody("[200]:Upload for file" + filename + " was successful!");*/
			}
		} else {
			retluploadLegalDocuments(filename, inputDbr, docType, docNo, records, PARENT_CODE);
		}

	} catch (err) {

		$.response.contentType = "text/html";
		$.response.setBody("File could not be saved in the database.  Here is the error:" + err.message);
	}
}

function retlGetUpload() {
	var output = {
		results: []
	};
	var record;
	var dbrFormId = $.request.parameters.get('DBR_FORM_ID');
	/*var status = $.request.parameters.get('status');*/
	var connection = $.db.getConnection();
	try {

		var query = 'select FILENAME ,DOCTYPE , DOC_ID from "MDB_TEST_INTEGRATION"."CUSTOMER_LEGAL_INFO" where DBR_FORM_ID = ? ';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, dbrFormId);
		/*	pstmt.setString(2, status);*/
		var rsgetFileName = pstmt.executeQuery();
		while (rsgetFileName.next()) {
			record = {};
			record.FILENAME = rsgetFileName.getString(1);
			record.DOCTYPE = rsgetFileName.getString(2);
			record.DOC_ID = rsgetFileName.getString(3);

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
	case "addDBRRegistration":
		addDBRRegistration();
		break;
	case "getDBRRegistrations":
		getDBRRegistrations();
		break;
	case "deleteDBRRegistration":
		deleteDBRRegistration();
		break;
	case "updateDbrDetails":
		updateDbrDetails();
		break;
	case "addCurrBussProfile":
		addCurrBussProfile();
		break;
	case "getPendingDBRRequest":
		getPendingDBRRequest();
		break;

	case "getApprovedDBRRequest":
		getApprovedDBRRequest();
		break;
	case "updateFosProfile":
		updateFosProfile();
		break;
	case "updateAllData":
		updateAllData();
		break;
	case "previewDetails":
		previewDetails();
		break;
	case "fileUpload":
		fileUpload();
		break;
	case "getfileUpload":
		getfileUpload();
		break;
	case "getRejectDBRRequest":
		getRejectDBRRequest();
		break;
	case "addContact":
		addContact();
		break;
	case "getContact":
		getContact();
		break;

	case "getPendDBRRequest":
		getPendDBRRequest();
		break;
	case "getUpload":
		getUpload();
		break;
	case "getCurrntBusiDetails":
		getCurrntBusiDetails();
		break;
	case "updateInvestmentDetails":
		updateInvestmentDetails();
		break;
	case "validateFosDetails":
		validateFosDetails();
		break;
	case "getFosDetails":
		getFosDetails();
		break;
	case "approvalSubmit":
		approvalSubmit();
		break;
	case "updateDBRStatus":
		updateDBRStatus();
		break;
	case "Otherpreferences":
		Otherpreferences();
		break;
	case "retailerTypes":
		retailerTypes();
		break;
	case "updateOtherDetails":
		updateOtherDetails();
		break;
	case "getOtherDetails":
		getOtherDetails();
		break;

	case "addRETLCurrBussProfile":
		addRETLCurrBussProfile();
		break;
	case "getRETLCurrntBusiDetails":
		getRETLCurrntBusiDetails();
		break;
	case "RetlPreviewDetails":
		RetlPreviewDetails();
		break;
	case "validatePromotorDetails":
		validatePromotorDetails();
		break;
	case "getRETLDetails":
		getRETLDetails();
		break;
	case "updateRetlDetails":
		updateRetlDetails();
		break;
	case "retlFileUpload":
		retlFileUpload();
		break;
	case "retlGetUpload":
		retlGetUpload();
		break;
	case "insertCurntBusinessProfile":
		insertCurntBusinessProfile();
		break;
	case "retlupdateDBRStatus":
	    retlupdateDBRStatus();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}