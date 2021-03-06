
function getIMEIDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.imei", "Imei");
	var client = new $.net.http.Client();
	var req = new $.net.http.Request($.net.http.POST, "");

	req.contentType = "application/json";

	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = JSON.parse(response.body.asString());
	//return data;
}


function getInvoiceDestination(records) {
	var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.hci", "Invoice");
	var client = new $.net.http.Client();
	//var req = new $.net.http.Request($.net.http.POST,"");
	var req = new $.web.WebRequest($.net.http.POST, "");
	
	req.contentType = "application/json";
	req.setBody(JSON.stringify(records));
	client.request(req, dest);
	var response = client.getResponse();
	records.data = response.body.asString();
	
	var test = '0';
}

/*
 * postInvoiceHeader is use for insert SAP Invoice Header data into HANA DB
 * create by laxmi
 */
function postInvoiceHeader() {
	var Output = [];
	var connection = $.db.getConnection();
	var InvHeaderUpdateRecord = {};
	var InvHeaderInput = $.request.body.asString();
	InvHeaderInput = JSON.parse(InvHeaderInput);
	try {
		for (var i = 0; i < InvHeaderInput.result.length; i++) {
			var InvHeaderData = InvHeaderInput.result[i];
			var queryInvHeaderPost =
			'insert into "MDB_DEV"."SALES_INVOICE_HEADER" ("INVOICE_NO","INVOICE_DATE","SAPUSER_ID","INVOICE_TYPE","BILL_TO_PARTY_CODE","BILL_TO_PARTY_NAME", ' +
 				' "SHIP_TO_PARTY_CODE","SHIP_TO_PARTY_NAME","INVOICE_VALUE","SALES_ORDER","CURRENCY","EXC_RATE","SAP_INV_DATE", ' +
 				' "SAP_INV_TIME","CANCELED_INVOICE","ODN","CREATE_BY","BATCH_NO","PLANT_CODE","SOFTDELL") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
			/*	'insert into "MDB_DEV"."SALES_INVOICE_HEADER" ("INVOICE_NO","INVOICE_DATE","SAPUSER_ID","INVOICE_TYPE","BILL_TO_PARTY_CODE","BILL_TO_PARTY_NAME", ' +
				' "SHIP_TO_PARTY_CODE","SHIP_TO_PARTY_NAME","INVOICE_VALUE","SALES_ORDER","CURRENCY","EXC_RATE","SAP_INV_DATE", ' +
				' "SAP_INV_TIME","CANCELED_INVOICE","ODN","CREATE_BY","BATCH_NO","PLANT_CODE","SOFTDELL") values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';*/
			var pstmtInvHeaderPost = connection.prepareStatement(queryInvHeaderPost);
			pstmtInvHeaderPost.setString(1, InvHeaderData.InvoiceNo);
			pstmtInvHeaderPost.setString(2, InvHeaderData.InvoiceDate);
			pstmtInvHeaderPost.setString(3, InvHeaderData.CustCode);
			pstmtInvHeaderPost.setString(4, InvHeaderData.InvoiceType);
			pstmtInvHeaderPost.setString(5, InvHeaderData.BillToPartyCode);
			pstmtInvHeaderPost.setString(6, InvHeaderData.BillToPartyName);
			pstmtInvHeaderPost.setString(7, InvHeaderData.ShipToPartyCode);
			pstmtInvHeaderPost.setString(8, InvHeaderData.ShipToPartyName);
			pstmtInvHeaderPost.setString(9, InvHeaderData.InvoiceValue);
			pstmtInvHeaderPost.setString(10, InvHeaderData.SalesOrder);
			pstmtInvHeaderPost.setString(11, InvHeaderData.Currency);
			pstmtInvHeaderPost.setString(12, InvHeaderData.ExcRate);
			pstmtInvHeaderPost.setString(13, InvHeaderData.SAPInvDate);
			pstmtInvHeaderPost.setString(14, InvHeaderData.SAPInvTime);
			pstmtInvHeaderPost.setString(15, InvHeaderData.CanceledBillingDocNumber);
			pstmtInvHeaderPost.setString(16, InvHeaderData.ODNNumber);
			pstmtInvHeaderPost.setString(17, "Job");
			pstmtInvHeaderPost.setString(18, InvHeaderData.BATCH_NO);
			pstmtInvHeaderPost.setString(19, InvHeaderData.PLANT_CODE);
			pstmtInvHeaderPost.setString(20, InvHeaderData.SOFTDELL);
			var rsInvHeaderPost = pstmtInvHeaderPost.executeUpdate();
			connection.commit();
			if (rsInvHeaderPost > 0) {
				InvHeaderUpdateRecord.status = '1';
				InvHeaderUpdateRecord.message = 'Invoice Header Data Successfully Uploaded';
				Output.push(InvHeaderUpdateRecord);
			} else {
				InvHeaderUpdateRecord.status = '0';
				InvHeaderUpdateRecord.message = 'Something went Wrong,Invoice Header data is not insert';
				Output.push(InvHeaderUpdateRecord);
			}
		}
		connection.close();
		var messages = Output.length + ' out of ' + (InvHeaderData.result.length) + ' has been Updated in Invoice Header Table';
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(messages);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/*
 * postInvoiceLine is use for insert SAP Invoice Line data into HANA DB
 * create by laxmi
 */
function postInvoiceLine() {
	var Output = [];
	var connection = $.db.getConnection();
	var InvLineUpdateRecord = {};
	var InvLineInput = $.request.body.asString();
	InvLineInput = JSON.parse(InvLineInput);
	try {
		for (var i = 0; i < InvLineInput.result.length; i++) {
			var InvLineData = InvLineInput.result[i];
			var queryInvLinePost =
			'insert into "MDB_DEV"."SALES_INVOICE_LINES" ("INVOICE_NO","INV_LINE_NUMBER","MATERIAL_CODE","QTY","SALES_PRICE","CGST", ' +
 				' "SGST","IGST","UOM","NET_WEIGHT","GROSS_WEIGHT","NET_VALUE","BATCH_NO", ' +
 				' "PLANT_CODE","SALES_ORDER_NO","SALES_ORDER_LINE_N0","CREATED_BY" ,"DISCOUNT" ,"SOFT_DELL") ' +
 				' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
			/*	'insert into "MDB_DEV"."SALES_INVOICE_LINE" ("INVOICE_NO","LINE_NO","ITEM_CODE","ITEM_QTY","AMOUNT","CGST", ' +
				' "SGST","IGST","UOM","NET_WT","GROSS_WT","NET_VALUE","BATCH_NO", ' +
				' "PLANT_CODE","SAP_SALES_ORDER","SAP_SALES_ORDER_LINE","CREATE_BY") ' + ' values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
		*/
			var pstmtInvLinePost = connection.prepareStatement(queryInvLinePost);
			pstmtInvLinePost.setString(1, InvLineData.InvoiceNo);
			pstmtInvLinePost.setString(2, InvLineData.InvLineNumber);
			pstmtInvLinePost.setString(3, InvLineData.MaterialCode);
			pstmtInvLinePost.setString(4, InvLineData.Qty);
			pstmtInvLinePost.setString(5, InvLineData.SalesPrice);
			pstmtInvLinePost.setString(6, InvLineData.CGST);
			pstmtInvLinePost.setString(7, InvLineData.SGST);
			pstmtInvLinePost.setString(8, InvLineData.IGST);
			pstmtInvLinePost.setString(9, InvLineData.UoM);
			pstmtInvLinePost.setString(10, InvLineData.NetWeight);
			pstmtInvLinePost.setString(11, InvLineData.GrossWeight);
			pstmtInvLinePost.setString(12, InvLineData.NetValue);
			pstmtInvLinePost.setString(13, InvLineData.BatchNo);
			pstmtInvLinePost.setString(14, InvLineData.PlantCode);
			pstmtInvLinePost.setString(15, InvLineData.SalesOrderNumber);
			pstmtInvLinePost.setString(16, InvLineData.SalesOrderLineNumber);
			pstmtInvLinePost.setString(17, "Job");
			pstmtInvLinePost.setString(18, InvLineData.DISCOUNT);
 			pstmtInvLinePost.setString(19, InvLineData.SOFT_DELL);
			var rsInvLinePost = pstmtInvLinePost.executeUpdate();
			connection.commit();
			if (rsInvLinePost > 0) {
				InvLineUpdateRecord.status = '1';
				InvLineUpdateRecord.message = 'Invoice Line Data Successfully Uploaded';
				Output.push(InvLineUpdateRecord);
			} else {
				InvLineUpdateRecord.status = '0';
				InvLineUpdateRecord.message = 'Something went Wrong,Invoice Line data is not insert';
				Output.push(InvLineUpdateRecord);
			}
		}
		connection.close();
		var messages = Output.length + ' out of ' + (InvLineInput.result.length) + ' has been Updated in Invoice Line Table';
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(messages);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/*
 * postInvoiceLine is use for insert SAP Invoice Line data into HANA DB
 * create by laxmi
 */
function postInvoiceEquipment() {
    var  data;
   var records = {};
	
	records.EndDate = "2018-06-03";
	records.EndTime = "00:00:00";
	records.StartDate = "2018-03-01";
	records.StartTime = "00:00:00";
	//records.push(requestInvoiceBody);

    
    getInvoiceDestination(records, data);
	var Output = [];
	var connection = $.db.getConnection();
	var InvEquiUpdateRecord = {};
	//var InvEquiInput = $.request.body.asString();
	var InvEquiInput = records.data;
	try {
		for (var i = 0; i < InvEquiInput.result.length; i++) {
			var InvEquiData = InvEquiInput.result[i];
			var queryInvEquiPost =
				'insert into "MDB_DEV"."SALES_INVOICE_WISE_EQUI" ("INVOICE_NO","INVOICE_LINE_NO","MATERIAL_CODE","SERIAL_NO","IMEI1", ' +
				' "IMEI2","SAPUSER_ID","BATCH_NO", "PLANT_CODE","QUANTITY","CREATE_DBY","PROCESS_STATUS") ' + ' values (?,?,?,?,?,?,?,?,?,?,?,?)';
			var pstmtInvEquiPost = connection.prepareStatement(queryInvEquiPost);
			pstmtInvEquiPost.setString(1, InvEquiData.InvoiceNo);
			pstmtInvEquiPost.setString(2, InvEquiData.LineNo);
			pstmtInvEquiPost.setString(3, InvEquiData.ItemCode);
			pstmtInvEquiPost.setString(4, InvEquiData.SerialNo);
			pstmtInvEquiPost.setString(5, InvEquiData.ImeiNo1);
			pstmtInvEquiPost.setString(6, InvEquiData.ImeiNo2);
			pstmtInvEquiPost.setString(7, InvEquiData.SAPUserID);
			pstmtInvEquiPost.setString(8, InvEquiData.BatchNo);
			pstmtInvEquiPost.setString(9, InvEquiData.PlantCode);
			pstmtInvEquiPost.setString(10, InvEquiData.ItemQty);
			pstmtInvEquiPost.setString(11, "Job");
			pstmtInvEquiPost.setString(12, InvEquiData.Processstatus);
			var rsInvEquiPost = pstmtInvEquiPost.executeUpdate();
			connection.commit();
			if (rsInvEquiPost > 0) {
				InvEquiUpdateRecord.status = '1';
				InvEquiUpdateRecord.message = 'Invoice Equi Data Successfully Uploaded';
				Output.push(InvEquiUpdateRecord);
			} else {
				InvEquiUpdateRecord.status = '0';
				InvEquiUpdateRecord.message = 'Something went Wrong,Invoice Equi data is not insert';
				Output.push(InvEquiUpdateRecord);
			}
		}
		connection.close();
		var messages = Output.length + ' out of ' + (InvEquiInput.result.length) + ' has been Updated in Invoice Equi Table';
	} catch (e) {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.message);
		return;
	}
	var body = JSON.stringify(request.data);
	$.response.contentType = 'application/json';
	$.response.setBody(request.data);
	$.response.status = $.net.http.OK;
}

function HCIJobs(){
    var datas = {
        record : {}
    };
    var records = {};
	records.EndDate = "2018-06-03";
	records.EndTime = "00:00:00";
	records.StartDate = "2018-03-01";
	records.StartTime = "00:00:00";
	datas.record = records;
	
    try{ var destination; var client;

destination = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.hci", "Invoice");

client = new $.net.http.Client();

var request = new $.net.http.Request($.net.http.POST,"/salesInvoiceEquipments");

request.headers.set("Content-Type" , "application/json");

request.headers.set("Accept" , "application/json");

request.setBody(JSON.stringify(datas));

client.request(request, destination);

var response = client.getResponse();

var body = response.body.asString();
$.response.setBody(JSON.stringify( {

"Success": client.getResponse().status} ));

}

catch(e){ $.response.status = $.net.http.INTERNAL_SERVER_ERROR; $.response.setBody(e.message ); }
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
    case "HCIJobs":
        HCIJobs();
        break;
	case "postInvoiceHeader":
		postInvoiceHeader();
		break;
	case "postInvoiceLine":
		postInvoiceLine();
		break;
	case "postInvoiceEquipment":
		postInvoiceEquipment();
		break;
	default:
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody('Invalid Command: ', aCmd);
}