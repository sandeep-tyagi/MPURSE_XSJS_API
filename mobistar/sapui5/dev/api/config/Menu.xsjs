/**
 * To get the status of soft_del in the form of Active or inactive.
 * @Param {String} output.
 * @return {String} SOFT_DEL_DESC  .
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
 * To fetch a Menu from Menu master.
 * @Param {Integer} menuId
 * @Param {String} menuName
 * @Param [] output to put the data in it
 * @returns {output} Array of Menu record
 * @author: Shubham.
 */

function getMenu() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var menuId = $.request.parameters.get('menuId');
	var queryMenuSelect = '';
	var pstmtMenuSelect = '';
	var rsMenuSelect = '';

	queryMenuSelect = 'SELECT * FROM "MDB_DEV"."MST_MENU" WHERE MENU_ID=? ';
	pstmtMenuSelect = connection.prepareStatement(queryMenuSelect);
	pstmtMenuSelect.setInteger(1, parseInt(menuId, 10));
	rsMenuSelect = pstmtMenuSelect.executeQuery();

	connection.commit();
	while (rsMenuSelect.next()) {
		var record = {};
		record.MENU_ID = rsMenuSelect.getString(1);
		record.MENU_NAME = rsMenuSelect.getString(2);
		record.ORDER_NO = rsMenuSelect.getString(3);
		record.URL = rsMenuSelect.getString(4);
		record.HEADER = rsMenuSelect.getString(5);
		record.SUB_HEADER = rsMenuSelect.getString(6);
		record.FRAME_TYPE = rsMenuSelect.getString(7);
		record.HEADER_IMAGE = rsMenuSelect.getString(8);
		record.FOOTER = rsMenuSelect.getString(9);
		record.TILE_TYPE = rsMenuSelect.getString(10);
		record.PRESS = rsMenuSelect.getString(11);
		record.SOFT_DEL = rsMenuSelect.getString(12);
		record.CREATE_BY = rsMenuSelect.getString(13);
		record.CREATE_DATE = rsMenuSelect.getString(14);
		record.MODIFIED_BY = rsMenuSelect.getString(15);
		record.MODIFIED_DATE = rsMenuSelect.getString(16);
		output.results.push(record);
	}

	connection.close();

	var body = JSON.stringify(output);
	$.response.contentType = 'application/json';
	$.response.setBody(body);
	$.response.status = $.net.http.OK;
}

/**
 * To fetch all Menus.
 * @Param [] output .
 * @return {String} array of menu.
 * @author: Shubham.
 */

function getMenus() {
	var output = {
		results: []
	};
	var conn1 = $.db.getConnection();
	try {
		var CallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_MENU"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtCallPro = conn1.prepareCall(CallPro);
		pstmtCallPro.setInteger(1, 0);
		pstmtCallPro.setString(2, ' ');
		pstmtCallPro.setInteger(3, 0);
		pstmtCallPro.setString(4, ' ');
		pstmtCallPro.setString(5, '0');
		pstmtCallPro.setString(6, 'ADMIN');
		pstmtCallPro.setString(7, dateFunction());
		pstmtCallPro.setString(8, ' ');
		pstmtCallPro.setString(9, dateFunction());
		pstmtCallPro.setString(10, 'SELECTMENUS');
		pstmtCallPro.execute();
		var rCallPro = pstmtCallPro.getResultSet();
		conn1.commit();
		while (rCallPro.next()) {
			var record = {};
			record.MENU_ID = rCallPro.getString(1);
			record.MENU_NAME = rCallPro.getString(2);
			record.ORDER_NO = rCallPro.getString(3);
			record.URL = rCallPro.getString(4);
			record.HEADER = rCallPro.getString(5);
			record.SUB_HEADER = rCallPro.getString(6);
			record.FRAME_TYPE = rCallPro.getString(7);
			record.HEADER_IMAGE = rCallPro.getString(8);
			record.FOOTER = rCallPro.getString(9);
			record.TILE_TYPE = rCallPro.getString(10);
			record.PRESS = rCallPro.getString(11);
			record.SOFT_DEL = rCallPro.getString(12);
			record.CREATE_BY = rCallPro.getString(13);
			record.CREATE_DATE = rCallPro.getString(14);
			record.MODIFIED_BY = rCallPro.getString(15);
			record.MODIFIED_DATE = rCallPro.getString(16);
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

/**
 * fetch Menu from menu master
 * @Param {} inputData.
 * @returns {output} resultset of Menu
 */

function fetchMenu(inputData, connection) {
	var queryselectMenu = 'select * from "MDB_DEV"."MST_MENU" where SOFT_DEL is not null ';
	var whereClause = "";
	if (inputData.menuName !== '') {
		whereClause += " AND MENU_NAME='" + inputData.menuName + "'";
	}
	queryselectMenu += whereClause;
	var pstmtSelectMenu = connection.prepareStatement(queryselectMenu);
	var rsSelectMenu = pstmtSelectMenu.executeQuery();
	return rsSelectMenu;
}
/**
 * Insert new  Menu.
 * @Param {string} menuName .
 * @Param [] output .
 * @return {String} message .
 * @author : Shubham.
 */
function addMenu(inputData, connection, record) {

	var queryAddMenu =
		'INSERT INTO "MDB_DEV"."MST_MENU"(MENU_NAME,ORDER_NO,URL,HEADER,SUB_HEADER,FRAME_TYPE,HEADER_IMAGE,FOOTER,TILE_TYPE,PRESS,CREATE_BY) values(?,?,?,?,?,?,?,?,?,?,?)';
	var pstmtAddMenu = connection.prepareStatement(queryAddMenu);

	pstmtAddMenu.setString(1, inputData.menuName);
	pstmtAddMenu.setInteger(2, parseInt(inputData.ordernoMenu, 10));
	pstmtAddMenu.setString(3, inputData.urlMenu);
	pstmtAddMenu.setString(4, inputData.header);
	pstmtAddMenu.setString(5, inputData.subHeader);
	pstmtAddMenu.setString(6, inputData.frameType);
	pstmtAddMenu.setString(7, inputData.headerImage);
	pstmtAddMenu.setString(8, inputData.footer);
	pstmtAddMenu.setString(9, inputData.tileType);
	pstmtAddMenu.setString(10, inputData.press);
	pstmtAddMenu.setString(11, inputData.createby);
	var rsAddMenu = pstmtAddMenu.executeUpdate();
	connection.commit();
	if (rsAddMenu > 0) {
		record.status = 1;
		record.Message = "Record Successfully inserted";
	} else {
		record.status = 0;
		record.Message = "Record Successfully  not inserted!!! Kindly contact Admin.";
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

/**
 * To update Menu.
 * @Param {Integer} menuIdEditMenu ,
 * @Param {String} menuNameEditMenu,
 * @Param {Integer} menuOrderNoEditMenu.
 *  @Param {String} menuUrlEditMenu.
 *  @Param {Integer} statusEditMenu.
 * @Param [] output .
 * @return {String} message .
 * @author: Shubham.
 */

function updateMenu() {
	var Output = {
		results: []

	};
	var queryMenuUpdate = '';
	var record = {};
	var conn = $.db.getConnection();
	var menuObjectUpdate = $.request.parameters.get('menuObjectUpdate');
	var inputData = JSON.parse(menuObjectUpdate.replace(/\\r/g, ""));
	/*var menuIdEditMenu = $.request.parameters.get('menuIdEditMenu');
	var menuNameEditMenu = $.request.parameters.get('menuNameEditMenu');
	var menuOrderNoEditMenu = $.request.parameters.get('menuOrderNoEditMenu');
	var menuUrlEditMenu = $.request.parameters.get('menuUrlEditMenu');
	var statusEditMenu = $.request.parameters.get('statusEditMenu');*/

	try {
		queryMenuUpdate =
			'UPDATE "MDB_DEV"."MST_MENU" SET MENU_NAME=?,ORDER_NO=?,URL=?,HEADER=?,SUB_HEADER=?,FRAME_TYPE=?,HEADER_IMAGE=?,FOOTER=?,TILE_TYPE=?,PRESS=?,MODIFIED_DATE=?,MODIFIED_BY=? where MENU_ID=?';
		var pstmtMenuUpdate = conn.prepareStatement(queryMenuUpdate);
		
		pstmtMenuUpdate.setString(1, inputData.editMenuNAME);
		pstmtMenuUpdate.setInteger(2, parseInt(inputData.editOrderNo, 10));
		pstmtMenuUpdate.setString(3, inputData.editURL);
		pstmtMenuUpdate.setString(4, inputData.editHeader);
		pstmtMenuUpdate.setString(5, inputData.editSubHeader);
		pstmtMenuUpdate.setString(6, inputData.editFrameType);
		pstmtMenuUpdate.setString(7, inputData.editHeaderImage);
		pstmtMenuUpdate.setString(8, inputData.editFooter);
		pstmtMenuUpdate.setString(9, inputData.editTileType);
		pstmtMenuUpdate.setString(10, inputData.editPress);
	/*	pstmtMenuUpdate.setInteger(11, parseInt(inputData.editStatus, 10));*/
		pstmtMenuUpdate.setString(11, dateFunction());
		pstmtMenuUpdate.setString(12, inputData.modifyby);
		pstmtMenuUpdate.setInteger(13, parseInt(inputData.editMenuID, 10));

		/*	pstmtUpdCallPro.setInteger(1, parseInt(menuIdEditMenu, 10));
		pstmtUpdCallPro.setString(2, menuNameEditMenu);
		pstmtUpdCallPro.setInteger(3, parseInt(menuOrderNoEditMenu, 10));
		pstmtUpdCallPro.setString(4, menuUrlEditMenu);
		pstmtUpdCallPro.setString(5, statusEditMenu);
		pstmtUpdCallPro.setString(6, 'ADMIN');
		pstmtUpdCallPro.setString(7, dateFunction());
		pstmtUpdCallPro.setString(8, ' ');
		pstmtUpdCallPro.setString(9, dateFunction());
		pstmtUpdCallPro.setString(10, 'UPDATE');*/
		var rsMenuUpdate = pstmtMenuUpdate.executeUpdate();

		conn.commit();

		if (rsMenuUpdate > 0) {
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

/**
 * To delete existing Menu.
 * @Param {integer} menuId .
 * @Param [] output .
 * @return {String} message .
 * @author: Shubham.
 */

function deleteMenu() {
	var Output = {
		results: []

	};
	var record = {};
	var conn = $.db.getConnection();
	var menuId = $.request.parameters.get('menuId');

	try {
		var DelCallPro = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MST_MENU"(?,?,?,?,?,?,?,?,?,?);';
		var pstmtUpdCallPro = conn.prepareCall(DelCallPro);
		pstmtUpdCallPro.setInteger(1, parseInt(menuId, 10));
		pstmtUpdCallPro.setString(2, ' ');
		pstmtUpdCallPro.setInteger(3, 0);
		pstmtUpdCallPro.setString(4, ' ');
		pstmtUpdCallPro.setString(5, '1');
		pstmtUpdCallPro.setString(6, 'ADMIN');
		pstmtUpdCallPro.setString(7, dateFunction());
		pstmtUpdCallPro.setString(8, ' ');
		pstmtUpdCallPro.setString(9, dateFunction());
		pstmtUpdCallPro.setString(10, 'DELETE');
		pstmtUpdCallPro.execute();
		var rsUpdCallPro = pstmtUpdCallPro.getParameterMetaData();
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

/**
 * This is a function which call addMenu to Validate to add menu data  on the behalf of input menuName.
 * @Param {String} menuName ,orderMenu, urlMenu
 * @Param [] output to put the data in it
 * @returns {output} menu
 * @author : Shubham
 */

function validateMenu() {

	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var menuObject = $.request.parameters.get('menuObject');
	var inputData = JSON.parse(menuObject.replace(/\\r/g, ""));
	try {
		var record = {};
		var rsMenuValidation = fetchMenu(inputData, connection);
		if (rsMenuValidation.next()) {
			var softDel = rsMenuValidation.getString(5);
			if (softDel === "0") {
				record.status = 1;
				record.Message = "Menu name already present in our System!!! Kindly add another menu name";

			} else {
				record.status = 1;
				record.Message = "Menu name is inactive in our System!!! Kindly use edit functionality to activate it.";
			}
		} else {
			addMenu(inputData, connection, record);
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

	case "getMenu":
		getMenu();
		break;
	case "getMenus":
		getMenus();
		break;
	case "addMenu":
		addMenu();
		break;
	case "updateMenu":
		updateMenu();
		break;
	case "deleteMenu":
		deleteMenu();
		break;
	case "validateMenu":
		validateMenu();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}