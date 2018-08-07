function getCustomerName(PRIMARYSALE_CUSTOMER){
    var connection = $.db.getConnection();
    var query = 'select CUST_NAME FROM "MDB_DEV"."MST_CUSTOMER" WHERE DMS_CUST_CODE=? ';
				var pstmt1 = connection.prepareStatement(query);
				pstmt1.setString(1, PRIMARYSALE_CUSTOMER);
				var rs1 = pstmt1.executeQuery();
				connection.commit();
				if (rs1.next()) {
				    return rs1.getString(1);
				}
				connection.close();
}
function getImeisData() {
	var output = {
		result: [],
		status: ""
	};

	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('Imeis');
	var dicLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	var record;
	var n = 0;
	try {
		for (var i = 0; i < dicLine.length; i++) {
			var Imei = dicLine[i];
			/*select e.MATERIAL_CODE,e.SERIAL_NUMBER ,p.MODEL_CODE , p.MODEL_DESCRIPTION,p.MATERIAL_DESC,e.PRIMARYSALE_CUSTOMER,
e.SECONDARYSALE_CUSTOMER,e.SECONDARY_PRICE
from "MDB_DEV"."MST_EQUIPMENT" as e 
inner join "MDB_DEV"."MST_MATERIAL_MASTER" as p on p.MATERIAL_CODE=e.MATERIAL_CODE 
inner join "MDB_DEV"."SALES_INVOICE_EQUIP" as eq on eq.IMEI1 = e.IMEI1
where e.IMEI1 = '260720182010095' and e.PRIMARYSALE_CUSTOMER = 'APDTUSHA01'
and e.SECONDARYSALE_CUSTOMER = 'RSHARM0001'*/
			var queryGetEqDetails = 'select e.MATERIAL_CODE,e.SERIAL_NUMBER ,p.MODEL_CODE , p.MODEL_DESCRIPTION,p.MATERIAL_DESC,e.PRIMARYSALE_CUSTOMER, '
+ ' e.SECONDARYSALE_CUSTOMER,e.SECONDARY_PRICE from "MDB_DEV"."MST_EQUIPMENT" as e  '
+ ' inner join "MDB_DEV"."MST_MATERIAL_MASTER" as p on p.MATERIAL_CODE=e.MATERIAL_CODE ' 
+ ' inner join "MDB_DEV"."SALES_INVOICE_EQUIP" as eq on eq.IMEI1 = e.IMEI1 '
+ ' where e.IMEI1 = ? and e.PRIMARYSALE_CUSTOMER = ? '
+ ' and e.SECONDARYSALE_CUSTOMER = ?';
			var pstmtGetEqDetails = connection.prepareStatement(queryGetEqDetails);
			pstmtGetEqDetails.setString(1, Imei.IMEI1);
			pstmtGetEqDetails.setString(2, Imei.DSTBCustCode);
			pstmtGetEqDetails.setString(3, Imei.RETLCustCode);
			var rsGetEqDetails = pstmtGetEqDetails.executeQuery();
			connection.commit();
			if (rsGetEqDetails.next() > 0) {
				record = {};
				record.MATERIAL = rsGetEqDetails.getString(1);
				record.SERIAL_NUMBER = rsGetEqDetails.getString(2);
				record.MODEL_CODE = rsGetEqDetails.getString(3);
				record.MODEL_DESC = rsGetEqDetails.getString(4);
				record.MATERIAL_DESC = rsGetEqDetails.getString(5);
				record.PRIMARYSALE_CUSTOMER = rsGetEqDetails.getString(6);
				record.PRIMARYSALE_CUSTOMER_NAME = getCustomerName(record.PRIMARYSALE_CUSTOMER);
				record.SECONDARYSALE_CUSTOMER = rsGetEqDetails.getString(7);
				record.SECONDARYSALE_CUSTOMER_NAME = getCustomerName(record.SECONDARYSALE_CUSTOMER);
				record.PRICE = rsGetEqDetails.getString(8);
				record.DATE = Imei.DATE; //dateFormat(Imei.DATE);
				record.IMEI1 = Imei.IMEI1;
				record.DSTBCustCode = Imei.DSTBCustCode;
				record.RETLCustCode = Imei.RETLCustCode;
				record.IMEI = Imei.IMEI1;
				record.COUNT = 1;
				record.Return = Imei.Return;
				n = n + 1;
				record.SNO = n + 1;
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
function countReceivedMaterial(dicLine,MaterialCount) {
	var flag = false;
	var data;
	if (MaterialCount.length > 0) {
		for (var i = 0; i < MaterialCount.length; i++) {
			if (MaterialCount[i].MATERIAL === dicLine.MATERIAL) {
				MaterialCount[i].RETLCustCode = dicLine.RETLCustCode;
				MaterialCount[i].QTY = parseInt(MaterialCount[i].QTY, 10) + parseInt(dicLine.COUNT, 10);
				flag = true;
			}
		}
	}
	if (flag === false) {
		data = {};
		data.RETLCustCode = dicLine.RETLCustCode;
		data.MATERIAL = dicLine.MATERIAL;
		data.QTY = dicLine.COUNT;
		MaterialCount.push(data);
	}
}
function updateEquipmentTrn(records,dicLine){
    var connection = $.db.getConnection();
    var queryinsertequipment = 'insert into "MDB_DEV"."TRN_EQUIPMENT_MASTER" (SERIAL_NO ,MATERIAL_CODE ,IMEI1 ,ACTIVE ,SAPUSER_ID, STATUS , TRANSACTION_DATE ,INVOICE_NO,IMEI2 ,DMS_CUST_CODE ,TRANSACTION_TYPE) values(?,?,?,?,?,?,?,?,?,?,?)';
							var pstmtinsertequipment = connection.prepareStatement(queryinsertequipment);
							pstmtinsertequipment.setString(1, records.SERIAL_NUMBER);
							pstmtinsertequipment.setString(2, records.MATERIAL);
							pstmtinsertequipment.setString(3, records.IMEI1);
							pstmtinsertequipment.setString(4, dicLine.Return);
							pstmtinsertequipment.setString(5, dicLine.RETLCustCode);
							pstmtinsertequipment.setString(6, '2');
							pstmtinsertequipment.setString(7, currentDate());
							pstmtinsertequipment.setString(8, records.INVOICE_NO);
							pstmtinsertequipment.setString(9, records.IMEI2);
							pstmtinsertequipment.setString(10, dicLine.RETLCustCode);
							pstmtinsertequipment.setString(11, dicLine.Return);
							var rsinsertequipment = pstmtinsertequipment.executeUpdate();
							connection.commit();
							if (rsinsertequipment > 0) {
							}
}

/*function updateReceiveStock(MaterialCount) {
	var connection = $.db.getConnection();
	for (var i = 0; i < MaterialCount.length; i++) {
	    var mater = MaterialCount[i];
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
	connection.close();
}*/

function addReturnStock(records,dicLine){
	var connection = $.db.getConnection();
    var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::SalesReturn"(?,?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, dicLine.DSTBCustCode);
		pstmtCallAttribute.setString(2, records.MATERIAL);
		pstmtCallAttribute.setInteger(3, parseInt(dicLine.COUNT,10));
		pstmtCallAttribute.setString(4, 'DSTB');
		pstmtCallAttribute.setString(5, dicLine.Return.toUpperCase());
		pstmtCallAttribute.setString(6, dicLine.Return.toUpperCase());
		pstmtCallAttribute.setString(7, currentDate());
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, 'DMSTEAM');
		pstmtCallAttribute.setInteger(10, parseInt(dicLine.COUNT,10));
		var CMD = dicLine.Return.toUpperCase();
		pstmtCallAttribute.setString(11, CMD);
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		connection.commit();
		if(rCallAttribute.next()) {
			records.status = 0;
			records.message = 'Data is Successfully Updated';
		}
		connection.close();
}
function addReturnTrnStock(records,dicLine){
	var connection = $.db.getConnection();
    var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::SalesReturn"(?,?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, dicLine.RETLCustCode);
		pstmtCallAttribute.setString(2, records.MATERIAL);
		pstmtCallAttribute.setInteger(3, parseInt(dicLine.COUNT,10));
		pstmtCallAttribute.setString(4, 'RETL');
		pstmtCallAttribute.setString(5, dicLine.Return.toUpperCase());
		pstmtCallAttribute.setString(6, dicLine.Return.toUpperCase());
		pstmtCallAttribute.setString(7, currentDate());
		pstmtCallAttribute.setString(8, '01:16:00');
		pstmtCallAttribute.setString(9, dicLine.DSTBCustCode);
		pstmtCallAttribute.setInteger(10, parseInt(dicLine.COUNT,10));
			var CMD = "TRN_STOCK";
		pstmtCallAttribute.setString(11, CMD);
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		connection.commit();
		if(rCallAttribute.next()) {
			records.status = 0;
			records.message = 'Data is Successfully Updated';
		}
		connection.close();
    
}
function DateFunction() {
	var dp = new Date();
	var monthp = '' + (dp.getMonth() + 1);
	var dayp = '' + dp.getDate();
	var yearp = dp.getFullYear();

	if (monthp.length < 2) monthp = '0' + monthp;
	if (dayp.length < 2) dayp = '0' + dayp;

	var yyyymmddp = yearp + '.' + monthp + '.' + dayp;
	return yyyymmddp;
}

function salesReturn(){
    var output = {
		results: []
	};
	var records = {};
	var Detail = "";
	var connection = $.db.getConnection();
    	var itemsArray = $.request.parameters.get('itemsArray');
	var dataLine = JSON.parse(itemsArray.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				//dicLine.MaterialCount = MaterialCount;
					var query = 'update "MDB_DEV"."MST_EQUIPMENT" set SECONDARYSALE_CUSTOMER = ?,SECONDARYSALE_DATE = ?,SECONDARYSALE_RECEIVING_DATE = ?,SECONDARY_PRICE = ?,STATUS = ? where IMEI1=?';
				var pstmt = connection.prepareStatement(query);
				pstmt.setString(1, Detail);
				pstmt.setString(2, DateFunction());
				pstmt.setString(3, DateFunction());
				pstmt.setInteger(4, 0);
				pstmt.setString(5, '2');
				pstmt.setString(6, dicLine.IMEI1);
				var rsSelectequipment = pstmt.executeUpdate();
				connection.commit();
				if (rsSelectequipment > 0) {
				    var querySelectequipment = 'select ME.SERIAL_NUMBER,ME.MATERIAL_CODE,ME.IMEI1,ME.IMEI2,SIE.INVOICE_NO FROM  "MDB_DEV"."MST_EQUIPMENT" as ME inner join "MDB_DEV"."SALES_INVOICE_EQUIP" as SIE on ME.IMEI1 = SIE.IMEI1 WHERE ME.IMEI1=? ';
        				var pstmtSelectequipment = connection.prepareStatement(querySelectequipment);
        				pstmtSelectequipment.setString(1, dicLine.IMEI1);
        				var rs = pstmtSelectequipment.executeQuery();
        				connection.commit();
        				if (rs.next()) {
        				    records.SERIAL_NUMBER = rs.getString(1);
        				    records.MATERIAL = rs.getString(2);
        				    records.IMEI1 = rs.getString(3);
        				    records.IMEI2 = rs.getString(4);
        				    records.INVOICE_NO = rs.getString(5);
        				    updateEquipmentTrn(records,dicLine);
        				    addReturnStock(records,dicLine);
        				    addReturnTrnStock(records,dicLine);
        				}
        				records.message = "Successfully Submit.!!";
				}
			}
		
		}
		output.results.push(records);
	}catch (e) {
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
	case "getImeisData":
		getImeisData();
		break;
	case "salesReturn":
	    salesReturn();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}