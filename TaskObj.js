/**
 * JavaScript Object library for asynchronously interacting with a taskifier
 * service using Cross-Origin Resource Sharing. NO jQuery needed.
 *
 * CORS browser support minimums: Gecko 1.9.1 (Firefox 3.5, SeaMonkey 2.0),
 * Safari 4, Google Chrome 3, MSHTML/Trident 4.0 (Internet Explorer 8) via
 * XDomainRequest, Opera 12.00, Opera Mobile 12
 * http://en.wikipedia.org/wiki/Cross-origin_resource_sharing#Browser_support
 *
 * `getDefault` method body taken from http://stackoverflow.com/a/894877
 */
function TaskObj(theOwnerKey, theTaskId) {
    var private_ApiBaseUrl = "https://taskifier.appspot.com";
    var private_DATA_BASE_URL = "/data";

    var private_METHOD_DELETE = "DELETE";
    var private_METHOD_GET = "GET";
    var private_METHOD_POST = "POST";

    var private_OnLoad = function() {};
    var private_OnError = function() {};

    this.setOnLoad = function(theOnLoadFunc) {
        private_OnLoad = theOnLoadFunc;
    };

    this.setOnError = function(theOnErrorFunc) {
        private_OnError = theOnErrorFunc;
    };

    this.getDefault = function(arg, val) {
        return typeof arg !== 'undefined' ? arg : val;
    };

    this.setApiBaseUrl = function(theNewUrl) {
        private_ApiBaseUrl = theNewUrl;
    };

    var private_OwnerKey = this.getDefault(theOwnerKey, false);
    var private_TaskId = this.getDefault(theTaskId, false);

    /**
     * create a CORS request object
     *
     * @param method {String}
     * @param url {String}
     * @returns {XMLHttpRequest}
     */
    function private_CreateRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
            xhr.open(method, url, true);
        } else if (typeof XDomainRequest != "undefined") {
            xhr = new XDomainRequest();
            xhr.open(method, url, true);
        } else {
            xhr = null;
        }
        return xhr;
    }

    /**
     * create the String representation of the data end point URL
     *
     * @param isPut {Boolean}
     * @returns {String}
     */
    function private_CreateRequestUrl(isPut) {
        var aRetEventUrl = private_ApiBaseUrl + private_DATA_BASE_URL;

        if (private_OwnerKey) {
            aRetEventUrl += "/" + private_OwnerKey;
        }

        if (!isPut && private_TaskId) {
            aRetEventUrl += "/" + private_TaskId;
        }

        return aRetEventUrl;
    }

    /**
     * kick-off the CORS data end point interaction
     *
     * @param method {String}
     * @param theTaskObj {Object} - must contain fields "type" and "content"
     */
    function private_SendTaskObj(method, theTaskObj) {
        if (method && theTaskObj && theTaskObj.content) {
            var aRequest = private_CreateRequest(method,
                    private_CreateRequestUrl((method === private_METHOD_POST)));

            if (aRequest) {
                if (theTaskObj.type) {
                    aRequest.setRequestHeader("Content-Type", theTaskObj.type);
                }

                aRequest.onload = private_OnLoad;
                aRequest.onerror = private_OnError;

                aRequest.send(theTaskObj.content);
            }
        }
    }

    this.DELETE = function() {
        var aTaskObj = {
            "type": "application/json",
            "content": "{}"
        };
        private_SendTaskObj(private_METHOD_DELETE, aTaskObj);
    };

    this.GET = function() {
        var aTaskObj = {
            "type": "application/json",
            "content": "{}"
        };
        private_SendTaskObj(private_METHOD_GET, aTaskObj);
    };

    this.PUT = function(theTask) {
        var params = "";

        for (var key in theTask) {
            if(theTask.hasOwnProperty(key)){
                var value = theTask[key];
                if (params == "") {
                    params = key + "=" + value;
                } else {
                    params += "&" + key + "=" + value;
                }
            }
        }

        var aTaskObj = {
            "type": "application/json",
            "content": params
        };
        private_SendTaskObj(private_METHOD_POST, aTaskObj);
    };
}

TaskObj.prototype.createTask = function(theSource, theDest, theContent, theReadyDate) {
    var aTaskObj = {
        "source": theSource,
        "dest": theDest,
        "content": theContent,
        "ready_time": theReadyDate.toJSON()
    };
    return aTaskObj;
};
