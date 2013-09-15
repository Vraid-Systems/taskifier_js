storagebin_js, a JavaScript wrapper library
=============================================

Object-oriented JavaScript library for abstracting out
Cross-Origin Resource Sharing via XMLHttpRequest usage.

Gotchas
------------
- Internet Explorer 8 & 9 use `XDomainRequest` instead of `XMLHttpRequest`:
http://en.wikipedia.org/wiki/Cross-Origin_Resource_Sharing#Browser_support
- FormData support requires a newer browser:
https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest/FormData#Browser_compatibility

Unit Test Environments
------------
- Python 2.7 local server for
[storagebin](https://github.com/jzerbe/storagebin)
running on Windows 7 (x64) with JS run via Firefox 21

License
-------------
http://opensource.org/licenses/BSD-3-Clause
