

    var HttpServiceModule = angular.module('HttpServiceModule',[])
        HttpServiceModule.service('HttpService', HttpService);

    HttpService.$inject = ['$q', '$http'];

    function HttpService($q, $http) {

   

        var _Get = function (url, reqData) {
            return _SendRequest('GET', url, reqData);

        }

        // var _Post = function (url, reqData) {

        //     return _SendRequest('POST', url, reqData);

        // };
       
        var _Post = function (url, reqData) {
            
            return _SendRequest('POST', url, reqData);

        };

        var _Put = function (url, reqData) {

            return _SendRequest('PUT', url, reqData);

        };

        var _Delete = function (url, reqData) {
           
            return _SendRequest('Delete', url, reqData);

        }

        //var _Delete = function (url, reqData,header) {
        //    //console.log("reqData " + reqData);
        //    return _SendRequest('Delete', url, reqData,header);

        //}

     //Removed Header from parameter.

        var _SendRequest = function (method, url, reqData) {

            var req = "";
          
            req = {
                'method': method,

                'url': baseURL + url,

                'data': reqData,
            

                'headers': {'Content-Type': 'application/x-www-form-urlencoded'},
                    transformRequest: function(obj) {
                    var str = [];
                    for(var p in obj)
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                    return str.join("&");
               },
            };


            var deferred = $q.defer();

          //  var headers = {};

            // if (header) {
            //     headers['Content-Type'] = undefined;
            // }
            // else {
            //     headers['Content-Type'] = 'application/json';
            // }


           // req['headers'] = {'Content-Type': 'application/x-www-form-urlencoded'};

            var _successCallback = function (data) {
                deferred.resolve(data);
            };

            var _errorCallback = function (data) {

            };



            console.log("API URl " + req.url);
            console.log("Req " + JSON.stringify(req.data));

            $http(req)
                .success(_successCallback)
                .error(_errorCallback);

            return deferred.promise;
        };

        var service = {
            Get: _Get,
            Post: _Post,
            Put: _Put,
            Delete: _Delete
        }

        return service;

    }


