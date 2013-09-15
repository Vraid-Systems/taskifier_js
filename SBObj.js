/**
 * JavaScript Object library for asynchronously interacting with a storagebin
 * service using Cross-Origin Resource Sharing. NO jQuery needed.
 * 
 * CORS browser support minimums: Gecko 1.9.1 (Firefox 3.5, SeaMonkey 2.0),
 * Safari 4, Google Chrome 3, MSHTML/Trident 4.0 (Internet Explorer 8) via
 * XDomainRequest, Opera 12.00, Opera Mobile 12
 * http://en.wikipedia.org/wiki/Cross-origin_resource_sharing#Browser_support
 * 
 * `getDefault` method body taken from http://stackoverflow.com/a/894877
 */
function SBObj(theOwnerKey, theDataId) {
    var private_ApiBaseUrl = "https://storagebin.appspot.com";
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
    var private_DataId = this.getDefault(theDataId, false);

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

        if (!isPut && private_DataId) {
            aRetEventUrl += "/" + private_DataId;
        }

        return aRetEventUrl;
    }

    /**
     * kick-off the CORS data end point interaction
     * 
     * @param method {String}
     * @param theDataObj {Object} - must contain fields "type" and "content"
     */
    function private_SendDataObj(method, theDataObj) {
        if (method && theDataObj && theDataObj.content) {
            var aRequest = private_CreateRequest(method,
                    private_CreateRequestUrl((method === private_METHOD_POST)));

            if (aRequest) {
                if (theDataObj.type) {
                    aRequest.setRequestHeader("Content-Type", theDataObj.type);
                }

                aRequest.onload = private_OnLoad;
                aRequest.onerror = private_OnError;

                aRequest.send(theDataObj.content);
            }
        }
    }

    this.DELETE = function() {
        var aDataObj = {
            "type": "application/json",
            "content": "{}"
        };
        // no content needed
        private_SendDataObj(private_METHOD_DELETE, aDataObj);
    };

    this.GET = function() {
        var aDataObj = {
            "type": "application/json",
            "content": "{}"
        };
        // no content needed
        private_SendDataObj(private_METHOD_GET, aDataObj);
    };

    this.PUT = function(theData, theDataContentType) {
        theDataContentType = this.getDefault(theDataContentType, "text/plain");
        var aBlob = new Blob([ theData ], {
            type: theDataContentType
        });

        var aFormData = new FormData();
        aFormData.append("file", aBlob);
        var aDataObj = {
            "type": false,
            "content": aFormData
        };

        private_SendDataObj(private_METHOD_POST, aDataObj);
    };
}
