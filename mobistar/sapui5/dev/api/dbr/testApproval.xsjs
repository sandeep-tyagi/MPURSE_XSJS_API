function getParentEmp(userCode,connection,record) {
	var querygetParentEmp;
	var pstmtgetParentEmp;
	var query;
	try {
	    
	    querygetParentEmp =
			'select * from "MDB_DEV"."MST_EMPLOYEE" as m inner join "MDB_DEV"."MAP_ROLE_POSITION" as mp ' +
            ' on m.ROLE_POSITION_ID = mp.ROLE_POS_ID ' +
            ' inner join "MDB_DEV"."POSITION_HIERARCHY" as h on h.POSITION_ID = mp.POSITION_ID ' +
            ' inner join "MDB_DEV"."MST_POSITION" as p on p.POSITION_ID = h.PARENT_POSITION_ID ' +
            ' where m.EMPLOYEE_CODE=?';
            
			pstmtgetParentEmp = connection.prepareStatement(querygetParentEmp);
 			pstmtgetParentEmp.setString(1, userCode);
 			
 		var rsgetParentEmp = pstmtgetParentEmp.executeQuery();
		while (rsgetParentEmp.next()) {
			record.PositionValue = rsgetParentEmp.getString(12);
			record.ParentPosition = rsgetParentEmp.getString(38);
			
			
		    }
		    
		    	switch (record.ParentPosition) {
			case "DISTRICT":
				query = 'Select DISTRICT_CODE from "MDB_DEV"."MST_AREA" where AREA_CODE=?';
				break;
			case "STATE":
			    query = ' Select STATE_CODE from "MDB_DEV"."MST_DISTRICT" where DISTRICT_CODE = ? ';
			    break;
			case "REGION":
			    query = ' Select REGION_CODE from "MDB_DEV"."MST_STATE" where STATE_CODE = ? ';
			    break; 
			case "COUNTRY":
			    query = ' Select COUNTRY_CODE from "MDB_DEV"."MST_REGION" where REGION_CODE = ? ';
			    break;     
	
			default:
			        return;
		    	}	
		    var pstmtgetParentInfo = connection.prepareStatement(query);
 			pstmtgetParentInfo.setString(1, record.PositionValue);
 			
 			var rsgetParentInfo = pstmtgetParentInfo.executeQuery();
		   connection.commit();
		
	    	while (rsgetParentInfo.next()) {
			record.ParentPositionValue = rsgetParentInfo.getString(1);
			
		    }
 			
 			var qryParentEmpInfo = 'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=?';
 			
 			 var pstmtParentEmpInfo = connection.prepareStatement(qryParentEmpInfo);
 			pstmtParentEmpInfo.setString(1, record.ParentPositionValue);
 			
 			var rsParentEmpInfo = pstmtParentEmpInfo.executeQuery();
		   connection.commit();
 			var countdata = 0;
 			while (rsParentEmpInfo.next()) {
 			    ++countdata;
			record.ParentEmpCode = rsParentEmpInfo.getString(2);
			record.ParentEmpName =	rsParentEmpInfo.getString(3);
			
			}
			
			if (countdata > 1){
		        var qryParentRolePositionHie =  'select * from "MDB_DEV"."MST_EMPLOYEE" where POSITION_VALUE_ID=? AND ROLE_POSITION_ID=( '
		                                        +  'SELECT PARENT_ID FROM "MDB_DEV"."MAP_ROLE_POSITION_HIERARCHY" '
		                                        +' WHERE ROLE_POSITION_ID = (SELECT ROLE_POSITION_ID FROM "MDB_DEV"."MST_EMPLOYEE" '
		                                        + ' WHERE EMPLOYEE_CODE= ?))';
		        var pstmtParentRolePositionHie = connection.prepareStatement(qryParentRolePositionHie);
		        pstmtParentRolePositionHie.setString(1, record.ParentPositionValue);
 		    	pstmtParentRolePositionHie.setString(2, userCode);
 		    	var rsParentRolePositionHie = pstmtParentRolePositionHie.executeQuery();
	    	 while (rsParentRolePositionHie.next()) {
			    record.ParentEmpCode = rsParentRolePositionHie.getString(2);
			    record.ParentEmpName =	rsParentRolePositionHie.getString(3);
		        }
 		    	
 		    	
		    }
 			
	    
	} catch (e) {

		return;
	}
    
}