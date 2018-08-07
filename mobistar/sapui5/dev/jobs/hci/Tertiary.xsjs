function getDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.tertiary", "Tertiary");
	var client = new $.net.http.Client();
	var req = new $.net.http.Request($.net.http.POST, "");

	req.contentType = "application/json";

	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = JSON.parse(response.body.asString());
	//return data;
}

function checkTeriaryEquipment(dicLine) {
	var connection = $.db.getConnection();
	var queryStatus = 'select SERIAL_NUMBER from "MDB_DEV"."TERTIARY_DATA" where SERIAL_NUMBER = ? or IMEI1 = ? ';
	var pstmtStatus = connection.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicLine.SerialNumber);
	pstmtStatus.setString(2, dicLine.IMEI1);
	var rStatus = pstmtStatus.executeQuery();
	connection.commit();
	if (rStatus.next() > 0) {

		return false;
	} else {
		return true;
	}
	connection.close();
}

function postTertiary() {
	var data;
	var records = {};

	//records.EndDate = "2018-06-03";
	//records.EndTime = "00:00:00";
	//records.StartDate = "2018-03-01";
	//records.StartTime = "00:00:00";
	//records.push(requestInvoiceBody);

	//getDestination(records, data);

	var Output = [];
	var connection = $.db.getConnection();
	var TertiaryUpdateRecord = {};
	var messages;
	/*	 var content = $.request.body.asString();
	 content=JSON.parse(content.replace(/\\r/g, ""));
	 
	var tertiaryData =JSON.parse(content.replace(/\\r/g, ""));
	
		var tertiaryData = $.request.parameters.get('gmsTertiary');
	var tertiaryDataFinal = JSON.parse(tertiaryData.replace(/\\r/g, ""));

	*/

	var tertiaryData = $.request.body.asString();
	var tertiaryDataFinal = JSON.parse(tertiaryData);

	try {
		for (var i = 0; i < tertiaryDataFinal.length; i++) {
			var TertiaryData = tertiaryDataFinal[i];
			if (checkTeriaryEquipment(TertiaryData)) {
				var queryTertiaryPost =
					'insert into "MDB_DEV"."TERTIARY_DATA"' +
					' ("SERIAL_NUMBER","IMEI1","IMEI2","CREATED_BY","PROCESS_STATUS","TERTIARY_DATE","TERTIARY_CUSTOMER","TERTIARY_PRICE") ' +
					' values (?,?,?,?,?,?,?,?)';
				var pstmtTertiaryPost = connection.prepareStatement(queryTertiaryPost);
				pstmtTertiaryPost.setString(1, TertiaryData.SerialNumber);
				pstmtTertiaryPost.setString(2, TertiaryData.IMEI1);
				pstmtTertiaryPost.setString(3, TertiaryData.IMEI2);
				pstmtTertiaryPost.setString(4, 'DMSTEAM');
				pstmtTertiaryPost.setString(5, '0');
				pstmtTertiaryPost.setString(6, '2018-09-09');
				pstmtTertiaryPost.setString(7, '');
				pstmtTertiaryPost.setString(8, '0');
				var rsTertiaryPost = pstmtTertiaryPost.executeUpdate();
				connection.commit();
				if (rsTertiaryPost > 0) {
					TertiaryUpdateRecord.status = '1';
					TertiaryUpdateRecord.message = 'Tertiary Data Successfully Uploaded';
					Output.push(TertiaryUpdateRecord);
				} else {
					TertiaryUpdateRecord.status = '0';
					TertiaryUpdateRecord.message = 'Something went Wrong,Tertiary data is not insert';
					Output.push(TertiaryUpdateRecord);
				}

			} else {
				messages = 'SerialNo Already Exists';
			}
		}
		connection.close();
		messages = Output.length + ' out of ' + (tertiaryDataFinal.length) + ' has been Updated in Tertiary Table';

		Output.push(messages);
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

function updateTertiary() {
	var Output = [];

	try {
		var qryTertiary = null;
		var connection = $.db.getConnection();
		qryTertiary = 'select SERIAL_NUMBER,IMEI1,IMEI2,CREATED_BY,PROCESS_STATUS,TERTIARY_DATE,TERTIARY_CUSTOMER,TERTIARY_PRICE' +
			' from "MDB_DEV"."TERTIARY_DATA"  WHERE PROCESS_STATUS=0 ';

		var pstmtTertiary = connection.prepareStatement(qryTertiary);
		var rsTertiary = pstmtTertiary.executeQuery();
		while (rsTertiary.next()) {
			var queryTertiaryPost =
				'UPDATE "MDB_DEV"."MST_EQUIPMENT" SET "TERTIARY_DATE"=?,"TERTIARY_CUSTOMER"=?,"TERTIARY_PRICE"=? ' + ' WHERE "IMEI1"=? ';
			var pstmtTertiaryPost = connection.prepareStatement(queryTertiaryPost);

			pstmtTertiaryPost.setString(1, rsTertiary.getString(6));
			pstmtTertiaryPost.setString(2, rsTertiary.getString(7));
			pstmtTertiaryPost.setString(3, rsTertiary.getString(8));
			pstmtTertiaryPost.setString(4, rsTertiary.getString(2));
			var rsTertiaryPost = pstmtTertiaryPost.executeUpdate();

			if (rsTertiaryPost > 0) {

				var queryTertiaryDataPost =
					'UPDATE "MDB_DEV"."TERTIARY_DATA" SET "PROCESS_STATUS"=?' + ' WHERE "IMEI1"=? ';
				var pstmtTertiaryDataPost = connection.prepareStatement(queryTertiaryDataPost);
				pstmtTertiaryDataPost.setString(1, '1');
				pstmtTertiaryDataPost.setString(2, rsTertiary.getString(2));
				var rsTertiaryDataPost = pstmtTertiaryDataPost.executeUpdate();
				if (rsTertiaryDataPost > 0) {
					Output.push('OK');
					connection.commit();
				}

			} else {
				Output.push('NOT UPDATED');
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
	case "postTertiary":
		postTertiary();
		break;
	case "updateTertiary":
		updateTertiary();
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('Invalid Command: ', aCmd);
}