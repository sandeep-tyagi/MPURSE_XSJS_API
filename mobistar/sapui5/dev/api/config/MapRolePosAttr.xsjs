/**
 * To get the current date in db format.
 * @return {String} yyyymmddp  
 * @author laxmi.
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
 * To fetch role Position Attribute behalf of RoleAttrId, RoleLocId and SubMenuId.
 * @Param {String} SubMenuId,RoleAttrId,RoleLocId.
 * @Param [] output to put the data in it
 * @return {output} Array of Role Position Attribute record
 * @author laxmi
 */
 
function getMapRolePosAttr() {
	var output = {
		results: []
	};
	var connection = $.db.getConnection();
	var roleAttrId = $.request.parameters.get('RoleAttrId');
	var roleLocId = $.request.parameters.get('RoleLocId');
	var subMenuId = $.request.parameters.get('SubMenuId');
	try {
		var CallProRolePosAttr = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_ROLE_POS_ATTR"(?,?,?,?,?,?,?,?,?,?)';
		var pstmtRolePosAttr = connection.prepareCall(CallProRolePosAttr);
		pstmtRolePosAttr.setInteger(1, 0);
		pstmtRolePosAttr.setString(2, roleAttrId);
		pstmtRolePosAttr.setString(3, roleLocId);
		pstmtRolePosAttr.setString(4, subMenuId);
		pstmtRolePosAttr.setString(5, '');
		pstmtRolePosAttr.setString(6, '');
		pstmtRolePosAttr.setString(7, dateFunction());
		pstmtRolePosAttr.setString(8, '');
		pstmtRolePosAttr.setString(9, dateFunction());
		pstmtRolePosAttr.setString(10, 'SELECT');
		pstmtRolePosAttr.execute();
		var rRolePosAttr = pstmtRolePosAttr.getResultSet();
		connection.commit();
		while (rRolePosAttr.next()) {
			var record = {};
			record.ID = rRolePosAttr.getString(1);
			record.ROLE_ATTR_ID = rRolePosAttr.getString(2);
			record.ROLE_LOC_ID = rRolePosAttr.getString(3);
			record.SUB_MENU_ID = rRolePosAttr.getString(4);
			record.SOFT_DEL = rRolePosAttr.getString(5);
			record.CREATE_BY = rRolePosAttr.getString(6);
			record.CREATE_DATE = rRolePosAttr.getString(7);
			record.MODIFIED_BY = rRolePosAttr.getString(8);
			record.MODIFIED_DATE = rRolePosAttr.getString(9);
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
 * Delete Matching record behaf of ROLE_LOC_ID ,MENU_ID.
 * @Param {dataLine} Array [] hold ROLE_LOC_ID ,MENU_ID.
 * @return {status} statuc either 0 or 1
 * @author laxmi
 */
 
function deleteMapRolePosAttr(dataLine,status){
    var connection = $.db.getConnection();
		if (dataLine.length > 0) {
			var dicLine = dataLine[0];
			var qryDeleteRoleAtt = 'Delete from "MDB_DEV"."MAP_ROLE_POS_ATTR" where ROLE_POS_ID = ? and SUB_MENU_ID in ' +
			                        '(select SUBMENU_ID from "MDB_DEV"."MST_SUB_MENU" where MENU_ID = ?)';
		    	var pstmtDeleteRoleAtt = connection.prepareStatement(qryDeleteRoleAtt);
				pstmtDeleteRoleAtt.setInteger(1, parseInt(dicLine.ROLE_LOC_ID, 10));
				pstmtDeleteRoleAtt.setInteger(2, parseInt(dicLine.MENU_ID, 10));
				var rsDeleteRoleAtt = pstmtDeleteRoleAtt.executeQuery();
				connection.commit();
				if (rsDeleteRoleAtt.next()) {
				    status = 1;
				}else{
				    status = 0;
				}
		    }
				connection.close();
}

/*
 * Insert all mandatory fields like Role Position Id,Attribute Id, Sub Menu Id.
 * and check record is already insert or not.
 * if record is match its as well as delete that record using "getMapRolePosAttr" function
 * @Param {datasLine} hold data in array [].
 * @Param [] output to put the data in it
 * @return {output} Array of Level Attribute record
 * @author laxmi
 */
 
function addMapRolePosAttr() {

	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var status;
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));

	try {
	    deleteMapRolePosAttr(dataLine,status);
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
				if (status === 1) {
					record.status = 0;
					record.message = 'Record Allready inserted!';
				} else {
					var CallProRolePosAttr = 'call "MDB_DEV"."com.mobistar.sapui5.dev.procedure::MAP_ROLE_POS_ATTR"(?,?,?,?,?,?,?,?,?,?)';
					var pstmtRolePosAttr = connection.prepareCall(CallProRolePosAttr);
					pstmtRolePosAttr.setInteger(1, 0);
					pstmtRolePosAttr.setInteger(2, parseInt(dicLine.ID, 10));
					pstmtRolePosAttr.setInteger(3, parseInt(dicLine.ROLE_LOC_ID, 10));
					pstmtRolePosAttr.setInteger(4, parseInt(dicLine.SUBID, 10));
					pstmtRolePosAttr.setString(5, '0');
					pstmtRolePosAttr.setString(6, ' ');
					pstmtRolePosAttr.setString(7, dateFunction());
					pstmtRolePosAttr.setString(8, '');
					pstmtRolePosAttr.setString(9, dateFunction());
					pstmtRolePosAttr.setString(10, 'INSERT');
					pstmtRolePosAttr.execute();
					var rRolePosAttr = pstmtRolePosAttr.getParameterMetaData();
					connection.commit();
					if (rRolePosAttr.getParameterCount() > 0) {
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


function deleteMapRolePosAttri() {

	var record;
	var Output = {
		results: []
	};
	var connection = $.db.getConnection();
	var datasLine = $.request.parameters.get('LineData');
	var dataLine = JSON.parse(datasLine.replace(/\\r/g, ""));

	try {
		if (dataLine.length > 0) {
			for (var i = 0; i < dataLine.length; i++) {
				var dicLine = dataLine[i];
				record = {};
					var qryDeleteRoleAtt = 'Delete from "MDB_DEV"."MAP_ROLE_POS_ATTR" where ATTRIBUTE_ID = ? and ROLE_POS_ID = ? and SUB_MENU_ID = ?';
				/*	ROLE_POS_ID = ? and SUB_MENU_ID in ' +
			                        '(select SUBMENU_ID from "MDB_DEV"."MST_SUB_MENU" where MENU_ID = ?)';*/
		    	var pstmtDeleteRoleAtt = connection.prepareStatement(qryDeleteRoleAtt);
			pstmtDeleteRoleAtt.setInteger(1, parseInt(dicLine.ID, 10));
					pstmtDeleteRoleAtt.setInteger(2, parseInt(dicLine.ROLE_LOC_ID, 10));
					pstmtDeleteRoleAtt.setInteger(3, parseInt(dicLine.SUBID, 10));
				var rsDeleteRoleAtt = pstmtDeleteRoleAtt.executeQuery();
				connection.commit();
					if (rsDeleteRoleAtt) {
						record.status = 1;
						record.message = 'Data deleted Sucessfully';
					} else {
						record.status = 0;
						record.message = 'Some Issues!';
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
/*
 * To get matching record of Role position attribute map.
 * @Param {Integer} rSubMenu as SubMenuId,rAttr as AttributeId.
 * @Param {String} rolePositionId as rolePositionId
 * @return {boolean} Check  in records.
 * @author laxmi
 */
 
function checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId) {
	var connection = $.db.getConnection();
	var querycheckRolePosAttr = 'select * from "MDB_DEV"."MAP_ROLE_POS_ATTR" where SUB_MENU_ID = ? and ATTRIBUTE_ID = ? ' +
	                            ' and SOFT_DEL = ? and ROLE_POS_ID = ?';
	var pstmtcheckRolePosAttr = connection.prepareStatement(querycheckRolePosAttr);
	pstmtcheckRolePosAttr.setInteger(1, rSubMenu.getInteger(2));
	pstmtcheckRolePosAttr.setInteger(2, rAttr.getInteger(1));
	pstmtcheckRolePosAttr.setString(3, '0');
	pstmtcheckRolePosAttr.setString(4, rolePositionId);
	var rcheckRolePosAttr = pstmtcheckRolePosAttr.executeQuery();
	connection.commit();
	if (rcheckRolePosAttr.next() > 0) {
		records.Check = true;
	} else {
		records.Check = false;
	}
	var AttributeName = rAttr.getString(2);
	if (AttributeName === 'CREATE') {
		records.INSERTCHECK = records.Check;
	} else if (AttributeName === 'SEARCH') {
		records.SEARCHCHECK = records.Check;
	} else if (AttributeName === 'DELETE') {
		records.DELETECHECK = records.Check;
	} else if (AttributeName === 'EDIT') {
		records.EDITCHECK = records.Check;
	} else if (AttributeName === 'VIEW') {
		records.VIEWCHECK = records.Check;
	} else if (AttributeName === 'PRINT') {
		records.PRINTCHECK = records.Check;
	}
	connection.close();
}

/*
 * To fetch Role Position Attribute behalf of Menu, Sub Menu and Attribute.
 * @Param {Integer} rolePositionId.
 * @Param [] output to put the data in it
 * @return {output} Array of Role Position Attribute record
 * @author laxmi
 */
function getSubMenuRolePositionAttr() {
	var output = {
		results: []
	};
	var pstmtMenu, pstmtSubMenu, pstmtAttr;
	var rMenu = 0,
		rSubMenu = 0,
		rAttr = 0;
	var rolePositionId = $.request.parameters.get('rolePosition'); 
	var connection = $.db.getConnection();
	try {
		var queryMenu = 'select Menu_id,menu_name from "MDB_DEV"."MST_MENU" where SOFT_DEL = ?';
		pstmtMenu = connection.prepareStatement(queryMenu);
		pstmtMenu.setString(1, '0');
		rMenu = pstmtMenu.executeQuery();
		while (rMenu.next()) {
			var record = {};
			var SubMenu = [];
			var querySubMenu = 'select distinct sub_menu_name,submenu_id,menu_id from "MDB_DEV"."MST_SUB_MENU" ' +
			                    ' where menu_id = ? and SOFT_DEL = ?';
			pstmtSubMenu = connection.prepareStatement(querySubMenu);
			pstmtSubMenu.setInteger(1, rMenu.getInteger(1));
			pstmtSubMenu.setString(2, '0');
			rSubMenu = pstmtSubMenu.executeQuery();
			connection.commit();
			while (rSubMenu.next()) {
				var records = {};
				var queryAttr = 'select ATTRIBUTE_ID,ATTRIBUTE_NAME from "MDB_DEV"."MST_ATTRIBUTE" where SOFT_DEL = ? and attribute_name != ?';
				pstmtAttr = connection.prepareStatement(queryAttr);
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
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					} else if (Attribute === 'SEARCH') {
						records.SEARCH_ID = rAttr.getInteger(1);
						records.SEARCH = Attribute;
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					} else if (Attribute === 'DELETE') {
						records.DELETE_ID = rAttr.getInteger(1);
						records.DELETE = Attribute;
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					} else if (Attribute === 'EDIT') {
						records.EDIT_ID = rAttr.getInteger(1);
						records.EDIT = Attribute;
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					} else if (Attribute === 'PRINT') {
						records.PRINT_ID = rAttr.getInteger(1);
						records.PRINT = Attribute;
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					} else if (Attribute === 'VIEW') {
						records.VIEW_ID = rAttr.getInteger(1);
						records.VIEW = Attribute;
						checkRolePosAttrRecord(rSubMenu, rAttr, records,rolePositionId);
					}
				}
				SubMenu.push(records);
			}

			record.MENU_ID = rMenu.getInteger(1);
			record.MENU_NAME = rMenu.getString(2);
			record.results = SubMenu;
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
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {

	case "getMapRolePosAttr":
		getMapRolePosAttr();
		break;
	case "addMapRolePosAttr":
		addMapRolePosAttr();
		break;

	case "getSubMenuRolePositionAttr":
		getSubMenuRolePositionAttr();
		break;
	case "deleteMapRolePosAttri":
	    deleteMapRolePosAttri();
	    break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}