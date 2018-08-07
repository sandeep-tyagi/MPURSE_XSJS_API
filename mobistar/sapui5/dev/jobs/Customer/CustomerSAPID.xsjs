function customers() {
var dest = $.net.http.readDestination("com.mobistar.sapui5.dev.jobs.Customer", "Customer");
	var client = new $.net.http.Client();
	var req = new $.web.WebRequest($.net.http.GET, "/MaterialSet");
	client.request(req, dest);
	var response = client.getResponse();
	var st1 = response.body.asString();
	//$.response.contentType = 'application/json';
	//$.response.charset = 'UTF-8';
	$.response.setBody(st1);
	
}

var aCmd = $.request.parameters.get('cmd');
switch (aCmd) {
	case "customers":
		customers();
		break;
	
	default:
		$.response.status = $.net.http.BAD_REQUEST;
		$.response.setBody('Invalid Command');

}