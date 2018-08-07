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

function dateFormat(oevent) {
	var dp = new Date(oevent);
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) monthp = '0' + monthp;
	if (dayp.length < 2) dayp = '0' + dayp;

	var yyyymmddp = dayp + '.' + monthp + '.' + yearp;
	return yyyymmddp;
}

function currentDate() {
	var dp = new Date();
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) monthp = '0' + monthp;
	if (dayp.length < 2) dayp = '0' + dayp;

	var yyyymmddp = dayp + '.' + monthp + '.' + yearp;
	return yyyymmddp;
}

function addStocks() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, '90000008');
		pstmtCallAttribute.setString(2, '110100C410003');
		pstmtCallAttribute.setInteger(3, 20);
		pstmtCallAttribute.setString(4, 'DSTB');
		pstmtCallAttribute.setString(5, 'STOCKREC');
		pstmtCallAttribute.setString(6, 'REC23563355');
		pstmtCallAttribute.setString(7, '2018-06-22');
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, 'DMSTEAM');

		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		connection.commit();
		// Need to identify
		while (rCallAttribute.next()) {

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
 * Purpose:GET ALL DETAILS
 * Input:
 * Output:
 * Exception:
 * Created By: SHRIYANSI
 * Created Date:
 */
function getDETAILS() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."MobiProcedure::SaleAndDelivery"();';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		/*pstmtCallPro.setString(1, 'C699 WR');*/
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.PRIMARY_CUSTOMER = rCallPro.getString(1);
			record.INVOICENO = rCallPro.getString(2);
			output.results.push(record);
		}

		conn1.close();
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
			'SELECT L.INVOICE_NO,E.IMEI1,E.MATERIAL_CODE,m.MODEL_CODE, E.IMEI2 FROM  "MDB_DEV"."SALES_INVOICE_LINES" AS L INNER JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" AS E ON L.INVOICE_NO = E.INVOICE_NO  INNER JOIN "MDB_DEV"."MST_MATERIAL_MASTER" AS m ON m.MATERIAL_CODE = E.MATERIAL_CODE WHERE  E.SAPUSER_ID = ?  AND L.INVOICE_NO IS NOT NULL  AND E.PROCESS_STATUS = ? ';
		//'SELECT L.INVOICE_NO,E.IMEI1,E.MATERIAL_CODE FROM "MDB_DEV"."SALES_INVOICE_LINES" AS L INNER JOIN "MDB_DEV"."SALES_INVOICE_EQUIP" AS E ON L.INVOICE_NO = E.INVOICE_NO WHERE  E.SAPUSER_ID = ?  AND L.INVOICE_NO IS NOT NULL and E.PROCESS_STATUS = ? ';
		pstmt1 = conn1.prepareStatement(query1);
		pstmt1.setString(1, SAPUSER_ID);
		pstmt1.setString(2, '2');
		r1 = pstmt1.executeQuery();
		conn1.commit();
		var firstQryRslt = [];
		while (r1.next()) {

			//	getmodelbyMaterial = {};
			var rcrdFirst = {};
			rcrdFirst.INVOICE_NO = r1.getString(1);
			rcrdFirst.IMEI1 = r1.getString(2);
			rcrdFirst.MATERIALCODE = r1.getString(3);
			rcrdFirst.MODEL_CODE = r1.getString(4);
			rcrdFirst.IMEI2 = r1.getString(5);

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
			//'select count(E.INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP"  as E inner join "MDB_DEV"."SALES_INVOICE_LINES" AS L ON L.INVOICE_NO = E.INVOICE_NO inner join "MDB_DEV"."MATERIALMASTER" AS m ON m.MATERIAL_CODE = E.MATERIAL_CODE 	where SAPUSER_ID =? AND E.INVOICE_NO=? and E.MATERIAL_CODE is not null AND (E.PROCESS_STATUS =? or  E.PROCESS_STATUS =?)';
			'select  count(IMEI1)  from "MDB_DEV"."SALES_INVOICE_EQUIP" AS E  inner join "MDB_DEV"."MST_MATERIAL_MASTER" as M on M.MATERIAL_CODE=E.MATERIAL_CODE where E.INVOICE_NO =? AND E.SAPUSER_ID=?  AND (E.PROCESS_STATUS=? or E.PROCESS_STATUS=? )';
			//'select  count(IMEI1)  from "MDB_DEV"."SALESINVOICEEQUIP" AS i  inner join "MDB_DEV"."MATERIALMASTER" as m on m.MATERIAL_CODE=i.MATERIAL_CODE where  i.INVOICE_NO =? AND SAPUSER_ID=?  AND (PROCESSSTATUS=? )' ; 
			pstmt4 = conn1.prepareStatement(query4);
			pstmt4.setString(1, recordParse.INVOICE_NO);
			pstmt4.setString(2, SAPUSER_ID);
			pstmt4.setString(3, '2');
			pstmt4.setString(4, '2');
			r4 = pstmt4.executeQuery();
			conn1.commit();
			while (r4.next()) {

				allmaterial = r4.getString(1);

			}

			query5 =
			//	'select count(E.INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP"  as E inner join "MDB_DEV"."SALES_INVOICE_LINES" AS L ON L.INVOICE_NO = E.INVOICE_NO	where SAPUSER_ID = ? AND E.INVOICE_NO=? and E.MATERIAL_CODE is not null AND (E.PROCESS_STATUS =? or  E.PROCESS_STATUS =?)';
			'select count(E.INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP"  as E inner join "MDB_DEV"."SALES_INVOICE_LINES" AS L ON L.INVOICE_NO = E.INVOICE_NO inner join "MDB_DEV"."MST_MATERIAL_MASTER" AS m ON m.MATERIAL_CODE = E.MATERIAL_CODE 	where SAPUSER_ID =? AND E.INVOICE_NO=? and E.MATERIAL_CODE is not null AND (E.PROCESS_STATUS =? or  E.PROCESS_STATUS =?)';

			//'select count(INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP" where SAPUSER_ID =? AND INVOICE_NO=? and MATERIAL_CODE is not null AND  (PROCESS_STATUS =? or  PROCESS_STATUS =?) ';
			//'select count(INVOICE_NO) as INVOICECOUNT  from "MDB_DEV"."SALES_INVOICE_EQUIP" where  SAPUSER_ID =? AND INVOICE_NO=?  AND  (PROCESS_STATUS =? ) and MATERIAL_CODE is not null';
			pstmt5 = conn1.prepareStatement(query5);
			pstmt5.setString(1, SAPUSER_ID);
			pstmt5.setString(2, recordParse.INVOICE_NO);
			pstmt5.setString(3, '2');
			pstmt5.setString(4, '2');
			r5 = pstmt5.executeQuery();
			conn1.commit();
			while (r5.next()) {

				inqty = r5.getString(1);
			}
			query3 =
				' select  INVOICE_VALUE from "MDB_DEV"."SALES_INVOICE_HEADER"  where INVOICE_NO =?	AND SAPUSER_ID=? limit 1 ';
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
			getmodel = {};
			getmodel.MATERIALCODE = recordParse.MATERIALCODE;
			getmodel.MODEL = recordParse.MODEL_CODE;
			getmodel.QUANTITY = allmaterial;
			arr.push(getmodel);
			ImeIrecord = {};
			ImeIrecord.IMEINO = recordParse.IMEI1;
			ImeIrecord.IMEI2 = recordParse.IMEI2;
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
							' insert into "MDB_DEV"."TRN_EQUIPMENT_MASTER" ("INVOICE_NO", "TRANSACTION_DATE" ,"SERIAL_NO" , "MATERIAL_CODE" , "IMEI1" , "SAPUSER_ID" , "ACTIVE") values (? , ? , ? , ? , ? , ? , ? ) ';
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

function getStatusDesc(record) {
	var connection = $.db.getConnection();
	if (record.Status !== undefined && record.Status !== null && record.Status !== '') {
		var queryStatus = 'select STATUS_CODE,STATUS_DESC from "MDB_DEV"."MST_STATUS" where STATUS_CODE = ?';
		var pstmtStatus = connection.prepareStatement(queryStatus);
		pstmtStatus.setInteger(1, record.Status);
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

function getParentChild() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	try {
		var querygetParentChild = 'select * from "MDB_DEV"."MST_CUSTOMER" where PARENT_CUST_CODE = ? ';
		var pstmtgetParentChild = connection.prepareStatement(querygetParentChild);
		pstmtgetParentChild.setString(1, SAPUSER_ID);
		var rsgetParentChild = pstmtgetParentChild.executeQuery();
		connection.commit();
		while (rsgetParentChild.next()) {
			var record = {};
			record.CUST_TYPE = rsgetParentChild.getString(1);
			record.SAPUSER_ID = rsgetParentChild.getString(3);
			record.CUST_NAME = rsgetParentChild.getString(43);
			record.PARENT_CUST_CODE = rsgetParentChild.getString(5);
			record.PARENT_CUST_NAME = rsgetParentChild.getString(6);
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

function getCheckImeis() {
	var output = {
		result: [],
		status: ""
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Imeis');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var record;
	var n = 0;
	var status = "('2','3')";
	try {
		for (var i = 0; i < dicLine.length; i++) {
			var Imei = dicLine[i];
			var queryGetEqDetails =
				'select e.MATERIAL_CODE,e.SERIAL_NUMBER ,p.MODEL_CODE , p.MODEL_DESCRIPTION from "MDB_DEV"."MST_EQUIPMENT" as e inner join "MDB_DEV"."MST_MATERIAL_MASTER" as p on p.MATERIAL_CODE=e.MATERIAL_CODE inner join "MDB_DEV"."SALES_INVOICE_EQUIP" as eq on eq.IMEI1 = e.IMEI1 where e.IMEI1 =? and e.PRIMARYSALE_CUSTOMER = ? and e.status in ' + status;
				//select DMS_CUST_CODE from "MDB_DEV"."MST_CUSTOMER" WHERE DBR_FORM_ID in (select PARENT_CUST_CODE FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=?)
			var pstmtGetEqDetails = connection.prepareStatement(queryGetEqDetails);
			pstmtGetEqDetails.setString(1, Imei.IMEI1);
			pstmtGetEqDetails.setString(2, Imei.ParentCode);
			//pstmtGetEqDetails.setString(3, '2');
			var rsGetEqDetails = pstmtGetEqDetails.executeQuery();
			connection.commit();
			if (rsGetEqDetails.next() > 0) {
				record = {};
				record.MATERIAL = rsGetEqDetails.getString(1);
				record.SERIAL_NUMBER = rsGetEqDetails.getString(2);
				record.MODEL_CODE = rsGetEqDetails.getString(3);
				record.MATERIAL_DESC = rsGetEqDetails.getString(4);
				record.DATE = Imei.DATE; //dateFormat(Imei.DATE);
				record.IMEI1 = Imei.IMEI1;
				record.IMEI = Imei.IMEI1;
				record.CODE = Imei.CUSTOMER;
				record.ParentCode = Imei.ParentCode;
				var query = 'select CUST_NAME FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=? ';
				var pstmt1 = connection.prepareStatement(query);
				pstmt1.setString(1, record.CODE);
				var rs1 = pstmt1.executeQuery();
				connection.commit();
				if (rs1.next()) {
					record.NAME = rs1.getString(1);
				}
				n = n + 1;
				record.SNO = n;
				record.COUNT = 1;
				record.Message = "successfull";
				output.result.push(record);
			}
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

function getModelByImei() {
	var output = {
		result: [],
		status: ""
	};

	var connection = $.db.getConnection();
	var imeiNo = $.request.parameters.get('imeiNo');
	var SAPUSER_ID = $.request.parameters.get('SAPUSER_ID');
	var ChildCustCode = $.request.parameters.get('ChildCustCode');
	var invoiceDate = $.request.parameters.get('ScanDate');
	var query, i = 0;
	var record;
	try {
		var queryGetEqDetails =
			'select e.MATERIAL_CODE,e.SERIAL_NUMBER ,p.MODEL_CODE , p.MODEL_DESCRIPTION  from "MDB_DEV"."MST_EQUIPMENT" as e inner join "MDB_DEV"."MST_MATERIAL_MASTER" as p on p.MATERIAL_CODE=e.MATERIAL_CODE inner join "MDB_DEV"."SALES_INVOICE_EQUIP" as eq on eq.IMEI1 = e.IMEI1 inner  join "MDB_DEV"."MST_CUSTOMER" as c on c.DMS_CUST_CODE = e.PRIMARYSALE_CUSTOMER	where e.IMEI1 =? and c.DBR_FORM_ID= ? and e.status=? ';
		var pstmtGetEqDetails = connection.prepareStatement(queryGetEqDetails);
		pstmtGetEqDetails.setString(1, imeiNo);
		pstmtGetEqDetails.setString(2, SAPUSER_ID);
		pstmtGetEqDetails.setString(3, '2');
		var rsGetEqDetails = pstmtGetEqDetails.executeQuery();
		connection.commit();
		if (rsGetEqDetails.next()) {
			record = {};
			record.MATERIAL = rsGetEqDetails.getString(1);
			record.SERIAL_NUMBER = rsGetEqDetails.getString(2);
			record.MODEL_CODE = rsGetEqDetails.getString(3);
			record.MATERIAL_DESC = rsGetEqDetails.getString(4);
			record.CODE = ChildCustCode;
			
			query = 'select CUST_NAME FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=? ';
			var pstmt1 = connection.prepareStatement(query);
			pstmt1.setString(1, record.CODE);
			var rs1 = pstmt1.executeQuery();
			connection.commit();
			if (rs1.next()) {
				record.NAME = rs1.getString(1);
			}
			i = i + 1;
			record.SNO = i;
			connection.commit();

			record.DATE = invoiceDate;
			record.IMEI1 = imeiNo;
			record.IMEI = imeiNo;
			record.COUNT = 1;
			output.result.push(record);
			output.status = '1';

		} else {
			record = {};
			output.status = '0';
			record.status = 0;
			record.message = 'IMEI is not present in Equipment master';
			output.result.push(record);
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

function updateEquipmentdelivery(retlCODE, SERIAL_NUMBER, connection, records) {
	var quryupdateEquipment = 'update "MDB_DEV"."MST_EQUIPMENT" SET STATUS=?,SECONDARYSALE_CUSTOMER=?,' +
		'SECONDARYSALE_DATE =?, SECONDARYSALE_RECEIVING_DATE = ? where SERIAL_NUMBER=?';
	var pstmtUpdateequipment = connection.prepareStatement(quryupdateEquipment);
	pstmtUpdateequipment.setString(1, '3');
	pstmtUpdateequipment.setString(2, retlCODE);
	pstmtUpdateequipment.setString(3, currentDate());
	pstmtUpdateequipment.setString(4, currentDate());
	pstmtUpdateequipment.setString(5, SERIAL_NUMBER);
	var rsqueryUpdate = pstmtUpdateequipment.executeUpdate();
	connection.commit();
	if (rsqueryUpdate > 0) {
		records.status = 1;
		records.message = 'record successfully updated.';
	} else {
		records.status = 0;
		records.message = 'Some Issues!';
	}

}

function updatePriceDSTBtoRETL(price, IMEI1, SERIAL_NUMBER, connection, records) {
	var quryupdateEquipment = 'update "MDB_DEV"."MST_EQUIPMENT" SET SECONDARY_PRICE=? where SERIAL_NUMBER=? or IMEI1=?';
	var pstmtUpdateequipment = connection.prepareStatement(quryupdateEquipment);
	pstmtUpdateequipment.setString(1, price);
	pstmtUpdateequipment.setString(2, SERIAL_NUMBER);
	pstmtUpdateequipment.setString(3, IMEI1);
	var rsqueryUpdate = pstmtUpdateequipment.executeUpdate();
	connection.commit();
	if (rsqueryUpdate > 0) {
		records.status = 1;
		records.message = 'record successfully updated.';
	} else {
		records.status = 0;
		records.message = 'Some Issues!';
	}

}

function selectPrice(retlCODE, IMEI1, SERIAL_NUMBER, connection, records) {
	var querySelect = 'select mp.SALE_PRICE from "MDB_DEV"."MST_PRICE" as mp inner join ' +
		' "MDB_DEV"."MST_EQUIPMENT" as e on mp.MATERIAL_CODE = e.MATERIAL_CODE ' +
		' inner join "MDB_DEV"."MST_CUSTOMER" as c on c.dms_cust_code = e.primarysale_customer ' +
		' inner join "MDB_DEV"."MST_CUSTOMER" as cs on cs.dms_cust_code= e.SECONDARYSALE_CUSTOMER ' +
		' where mp.date_till>=e.SECONDARYSALE_RECEIVING_DATE and mp.valid_from <=e.SECONDARYSALE_RECEIVING_DATE' +
		' and cs.CUST_TYPE=? and c.CUST_TYPE=? and e.imei1=? and e.serial_number=? and mp.state= c.state_code and ' +
		' e.SECONDARYSALE_RECEIVING_DATE is not null and mp.SOFT_DEL=?';
	var pstmtUpdateequipment = connection.prepareStatement(querySelect);
	pstmtUpdateequipment.setString(1, 'RETL');
	pstmtUpdateequipment.setString(2, 'DSTB');
	pstmtUpdateequipment.setString(3, IMEI1);
	pstmtUpdateequipment.setString(4, SERIAL_NUMBER);
	pstmtUpdateequipment.setString(5, '0');
	var rsqueryUpdate = pstmtUpdateequipment.executeQuery();
	connection.commit();
	if (rsqueryUpdate.next()) {
		var price = rsqueryUpdate.getString(1);
		updatePriceDSTBtoRETL(price, IMEI1, SERIAL_NUMBER, connection, records);
		records.status = 1;
		records.message = 'record successfully updated.';
	} else {
		records.status = 0;
		records.message = 'Some Issues!';
	}

}

function countReceivedMaterial(MaterialCount, DmsCustCode, dicLine) {
	var flag = false;
	var data;
	if (MaterialCount.length > 0) {
		for (var i = 0; i < MaterialCount.length; i++) {
			if (MaterialCount[i].MATERIAL === dicLine.MATERIAL && MaterialCount[i].RETLCODE === dicLine.CODE) {
				MaterialCount[i].DmsCustCode = DmsCustCode;
				MaterialCount[i].RETLCODE = dicLine.CODE;
				MaterialCount[i].Replace = dicLine.Replace;
				MaterialCount[i].QTY = parseInt(MaterialCount[i].QTY, 10) + parseInt(dicLine.COUNT, 10);
				flag = true;
			}
		}
	}

	if (flag === false) {
		data = {};
		data.DmsCustCode = DmsCustCode;
		data.MATERIAL = dicLine.MATERIAL;
		data.QTY = dicLine.COUNT;
		data.RETLCODE = dicLine.CODE;
		data.Replace = dicLine.Replace;
		MaterialCount.push(data);
	}
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


function addDeliveredstock(MaterialCount , DmsCustCode, dicLine , records){
var output = {
		results: []
	};
	var connection = $.db.getConnection();

	try {
	
		//var QTY = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].QTY;*/
for(var i = 0; i < MaterialCount.length; i++){
     if(MaterialCount[i].Replace !== true){
    var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, MaterialCount[i].DmsCustCode);
		pstmtCallAttribute.setString(2, MaterialCount[i].MATERIAL);
		pstmtCallAttribute.setInteger(3, parseInt(MaterialCount[i].QTY,10));
		pstmtCallAttribute.setString(4, 'DSTB');
		pstmtCallAttribute.setString(5, 'STOCKSAL');
		pstmtCallAttribute.setString(6, 'SALE23563355');
		pstmtCallAttribute.setString(7, dateFunction());
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, 'DMSTEAM');
		pstmtCallAttribute.setInteger(10,parseInt(MaterialCount[i].QTY,10));
			pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
     }
}

		connection.commit();
		// Need to identify
		if(rCallAttribute.next()) {
			records.status = 0;
			records.message = 'Data is Successfully Updated';
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

function updateReceiveStock(MaterialCount) {
	var connection = $.db.getConnection();
	for (var i = 0; i < MaterialCount.length; i++) {
	    var mater = MaterialCount[i];
	    if(mater.Replace !== true){
		var query =
			' UPDATE "MDB_DEV"."MST_STOCKS" SET current_stock=((SELECT CURRENT_STOCK FROM "MDB_DEV"."MST_STOCKS" WHERE CUSTOMER_CODE=? AND MATERIAL_CODE=?)-' + parseInt(MaterialCount[i].QTY, 10) + ')' 
			+ ' WHERE CUSTOMER_CODE=? AND MATERIAL_CODE=?';
		var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, mater.DmsCustCode);
		pstmt.setString(2, mater.MATERIAL);
		//pstmt.setInteger(3, parseInt(MaterialCount[i].QTY, 10));
		pstmt.setString(3, mater.DmsCustCode);
		pstmt.setString(4, mater.MATERIAL);
		var rs = pstmt.executeUpdate();
		connection.commit();
		if (rs > 0) {

		}
	    }
	}
	connection.close();
}

function addDeliveredStockRetl(MaterialCount , CODE, DmsCustCode, dicLine,records){
    
    var output = {
		results: []
	};
	var connection = $.db.getConnection();

	try {
	
for(var i = 0; i < MaterialCount.length; i++){
    var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, MaterialCount[i].RETLCODE);
		pstmtCallAttribute.setString(2, MaterialCount[i].MATERIAL);
		pstmtCallAttribute.setInteger(3, parseInt(MaterialCount[i].QTY,10));
		pstmtCallAttribute.setString(4, 'RETL');
		pstmtCallAttribute.setString(5, 'STOCKREC');
		pstmtCallAttribute.setString(6, 'RECEIVED23563355');
		pstmtCallAttribute.setString(7, dateFunction());
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, 'DMSTEAM');
		pstmtCallAttribute.setInteger(10, parseInt(MaterialCount[i].QTY,10));
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
}

		connection.commit();
		if(rCallAttribute.next()) {
			records.status = 0;
			records.message = 'Data is Successfully Updated';
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
function insertIntoTrnStock(dicLine){
    var connection = $.db.getConnection();
    var query = 'INSERT INTO "MDB_DEV"."TRN_STOCKS" ("CUSTOMER_CODE","TRANSACTION_TYPE","MATERIAL","TRANSACTION_QTY","TRANSACTION_NUMBER","TRANSACTION_DATE","TRANSACTION_TIME","CREATED_BY","INVENTORY_AFTER_TR") values (?,?,?,?,?,?,?,?,(select top 1 current_stock from "MDB_DEV"."MST_STOCKS" where customer_code=? and material_code=?))';
    var pstmt = connection.prepareStatement(query);
		pstmt.setString(1, dicLine.SecondrySECONDARYSALECUSTOMER);
		pstmt.setString(2, "SALE");
		pstmt.setString(3, dicLine.SecondryMATERIALCODE);
		pstmt.setInteger(4, 1);
		pstmt.setString(5, 'SALE23563355');
		pstmt.setString(6, dateFunction());
		pstmt.setString(7, '01:16:00');
		pstmt.setString(8, dicLine.CreateBy);
		pstmt.setString(9, dicLine.SecondrySECONDARYSALECUSTOMER);
		pstmt.setString(10,dicLine.SecondryMATERIALCODE);
				var rs = pstmt.executeUpdate();
				connection.commit();
				if (rs > 0 ){
				    //insertIntoTrnStock(dicLine);
				}
				connection.close();
}
function detectStock(dicLine){
     var connection = $.db.getConnection();
    var query = 'UPDATE "MDB_DEV"."MST_STOCKS" SET current_stock=current_stock-1 WHERE CUSTOMER_CODE= ? AND MATERIAL_CODE=?';
    var pstmt = connection.prepareStatement(query);
				pstmt.setString(1, dicLine.SecondrySECONDARYSALECUSTOMER);
				pstmt.setString(2, dicLine.SecondryMATERIALCODE);
				var rs = pstmt.executeUpdate();
				connection.commit();
				if (rs > 0 ){
				    insertIntoTrnStock(dicLine);
				}else{
				    return;
				}
				connection.close();
    
}
function checkSecondrySales(dicLine){
    var connection = $.db.getConnection();
    var querySelectequipment = 'select IMEI1,MATERIAL_CODE,SECONDARYSALE_CUSTOMER FROM  "MDB_DEV"."MST_EQUIPMENT" WHERE IMEI1=? and SECONDARYSALE_CUSTOMER != ?';
				var pstmtSelectequipment = connection.prepareStatement(querySelectequipment);
				pstmtSelectequipment.setString(1, dicLine.IMEI);
				pstmtSelectequipment.setString(2, '');
				var rsSelectequipment = pstmtSelectequipment.executeQuery();
				connection.commit();
				if (rsSelectequipment.next()) {
				    dicLine.SecondryIMEI1 = rsSelectequipment.getString(1);
				    dicLine.SecondryMATERIALCODE = rsSelectequipment.getString(2);
				    dicLine.SecondrySECONDARYSALECUSTOMER = rsSelectequipment.getString(3);
				    dicLine.Replace = true;
				    /*var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?,?);';
            		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
            		pstmtCallAttribute.setString(1, dicLine.ParentCode);
            		pstmtCallAttribute.setString(2, dicLine.SecondryMATERIALCODE);
            		pstmtCallAttribute.setInteger(3, 1);
            		pstmtCallAttribute.setString(4, 'DSTB');
            		pstmtCallAttribute.setString(5, 'STOCKSAL');
            		pstmtCallAttribute.setString(6, 'SALE23563355');
            		pstmtCallAttribute.setString(7, dateFunction());
            		pstmtCallAttribute.setString(8, '01:16:00');
            		pstmtCallAttribute.setString(9, 'DMSTEAM');
            		pstmtCallAttribute.setInteger(10,1);
            		pstmtCallAttribute.execute();
            		var rCallAttribute = pstmtCallAttribute.getResultSet();
            		connection.commit();
            		// Need to identify
            		if(rCallAttribute.next()) {
            			dicLine.status = 0;
            			dicLine.message = 'Data is Successfully Updated';
            		}*/
				    
				    detectStock(dicLine);
				}else{
				}
				connection.close();
}


function submitDeliveriesOfDstb() {
	var output = {
		results: []
	};
	var MaterialCount = [],
		flag = false;
	var records = {};
	var connection = $.db.getConnection();
	var DmsCustCode = $.request.parameters.get('DmsCustCode');
	var itemsArray = $.request.parameters.get('itemsArray');
	var dataLine = JSON.parse(itemsArray.replace(/\\r/g, ""));
	var status = "('2','3')";
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				dicLine.CreateBy = DmsCustCode;
				var querySelectequipment = 'select IMEI1,MATERIAL_CODE , IMEI2 FROM  "MDB_DEV"."MST_EQUIPMENT" WHERE IMEI1=? and status in ' + status;
				var pstmtSelectequipment = connection.prepareStatement(querySelectequipment);
				pstmtSelectequipment.setString(1, dicLine.IMEI);
			//	pstmtSelectequipment.setString(2, '2');
				var rsSelectequipment = pstmtSelectequipment.executeQuery();
				connection.commit();
				if (rsSelectequipment.next()) {
					var query =
						'select CUST_TYPE,DMS_CUST_CODE,CUST_NAME FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=?';// and PARENT_CUST_CODE=? '; //and STATUS=?
					var pstm0 = connection.prepareStatement(query);
					pstm0.setString(1, dicLine.CODE);
					//pstm0.setString(2, parentCode);
					var rpstm0 = pstm0.executeQuery();
					connection.commit();
					if (rpstm0.next()) {
						var usertype = 'RETL';
						if (usertype === rpstm0.getString(1)) {
						    dicLine.Replace = false;
							var queryinsertequipment =
								'insert into "MDB_DEV"."TRN_EQUIPMENT_MASTER" (SERIAL_NO ,MATERIAL_CODE ,IMEI1 ,ACTIVE ,SAPUSER_ID, STATUS , TRANSACTION_DATE ,INVOICE_NO,IMEI2 ,DMS_CUST_CODE ,TRANSACTION_TYPE) values(?,?,?,?,?,?,?,?,?,?,?)';
							var statusid = '3';
							var pstmtinsertequipment = connection.prepareStatement(queryinsertequipment);
							pstmtinsertequipment.setString(1, dicLine.SERIAL_NUMBER);
							pstmtinsertequipment.setString(2, dicLine.MATERIAL);
							pstmtinsertequipment.setString(3, dicLine.IMEI);
							pstmtinsertequipment.setString(4, 'Active');
							//	pstmtinsertequipment.setString(5, parentCode);
							pstmtinsertequipment.setString(5, dicLine.CODE);
							pstmtinsertequipment.setString(6, statusid);
							if (dicLine.DATE === null || dicLine.DATE === "" || dicLine.DATE === undefined) {
								pstmtinsertequipment.setString(7, currentDate());
							} else {
								pstmtinsertequipment.setString(7, dicLine.DATE);
							}
							pstmtinsertequipment.setString(8, 'null');
							pstmtinsertequipment.setString(9, rsSelectequipment.getString(3));
							pstmtinsertequipment.setString(10, dicLine.CODE);
							pstmtinsertequipment.setString(11, 'SALE');
							var rsinsertequipment = pstmtinsertequipment.executeUpdate();
							connection.commit();
							if (rsinsertequipment > 0) {
							    checkSecondrySales(dicLine);
								updateEquipmentdelivery(dicLine.CODE, dicLine.SERIAL_NUMBER, connection, records);
								selectPrice(dicLine.CODE, dicLine.IMEI, dicLine.SERIAL_NUMBER, connection, records);
								records.status = 1;
								records.message = 'record successfully uploaded.';
								countReceivedMaterial(MaterialCount, DmsCustCode, dicLine);
								flag = true;
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
			if (flag === true) {
				updateReceiveStock(MaterialCount);
				addDeliveredstock(MaterialCount , DmsCustCode, dicLine,records);
				addDeliveredStockRetl(MaterialCount , dicLine.CODE, dicLine,records);
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

function submitDeliveryOfDstb() {
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
					//var entryDate = DateFunction(items.DATE);
					var querySelectequipment = 'select IMEI1,MATERIAL_CODE , IMEI2 FROM  "MDB_DEV"."MST_EQUIPMENT" WHERE IMEI1=? and status=? ';
					var pstmtSelectequipment = connection.prepareStatement(querySelectequipment);
					pstmtSelectequipment.setString(1, items.IMEI);
					pstmtSelectequipment.setString(2, '2');
					var rsSelectequipment = pstmtSelectequipment.executeQuery();
					connection.commit();
					if (rsSelectequipment.next()) {
						var query =
							'select CUST_TYPE,DMS_CUST_CODE,CUST_NAME FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=? and PARENT_CUST_CODE=? '; //and STATUS=?
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
									//'insert into "MDB_DEV"."TRN_EQUIPMENT_MASTER" (SERIAL_NO ,MATERIAL_CODE ,IMEI1 ,ACTIVE ,PRIMARYSALE_CUSTOMER, SECONDARYSALE_CUSTOMER ,STATUS , SECONDARSALE_RECEIVING_DATE ,INVOICE_NO , UPDATED_DATE) values(?,?,?,?,?,?,?,?,?,?)';
									'insert into "MDB_DEV"."TRN_EQUIPMENT_MASTER" (SERIAL_NO ,MATERIAL_CODE ,IMEI1 ,ACTIVE ,SAPUSER_ID, STATUS , TRANSACTION_DATE ,INVOICE_NO,IMEI2) values(?,?,?,?,?,?,?,?,?)';
								var statusid = '3';
								var pstmtinsertequipment = connection.prepareStatement(queryinsertequipment);
								pstmtinsertequipment.setString(1, items.SERIAL_NUMBER);
								pstmtinsertequipment.setString(2, items.MATERIAL);
								pstmtinsertequipment.setString(3, items.IMEI);
								pstmtinsertequipment.setString(4, 'Active');
								//	pstmtinsertequipment.setString(5, parentCode);
								pstmtinsertequipment.setString(5, dicLine.CODE);
								pstmtinsertequipment.setString(6, statusid);
								if (items.DATE === null || items.DATE === "" || items.DATE === undefined) {
									pstmtinsertequipment.setString(7, currentDate());
								} else {
									pstmtinsertequipment.setString(7, items.DATE);
								}
								pstmtinsertequipment.setString(8, 'null');
								pstmtinsertequipment.setString(9, rsSelectequipment.getString(3));
								//pstmtinsertequipment.executeUpdate();
								var rsinsertequipment = pstmtinsertequipment.executeUpdate();
								connection.commit();
								if (rsinsertequipment > 0) {
									updateEquipmentdelivery(dicLine.CODE, items.IMEI, connection, records);
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

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getDETAILS":
		getDETAILS();
		break;
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
	case "submitDeliveryOfDstb":
		submitDeliveryOfDstb();
		break;
	case "getCheckImeis":
		getCheckImeis();
		break;
	case "submitDeliveriesOfDstb":
		submitDeliveriesOfDstb();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}