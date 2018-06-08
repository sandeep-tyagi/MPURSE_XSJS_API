/**
 * To get the current date in db format.
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
/*
 * To get matching record of level attribute map.
 * @Param {Integer} rSubMenu as SubMenuId,rAttr as AttributeId.
 * @Param {String} levelId as LevelId
 * @return {boolean} Check  in records.
 * @author laxmi
 */
function checkLevelRecord(rSubMenu, rAttr, records, levelId) {
	var conn = $.db.getConnection();
	var queryCheckLvlAtt = 'select * from "MDB_TEST_INTEGRATION"."MAP_LEV_ATTR" where SUB_MENU_ID = ? and ATTRIBUTE_ID = ? and SOFT_DEL = ? and LEVEL_ID=?';
	var pstmtCheckLvlAtt = conn.prepareStatement(queryCheckLvlAtt);
	pstmtCheckLvlAtt.setInteger(1, rSubMenu.getInteger(2));
	pstmtCheckLvlAtt.setInteger(2, rAttr.getInteger(1));
	pstmtCheckLvlAtt.setString(3, '0');
	pstmtCheckLvlAtt.setString(4, levelId);
	var rCheckLvlAtt = pstmtCheckLvlAtt.executeQuery();
	if (rCheckLvlAtt.next() > 0) {
		records.Check = true;
	} else {
		records.Check = false;
	}
	var Attribute = rAttr.getString(2);
	if (Attribute === 'CREATE') {
		records.INSERTCHECK = records.Check;
	} else if (Attribute === 'SEARCH') {
		records.SEARCHCHECK = records.Check;
	} else if (Attribute === 'DELETE') {
		records.DELETECHECK = records.Check;
	} else if (Attribute === 'EDIT') {
		records.EDITCHECK = records.Check;
	} else if (Attribute === 'VIEW') {
		records.VIEWCHECK = records.Check;
	} else if (Attribute === 'PRINT') {
		records.PRINTCHECK = records.Check;
	}
}

/*
 * To fetch Level Attribute behalf of Menu, Sub Menu and Attribute.
 * @Param {Integer} levelId.
 * @Param [] output to put the data in it
 * @return {output} Array of Level Attribute record
 * @author laxmi
 */

function getSubMenuLevelAttr() {
	var output = {
		results: []
	};
	var pstmtMenu, pstmtSubMenu, pstmtAttr;
	var rMenu = 0,
		rSubMenu = 0,
		rAttr = 0;
	var conn = $.db.getConnection();
	var levelId = $.request.parameters.get('levelId');
	try {
		var queryMenu = 'select Menu_id,menu_name from "MDB_TEST_INTEGRATION"."MST_MENU" where SOFT_DEL = ?';
		pstmtMenu = conn.prepareStatement(queryMenu);
		pstmtMenu.setString(1, '0');
		rMenu = pstmtMenu.executeQuery();
		while (rMenu.next()) {

			var record = {};
			var SubMenu = [];
			var querySubMenu = 'select distinct sub_menu_name,submenu_id,menu_id from "MDB_TEST_INTEGRATION"."MST_SUB_MENU" where menu_id = ? and SOFT_DEL = ?';
			pstmtSubMenu = conn.prepareStatement(querySubMenu);
			pstmtSubMenu.setInteger(1, rMenu.getInteger(1));
			pstmtSubMenu.setString(2, '0');
			rSubMenu = pstmtSubMenu.executeQuery();
			conn.commit();
			while (rSubMenu.next()) {
				var records = {};
				var queryAttr = 'select ATTRIBUTE_ID,ATTRIBUTE_NAME from "MDB_TEST_INTEGRATION"."MST_ATTRIBUTE" where SOFT_DEL = ? and attribute_name != ?';
				pstmtAttr = conn.prepareStatement(queryAttr);
				pstmtAttr.setString(1, '0');
				pstmtAttr.setString(2, '');
				rAttr = pstmtAttr.executeQuery();
				while (rAttr.next()) {
					records.SUBID = rSubMenu.getInteger(2);
					records.SUBNAME = rSubMenu.getString(1);
					var Attribute = rAttr.getString(2);
					if (Attribute === 'CREATE') {
						records.INSERT_ID = rAttr.getInteger(1);
						records.INSERT = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					} else if (Attribute === 'SEARCH') {
						records.SEARCH_ID = rAttr.getInteger(1);
						records.SEARCH = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					} else if (Attribute === 'DELETE') {
						records.DELETE_ID = rAttr.getInteger(1);
						records.DELETE = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					} else if (Attribute === 'EDIT') {
						records.EDIT_ID = rAttr.getInteger(1);
						records.EDIT = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					} else if (Attribute === 'VIEW') {
						records.VIEW_ID = rAttr.getInteger(1);
						records.VIEW = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					} else if (Attribute === 'PRINT') {
						records.PRINT_ID = rAttr.getInteger(1);
						records.PRINT = Attribute;
						checkLevelRecord(rSubMenu, rAttr, records, levelId);
					}
				}
				SubMenu.push(records);
			}

			record.MENU_ID = rMenu.getInteger(1);
			record.MENU_NAME = rMenu.getString(2);
			record.results = SubMenu;
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
}

/*
 * To fetch All Level Attribute data.
 * @Param [] output to put the data in it
 * @return {output} Array of Level Attribute record
 * @author laxmi
 */

function getMapLevAttrs() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	try {
		var CallLvlAttr = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_LEV_ATTR"(?,?,?,?,?,?,?,?,?,?)';
		var pstmtLvlAttr = connection.prepareCall(CallLvlAttr);
		pstmtLvlAttr.setInteger(1, 0);
		pstmtLvlAttr.setInteger(2, 0);
		pstmtLvlAttr.setInteger(3, 4);
		pstmtLvlAttr.setInteger(4, 2);
		pstmtLvlAttr.setString(5, '');
		pstmtLvlAttr.setString(6, '');
		pstmtLvlAttr.setString(7, dateFunction());
		pstmtLvlAttr.setString(8, '');
		pstmtLvlAttr.setString(9, dateFunction());
		pstmtLvlAttr.setString(10, 'SELECT');
		pstmtLvlAttr.execute();
		var rCallLvlAttr = pstmtLvlAttr.getResultSet();
		connection.commit();
		while (rCallLvlAttr.next()) {
			var record = {};
			record.LEVEL_NAME = rCallLvlAttr.getString(1);
			record.LEVEL_ATTR_ID = rCallLvlAttr.getString(2);
			record.LEVEL_ID = rCallLvlAttr.getString(3);
			record.SUB_MENU_NAME = rCallLvlAttr.getString(10);
			record.MENU_NAME = rCallLvlAttr.getString(11);
			record.SUB_MENU_ID = rCallLvlAttr.getString(4);
			record.SOFT_DEL = rCallLvlAttr.getString(5);
			record.CREATE_BY = rCallLvlAttr.getString(6);
			record.CREATE_DATE = rCallLvlAttr.getString(7);
			record.MODIFIED_BY = rCallLvlAttr.getString(8);
			record.MODIFIED_DATE = rCallLvlAttr.getString(9);
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

/*
 * Delete Matching record behaf of LEVEL_ID ,MENU_ID.
 * @Param {dataLine} Array [] hold LEVEL_ID ,MENU_ID.
 * @return {status} status either 0 or 1
 * @author laxmi
 */

function deleteMapLevelAttr(dataLine, status) {
	var connection = $.db.getConnection();
	if (dataLine.length > 0) {
		var dicLine = dataLine[0];
		var qryDeleteLevelAtt =
			'Delete from "MDB_TEST_INTEGRATION"."MAP_LEV_ATTR" where LEVEL_ID = ? and SUB_MENU_ID in (select SUBMENU_ID from "MDB_TEST_INTEGRATION"."MST_SUB_MENU" where MENU_ID = ?)';
		var pstmtDeleteLevelAtt = connection.prepareStatement(qryDeleteLevelAtt);
		pstmtDeleteLevelAtt.setInteger(1, parseInt(dicLine.LEVEL_ID, 10));
		pstmtDeleteLevelAtt.setInteger(2, parseInt(dicLine.MENU_ID, 10));
		var rsDeleteLevelAtt = pstmtDeleteLevelAtt.executeQuery();
		connection.commit();
		if (rsDeleteLevelAtt.next()) {
			status = 1;
		} else {
			status = 0;
		}
		connection.close();
	}
}

/*
 * Insert all mandatory fields like Level Id,Attribute Id, Sub Menu Id.
 * and check record is already insert or not.
 * if record is match its as well as delete that record using "deleteMapLevelAttr" function
 * @Param {datasLine} hold data in array [].
 * @Param [] output to put the data in it
 * @return {output} Array of Level Attribute record
 * @author laxmi
 */

function addMapLevAttr() {

	var record, status;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));
	try {
		if (dataLine.length > 0) {
			deleteMapLevelAttr(dataLine, status);
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				if (status === 1) {
					record.status = 0;
					record.message = 'Record Allready inserted!';
				} else {
					var CallLvlAttr = 'call "MDB_TEST_INTEGRATION"."com.mobistar.sapui5.testintegration.procedure::MAP_LEV_ATTR"(?,?,?,?,?,?,?,?,?,?);';
					var pstmtCallLvlAttr = connection.prepareCall(CallLvlAttr);
					pstmtCallLvlAttr.setInteger(1, 0);
					pstmtCallLvlAttr.setInteger(2, parseInt(dicLine.LEVEL_ID, 10));
					pstmtCallLvlAttr.setInteger(3, parseInt(dicLine.ID, 10));
					pstmtCallLvlAttr.setInteger(4, parseInt(dicLine.SUBID, 10));
					pstmtCallLvlAttr.setString(5, '0');
					pstmtCallLvlAttr.setString(6, '');
					pstmtCallLvlAttr.setString(7, dateFunction());
					pstmtCallLvlAttr.setString(8, '');
					pstmtCallLvlAttr.setString(9, dateFunction());
					pstmtCallLvlAttr.setString(10, 'INSERT');
					pstmtCallLvlAttr.execute();
					var rLvlAttr = pstmtCallLvlAttr.getParameterMetaData();
					connection.commit();
					if (rLvlAttr.getParameterCount() > 0) {
						record.status = 1;
						record.message = 'Data Uploaded Sucessfully';
					} else {
						record.status = 0;
						record.message = 'Some Issues!';
					}
				}
			}
			Output.results.push(record);
			connection.close();
		}
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

	case "getMapLevAttr":
		getMapLevAttrs();
		break;
	case "addMapLevAttr":
		addMapLevAttr();
		break;
	case "getSubMenuLevelAttr":
		getSubMenuLevelAttr();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}