var myTaskId = -1;

function loadDataId(theResponse) {
    var aResponseObj = eval('(' + theResponse + ')');
    myTaskId = aResponseObj.id;
}

var aOnLoadFunc = function(e) {
    if (e.target && e.target.response) {
        var aResp = e.target.response;
        if (aResp.contains("NOOP") || aResp.contains("ERROR")) {
            ok(false, aResp);
        } else {
            loadDataId(aResp);
            ok(true, aResp);
        }
    } else {
        ok(false, "malformed response");
    }
    start();
};
var aOnErrorFunc = function(e) {
    var errorMsg = "remote resource error";
    if (e.target && e.target.response) {
        errorMsg = e.target.response;
    }
    ok(false, errorMsg);
    start();
};

asyncTest("PUT", 1, function() {
    var aTaskObj_PUT = new TaskObj("example");
    aTaskObj_PUT.setOnLoad(aOnLoadFunc);
    aTaskObj_PUT.setOnError(aOnErrorFunc);
    aTaskObj_PUT.setApiBaseUrl("http://localhost:8000");
    aTaskObj_PUT.PUT(aTaskObj_PUT.createTask("a@domain.com", "b@domain.com", "the content", new Date()));
});

asyncTest("GET", 1, function() {
    var aTaskObj_GET = new TaskObj("example", myTaskId);
    aTaskObj_GET.setOnLoad(aOnLoadFunc);
    aTaskObj_GET.setOnError(aOnErrorFunc);
    aTaskObj_GET.setApiBaseUrl("http://localhost:8000");
    aTaskObj_GET.GET();
});

asyncTest("DELETE", 1, function() {
    var aTaskObj_DELETE = new TaskObj("example", myTaskId);
    aTaskObj_DELETE.setOnLoad(aOnLoadFunc);
    aTaskObj_DELETE.setOnError(aOnErrorFunc);
    aTaskObj_DELETE.setApiBaseUrl("http://localhost:8000");
    aTaskObj_DELETE.DELETE();
});
