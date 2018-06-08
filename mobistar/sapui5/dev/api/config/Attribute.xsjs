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
  * To fetch all attribute. on the behalf of attributeId.
  * @Param [] output .
  * @return {String} array of attribute .
  * @author: Shriyansi.
  */
 function getAttribute() {
 	var output = {
 		results: []
 	};
 	var connection = $.db.getConnection();
 	var attributeId = $.request.parameters.get('attributeId');
 	try {
 		var CallProAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ATTRIBUTE"(?,?,?,?,?,?,?,?,?);';
 		var pstmtCallAttribute = connection.prepareCall(CallProAttribute);
 		pstmtCallAttribute.setInteger(1, parseInt(attributeId, 10));
 		pstmtCallAttribute.setString(2, ' ');
 		pstmtCallAttribute.setString(3, ' ');
 		pstmtCallAttribute.setString(4, '0');
 		pstmtCallAttribute.setString(5, ' ');
 		pstmtCallAttribute.setString(6, dateFunction());
 		pstmtCallAttribute.setString(7, ' ');
 		pstmtCallAttribute.setString(8, dateFunction());
 		pstmtCallAttribute.setString(9, 'SELECT');
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
  * To fetch all attribute.
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

 function fetchAttribute(inputData, connection) {
 	var querySelectAttribute = 'select * from "MDB_DEV"."MST_ATTRIBUTE" where SOFT_DEL is not null ';
 	var whereClause = "";
 	if (inputData.attributeName !== '') {
 		whereClause += " AND ATTRIBUTE_NAME='" + inputData.attributeName + "'";
 	}
 	querySelectAttribute += whereClause;
 	var pstmtSelectAttribute = connection.prepareStatement(querySelectAttribute);
 	var rsSelectAttribute = pstmtSelectAttribute.executeQuery();
 	return rsSelectAttribute;
 }

 /**
  * Insert new  attribute.
  * @Param {string} attributeName .
  * @Param [] output .
  * @return {String} message .
  * @author : Shriyansi.
  */
 function addAttribute(inputData, connection, record) {

 	var addCallAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ATTRIBUTE"(?,?,?,?,?,?,?,?,?);';
 	var pstmtaddCalladdAttribute = connection.prepareCall(addCallAttribute);
 	pstmtaddCalladdAttribute.setInteger(1, 0);
 	pstmtaddCalladdAttribute.setString(2, inputData.attributeName);
 	pstmtaddCalladdAttribute.setString(3, inputData.displayName);
 	pstmtaddCalladdAttribute.setString(4, '');
 	pstmtaddCalladdAttribute.setString(5, inputData.createby);
 	pstmtaddCalladdAttribute.setString(6, dateFunction());
 	pstmtaddCalladdAttribute.setString(7, '');
 	pstmtaddCalladdAttribute.setString(8, dateFunction());
 	pstmtaddCalladdAttribute.setString(9, 'INSERT');
 	pstmtaddCalladdAttribute.execute();
 	var rCalladdAttribute = pstmtaddCalladdAttribute.getParameterMetaData();
 	connection.commit();
 	if (rCalladdAttribute.getParameterCount() > 0) {
 		record.status = 1;
 		record.Message = "Record Successfully inserted";
 	} else {
 		record.status = 0;
 		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
 	}

 }

 /**
  * To update attribute.
  * @Param {string} attributeEditId ,
  * @Param {string} attributeEditName,
  * @Param {string} attributeEditDisplay.
  * @Param [] output .
  * @return {String} message .
  * @author: Shriyansi.
  */
 function updateAttrubute() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var attrEditId = $.request.parameters.get('attrEditId');
 	var attrEditName = $.request.parameters.get('attrEditName');
 	var attrEditDisplay = $.request.parameters.get('attrEditDisplay');
 	var attrEditStatus = $.request.parameters.get('attrEditStatus');
 	var modifyby = $.request.parameters.get('modifyby');
 	try {
 		var UpdCallAttrubute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ATTRIBUTE"(?,?,?,?,?,?,?,?,?);';
 		var pstmtUpdCallAttrubute = conn.prepareCall(UpdCallAttrubute);
 		pstmtUpdCallAttrubute.setInteger(1, parseInt(attrEditId, 10));
 		pstmtUpdCallAttrubute.setString(2, attrEditName);
 		pstmtUpdCallAttrubute.setString(3, attrEditDisplay);
 		pstmtUpdCallAttrubute.setString(4, attrEditStatus);
 		pstmtUpdCallAttrubute.setString(5, 'ADMIN');
 		pstmtUpdCallAttrubute.setString(6, dateFunction());
 		pstmtUpdCallAttrubute.setString(7, modifyby);
 		pstmtUpdCallAttrubute.setString(8, dateFunction());
 		pstmtUpdCallAttrubute.setString(9, 'UPDATE');
 		pstmtUpdCallAttrubute.execute();
 		var rsUpdCallAttrubute = pstmtUpdCallAttrubute.getParameterMetaData();
 		conn.commit();
 		if (rsUpdCallAttrubute.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Successfully updated the Attribute Data';
 		} else {
 			record.status = 1;
 			record.message = 'failed to update the Attribute Data. Kindly contact to Admin!!!';
 		}
 		Output.results.push(record);
 		conn.close();
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

 /**
  * To delete existing attribute.
  * @Param {string} attributeDelId .
  * @Param [] output .
  * @return {String} message .
  * @author: shriyansi.
  */
 function deleteAttribute() {
 	var Output = {
 		results: []
 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var attrDelId = $.request.parameters.get('attrDelId');
 	try {
 		var DelCallAttribute = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_ATTRIBUTE"(?,?,?,?,?,?,?,?,?);';
 		var pstmtDelCallAttribute = conn.prepareCall(DelCallAttribute);
 		pstmtDelCallAttribute.setInteger(1, parseInt(attrDelId, 10));
 		pstmtDelCallAttribute.setString(2, ' ');
 		pstmtDelCallAttribute.setString(3, ' ');
 		pstmtDelCallAttribute.setString(4, '1');
 		pstmtDelCallAttribute.setString(5, 'ADMIN');
 		pstmtDelCallAttribute.setString(6, dateFunction());
 		pstmtDelCallAttribute.setString(7, ' ');
 		pstmtDelCallAttribute.setString(8, dateFunction());
 		pstmtDelCallAttribute.setString(9, 'DELETE');
 		pstmtDelCallAttribute.execute();
 		var rsDelCallAttribute = pstmtDelCallAttribute.getParameterMetaData();
 		conn.commit();
 		if (rsDelCallAttribute.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Successfully deleted the Attribute Data';
 		} else {
 			record.status = 1;
 			record.message = 'failed to delete the Attribute Data';
 		}
 		Output.results.push(record);
 		conn.close();
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

 /**
  * To get distinct attribute.name
  * @return {data} as output.
  * @author: shriyansi.
  */
 function getAttributeName() {
 	var conn = $.db.getConnection();
 	var data = {
 		navigation: []
 	};
 	var record;
 	try {
 		var querygetAttributeName = 'select distinct Attribute_name from "MDB_DEV"."MST_ATTRIBUTE"';
 		var pstmtgetAttributeName = conn.prepareStatement(querygetAttributeName);
 		var rsgetAttributeName = pstmtgetAttributeName.executeQuery();
 		conn.commit();
 		while (rsgetAttributeName.next()) {
 			record = {};
 			data.navigation.push(record);
 		}
 		conn.close();
 	} catch (e) {

 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 		$.response.setBody(e.message);
 		return;
 	}

 	var body = JSON.stringify(data);
 	$.response.contentType = 'application/json';
 	$.response.setBody(body);
 	$.response.status = $.net.http.OK;
 }

 function validateAttribute() {

 	var Output = {
 		results: []
 	};
 	var connection = $.db.getConnection();
 	var inputData = {};
 	var attributeName = $.request.parameters.get('attributeName');
 	var displayName = $.request.parameters.get('displayName');
 	var createby = $.request.parameters.get('createby');
 	inputData.attributeName = attributeName;
 	inputData.displayName = displayName;
    inputData.createby = createby;
 	try {
 		var record = {};
 		var rsAttributeValidation = fetchAttribute(inputData, connection);
 		if (rsAttributeValidation.next()) {
 			var softDel = rsAttributeValidation.getString(4);
 			if (softDel === "0") {
 				record.status = 1;
 				record.Message = "Attribute already present in our System!!! Kindly add another Attribute";

 			} else {
 				record.status = 1;
 				record.Message = "Attribute is inactive in our System!!! Kindly use edit functionality to activate it.";
 			}
 		} else {
 			addAttribute(inputData, connection, record);
 		}
 		Output.results.push(record);
 		connection.close();

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
 	case "getAttribute":
 		getAttribute();
 		break;
 	case "getAttributes":
 		getAttributes();
 		break;
 	case "addAttribute":
 		addAttribute();
 		break;
 	case "updateAttrubute":
 		updateAttrubute();
 		break;
 	case "deleteAttribute":
 		deleteAttribute();
 		break;
 	case "getAttributeName":
 		getAttributeName();
 		break;

 	case "validateAttribute":
 		validateAttribute();
 		break;
 	default:
 		$.response.status = $.net.http.BAD_REQUEST;
 		$.response.setBody('Invalid Command');
 }