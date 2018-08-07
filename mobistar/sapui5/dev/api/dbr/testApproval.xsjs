function getParentEmp(userCode, connection, record) {
	var querygetParentEmp;
	var pstmtgetParentEmp;
	var query;
	try {

		querygetParentEmp =
		
			'select n.POSITION_VALUE_ID,p.POSITION_NAME,n.role_position_id from "MDB_DEV"."MST_EMPLOYEE" as m inner join "MDB_DEV"."MAP_ROLE_POSITION" as mp ' +
			' on m.ROLE_POSITION_ID = mp.ROLE_POS_ID ' +
			' inner join "MDB_DEV"."POSITION_HIERARCHY" as h on h.POSITION_ID = mp.POSITION_ID ' +
			' inner join "MDB_DEV"."MST_POSITION" as p on p.POSITION_ID = h.PARENT_POSITION_ID ' +
			' inner join "MDB_DEV"."TRN_TEST" as n on m.EMPLOYEE_CODE = n.EMPLOYEE_CODE ' +
			' where m.EMPLOYEE_CODE=? AND m.SOFT_DEL=0 AND mp.SOFT_DEL=0 AND h.SOFT_DEL=0 AND p.SOFT_DEL=0';

		pstmtgetParentEmp = connection.prepareStatement(querygetParentEmp);
		pstmtgetParentEmp.setString(1, userCode);

		var rsgetParentEmp = pstmtgetParentEmp.executeQuery();
        var positionInfo = [];
		while (rsgetParentEmp.next()) {
			record.PositionValue = rsgetParentEmp.getString(1);
			record.ParentPosition = rsgetParentEmp.getString(2);
			record.RolePositionId = rsgetParentEmp.getString(3);
			positionInfo.push(record);

		}
		switch (record.ParentPosition) {
			case "BRANCH":
				query = 'Select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "REGION":
				//query = ' Select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
				query = ' Select R.REGIONAL_CODE from "MDB_DEV"."MST_DISTRICT" AS D INNER JOIN ' +
					' "MDB_DEV"."TRN_REGIONAL" AS R ON R.STATE_CODE = D.STATE_CODE  where D.DISTRICT_CODE = ? ';
				break;
			case "ZONE":
				//	query = ' Select REGION_CODE from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
				query = ' Select ZONE_CODE from "MDB_DEV"."MST_REGIONAL" where REGIONAL_CODE = ? ';
				break;
			case "COUNTRY":
				var querygetConditionalRolePositionID = 'select VALUE from "MDB_DEV"."APPLICATION_PARAMETER" WHERE NAME=?';
				var pstmtgetConditionalRolePositionID = connection.prepareStatement(querygetConditionalRolePositionID);
				pstmtgetConditionalRolePositionID.setString(1, 'CONDITIONAL_ROLE_POSITION_ID');
				var rsgetConditionalRolePositionID = pstmtgetConditionalRolePositionID.executeQuery();
				while (rsgetConditionalRolePositionID.next()) {
					record.ConditionalRolePositionID = rsgetConditionalRolePositionID.getString(1);
				}
				if (record.RolePositionId === record.ConditionalRolePositionID) {
					query = ' Select ZONE_CODE from "MDB_DEV"."MST_REGIONAL" where ZONE_CODE = ? ';
				} else {
					query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
				}
				break;

			default:
				return;
		}
		var pstmtgetParentInfo = connection.prepareStatement(query);
		pstmtgetParentInfo.setString(1, record.PositionValue);

		var rsgetParentInfo = pstmtgetParentInfo.executeQuery();
		connection.commit();
		record.ParentPositionValue = "";
		while (rsgetParentInfo.next()) {
			record.ParentPositionValue = rsgetParentInfo.getString(1);

		}
		if (record.ParentPositionValue === "") {
			var qryParentRolePositionHie =
				'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=' +
				'(Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE =? )' +
				+' AND ROLE_POSITION_ID=( ' +
				'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
				' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
			var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
			pstmtParentRolePositionHie.setString(1, record.PositionValue);
			pstmtParentRolePositionHie.setString(2, userCode);
			var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
			while (rsParentRolePositionHie.next()) {
				record.ParentEmpCode = rsParentRolePositionHie.getString(1);
				record.ParentEmpName = rsParentRolePositionHie.getString(2);
				record.ParentEmpEmail = rsParentRolePositionHie.getString(3);

			}
		} else {
			var qryParentEmpInfo = 'select  EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=?';

			var pstmtParentEmpInfo = connection.prepareStatement(qryParentEmpInfo);
			pstmtParentEmpInfo.setString(1, record.ParentPositionValue);

			var rsParentEmpInfo = pstmtParentEmpInfo.executeQuery();
			connection.commit();
			var countdata = 0;

			while (rsParentEmpInfo.next()) {
				++countdata;
				record.ParentEmpCode = rsParentEmpInfo.getString(1);
				record.ParentEmpName = rsParentEmpInfo.getString(2);
				record.ParentEmpEmail = rsParentEmpInfo.getString(3);
			}

			if (countdata > 1) {
				var qryParentRolePositionHie =
					'select EMPLOYEE_CODE,EMPLOYEE_NAME,EMAIL from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( ' +
					'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" ' +
					' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" ' + ' WHERE EMPLOYEE_CODE= ?))';
				var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
				pstmtParentRolePositionHie.setString(1, record.ParentPositionValue);
				pstmtParentRolePositionHie.setString(2, userCode);
				var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
				while (rsParentRolePositionHie.next()) {
					record.ParentEmpCode = rsParentRolePositionHie.getString(1);
					record.ParentEmpName = rsParentRolePositionHie.getString(2);
					record.ParentEmpEmail = rsParentRolePositionHie.getString(3);
				}

			}
		}

	} catch (e) {

		return;
	}

}


var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {


	case "getParentEmp":
		getParentEmp();
		break;
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}