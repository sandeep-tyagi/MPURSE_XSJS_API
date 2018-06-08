function DateFunction(oevent) {
	var dp = new Date(oevent);
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) monthp = '0' + monthp;
	if (dayp.length < 2) dayp = '0' + dayp;

	var yyyymmddp = yearp + '.' + monthp + '.' + dayp;
	return yyyymmddp;
}


function GetReceveing() {
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');

	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	var pstmt1;
	var pstmt3;
	var pstmt4;
	var pstmt5;
	var query1;
	var query3;
	var query4;
	var query5;
	var r1;
	var r3;
	var r4;
	var r5;
	var getmodel;
	var ImeIrecord;
	var record;
	var allmaterial;
	var inqty = 0;
	try {
		query1 =
			'SELECT L.INVOICE_NO,E.IMEI1,E.MATERIAL_CODE FROM "MDB_TEST_INTEGRATION"."SALES_INVOICE_LINES" AS L INNER JOIN "MDB_TEST_INTEGRATION"."SALES_INVOICE_EQUIP" AS E ON L.INVOICE_NO = E.INVOICE_NO WHERE  E.SAPUSER_ID = ?  AND L.INVOICE_NO IS NOT NULL ';//and E.PROCESS_STATUS = ?
		pstmt1 = conn1.prepareStatement(query1);
		pstmt1.setString(1, SAPUSER_ID);
	//	pstmt1.setString(2, '1');
		r1 = pstmt1.executeQuery();
		conn1.commit();
		var firstQryRslt = [];
		while (r1.next()) {

			//	getmodelbyMaterial = {};
			var rcrdFirst = {};
			rcrdFirst.INVOICE_NO = r1.getString(1);
			rcrdFirst.IMEI1 = r1.getString(2);
			rcrdFirst.MATERIALCODE = r1.getString(3);
			firstQryRslt.push(rcrdFirst);

		}

		pstmt1.close();
		conn1.close();

		//conn1 = $.db.getConnection();
		for (var i = 0; i < firstQryRslt.length; i++) {

			conn1 = $.db.getConnection();
			var recordParse = firstQryRslt[i];
			record = {};
			getmodel = {};
			ImeIrecord = {};
			var arr = [];
			var arr1 = [];
			query4 =
				'select  count(IMEI1)  from "MDB_TEST_INTEGRATION"."SALES_INVOICE_EQUIP" AS E  inner join "MDB_TEST_INTEGRATION"."MATERIALMASTER" as M on M.MATERIAL_CODE=E.MATERIAL_CODE where E.INVOICE_NO =? AND E.SAPUSER_ID=?  ';//AND (PROCESS_STATUS=? )
			//'select  count(IMEI1)  from "MDB_DEV"."SALESINVOICEEQUIP" AS i  inner join "MDB_DEV"."MATERIALMASTER" as m on m.MATERIAL_CODE=i.MATERIAL_CODE where  i.INVOICE_NO =? AND SAPUSER_ID=?  AND (PROCESSSTATUS=? )' ; 
			pstmt4 = conn1.prepareStatement(query4);
			pstmt4.setString(1, recordParse.INVOICE_NO);
			pstmt4.setString(2, SAPUSER_ID);
		//	pstmt4.setString(3, '1');
			r4 = pstmt4.executeQuery();
			conn1.commit();
			while (r4.next()) {

				allmaterial = r4.getString(1);

			}

			query5 =
				'select count(INVOICE_NO) as INVOICECOUNT  from "MDB_TEST_INTEGRATION"."SALES_INVOICE_EQUIP" where SAPUSER_ID =? AND INVOICE_NO=?  and MATERIAL_CODE is not null';//AND  (PROCESS_STATUS =? ) 
			//'select count(INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP" where  SAPUSER_ID =? AND INVOICE_NO=?  AND  (PROCESS_STATUS =? ) and MATERIAL_CODE is not null';
			pstmt5 = conn1.prepareStatement(query5);
			pstmt5.setString(1, SAPUSER_ID);
			pstmt5.setString(2, recordParse.INVOICE_NO);
		//	pstmt5.setString(3, '1');
			r5 = pstmt5.executeQuery();
			conn1.commit();
			while (r5.next()) {

				inqty = r5.getString(1);
			}
			query3 =
				' select  INVOICE_VALUE from "MDB_TEST_INTEGRATION"."SALES_INVOICE_HEADER"  where INVOICE_NO =?	AND SAPUSER_ID=? limit 1 ';
			pstmt3 = conn1.prepareStatement(query3);
			pstmt3.setString(1, recordParse.INVOICE_NO);
			pstmt3.setString(2, SAPUSER_ID);

			r3 = pstmt3.executeQuery();
			conn1.commit();
			while (r3.next()) {
				record = {};

				var x = r3.getString(1);
				var lastThree = x.substring(x.length - 3);
				var otherNumbers = x.substring(0, x.length - 3);
				if (otherNumbers !== '') {
					lastThree = ',' + lastThree;

				}
				var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + ' ' + 'INR';

				record.TOTAL_INVOICE_AMT = res;
			}
			//getmodel = {};
			getmodel.MATERIALCODE = recordParse.MATERIALCODE;
			//getmodel.MODEL = recordParse.MODEL;
			getmodel.QUANTITY = allmaterial;
			arr.push(getmodel);
			// ImeIrecord = {};
			ImeIrecord.IMEINO = recordParse.IMEI1;
			arr1.push(ImeIrecord);

			record.INVOICENO = recordParse.INVOICE_NO;
			record.INVOICECOUNT = inqty;
			record.INVOICE_IMEI = arr1;
			record.INVOICE_ITEMS = arr;
			output.results.push(record);

			conn1.close();
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



function getParentChild() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	try {
		var querygetParentChild = 'select * from "MDB_TEST_INTEGRATION"."MST_CUSTOMER" where PARENT_CUST_CODE = ? ';
		var pstmtgetParentChild = connection.prepareStatement(querygetParentChild);
		pstmtgetParentChild.setString(1, SAPUSER_ID);
		//	pstmtgetParentChild.setString(2, '0');
		var rsgetParentChild = pstmtgetParentChild.executeQuery();
		connection.commit();
		while (rsgetParentChild.next()) {
			var record = {};
			record.CUST_TYPE = rsgetParentChild.getString(1);
			record.SAPUSER_ID = rsgetParentChild.getString(2);
			record.CUST_NAME = rsgetParentChild.getString(4);
			record.PARENT_CUST_CODE = rsgetParentChild.getString(5);
			record.PARENT_CUST_NAME = rsgetParentChild.getString(6);
			/*	record.ADDRESS1 = rsgetParentChild.getString(6);
			record.ADDRESS2 = rsgetParentChild.getString(7);
			record.ADDRESS3 = rsgetParentChild.getString(8);
			record.DISTRICT = rsgetParentChild.getString(9);
			record.STATE = rsgetParentChild.getString(10);
			record.REGION = rsgetParentChild.getString(11);
			record.COUNTRY = rsgetParentChild.getString(12);
			record.EMAIL = rsgetParentChild.getString(13);
			record.PHONE_NUMBER = rsgetParentChild.getString(14);
			record.PINCODE = rsgetParentChild.getString(15);
			record.TINNO = rsgetParentChild.getString(16);
			record.PLANT_CODE = rsgetParentChild.getString(19);
			record.Status = rsgetParentChild.getInteger(20);
			record.LEVEL = rsgetParentChild.getString(26);
			record.UserType = "Customer";
*/ //	getStatusDesc(record);
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



function getModelByImei() {
	var output = {
		results: [],
		status: ""
	};

	var connection = $.db.getConnection();
	var imeiNo = $.request.parameters.get('imeiNo');
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var ChildCustCode = $.request.parameters.get('ChildCustCode');
	//	var statementType = $.request.parameters.get('statementType');
	var invoiceDate = $.request.parameters.get('ScanDate');
	var query;
	var record;
	try {
		var queryGetEqDetails =
			'select e.MATERIAL_CODE,e.SERIAL_NUMBER ,p.MODEL_CODE , p.MODEL_DESCRIPTION from "MDB_TEST_INTEGRATION"."EQUIPMENT_MASTER" as e inner join "MDB_TEST_INTEGRATION"."MATERIALMASTER" as p on p.MATERIAL_CODE=e.MATERIAL_CODE inner join "MDB_TEST_INTEGRATION"."SALES_INVOICE_EQUIP" as eq on eq.IMEI1 = e.IMEI1 where e.IMEI1 = ? and eq.SAPUSER_ID=?  ';
		var pstmtGetEqDetails = connection.prepareStatement(queryGetEqDetails);
		pstmtGetEqDetails.setString(1, imeiNo);
		pstmtGetEqDetails.setString(2, SAPUSER_ID);
		var rsGetEqDetails = pstmtGetEqDetails.executeQuery();
		connection.commit();
		while (rsGetEqDetails.next()) {

			record = {};
			record.MATERIAL_CODE = rsGetEqDetails.getString(1);
			record.SERIAL_NUMBER = rsGetEqDetails.getString(2);
			record.MODEL_CODE = rsGetEqDetails.getString(3);
			record.MATERIAL_DESC = rsGetEqDetails.getString(4);
			record.CODE = ChildCustCode;
			query = 'select PARENT_CUST_NAME,PARENT_CUST_CODE FROM "MDB_TEST_INTEGRATION"."MST_CUSTOMER" WHERE SAPUSER_ID=? ';
			var pstmt1 = connection.prepareStatement(query);
			pstmt1.setString(1, ChildCustCode);
			var rs1 = pstmt1.executeQuery();
			if (rs1.next()) {
				record.PARENT_CUST_NAME = rs1.getString(1);
				record.PARENT_CUST_CODE = rs1.getString(2);
			}
			connection.commit();

			record.DATE = invoiceDate;
			record.IMEI1 = imeiNo;
			output.results.push(record);
			output.status = '1';

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

function insertdelivery() {
	var output = {
		results: []
		/*IMEI: [],
		CUSTOMER: [],
		returnFile: [],
		Statement: ''*/

	};
	//	var curdate = new Date();
	var records = {};
	var connection = $.db.getConnection();
	var parentCode = $.request.parameters.get('parentCode');
	var itemsArray = $.request.parameters.get('itemsArray');
	var sdate = '';
	var dataLine = JSON.parse(itemsArray.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				for (var j = 0; j < dataLine[i].IMEIS_NO.length; j++) {
					var items = dataLine[i].IMEIS_NO[j];
					var entryDate = DateFunction(items.DATE);
					var querySelectequipment = 'select IMEI1,MATERIAL_CODE FROM  "MDB_TEST_INTEGRATION"."EQUIPMENT_MASTER" WHERE IMEI1=?';
					var pstmtSelectequipment = connection.prepareStatement(querySelectequipment);
					pstmtSelectequipment.setString(1, items.IMEI);
					//pstmtSelectequipment.setString(2, 2);
					var rsSelectequipment = pstmtSelectequipment.executeQuery();
					connection.commit();
					if (rsSelectequipment.next()) {
						var query =
							'select CUST_TYPE,SAPUSER_ID,CUST_NAME FROM "MDB_TEST_INTEGRATION"."MST_CUSTOMER" WHERE SAPUSER_ID=? and PARENT_CUST_CODE=? ';//and STATUS=?
						var pstm0 = connection.prepareStatement(query);
						pstm0.setString(1, dicLine.CODE);
						pstm0.setString(2, parentCode);
						//pstm0.setString(3, '0');
						var rpstm0 = pstm0.executeQuery();
						connection.commit();
						if (rpstm0.next()) {
							var usertype = 'RETL';
							if (usertype === rpstm0.getString(1)) {
								var queryinsertequipment =
									'insert into "MDB_TEST_INTEGRATION"."EQUIPMENT_MASTERTRANS" (SERIAL_NO ,MATERIAL_CODE ,IMEI1 ,ACTIVE ,SAPUSER_ID ,STATUS , TRANSACTION_DATE ,INVOICE_NO) values(?,?,?,?,?,?,?,?)';
								var statusid = '3';
								var pstmtinsertequipment = connection.prepareStatement(queryinsertequipment);
								pstmtinsertequipment.setString(1, items.SERIAL_NUMBER);
								pstmtinsertequipment.setString(2, items.MATERIAL);
								pstmtinsertequipment.setString(3, items.IMEI);
								pstmtinsertequipment.setString(4, 'x');
								pstmtinsertequipment.setString(5, dicLine.CODE);
								pstmtinsertequipment.setString(6, statusid);
								pstmtinsertequipment.setString(7, sdate);
								pstmtinsertequipment.setString(8, 'null');
								//pstmtinsertequipment.executeUpdate();
								var rsinsertequipment = pstmtinsertequipment.executeUpdate();
								connection.commit();
								if (rsinsertequipment > 0) {
									records.status = 1;
									records.message = 'record successfully uploaded.';
								}
							} else {
								records.status = 0;
								records.message = 'Some Issues!';
							}

						} else {
							records.status = 0;
							records.message = 'record not found!!!';
						}
					} else {
						records.status = 0;
						records.message = 'IMEI is not present in Equipment master';
					}
				}

			}
			output.results.push(records);

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



function recvUpdateEquipment() {
	var output = {
		results: []
	};

	var TRANSACTION_DATE = $.request.parameters.get('TRANSACTION_DATE');
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var connection = $.db.getConnection();
	var datas = $.request.parameters.get('tagsArray');
	var ACTIVE = 'X';
	var STATUS = '2';
	var pstmt1;
	var record = {};

	try {
		var bool = false;
		var oFinalResult = JSON.parse(datas);
		for (var i = 0; i < oFinalResult.length; i++) {
			for (var m = 0; m < oFinalResult[i].INVOICE_ITEMS.length; m++) {
				for (var k = 0; k < oFinalResult[i].INVOICE_ITEMS[m].INVOICE_IMEI.length; k++) {
					if (oFinalResult[i].INVOICE_ITEMS[m].INVOICE_IMEI[k].IsChecked === '1') {
						bool = true;
						var IMEI = oFinalResult[i].INVOICE_ITEMS[m].INVOICE_IMEI[k].IMEINO;
						var queryinsert =
							' insert into "MDB_TEST_INTEGRATION"."EQUIPMENT_MASTERTRANS" ("INVOICE_NO", "TRANSACTION_DATE" ,"SERIAL_NO" , "MATERIAL_CODE" , "IMEI1" , "SAPUSER_ID" , "ACTIVE") values (? , ? , ? , ? , ? , ? , ? ) ';
						pstmt1 = connection.prepareStatement(queryinsert);
						pstmt1.setString(1, oFinalResult[i].INVOICENO);
						pstmt1.setString(2, TRANSACTION_DATE);
						pstmt1.setString(3, IMEI);
						pstmt1.setString(4, oFinalResult[i].MATERIAL_CODE);
						pstmt1.setString(5, IMEI);
						pstmt1.setString(6, SAPUSER_ID);
						pstmt1.setString(7, ACTIVE);
						var rstatus = pstmt1.executeUpdate();
						connection.commit();
						if (rstatus > 0) {
							record.UpdateStatus = rstatus.toString();
							record.UpdateMessage = 'Data Succesfully Updated!';
						} else {
							record.UpdateStatus = rstatus.toString();
							record.UpdateMessage = 'Unable to Update!';
						}

						record.status = rstatus.toString();
						record.message = 'Data is Successfully Updated';

					}
				}

			}

		}
		if (bool === false) {

			record.status = '3';
			record.message = 'No Data Is Selected';

		}
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




var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {


	case "GetReceveing":
		GetReceveing();
		break;
	case "recvUpdateEquipment":
		recvUpdateEquipment();
		break;
	case "getParentChild":
		getParentChild();
		break;
	case "getModelByImei":
		getModelByImei();
		break;
    case "insertdelivery":
        insertdelivery();
        break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}