/**
 *  * To get all SAP receiving invoice.
 * @return {object} array of a resultset.
 * @author: laxmi
 **/
function getSapInvoice() {
	var recordInvoiceHeader;
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	var output = {
		results: []
	};
	var CustCode = $.request.parameters.get('CustCode');
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select SIH.INVOICE_NO,SIH.INVOICE_DATE,SIH.BATCH_NO,SIH.INVOICE_TYPE,SIH.PLANT_CODE,SIH.INVOICE_VALUE,SIH.SALES_ORDER,C.CUST_TYPE,C.DMS_CUST_CODE,C.CUST_NAME from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' +
			' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE = SIH.DMS_CUST_CODE where C.DBR_FORM_ID = ?';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);
		pstmtInvoiceHeader.setString(1, CustCode);
		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.SAPUSERID = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.CUSTOMERNAME = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.INVOICENO = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.INVOICEDATE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.BATCHNO = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.INVOICETYPE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.PLANTCODE = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.INVOICE_AMOUNT = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.SALESORDER = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.IsChecked = "0";
			var queryInvoiceLine =
				'select SIL.INVOICE_NO,SIL.INV_LINE_NUMBER,SIL.MATERIAL_CODE,SIL.QTY,M.MATERIAL_DESC,M.MODEL_CODE,M.MODEL_DESCRIPTION from "MDB_DEV"."SALES_INVOICE_LINES" as "SIL"' +
				' inner join "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE = SIL.MATERIAL_CODE  where SIL.INVOICE_NO=?';
			var paramInvoiceLine = connection.prepareStatement(queryInvoiceLine);
			paramInvoiceLine.setString(1, recordInvoiceHeader.INVOICENO);
			var rsInvoiceLine = paramInvoiceLine.executeQuery();
			connection.commit();
			while (rsInvoiceLine.next()) {
				recordInvoiceLine = {};
				recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(1);
				recordInvoiceLine.LINENO = rsInvoiceLine.getString(2);
				recordInvoiceLine.MODELCODE = rsInvoiceLine.getString(6);
				recordInvoiceLine.MODELDESC = rsInvoiceLine.getString(7);
				recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(3);
				recordInvoiceLine.MATERIALDESC = rsInvoiceLine.getString(5);
				recordInvoiceLine.QTY = rsInvoiceLine.getString(4);
				recordInvoiceLine.IsChecked = "0";
				var queryInvoiceEquip =
					'select SI.SERIAL_NO,SI.IMEI1,SI.IMEI2 from "MDB_DEV"."SALES_INVOICE_EQUIP" as SI inner join "MDB_DEV"."MST_EQUIPMENT" as ME on SI.SERIAL_NO = ME.SERIAL_NUMBER  where SI.INVOICE_NO=? and SI.INVOICE_LINE_NO=? and ME.STATUS = ? ';
				var paramInvoiceEquip = connection.prepareStatement(queryInvoiceEquip);
				paramInvoiceEquip.setString(1, recordInvoiceLine.INVOICENO);
				paramInvoiceEquip.setString(2, recordInvoiceLine.LINENO);
				paramInvoiceEquip.setString(3, '1');
				var rsInvoiceEquip = paramInvoiceEquip.executeQuery();
				while (rsInvoiceEquip.next()) {
					recordInvoiceEquip = {};
					//recordInvoiceEquip.MATERIALCODE = rsInvoiceEquip.getString(4);
					recordInvoiceEquip.SERIALNO = rsInvoiceEquip.getString(1);
					recordInvoiceEquip.IMEI1 = rsInvoiceEquip.getString(2);
					recordInvoiceEquip.IMEI2 = rsInvoiceEquip.getString(3);
					recordInvoiceEquip.IsChecked = "0";
					invoiceEquipArray.push(recordInvoiceEquip);
					recordInvoiceLine.INVOICEEQUIPMENTS = invoiceEquipArray;
				}
				if (invoiceEquipArray.length > 0) {
					invoiceLineArray.push(recordInvoiceLine);
					recordInvoiceHeader.INVOICELINES = invoiceLineArray;
				}
				invoiceEquipArray = [];
			}
			if (invoiceLineArray.length > 0) {
				output.results.push(recordInvoiceHeader);
			}
			invoiceLineArray = [];
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

/**
 *  * To get all SAP receiving invoice.
 * @return {object} array of a resultset.
 * @author: Rohit
 **/
function getSapInvoices() {
	var recordInvoiceHeader;
	var recordInvoiceLine;
	var invoiceLineArray = [];
	var recordInvoiceEquip;
	var invoiceEquipArray = [];
	var output = {
		results: []
	};
	try {
		var qryInvoiceHeader = null;
		var connection = $.db.getConnection();
		qryInvoiceHeader =
			'select SIH.INVOICE_NO,SIH.INVOICE_DATE,SIH.BATCH_NO,SIH.INVOICE_TYPE,SIH.PLANT_CODE,SIH.INVOICE_VALUE,SIH.SALES_ORDER,C.CUST_TYPE,C.SAPUSER_ID,C.CUST_NAME from "MDB_DEV"."SALES_INVOICE_HEADER" as "SIH" ' +
			' inner join "MDB_DEV"."MST_CUSTOMER" as "C" on C.DMS_CUST_CODE = SIH.DMS_CUST_CODE';
		var pstmtInvoiceHeader = connection.prepareStatement(qryInvoiceHeader);

		var rsInvoiceHeader = pstmtInvoiceHeader.executeQuery();
		while (rsInvoiceHeader.next()) {
			recordInvoiceHeader = {};
			recordInvoiceHeader.CUSTOMERTYPE = rsInvoiceHeader.getString(8);
			recordInvoiceHeader.SAPUSERID = rsInvoiceHeader.getString(9);
			recordInvoiceHeader.CUSTOMERNAME = rsInvoiceHeader.getString(10);
			recordInvoiceHeader.INVOICENO = rsInvoiceHeader.getString(1);
			recordInvoiceHeader.INVOICEDATE = rsInvoiceHeader.getString(2);
			recordInvoiceHeader.BATCHNO = rsInvoiceHeader.getString(3);
			recordInvoiceHeader.INVOICETYPE = rsInvoiceHeader.getString(4);
			recordInvoiceHeader.PLANTCODE = rsInvoiceHeader.getString(5);
			recordInvoiceHeader.INVOICE_AMOUNT = rsInvoiceHeader.getString(6);
			recordInvoiceHeader.SALESORDER = rsInvoiceHeader.getString(7);
			recordInvoiceHeader.IsChecked = "0";
			var queryInvoiceLine =
				'select SIL.INVOICE_NO,SIL.INV_LINE_NUMBER,SIL.MATERIAL_CODE,SIL.QTY,M.MATERIAL_DESC,M.MODEL_CODE,M.MODEL_DESCRIPTION from "MDB_DEV"."SALES_INVOICE_LINES" as "SIL"' +
				' inner join "MDB_DEV"."MST_MATERIAL_MASTER" as "M" on M.MATERIAL_CODE = SIL.MATERIAL_CODE  where SIL.INVOICE_NO=?';
			var paramInvoiceLine = connection.prepareStatement(queryInvoiceLine);
			paramInvoiceLine.setString(1, recordInvoiceHeader.INVOICENO);
			var rsInvoiceLine = paramInvoiceLine.executeQuery();
			connection.commit();
			while (rsInvoiceLine.next()) {
				recordInvoiceLine = {};
				recordInvoiceLine.INVOICENO = rsInvoiceLine.getString(1);
				recordInvoiceLine.LINENO = rsInvoiceLine.getString(2);
				recordInvoiceLine.MODELCODE = rsInvoiceLine.getString(6);
				recordInvoiceLine.MODELDESC = rsInvoiceLine.getString(7);
				recordInvoiceLine.MATERIALCODE = rsInvoiceLine.getString(3);
				recordInvoiceLine.MATERIALDESC = rsInvoiceLine.getString(5);
				recordInvoiceLine.QTY = rsInvoiceLine.getString(4);
				recordInvoiceLine.IsChecked = "0";
				var queryInvoiceEquip =
					'select SI.SERIAL_NO,SI.IMEI1,SI.IMEI2 from "MDB_DEV"."SALES_INVOICE_EQUIP" as SI inner join "MDB_DEV"."MST_EQUIPMENT" as ME on SI.SERIAL_NO = ME.SERIAL_NUMBER  where SI.INVOICE_NO=? and SI.INVOICE_LINE_NO=? and ME.STATUS = ? ';
				var paramInvoiceEquip = connection.prepareStatement(queryInvoiceEquip);
				paramInvoiceEquip.setString(1, recordInvoiceLine.INVOICENO);
				paramInvoiceEquip.setString(2, recordInvoiceLine.LINENO);
				paramInvoiceEquip.setString(3, '1');
				var rsInvoiceEquip = paramInvoiceEquip.executeQuery();
				while (rsInvoiceEquip.next()) {
					recordInvoiceEquip = {};
					//recordInvoiceEquip.MATERIALCODE = rsInvoiceEquip.getString(4);
					recordInvoiceEquip.SERIALNO = rsInvoiceEquip.getString(1);
					recordInvoiceEquip.IMEI1 = rsInvoiceEquip.getString(2);
					recordInvoiceEquip.IMEI2 = rsInvoiceEquip.getString(3);
					recordInvoiceEquip.IsChecked = "0";
					invoiceEquipArray.push(recordInvoiceEquip);
					recordInvoiceLine.INVOICEEQUIPMENTS = invoiceEquipArray;
				}
				invoiceEquipArray = [];

				invoiceLineArray.push(recordInvoiceLine);
				recordInvoiceHeader.INVOICELINES = invoiceLineArray;
			}
			invoiceLineArray = [];
			output.results.push(recordInvoiceHeader);
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

function countMaterial(MaterialCount, InvoiceLine,SAPUSERID) {
   /* var data = {};
    data.SAPUSERID = SAPUSERID;*/
    var flag = false;
    var data;
	if (MaterialCount.length > 0) {
		for (var i = 0; i < MaterialCount.length; i++) {
			if (MaterialCount[i].MATERIALCODE === InvoiceLine.MATERIALCODE) {
			    MaterialCount[i].SAPUSERID = SAPUSERID;
				MaterialCount[i].QTY = parseInt(MaterialCount[i].QTY, 10) + 1;//parseInt(InvoiceLine.QTY, 10);
		        flag = true;
			}
		}
	} 
	/*else {
	    data = {};
	    data.SAPUSERID = SAPUSERID;
	    data.MATERIALCODE = InvoiceLine.MATERIALCODE;
	    data.QTY = InvoiceLine.QTY;
		MaterialCount.push(InvoiceLine);
	}*/
	if(flag === false){
	    data = {};
	    data.SAPUSERID = SAPUSERID;
	    data.MATERIALCODE = InvoiceLine.MATERIALCODE;
	    data.QTY = 1;//InvoiceLine.QTY;
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

function addStocks(MaterialCount,record) {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		//var QTY = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].QTY;*/
for(var i = 0; i < MaterialCount.length; i++){
    var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, MaterialCount[i].SAPUSERID);
		pstmtCallAttribute.setString(2, MaterialCount[i].MATERIALCODE);
		pstmtCallAttribute.setInteger(3, parseInt(MaterialCount[i].QTY,10));
		pstmtCallAttribute.setString(4, 'DSTB');
		pstmtCallAttribute.setString(5, 'STOCKREC');
		pstmtCallAttribute.setString(6, 'REC23563355');
		pstmtCallAttribute.setString(7, dateFunction());
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, 'DMSTEAM');
		pstmtCallAttribute.setInteger(10, parseInt(MaterialCount[i].QTY,10));
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		connection.commit();
		// Need to identify
		if(rCallAttribute.next()) {
			record.status = 0;
			record.message = 'Data is Successfully Updated';
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

function receivingEquipment() {
	var output = {
		results: []
	};
var flag = false;
	var record = {},
		InvoiceLine;
	var connection = $.db.getConnection();
	var serialNos = $.request.parameters.get('serialNos');
	var MaterialCount = [];
	try {

		var bool = false;
		var oFinalSerialNoResult = JSON.parse(serialNos);
		for (var i = 0; i < oFinalSerialNoResult.results.length; i++) {
			for (var m = 0; m < oFinalSerialNoResult.results[i].INVOICELINES.length; m++) {
				//using for count material qty 
				if (oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS !== undefined) {
					for (var k = 0; k < oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS.length; k++) {
						if (oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IsChecked === '1') {
							bool = true;
							var IMEI1 = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IMEI1.trim();
							var INVOICENO = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICENO.trim();
							var INVOICELINENO = oFinalSerialNoResult.results[i].INVOICELINES[m].LINENO.trim();
							var SERIALNO = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].SERIALNO.trim();
							var IMEI2 = oFinalSerialNoResult.results[i].INVOICELINES[m].INVOICEEQUIPMENTS[k].IMEI2.trim();
							var MATERIALCODE = oFinalSerialNoResult.results[i].INVOICELINES[m].MATERIALCODE.trim();
							var SAPUSERID = oFinalSerialNoResult.results[i].SAPUSERID;
							var BATCHNO = oFinalSerialNoResult.results[i].BATCHNO;
							var PLANTCODE = oFinalSerialNoResult.results[i].PLANTCODE;
							var QTY =  oFinalSerialNoResult.results[i].INVOICELINES[m].QTY;

							var CallProcTRANEQUIP = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::TRAN_EQUIPMENT"(?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
							var pstmtCallProcTRANEQUIP = connection.prepareCall(CallProcTRANEQUIP);
							pstmtCallProcTRANEQUIP.setString(1, INVOICENO);
							pstmtCallProcTRANEQUIP.setString(2, INVOICELINENO);
							pstmtCallProcTRANEQUIP.setString(3, SERIALNO);
							pstmtCallProcTRANEQUIP.setString(4, IMEI1);
							pstmtCallProcTRANEQUIP.setString(5, IMEI2);
							pstmtCallProcTRANEQUIP.setString(6, SAPUSERID);
							pstmtCallProcTRANEQUIP.setString(7, MATERIALCODE);
							pstmtCallProcTRANEQUIP.setString(8, dateFunction());
							pstmtCallProcTRANEQUIP.setString(9, "1001");
							pstmtCallProcTRANEQUIP.setString(10, "MS09");
							pstmtCallProcTRANEQUIP.setString(11, SAPUSERID);
							pstmtCallProcTRANEQUIP.setString(12, "RECEIVED");
							pstmtCallProcTRANEQUIP.setString(13, dateFunction());
							pstmtCallProcTRANEQUIP.setString(14, "2");
							pstmtCallProcTRANEQUIP.execute();
							//var rsCallProcTRANEQUIP = pstmtCallProcTRANEQUIP.getParameterMetaData();
							var rsCallProcTRANEQUIP = pstmtCallProcTRANEQUIP.getParameterMetaData();
							connection.commit();
							if (rsCallProcTRANEQUIP.getParameterCount() > 0) {
								record.status = 1;
								record.message = 'Data is Successfully Updated';
								InvoiceLine = oFinalSerialNoResult.results[i].INVOICELINES[m];
				                countMaterial(MaterialCount,InvoiceLine,SAPUSERID);
								flag = true;
							}
						}

					}
				}
				if (bool === false) {

					record.status = '3';
					record.message = 'No Data Is Selected';

				}
			}
		}
		if(flag === true){
		    addStocks(MaterialCount,record);
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

	case "getSapInvoices":
		getSapInvoices();
		break;

	case "receivingEquipment":
		receivingEquipment();
		break;
	case "getSapInvoice":
		getSapInvoice();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}