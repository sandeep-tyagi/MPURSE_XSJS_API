/**
 * To get the current date in db format.
 * @Param {String} output.
 * @return {String} yyyymmddp  .
 */
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

/**
 * To get the current date in db format.
 * @Param {String} output.
 * @return {String} yyyymmddp  .
 */
function checkStatusDescription(record) {
	if (record.SOFT_DEL === '0') {
		record.SOFT_DEL_DESC = 'Active';
	} else if (record.SOFT_DEL === '1') {
		record.SOFT_DEL_DESC = 'Inactive';
	}
	return record;
}
/**
 * To get the current date in db format.
 * @Param {String} output.
 * @return {String} yyyymmddp  .
 */
function dateFormat(record) {
	var date = record.CREATE_DATE;
	if (date) {
		record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
		return record.CREATE_DATE;
	}
}

/**
 * To fetch all attribute. on the behalf of attributeId.
 * @Param [] output .
 * @return {String} array of attribute .
 * @author: Shriyansi.
 */
function getAttributes() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ATTRIBUTE"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setInteger(1, 0);
		pstmtCallAttribute.setString(2, ' ');
		pstmtCallAttribute.setString(3, ' ');
		pstmtCallAttribute.setString(4, '0');
		pstmtCallAttribute.setString(5, ' ');
		pstmtCallAttribute.setString(6, dateFunction());
		pstmtCallAttribute.setString(7, ' ');
		pstmtCallAttribute.setString(8, dateFunction());
		pstmtCallAttribute.setString(9, 'SELECTATTRIBUTES');
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		connection.commit();
		while (rCallAttribute.next()) {
			var record = {};
			record.ATTRIBUTE_ID = rCallAttribute.getString(1);
			record.ATTRIBUTE_NAME = rCallAttribute.getString(2);
			record.DISPLAY = rCallAttribute.getString(3);
			record.SOFT_DEL = rCallAttribute.getString(4);
			record.CREATE_BY = rCallAttribute.getString(5);
			record.CREATE_DATE = rCallAttribute.getString(6);
			record.MODIFIED_BY = rCallAttribute.getString(7);
			record.MODIFIED_DATE = rCallAttribute.getString(8);
			checkStatusDescription(record);
			dateFormat(record);
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


/**
 * To fetch all Area.
 * @Param [] output .
 * @return {String} array of attribute .
 * @author: Rohit.
 */
function getAreas() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'SELECT A.AREA_CODE,A.AREA_DESC,A.DISTRICT_CODE,D.DISTRICT_NAME from "MDB_DEV"."MST_AREA" as "A" join "MDB_DEV"."DISTRICT_DATA" as "D" on A.DISTRICT_CODE=D.DISTRICT_CODE';
		var pstmtCallAttribute = connection.prepareStatement(CallProAttribute);
	    var rsAreaDetails = pstmtCallAttribute.executeQuery();
		while (rsAreaDetails.next()) {
			var record = {};
			record.AREACODE = rsAreaDetails.getString(1);
		    record.AREADISCRIPTTION = rsAreaDetails.getString(2);
		    record.DISTRICTCODE = rsAreaDetails.getString(3);
		    record.DISTRICTNAME = rsAreaDetails.getString(4);
			output.results.push(record);
		}
		connection.commit();
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



function addStocks() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::Trn_Stock"(?,?,?,?,?,?,?,?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, '90000007');
		pstmtCallAttribute.setString(2, '110100C410002');
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
		while (rCallAttribute.next()) 
		{
			
			
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





function getDSTBCustCode() {
	var output = {
		results: []
	};
	var employeeCode = $.request.parameters.get('employeeCode');
	var positionValue = $.request.parameters.get('positionValue');
	var connection = $.db.getConnection();
	try {
		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::GetDstbCustCode"(?,?);';
		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
		pstmtCallAttribute.setString(1, employeeCode);
		pstmtCallAttribute.setString(2, positionValue);
		pstmtCallAttribute.execute();
		var rCallAttribute = pstmtCallAttribute.getResultSet();
		
		while (rCallAttribute.next()) 
		{
				//var record = {};
			//record.DSTBCode = rCallAttribute.getString(1);
			output.results.push(rCallAttribute.getString(1));
			
		}
		connection.commit();
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
	case "getAttributes":
		getAttributes();
		break;
    case "getAreas":
		getAreas();
		break;
	case "addStocks":
		addStocks();
		break;
	case "getDSTBCustCode":
		getDSTBCustCode();
		break;
		
		

	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');
}