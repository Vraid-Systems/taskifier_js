var myDataId = -1;

function loadDataId(theResponse) {
    if (theResponse.contains("=")) {
        var array = theResponse.split("=");
        myDataId = array[1];
    }
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
    var aSBObj_PUT = new SBObj("example");
    aSBObj_PUT.setOnLoad(aOnLoadFunc);
    aSBObj_PUT.setOnError(aOnErrorFunc);
    aSBObj_PUT.setApiBaseUrl("http://localhost:8000");
    aSBObj_PUT.PUT("test text data to store", "text/plain");
});

asyncTest("GET", 1, function() {
    var aSBObj = new SBObj("example", myDataId);
    aSBObj.setOnLoad(aOnLoadFunc);
    aSBObj.setOnError(aOnErrorFunc);
    aSBObj.setApiBaseUrl("http://localhost:8000");
    aSBObj.GET();
});

asyncTest("DELETE", 1, function() {
    var aSBObj = new SBObj("example", myDataId);
    aSBObj.setOnLoad(aOnLoadFunc);
    aSBObj.setOnError(aOnErrorFunc);
    aSBObj.setApiBaseUrl("http://localhost:8000");
    aSBObj.DELETE();
});
