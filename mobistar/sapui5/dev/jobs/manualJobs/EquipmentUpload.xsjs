function avilabiltyCheck(dicLine, records) {
	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NUMBER from "MDB_DEV"."MST_EQUIPMENT" where SERIAL_NUMBER = ? and IMEI1 = ?';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNo);
	pstmtStatus.setString(2, dicLine.ImeiNo1);
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

function uploadEquipment() {
	var records = {};
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('EquipmentData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
					var queryStatus = 'select SERIAL_NUMBER from "MDB_DEV"."MST_EQUIPMENT" where SERIAL_NUMBER = ? and IMEI1 = ?';
            	var pstmtStatus = connection.prepareStatement(queryStatus);
            	pstmtStatus.setString(1, dicLine.SerialNo);
            	pstmtStatus.setString(2, dicLine.ImeiNo1);
            	var rStatus = pstmtStatus.executeQuery();
            	connection.commit();
            	if (rStatus.next() > 0) {
            		records.status = 0;
            		records.message = 'Allready exist in data base !!';
            	}else{
					var query =
						'insert into  "MDB_DEV"."MST_EQUIPMENT"(SERIAL_NUMBER,MATERIAL_CODE,BATCH_NO,IMEI1,IMEI2,PLANT_CODE,MANUFACTURING_DATE,MATERIAL_TYPE,MODEL_CODE,MODEL_DESCRIPTION,STATUS,CREATED_BY,GSM_STATUS) values (?,?,?,?,?,?,?,?,?,?,?,?,?)';
					var pstmt = connection.prepareStatement(query);
					pstmt.setString(1, dicLine.SerialNo);
					pstmt.setString(2, dicLine.MATERIAL_CODE);
					//pstmt.setString(3, dicLine.InvoiceNo);
					pstmt.setString(3, dicLine.BatchNo);
					pstmt.setString(4, dicLine.ImeiNo1);
					if(dicLine.ImeiNo2 === ""){
					    pstmt.setString(5, '0');
					}else{
					    pstmt.setString(5, dicLine.ImeiNo2);
					}
					pstmt.setString(6, dicLine.PlantCode);
					pstmt.setString(7, dicLine.MANUFACTURING_DATE);
					pstmt.setString(8, dicLine.MATERIAL_TYPE);
					pstmt.setString(9, dicLine.MODEL_CODE);
					pstmt.setString(10, dicLine.MODEL_DESCRIPTION);
					pstmt.setString(11, '0');
					pstmt.setString(12, 'ManualJob');
				//	pstmt.setString(14, dateFunction());
					pstmt.setString(13, '0');
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
	case "uploadEquipment":
		uploadEquipment();
		break;
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}