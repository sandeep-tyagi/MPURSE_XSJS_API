function avilabiltyCheck(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select MATERIAL_CODE from "MDB_DEV"."MST_MATERIAL_MASTER" where MATERIAL_CODE = ?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.MATERIAL_CODE);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {
		records.status = 0;
		records.message = 'Allready exist in data base !!';
		return false;
	} else {
		return true;
	}
	connection.close();
}

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

function uploadMaterial() {
	var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('MaterialData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				//if (avilabiltyCheck(dicLine,records))
				var queryStatus = 'select MATERIAL_CODE from "MDB_DEV"."MST_MATERIAL_MASTER" where MATERIAL_CODE = ?';
				var pstmtStatus = connection.prepareStatement(queryStatus);
				pstmtStatus.setString(1, dicLine.MATERIAL_CODE);
				var rStatus = pstmtStatus.executeQuery();
				connection.commit();
				if (rStatus.next() > 0) {
					records.status = 0;
					records.message = 'Allready exist in data base !!';
				} else {
					var query =
						'insert into  "MDB_DEV"."MST_MATERIAL_MASTER"(COMP_CODE,MATERIAL_CODE,MATERIAL_DESC,MATERIAL_TYPE,UNIT,BATCH_CONTROLLED,SERIELIZED,STORAGE_CONDITION,CREATED_DATE,NETVALUE,CREATED_BY,MODEL_CODE,MODEL_DESCRIPTION,CREATEDDATE) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
					var pstmt = connection.prepareStatement(query);
					pstmt.setString(1, dicLine.COMP_CODE);
					pstmt.setString(2, dicLine.MATERIAL_CODE);
					pstmt.setString(3, dicLine.MATERIAL_DESC);
					pstmt.setString(4, dicLine.MATERIAL_TYPE);
					pstmt.setString(5, dicLine.UNIT);
					pstmt.setString(6, dicLine.BATCH_CONTROLLED);
					pstmt.setString(7, dicLine.SERIELIZED);
					pstmt.setString(8, dicLine.STORAGE_CONDITION);
					pstmt.setString(9, dateFunction());
					pstmt.setString(10, '0');
					pstmt.setString(11, 'ManualJob');
					pstmt.setString(12, dicLine.MODEL_CODE);
					pstmt.setString(13, dicLine.MODEL_DESCRIPTION);
					pstmt.setString(14, dicLine.MAT_CREATED_DATE);
					var rs = pstmt.executeUpdate();
					connection.commit();
					records = {};
					if (rs > 0) {
						records.status = 1;
						records.message = 'Data Uploaded Sucessfully';
					} else {
						records.status = 0;
						records.message = 'Some Issues!';
					}
				}
			}
			Output.results.push(records);
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
	case "uploadMaterial":
		uploadMaterial();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}