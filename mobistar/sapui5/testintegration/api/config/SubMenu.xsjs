 function checkStatusDescription(record) {
 	if (record.SOFT_DEL === '0') {
 		record.SOFT_DEL_DESC = 'Active';
 	} else if (record.SOFT_DEL === '1') {
 		record.SOFT_DEL_DESC = 'Inactive';
 	}
 	return record;
 }
  function dateFormat(record) {
    var date = record.CREATE_DATE;
   if (date) {
    record.CREATE_DATE = date.substring(8, 10) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4);
    return record.CREATE_DATE;
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

 function getSubMenu() {
 	var output = {
 		results: []
 	};
 	var conn1 = $.db.getConnection();
 	var subMenuId = $.request.parameters.get('subMenuId');
 	/*var subMenuName = $.request.parameters.get('subMenuName');
	var menuId = $.request.parameters.get('menuId');
	var orderNo = $.request.parameters.get('orderNo');
	var key = $.request.parameters.get('key');*/
 	//	var icon = $.request.parameters.get('icon');
 	//	if (orderNo === undefined || orderNo === null || orderNo === '') {
 	//	orderNo = 0;
 	//	}

 	if (subMenuId === undefined || subMenuId === null || subMenuId === '') {
 		subMenuId = 0;
 	}
 	try {
 		var CallgetSubMenu = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.dev.procedure::MST_SUB_MENU"(?,?,?,?,?,?,?,?,?,?,?,?);';
 		var pstmtCallgetSubMenu = conn1.prepareCall(CallgetSubMenu);
 		pstmtCallgetSubMenu.setInteger(1, parseInt(subMenuId, 10));
 		pstmtCallgetSubMenu.setString(2, 'null');
 		pstmtCallgetSubMenu.setInteger(3, 0);
 		pstmtCallgetSubMenu.setInteger(4, 0);
 		pstmtCallgetSubMenu.setString(5, 'null');
 		pstmtCallgetSubMenu.setString(6, 'null');
 		pstmtCallgetSubMenu.setInteger(7, 0);
 		pstmtCallgetSubMenu.setString(8, 'ADMIN');
 		pstmtCallgetSubMenu.setString(9, dateFunction());
 		pstmtCallgetSubMenu.setString(10, ' ');
 		pstmtCallgetSubMenu.setString(11, dateFunction());
 		pstmtCallgetSubMenu.setString(12, 'SELECT');
 		pstmtCallgetSubMenu.execute();
 		var rCallgetSubMenu = pstmtCallgetSubMenu.getResultSet();
 		conn1.commit();
 		while (rCallgetSubMenu.next()) {
 			var record = {};
 			record.MENU_NAME = rCallgetSubMenu.getString(1);
 			record.SUBMENU_ID = rCallgetSubMenu.getString(2);
 			record.SUB_MENU_NAME = rCallgetSubMenu.getString(3);
 			record.MENU_ID = rCallgetSubMenu.getString(4);
 			record.ORDER_NO = rCallgetSubMenu.getString(5);
 			record.URL = rCallgetSubMenu.getString(6);
 			record.SOFT_DEL = rCallgetSubMenu.getString(7);
 			record.CREATE_BY = rCallgetSubMenu.getString(8);
 			record.CREATE_DATE = rCallgetSubMenu.getString(9);
 			record.MODIFIED_BY = rCallgetSubMenu.getString(10);
 			record.MODIFIED_DATE = rCallgetSubMenu.getString(11);
 			// 			record.LOCATION_NAME = rCallPro.getString(1);
 			// 			record.ROLE_NAME = rCallPro.getString(2);

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

 function getSubMenus() {
 	var output = {
 		results: []
 	};
 	var conn1 = $.db.getConnection();

 	try {
 		var qryGetSubMenus = 'select sm.SUBMENU_ID,sm.SUB_MENU_NAME,sm.MENU_ID,sm.ORDER_NO,sm.KEY,' +
 			'sm.ICON,sm.SOFT_DEL,sm.CREATE_BY,sm.CREATE_DATE,sm.MODIFIED_BY,sm.MODIFIED_DATE ,' +
 			' m.MENU_NAME from "MDB_TEST_INTEGRATION"."MST_SUB_MENU" as  sm inner join "MDB_TEST_INTEGRATION"."MST_MENU" as m ' + ' on m.menu_id=sm.menu_id ';
 		var pstmtGetSubMenus = conn1.prepareStatement(qryGetSubMenus);
 		//	pstmtGetSubMenus.execute();
 		var rsInstSubMenu = pstmtGetSubMenus.executeQuery();
 		conn1.commit();
 		while (rsInstSubMenu.next()) {
 			var record = {};
 			//record.MENU_NAME = rsInstSubMenu.getString(1);
 			record.SUBMENU_ID = rsInstSubMenu.getString(1);
 			record.SUB_MENU_NAME = rsInstSubMenu.getString(2);
 			record.MENU_ID = rsInstSubMenu.getString(3);
 			record.ORDER_NO = rsInstSubMenu.getString(4);
 			record.KEY = rsInstSubMenu.getString(5);
 			record.ICON = rsInstSubMenu.getString(6);
 			record.SOFT_DEL = rsInstSubMenu.getString(7);
 			record.CREATE_BY = rsInstSubMenu.getString(8);
 			record.CREATE_DATE = rsInstSubMenu.getString(9);
 			record.MODIFIED_BY = rsInstSubMenu.getString(10);
 			record.MODIFIED_DATE = rsInstSubMenu.getString(11);
 			record.MENUNAME = rsInstSubMenu.getString(12);
 			checkStatusDescription(record);
 			dateFormat(record);
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

 // function addSubMenu() {

 // 	var record;
 // 	var Output = {
 // 		results: []
 // 	};

 // 	var conn = $.db.getConnection();
 // 	var subMenuName = $.request.parameters.get('subMenuName');
 // 	var menuId = $.request.parameters.get('menuId');
 // 	var orderNo = $.request.parameters.get('orderNo');
 // 	var url = $.request.parameters.get('url');

 // 	if (orderNo === undefined || orderNo === null || orderNo === '') {
 // 		orderNo = 0;
 // 	}

 // 	if (menuId === undefined || menuId === null || menuId === '') {
 // 		menuId = 0;
 // 	}

 // 	try {
 // 		record = {};
 // 		var CallPro = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.dev.procedure::MST_SUB_MENU"(?,?,?,?,?,?,?,?,?,?,?);';
 // 		var pstmtCallPro = conn.prepareCall(CallPro);
 // 		pstmtCallPro.setInteger(1, 0);
 // 		pstmtCallPro.setString(2, subMenuName);
 // 		pstmtCallPro.setInteger(3, parseInt(menuId, 10));
 // 		pstmtCallPro.setInteger(4, parseInt(orderNo, 10));
 // 		pstmtCallPro.setString(5, url);
 // 		pstmtCallPro.setString(6, '0');
 // 		pstmtCallPro.setString(7, 'null');
 // 		pstmtCallPro.setString(8, dateFunction());
 // 		pstmtCallPro.setString(9, 'null');
 // 		pstmtCallPro.setString(10, dateFunction());
 // 		pstmtCallPro.setString(11, 'INSERT');
 // 		pstmtCallPro.execute();
 // 		var rsm = pstmtCallPro.getParameterMetaData();
 // 		conn.commit();
 // 		if (rsm.getParameterCount() > 0) {
 // 			record.status = 1;
 // 			record.Message = 'Data Uploaded Sucessfully';
 // 		} else {
 // 			record.status = 0;
 // 			record.Message = 'Some Issues!';
 // 		}

 // 		Output.results.push(record);
 // 		conn.close();
 // 	} catch (e) {

 // 		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
 // 		$.response.setBody(e.message);
 // 		return;
 // 	}
 // 	var body = JSON.stringify(Output);
 // 	$.response.contentType = 'application/json';
 // 	$.response.setBody(body);
 // 	$.response.status = $.net.http.OK;
 // }

 function fetchSubMenu(inputData, connection) {
 	var querySelectSubMenu = 'select * from "MDB_TEST_INTEGRATION"."MST_SUB_MENU" where SOFT_DEL is not null ';
 	var whereClause = "";
 	if (inputData.subMenuName !== '') {
 		whereClause += " AND SUB_MENU_NAME='" + inputData.subMenuName + "'";
 	}
 	if (inputData.menuId !== '') {
 		whereClause += " AND MENU_ID='" + inputData.menuId + "'";
 	}
 	if (inputData.key !== '') {
 		whereClause += " AND KEY='" + inputData.key + "'";
 	}
 	querySelectSubMenu += whereClause;
 	var pstmtSelectSubMenu = connection.prepareStatement(querySelectSubMenu);
 	var rsSelectSubMenu = pstmtSelectSubMenu.executeQuery();
 	return rsSelectSubMenu;
 }

 function addSubMenu(inputData, connection, record) {

 	var qryInstSubMenu = 'INSERT INTO  "MDB_TEST_INTEGRATION"."MST_SUB_MENU" (SUB_MENU_NAME, MENU_ID, ORDER_NO, KEY, ICON,CREATE_BY) VALUES (?,?,?,?,?,?);';
 	var pstmtInstSubMenu = connection.prepareStatement(qryInstSubMenu);
 	pstmtInstSubMenu.setString(1, inputData.subMenuName);
 	pstmtInstSubMenu.setInteger(2, parseInt(inputData.menuId, 10));
 	pstmtInstSubMenu.setInteger(3, parseInt(inputData.orderNo, 10));
 	pstmtInstSubMenu.setString(4, inputData.key);
 	pstmtInstSubMenu.setString(5, inputData.icon);
 	pstmtInstSubMenu.setString(6, inputData.createby);
 	var rsInstSubMenu = pstmtInstSubMenu.executeUpdate();
 	connection.commit();
 	if (rsInstSubMenu > 0) {
 		record.status = 1;
 		record.Message = "Record Successfully inserted";
 	} else {
 		record.status = 0;
 		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
 	}
 }

 function MDB_TEST_INTEGRATIONbMEenu() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var SUBMENU_ID = $.request.parameters.get('SUBMENU_ID');
 	var submenuName = $.request.parameters.get('submenuName');
 	var submenuOrderNo = $.request.parameters.get('submenuOrderNo');
 	var submenuKey = $.request.parameters.get('submenuKey');
 	var submenuIcon = $.request.parameters.get('submenuIcon');
 	var submenuStatus = $.request.parameters.get('submenuStatus');
var modifyby = $.request.parameters.get('modifyby');
 	try {
 		var qryUpdateSubMenu = 'update "MDB_TEST_INTEGRATION"."MST_SUB_MENU" set SUB_MENU_NAME=? ,ORDER_NO=?, KEY=?, ICON=?, SOFT_DEL=?,MODIFIED_BY=?,MODIFIED_DATE=? where SUBMENU_ID=?';
 		var pstmtUpdateSubMenu = conn.prepareCall(qryUpdateSubMenu);
 		pstmtUpdateSubMenu.setString(1, submenuName);
 		pstmtUpdateSubMenu.setInteger(2, parseInt(submenuOrderNo, 10));
 		pstmtUpdateSubMenu.setString(3, submenuKey);
 		pstmtUpdateSubMenu.setString(4, submenuIcon);
 		pstmtUpdateSubMenu.setString(5, submenuStatus);
 		pstmtUpdateSubMenu.setString(6, modifyby);
		pstmtUpdateSubMenu.setString(7, dateFunction());
 		pstmtUpdateSubMenu.setInteger(8, parseInt(SUBMENU_ID, 10));
 		/*	pstmtUpdateSubMenu.setInteger(6, 0);
		pstmtUpdateSubMenu.setString(7, 'ADMIN');
		pstmtUpdateSubMenu.setString(8, dateFunction());
		pstmtUpdateSubMenu.setString(9, ' ');
		pstmtUpdateSubMenu.setString(10, dateFunction());
		pstmtUpdateSubMenu.setString(11, 'UPDATE');*/
 		pstmtUpdateSubMenu.execute();
 		var rsUpdCallPro = pstmtUpdateSubMenu.getParameterMetaData();
 		conn.commit();

 		if (rsUpdCallPro.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Success';
 			Output.results.push(record);

 		} else {
 			record.status = 1;
 			record.message = 'failed';
 			Output.results.push(record);

 		}

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

 function deleteSubMenu() {
 	var Output = {
 		results: []

 	};
 	var record = {};
 	var conn = $.db.getConnection();
 	var SUBMENU_ID = $.request.parameters.get('SUBMENU_ID');

 	try {
 		var qrydeleteSubMenu = 'update "MDB_TEST_INTEGRATION"."MST_SUB_MENU" set soft_Del=? where SUBMENU_ID=?';
 		var pstmtdeleteSubMenu = conn.prepareCall(qrydeleteSubMenu);
 		pstmtdeleteSubMenu.setString(1, '1');
 		pstmtdeleteSubMenu.setString(2, SUBMENU_ID);
 		pstmtdeleteSubMenu.execute();
 		var rsdeleteSubMenu = pstmtdeleteSubMenu.getParameterMetaData();
 		conn.commit();

 		if (rsdeleteSubMenu.getParameterCount() > 0) {
 			record.status = 0;
 			record.message = 'Success';
 			Output.results.push(record);

 		} else {
 			record.status = 1;
 			record.message = 'failed';
 			Output.results.push(record);

 		}

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

 function validateSubMenu() {

 	var Output = {
 		results: []
 	};
 	var connection = $.db.getConnection();
 	var inputData = {};
 	var subMenuName = $.request.parameters.get('subMenuName');
 	var menuId = $.request.parameters.get('menuId');
 	var orderNo = $.request.parameters.get('orderNo');
 	var key = $.request.parameters.get('key');
 	var icon = $.request.parameters.get('icon');
 	var createby = $.request.parameters.get('createby');
 	inputData.subMenuName = subMenuName;
 	inputData.menuId = menuId;
 	inputData.orderNo = orderNo;
 	inputData.key = key;
 	inputData.icon = icon;
inputData.createby = createby;
 	try {
 		var record = {};
 		var rsSubMenuValidation = fetchSubMenu(inputData, connection);
 		if (rsSubMenuValidation.next()) {
 			var softDel = rsSubMenuValidation.getString(7);
 			if (softDel === "0") {
 				record.status = 1;
 				record.Message = "SubMenu name already present in our System!!! Kindly add another SubMenu name";

 			} else {
 				record.status = 1;
 				record.Message = "SubMenu name is inactive in our System!!! Kindly use edit functionality to activate it.";
 			}
 		} else {
 			addSubMenu(inputData, connection, record);
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

 	case "getSubMenu":
 		getSubMenu();
 		break;
 	case "getSubMenus":
 		getSubMenus();
 		break;
 	case "addSubMenu":
 		addSubMenu();
 		break;
 	case "updateSubMEenu":
 		updateSubMEenu();
 		break;
 	case "deleteSubMenu":
 		deleteSubMenu();
 		break;
 	case "validateSubMenu":
 		validateSubMenu();
 		break;

 	default:
 		$.response.status = $.net.http.BAD_REQUEST;
 		$.response.setBody('Invalid Command');

 }