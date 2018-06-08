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

function updateMstEmployee(record, dataLine, Output) {
	var conn = $.db.getConnection();
	for (var i = 0; i < dataLine.length; i++) {
		var dicLine = dataLine[i];
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_EMPLOYEE"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setString(2, dicLine.CODE);
		pstmtCallPro.setString(3, 'null');
		pstmtCallPro.setString(4, 'null');
		pstmtCallPro.setString(5, 'null');
		pstmtCallPro.setString(6, 'null');
		pstmtCallPro.setString(7, 'null');
		pstmtCallPro.setString(8, 'null');
		pstmtCallPro.setString(9, 'null');
		pstmtCallPro.setString(10, 'null');
		pstmtCallPro.setInteger(11, 0);
		pstmtCallPro.setString(12, 'null');
		//pstmtCallPro.setString(13, dicLine.Status);
		if (dicLine.Status === "Active") {
			if (dicLine.DATE !== '') {
				pstmtCallPro.setString(14, dicLine.DATE);
			} else {
				pstmtCallPro.setString(14, dateFunction());
			}
			pstmtCallPro.setInteger(13, 1);
			pstmtCallPro.setString(15, dateFunction());
			pstmtCallPro.setString(16, '0');
			pstmtCallPro.setString(21, 'StatusUpdateActive');
		} else if (dicLine.Status === "Deactive") {
			if (dicLine.DATE !== '') {
				pstmtCallPro.setString(15, dicLine.DATE);
			} else {
				pstmtCallPro.setString(15, dateFunction());
			}
			pstmtCallPro.setInteger(13, 2);
			pstmtCallPro.setString(14, dateFunction());
			pstmtCallPro.setString(16, '1');
			pstmtCallPro.setString(21, 'StatusUpdateDeactive');
		} else if (dicLine.Status === "Delete") {
			pstmtCallPro.setInteger(13, 2);
			pstmtCallPro.setString(14, dateFunction());
			pstmtCallPro.setString(15, dateFunction());
			pstmtCallPro.setString(16, '1');
			pstmtCallPro.setString(21, 'StatusUpdateDelete');
		}
		//pstmtCallPro.setString(16, dateFunction());
		pstmtCallPro.setString(17, '');
		pstmtCallPro.setString(18, dateFunction());
		pstmtCallPro.setString(19, '');
		pstmtCallPro.setString(20, dateFunction());
		pstmtCallPro.execute();
		var rsm = pstmtCallPro.getParameterMetaData();
		conn.commit();
		if (rsm.getParameterCount() > 0) {
			record.status = 1;
			record.message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.message = 'Some Issues!';
		}
	}
	Output.results.push(record);
	conn.close();
}

function updateMstCustomer(record, dataLine, Output) {
	var conn = $.db.getConnection();
	for (var i = 0; i < dataLine.length; i++) {
		var dicLine = dataLine[i];
		record = {};
		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MST_CUSTOMER"(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setString(1, 'NULL');
		pstmtCallPro.setString(2, dicLine.CODE);
		pstmtCallPro.setString(3, 'NULL');
		pstmtCallPro.setString(4, 'NULL');
		pstmtCallPro.setString(5, 'NULL');
		pstmtCallPro.setString(6, 'NULL');
		pstmtCallPro.setString(7, 'NULL');
		pstmtCallPro.setString(8, 'NULL');
		pstmtCallPro.setString(9, 'NULL');
		pstmtCallPro.setString(10, 'NULL');
		pstmtCallPro.setString(11, 'NULL');
		pstmtCallPro.setString(12, 'NULL');
		pstmtCallPro.setString(13, 'NULL');
		pstmtCallPro.setString(14, 'NULL');
		pstmtCallPro.setString(15, 'NULL');
		pstmtCallPro.setString(16, 'NULL');
		pstmtCallPro.setString(17, 'null');
		pstmtCallPro.setString(18, 'null');
		pstmtCallPro.setString(19, 'null');
		//	pstmtCallPro.setInteger(20, 0);
		//	pstmtCallPro.setString(21, dateFunction());
		pstmtCallPro.setString(22, '00:00:00');
		//	pstmtCallPro.setString(23, dateFunction());
		pstmtCallPro.setString(24, dateFunction());
		pstmtCallPro.setString(25, dateFunction());
		pstmtCallPro.setString(26, 'NULL');
		pstmtCallPro.setString(27, 'null');
		//	pstmtCallPro.setString(28, '0');
		pstmtCallPro.setString(29, 'null');
		pstmtCallPro.setString(30, dateFunction());
		pstmtCallPro.setString(31, 'null');
		pstmtCallPro.setString(32, dateFunction());
		if (dicLine.Status === "Active") {
			if (dicLine.DATE !== '') {
				pstmtCallPro.setString(21, dicLine.DATE);
			} else {
				pstmtCallPro.setString(21, dateFunction());
			}
			pstmtCallPro.setInteger(20, 1);
			pstmtCallPro.setString(23, dateFunction());
			pstmtCallPro.setString(28, '0');
			pstmtCallPro.setString(33, 'StatusUpdateActive');
		} else if (dicLine.Status === "Deactive") {
			if (dicLine.DATE !== '') {
				pstmtCallPro.setString(23, dicLine.DATE);
			} else {
				pstmtCallPro.setString(23, dateFunction());
			}
			pstmtCallPro.setInteger(20, 2);
			pstmtCallPro.setString(21, dateFunction());
			pstmtCallPro.setString(28, '0');
			pstmtCallPro.setString(33, 'StatusUpdateDeactive');
		} else if (dicLine.Status === "Delete") {
			pstmtCallPro.setInteger(20, 0);
			pstmtCallPro.setString(21, dateFunction());
			pstmtCallPro.setString(23, dateFunction());
			pstmtCallPro.setString(28, '1');
			pstmtCallPro.setString(33, 'StatusUpdateDelete');
		}
		//pstmtCallPro.setString(16, dateFunction());
		//pstmtCallPro.setString(18, '');
		//pstmtCallPro.setString(19, dateFunction());
		//pstmtCallPro.setString(20, '');
		//pstmtCallPro.setString(21, dateFunction());
		pstmtCallPro.execute();
		var rsm = pstmtCallPro.getParameterMetaData();
		conn.commit();
		if (rsm.getParameterCount() > 0) {
			record.status = 1;
			record.message = 'Data Uploaded Sucessfully';
		} else {
			record.status = 0;
			record.message = 'Some Issues!';
		}
	}
	Output.results.push(record);
	conn.close();
}

function updateUserStatus() {
	var conn = $.db.getConnection();
	var record;
	var Output = {
		results: []
	};
	var datasLine = $.request.parameters.get('LineData');
	var record;
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			var query = 'select EMPLOYEE_CODE from "MDB_TEST_INTEGRATION"."MST_EMPLOYEE" where EMPLOYEE_CODE=?';
			var pstmt = conn.prepareStatement(query);
			pstmt.setString(1, dataLine[0].CODE);
			var rs = pstmt.executeQuery();
			conn.commit();
			if (rs.next() > 0) {
				updateMstEmployee(record, dataLine, Output);
			} else {
				updateMstCustomer(record, dataLine, Output);
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
}
var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "updateUserStatus":
		updateUserStatus();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}