//this is use for create unique number for PO
function getPORange(record) {
	var today = new Date();
	var yyyy = today.getFullYear();

	var conn = $.db.getConnection();
	var queryRange = 'select ID,name from "MDB_DEV"."PO_RANGE"';
	var pstmtRange = conn.prepareStatement(queryRange);
	var rrange = pstmtRange.executeQuery();
	conn.commit();
	while (rrange.next()) {
		record.ID = rrange.getString(1);
		record.name = rrange.getString(2);
	}
	record.PONO = record.name + (record.ID).toString() + yyyy;
	conn.close();
}
//salesOrderUpdate is use for insert current PO number

function generatePOUpdate(record) {
	var conn = $.db.getConnection();
	var id = parseInt(record.ID, 10);
	id = id + 1;
	var query2 = 'UPDATE "MDB_DEV"."PO_RANGE" SET ID = ?,value = ? WHERE name = ?';
	var pstmt2 = conn.prepareStatement(query2);
	pstmt2.setInteger(1, id);
	pstmt2.setString(2, record.PONO);
	pstmt2.setString(3, record.name);
	var r2 = pstmt2.executeUpdate();
	conn.commit();
	if (r2 > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
}
//this is use for find out parent code of customer


function getParentCustCode(dicHeader){
    var conn = $.db.getConnection();
	var queryRange = ' select parent_cust_code from "CELEKONDMS"."CUSTOMER_MASTER" where cust_code = ?';
	var pstmtRange = conn.prepareStatement(queryRange);
	pstmtRange.setString(1,dicHeader.CustCode);
	var rrange = pstmtRange.executeQuery();
	conn.commit();
	while (rrange.next()) {
		dicHeader.ParentCode = rrange.getString(1);
	}
	conn.close();
}
//Use for change date formate
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
//update Status in sales order in sales header
function updateSoPo(dicLine){
    var record = {},yyyymmddp;
    yyyymmddp = dateFunction();
    var conn = $.db.getConnection();
	var query2 = 'UPDATE "MDB_DEV"."SALESORDER_LINE" SET PARENT_PO_NUMBER = ?,PARENT_PO_DATE = ? WHERE SO_NUMBER = ? and MATERIAL_CODE = ?';
	var pstmt2 = conn.prepareStatement(query2);
	pstmt2.setString(1, dicLine.PONO);
	pstmt2.setString(2, yyyymmddp);
	pstmt2.setString(3, dicLine.SONo);
	pstmt2.setString(4, dicLine.MatCode);
	var r2 = pstmt2.executeUpdate();
	conn.commit();
	if (r2 > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
}

//
function getSOStatus(dicLine,dicHeader){
    var conn = $.db.getConnection();
    var queryStatus = 'select SO_STATUS from "MDB_DEV"."SALESORDER_HEADER" where PARENT_CODE = ? and SO_NUMBER = ?';
    var pstmtStatus = conn.prepareStatement(queryStatus);
	pstmtStatus.setString(1, dicHeader.CustCode);
	pstmtStatus.setString(2, dicLine.SONo);
    var rStatus = pstmtStatus.executeQuery();
	conn.commit();
	while (rStatus.next()) {
		dicLine.SoStatus = rStatus.getString(1);
	}
	conn.close();
}
//update sales order status and Parent PO number
function updateSoStatus(dicLine,dicHeader){
    //use for capture current status of sales order
    getSOStatus(dicLine,dicHeader);
    var record = {};
    if(dicLine.SoStatus === '0'){
        var status = parseInt(dicLine.SoStatus ,10);
        var conn = $.db.getConnection();
	var query2 = 'UPDATE "MDB_DEV"."SALESORDER_HEADER" SET SO_STATUS = ? WHERE PARENT_CODE = ? and SO_NUMBER = ?';
	var pstmt2 = conn.prepareStatement(query2);
	pstmt2.setInteger(1, status + 1);
	pstmt2.setString(2, dicHeader.CustCode);
	pstmt2.setString(3, dicLine.SONo);
	var r2 = pstmt2.executeUpdate();
	conn.commit();
	if (r2 > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
    }
    
}

//this is use for Generate PO

function generatePO() {
	var output = {
		results: []
	};
	var records;
	var datasLine = $.request.parameters.get('OrderLine');
	var datasHeader = $.request.parameters.get('OrderHeader');
	//.replace(/\\r/g, "")
	var record = {};
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var dataHeader = JSON.parse(datasHeader.replace(/\\r/g, ""));

	var conn1 = $.db.getConnection();
	try {
		//this is use for create unique number for sales order
		getPORange(record);
		if (dataHeader.length > 0 && dataLine.length > 0) {
			for (var i = 0; i < dataHeader.length; i++) {
				var dicHeader = dataHeader[i];
				getParentCustCode(dicHeader);
				var queryHeader =
					'insert into  "MDB_DEV"."PO_HEADER"(PARENT_CODE,CUST_CODE,PO_NUMBER,PO_STATUS,CREATED_BY)values(?,?,?,?,?)';
				var pstmtHeader = conn1.prepareStatement(queryHeader);
				pstmtHeader.setString(1, dicHeader.ParentCode);
				pstmtHeader.setString(2, dicHeader.CustCode);
				//pstmtHeader.setString(3, dicHeader.ParentCode);
				pstmtHeader.setString(3, record.PONO);
				pstmtHeader.setInteger(4, 0);
			/*	pstmtHeader.setString(6, dicHeader.PoNo);
				pstmtHeader.setString(7, dicHeader.PoDate);*/
				pstmtHeader.setString(5, dicHeader.CustCode);

				var rsHeader = pstmtHeader.executeUpdate();
				conn1.commit();
				records = {};
				if (rsHeader > 0) {
					records.status = 1;
					records.message = 'Data Uploaded Sucessfully';
				} else {
					records.status = 0;
					records.message = 'Some Issues!';
				}

				output.results.push(records);

			}
			for (var j = 0; j < dataLine.length; j++) {
				//var k = 1;
				var dicLine = dataLine[j];
				var queryLine =
					'insert into  "MDB_DEV"."PO_LINE"(MATERIAL_CODE,ORDER_QTY,UNIT_PRICE,REQUIRED_DATE,DISCOUNT,SGST,IGST,CGST,TOTAL_AMT,CREATED_BY,PO_NUMBER,PO_LINE_NO)values(?,?,?,?,?,?,?,?,?,?,?,?)';
				var pstmtLine = conn1.prepareStatement(queryLine);
				pstmtLine.setString(1, dicLine.MatCode);
				pstmtLine.setInteger(2, parseInt(dicLine.Qty,10));
				pstmtLine.setInteger(3, parseInt(dicLine.Price,10));
				pstmtLine.setString(4, dicLine.RDate);
				pstmtLine.setInteger(5, 0);
				pstmtLine.setInteger(6, 0);
				pstmtLine.setInteger(7, 0);
				pstmtLine.setInteger(8, 0);
				pstmtLine.setInteger(9, parseInt(dicLine.Amt,10));
				pstmtLine.setString(10, dicHeader.CustCode);
				///	pstmtLine.setInteger(11, k++);
				pstmtLine.setString(11, record.PONO);
				pstmtLine.setInteger(12, 10);

				var rsLine = pstmtLine.executeUpdate();
				conn1.commit();
				records = {};
				if (rsLine > 0) {
					records.status = 1;
					records.message = 'Data Uploaded Sucessfully';
					// this is use for update current salesorder no in table
					dicLine.PONO = record.PONO;
					generatePOUpdate(record);
					updateSoPo(dicLine);
					updateSoStatus(dicLine,dicHeader);
				} else {
					records.status = 0;
					records.message = 'Some Issues!';
				}

				output.results.push(records);
			}
		} else {
			records.message = 'Please fill header and Line details';
			output.results.push(records);
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
//use for get Sales orders and po according to customer
function getSoAndPOAccordingCustDSTB(CustCode,output){
    var conn = $.db.getConnection();
    var record;
    var queryHeader =
			'select c.cust_name,SH.CUST_CODE,SH.SO_NUMBER,SH.CHILD_PO_NUMBER,SH.CHILD_PO_DATE from "MDB_DEV"."SALESORDER_HEADER" as SH inner join "CELEKONDMS"."CUSTOMER_MASTER" as c on SH.CUST_CODE = c.CUST_CODE where SH.PARENT_CODE = ? and SO_STATUS=?';
		var pstmtHeader = conn.prepareStatement(queryHeader);
		pstmtHeader.setString(1, CustCode);
		pstmtHeader.setInteger(2, 0);
		var rsHeader = pstmtHeader.executeQuery();
		conn.commit();
		while (rsHeader.next()) {
			var LineItems = [],
				record = {};
			record.CustName = rsHeader.getString(1);
			record.CustCode = rsHeader.getString(2);
			record.SONo = rsHeader.getString(3);
			record.ChildPO = rsHeader.getString(4);
			record.ChildPODate = rsHeader.getString(5);

			var queryLineItems =
				'select Material_code,order_qty,unit_price,required_date,total_amt,SO_NUMBER from "MDB_DEV"."SALESORDER_LINE" where SO_NUMBER = ?';

			var pstmtLineItems = conn.prepareStatement(queryLineItems);
			pstmtLineItems.setString(1, record.SONo);
			var rsLineItems = pstmtLineItems.executeQuery();
			conn.commit();
			while (rsLineItems.next()) {
				var records = {};
				records.MatCode = rsLineItems.getString(1);
				records.Qty = rsLineItems.getString(2);
				records.Price = rsLineItems.getString(3);
				records.RDate = rsLineItems.getString(4);
				records.Amt = rsLineItems.getString(5);
				records.SONo = rsLineItems.getString(6);
				records.Currency = 'INR';
				//records.CustName = record.CustName;
				//records.CustCode = record.CustCode;
				//records.ChildPO = record.ChildPO;
				//records.ChildPODate = record.ChildPODate;
				LineItems.push(records);
			}
			record.results = LineItems;
			output.results.push(record);
		}
		conn.close();
}
function getSoAndPOAccordingCustSTK(CustCode,output){
    var conn = $.db.getConnection();
    var record;
    var queryHeader =
			'select c.cust_name,PH.CUST_CODE,PH.PO_NUMBER,PH.PO_DATE from "MDB_DEV"."PO_HEADER" as PH inner join "CELEKONDMS"."CUSTOMER_MASTER" as c on PH.CUST_CODE = c.CUST_CODE where PH.PARENT_CODE = ? and PO_STATUS=?';
		var pstmtHeader = conn.prepareStatement(queryHeader);
		pstmtHeader.setString(1, CustCode);
		pstmtHeader.setInteger(2, 0);
		var rsHeader = pstmtHeader.executeQuery();
		conn.commit();
		while (rsHeader.next()) {
			var LineItems = [],
				 record = {};
			record.CustName = rsHeader.getString(1);
			record.CustCode = rsHeader.getString(2);
			record.ChildPO = rsHeader.getString(3);
			//record.ChildPO = rsHeader.getString(4);
			record.ChildPODate = rsHeader.getString(4);

			var queryLineItems =
				'select Material_code,order_qty,unit_price,required_date,total_amt,PO_NUMBER from "MDB_DEV"."PO_LINE" where PO_NUMBER = ?';

			var pstmtLineItems = conn.prepareStatement(queryLineItems);
			pstmtLineItems.setString(1, record.ChildPO);
			var rsLineItems = pstmtLineItems.executeQuery();
			conn.commit();
			while (rsLineItems.next()) {
				var records = {};
				records.MatCode = rsLineItems.getString(1);
				records.Qty = rsLineItems.getString(2);
				records.Price = rsLineItems.getString(3);
				records.RDate = rsLineItems.getString(4);
				records.Amt = rsLineItems.getString(5);
				records.SONo = rsLineItems.getString(6);
				records.Currency = 'INR';
				//records.CustName = record.CustName;
				//records.CustCode = record.CustCode;
				//records.ChildPO = record.ChildPO;
				//records.ChildPODate = record.ChildPODate;
				LineItems.push(records);
			}
			record.results = LineItems;
			output.results.push(record);
		}
		conn.close();
}
//function use for find out which type of customer
function geCustType(data){
    var conn = $.db.getConnection();
	var queryRange = ' select Cust_type from "CELEKONDMS"."CUSTOMER_MASTER" where cust_code = ?';
	var pstmtRange = conn.prepareStatement(queryRange);
	pstmtRange.setString(1,data.CustCode);
	var rrange = pstmtRange.executeQuery();
	conn.commit();
	while (rrange.next()) {
		data.CustType = rrange.getString(1);
	}
	conn.close();
}
//get Sales order data for PO creation
function getSODataPOCreation() {
	//var conn = $.db.getConnection();
	var data = {};
	var output = {
		results: []
	};
	var CustCode = $.request.parameters.get('CustCode');
	data.CustCode = CustCode;
	try {
	    geCustType(data);
	    if(data.CustType === 'DSTB'){
	        getSoAndPOAccordingCustDSTB(CustCode,output);
	    }else if(data.CustType === 'STK'){
	        getSoAndPOAccordingCustSTK(CustCode,output);
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

//use for find out line items with the help of SO Number

function getSOLinesItemsDetail() {
	var conn = $.db.getConnection();
	var output = {
		results: []
	};
	var SONumber = $.request.parameters.get('SONumber');
	try {
		var CallPro = 'call "MDB_DEV"."MobiProcedure::GetSOLineItems"(?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setString(1, SONumber);
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn.commit();
		while (rCallPro.next()) {
			var record = {};
			record.MatCode = rCallPro.getString(1);
			record.Qty = rCallPro.getString(2);
			record.Price = rCallPro.getString(3);
			record.Total = rCallPro.getString(4);
			record.Model = rCallPro.getString(5);
			output.results.push(record);
		}

		conn.close();
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
//use for find out Master details of related customer sales orders

function getSOMasterHeaderDetail() {
	var conn = $.db.getConnection();
	var output = {
		results: []
	};
	var CustCode = $.request.parameters.get('CustCode');
	try {
		var CallPro = 'call "MDB_DEV"."MobiProcedure::GetSOMstHeader"(?)';
		var pstmtCallPro = conn.prepareCall(CallPro);
		pstmtCallPro.setString(1, CustCode);
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn.commit();
		while (rCallPro.next()) {
			var record = {};
			record.ChildCustCode = rCallPro.getString(1);
			record.SONumber = rCallPro.getString(2);
			record.CreateDate = rCallPro.getString(3);
			record.ChildCustName = rCallPro.getString(4);
			record.Status = rCallPro.getString(5);
			record.Amt = rCallPro.getString(6);
			record.AmtUnit = 'INR';
			if (record.Status === '0') {
				record.StatusDesc = 'Pending for PO Genaration.';
			}else if (record.Status === '1') {
				record.StatusDesc = 'Pending for 1st level Approver.';
			}
			output.results.push(record);
		}

		conn.close();
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

//this is use for create unique number for sales order
function salesOrderRange(record) {
	var today = new Date();
	var yyyy = today.getFullYear();

	var conn = $.db.getConnection();
	var queryRange = 'select ID,name from "MDB_DEV"."SO_RANGE"';
	var pstmtRange = conn.prepareStatement(queryRange);
	var rrange = pstmtRange.executeQuery();
	conn.commit();
	while (rrange.next()) {
		record.ID = rrange.getString(1);
		record.name = rrange.getString(2);
	}
	record.OrderNO = record.name + (record.ID).toString() + yyyy;
	conn.close();
}
//salesOrderUpdate is use for insert current sales order number

function salesOrderUpdate(record) {
	var conn = $.db.getConnection();
	var id = parseInt(record.ID, 10);
	id = id + 1;
	var query2 = 'UPDATE "MDB_DEV"."SO_RANGE" SET ID = ?,value = ? WHERE name = ?';
	var pstmt2 = conn.prepareStatement(query2);
	pstmt2.setInteger(1, id);
	pstmt2.setString(2, record.OrderNO);
	pstmt2.setString(3, record.name);
	var r2 = pstmt2.executeUpdate();
	conn.commit();
	if (r2 > 0) {
		record.status = 1;
		record.message = 'Data Uploaded Sucessfully';
	}
}

//Insert Sales Orders
function uploadSalesOrders() {
	var output = {
		results: []
	};
	var records;
	var datasLine = $.request.parameters.get('OrderLine');
	var datasHeader = $.request.parameters.get('OrderHeader');
	//.replace(/\\r/g, "")
	var record = {};
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var dataHeader = JSON.parse(datasHeader.replace(/\\r/g, ""));

	var conn1 = $.db.getConnection();
	try {
		//this is use for create unique number for sales order
		salesOrderRange(record);
		if (dataHeader.length > 0 && dataLine.length > 0) {
			for (var i = 0; i < dataHeader.length; i++) {
				var dicHeader = dataHeader[i];
				var queryHeader =
					'insert into  "MDB_DEV"."SALESORDER_HEADER"(PARENT_CODE,CUST_CODE,SHIP_TO,SO_NUMBER,SO_STATUS,CHILD_PO_NUMBER,CHILD_PO_DATE,CREATED_BY)values(?,?,?,?,?,?,?,?)';
				var pstmtHeader = conn1.prepareStatement(queryHeader);
				pstmtHeader.setString(1, dicHeader.ParentCode);
				pstmtHeader.setString(2, dicHeader.ChildCode);
				pstmtHeader.setString(3, dicHeader.ParentCode);
				pstmtHeader.setString(4, record.OrderNO);
				pstmtHeader.setInteger(5, 0);
				pstmtHeader.setString(6, dicHeader.PoNo);
				pstmtHeader.setString(7, dicHeader.PoDate);
				pstmtHeader.setString(8, dicHeader.ParentCode);

				var rsHeader = pstmtHeader.executeUpdate();
				conn1.commit();
				records = {};
				if (rsHeader > 0) {
					records.status = 1;
					records.message = 'Data Uploaded Sucessfully';
				} else {
					records.status = 0;
					records.message = 'Some Issues!';
				}

				output.results.push(records);

			}
			for (var j = 0; j < dataLine.length; j++) {
				//var k = 1;
				var dicLine = dataLine[j];
				var queryLine =
					'insert into  "MDB_DEV"."SALESORDER_LINE"(MATERIAL_CODE,ORDER_QTY,UNIT_PRICE,REQUIRED_DATE,DISCOUNT,SGST,IGST,CGST,TOTAL_AMT,CREATED_BY,SO_NUMBER,SO_LINE_NO)values(?,?,?,?,?,?,?,?,?,?,?,?)';
				var pstmtLine = conn1.prepareStatement(queryLine);
				pstmtLine.setString(1, dicLine.MaterialCode);
				pstmtLine.setString(2, dicLine.qty);
				pstmtLine.setString(3, dicLine.Price);
				pstmtLine.setString(4, dicLine.required_date);
				pstmtLine.setInteger(5, 0);
				pstmtLine.setInteger(6, 0);
				pstmtLine.setInteger(7, 0);
				pstmtLine.setInteger(8, 0);
				pstmtLine.setInteger(9, dicLine.total_amount);
				pstmtLine.setString(10, dicHeader.ParentCode);
				///	pstmtLine.setInteger(11, k++);
				pstmtLine.setString(11, record.OrderNO);
				pstmtLine.setInteger(12, 10);

				var rsLine = pstmtLine.executeUpdate();
				conn1.commit();
				records = {};
				if (rsLine > 0) {
					records.status = 1;
					records.message = 'Data Uploaded Sucessfully';
					// this is use for update current salesorder no in table
					salesOrderUpdate(record);
				} else {
					records.status = 0;
					records.message = 'Some Issues!';
				}

				output.results.push(records);
			}
		} else {
			records.message = 'Please fill header and Line details';
			output.results.push(records);
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

//GetMaterials is use for getting all materials without any search field
//GetMaterial procedure call all material without any search field 
function getMaterialAll() {
	var output = {
		results: []
	};
	//var CustCode = $.request.parameters.get('CustCode');
	var conn1 = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."MobiProcedure::GetMaterial"';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		//pstmtCallPro.setString(1, CustCode);
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.MaterialCode = rCallPro.getString(1);
			record.MaterialDesc = rCallPro.getString(2);
			//	record.Price = rCallPro.getString(3);
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
//Get Particular matarial price

function get1MaterialPrice() {
	var output = {
		results: []
	};
	var MatCode = $.request.parameters.get('MatCode');
	var CustCode = $.request.parameters.get('CustCode');
	var conn1 = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."MobiProcedure::Get1MatPrice"(?,?)';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setString(1, CustCode);
		pstmtCallPro.setString(2, MatCode);
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.Price = rCallPro.getString(1);
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

//GetChild find parent customers child with search field.
//GetChildCust procedure use for fatch Child customer data with the help of parent code
function getChild() {
	var output = {
		results: []
	};
	var ParentCustomer = $.request.parameters.get('ParentCustomer');
	var conn = $.db.getConnection();
	try {
		var CallChildCust = 'call "MDB_DEV"."MobiProcedure::GetChildCust"(?)';
		var pstmtChildCust = conn.prepareCall(CallChildCust);
		pstmtChildCust.setString(1, ParentCustomer);
		pstmtChildCust.execute();
		var rChildCust = pstmtChildCust.getResultSet();
		conn.commit();
		while (rChildCust.next()) {
			var record = {};
			record.CustCode = rChildCust.getString(1);
			record.CustName = rChildCust.getString(2);
			output.results.push(record);
		}

		conn.close();
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

	case "getMaterialAll":
		getMaterialAll();
		break;
	case "getChild":
		getChild();
		break;
	case "get1MaterialPrice":
		get1MaterialPrice();
		break;
	case "uploadSalesOrders":
		uploadSalesOrders();
		break;
	case "getSOMasterHeaderDetail":
		getSOMasterHeaderDetail();
		break;
	case "getSOLinesItemsDetail":
		getSOLinesItemsDetail();
		break;
	case "getSODataPOCreation":
		getSODataPOCreation();
		break;
	case "generatePO":
	    generatePO();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}