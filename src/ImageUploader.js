/*
 *  JavaScript auxiliary library
 *  Copyright (C) 2012-2014 Dario Giovannetti <dev@dariogiovannetti.net>
 *
 *  This file is part of JavaScript auxiliary library.
 *
 *  JavaScript auxiliary library is free software: you can redistribute it
 *  and/or modify it under the terms of the GNU General Public License
 *  as published by the Free Software Foundation, either version 3
 *  of the License, or (at your option) any later version.
 *
 *  JavaScript auxiliary library is distributed in the hope that it will be
 *  useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with JavaScript auxiliary library.
 *  If not, see <http://www.gnu.org/licenses/>.
 */

if (!Alib) var Alib = {};

Alib.ImageUploader = new function () {
    var httpRequest = function (params) {
        /*
         * params = {
         *     method: ,
         *     url: ,
         *     data: ,
         *     headers: ,
         *     user: ,
         *     password: ,
         *     onload: ,
         *     onerror: ,
         *     onreadystatechange: ,
         * }
         */
        if (!params.method) params.method = "GET";
        if (!params.data) params.data = null;
        if (!params.headers) params.headers = {};
        if (!params.user) params.user = null;
        if (!params.password) params.password = null;
        if (!params.onload) params.onload = function (req) {};
        if (!params.onerror) params.onerror = function (req) {};
        if (!params.onreadystatechange) params.onreadystatechange = function (req) {};
        params.async = true;

        var req = new XMLHttpRequest();

        req.open(params.method, params.url, params.async, params.user, params.password);

        for (var header in params.headers) {
            req.setRequestHeader(header, params.headers[header]);
        }

        // TODO:
        //   http://www.matlus.com/html5-file-upload-with-progress/
        //   http://html5doctor.com/the-progress-element/
        //   http://www.geekthis.net/blog/38/html5-uploading-with-progress-bar
        req.upload.onprogress = function(e) {
            if (e.lengthComputable) {
                var percentComplete = (e.loaded / e.total) * 100;
                // TODO: log
                //console.log(percentComplete + '% uploaded');
            }
        };

        req.onreadystatechange = function () {
            var response = {
                responseText: req.responseText,
                readyState: req.readyState,
                responseHeaders: req.getAllResponseHeaders(),
                status: req.status,
                statusText: req.statusText,
            };

            try {
                response.responseJSON = JSON.parse(req.responseText);
            }
            catch (err) {
                response.responseJSON = undefined;
            }

            params.onreadystatechange(response);

            if (req.readyState == 4) {
                if (req.status == 200) {
                    params.onload(response);
                }
                else {
                    params.onerror(response);
                }
            }
        };

        req.send(params.data);

        return {
            abort: function () {
                req.abort();
            },
        }
    };

    var requestPost = function (params, blobs, url, call, callArgs) {
        var query = {
            method: "POST",
            url: url,
            onload: function (res) {
                call(res, callArgs);
            },
            onerror: function (res) {
                if (confirm("Failed query (" + res.finalUrl + ")\n\nDo you want to retry?")) {
                    requestPost(params, url, call, callArgs);
                }
            }
        };

        query.data = new FormData();
        for (var p in params) {
            query.data.append(p, params[p]);
        }
        for (var b = 0; b < blobs.length; b++) {
            var blob = blobs[b];
            query.data.append(blob[0], blob[1], blob[2]);
        }
        // Do not add "multipart/form-data" explicitly or the query will fail
        //query.headers = {"Content-type": "multipart/form-data"};

        try {
            httpRequest(query);
        }
        catch (err) {
            alert("Failed HTTP request: " + err);
        }
    };

    var dataURLtoBlob = function(cId, dataURL) {
        // Thanks to http://mitgux.com/send-canvas-to-server-as-file-using-ajax

        var binary = atob(dataURL.split(',')[1]);

        // Create 8-bit unsigned array
        var array = [];
        for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
        }

        return new Blob([new Uint8Array(array)], {type: config.copies[cId].type});
    };

    var processImage = function(iId, cId, canvas, name, image) {
        var ctx = canvas.getContext("2d");

        var imageObj = new Image();
        imageObj.onload = function() {
            resizeImage(cId, this, canvas, ctx);
            var modImage = dataURLtoBlob(cId, canvas.toDataURL(config.copies[cId].type));
            uploadImage(iId, cId, name, modImage);
        };

        var reader = new FileReader();
        reader.onload = function (e) {
            imageObj.src = e.target.result;
        };

        reader.readAsDataURL(image);
    };

    var resizeImage = function(cId, img, canvas, ctx) {
        var ratio = img.width / img.height;

        var cfgWidth = config.copies[cId].width;
        var cfgHeight = config.copies[cId].height;

        var newWidth, newHeight;

        if (cfgWidth && cfgHeight) {
            newWidth = cfgWidth;
            newHeight = cfgHeight;

            if (config.copies[cId].mode == 'outside') {
                newHeight = cfgWidth / ratio;
                if (newHeight < cfgHeight) {
                    newHeight = cfgHeight;
                    newWidth = cfgHeight * ratio;
                }
            }
            else if (config.copies[cId].mode == 'inside') {
                newHeight = cfgWidth / ratio;
                if (newHeight > cfgHeight) {
                    newHeight = cfgHeight;
                    newWidth = cfgHeight * ratio;
                }
            }
        }
        else if (cfgWidth && !cfgHeight) {
            newWidth = cfgWidth;
            newHeight = cfgWidth / ratio;
        }
        else if (!cfgWidth && cfgHeight) {
            newWidth = cfgHeight * ratio;
            newHeight = cfgHeight;
        }
        else {
            newWidth = img.width;
            newHeight = img.height;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
    };

    var uploadImage = function(iId, cId, name, blob) {
        var destPath = config.copies[cId].destPath;
        if(destPath != '' && destPath.substr(-1) != '/') {
            destPath += '/';
        }

        var fName = destPath + config.copies[cId].prefix + name;

        var blobs = [
            ['image', blob, fName],
        ];
        var url = config.copies[cId].processUrl;
        var call = function(res, args) {
            updateStatus(iId, cId, res);
        };

        requestPost({}, blobs, url, call, []);
    };

    var updateStatus = function(iId, cId, res) {
        // counter and total are defined outside of this function
        counter++;
        config.statusMessage.innerHTML = (counter * 100 / total).toFixed(0) + " %";
        config.statusList.getElementsByTagName('li')[iId].innerHTML += '<br>' + res.responseText;
    };

    var total = 0;
    var counter = 0;

    var config = {
        'fileChooser': null,  // Must be overridden
        'uploadButton': null,  // Must be overridden
        'statusMessage': null,  // Must be overridden
        'statusList': null,  // Must be overridden
        'copies': [
            {
                'processUrl': null,  // Must be overridden
                'destPath': './', // Automatically normalized with a trailing slash
                'prefix': '',
                'type': 'image/png',
                'mode': 'deform',
                'width': 200,
                'height': 200,
            },
        ],
    };

    this.configure = function(cfg) {
        // cfg can be incomplete, thus using the default values in config
        for (var c in cfg) {
            config[c] = cfg[c];
        }
    };

    this.initStatus = function() {
        // Reset file list
        config.statusList.innerHTML = '';

        // Make sure the controls are enabled, as for example Firefox doesn't
        // re-enable them if the page is refreshed simply (not using Shift)
        config.uploadButton.disabled = false;
        config.fileChooser.disabled = false;

        var files = config.fileChooser.files;

        for (var i = 0; i < files.length; i++) {
            var image = files[i];
            var imageItem = document.createElement('li');
            imageItem.innerHTML = image.name + ' (' + image.type + ')';
            config.statusList.appendChild(imageItem);
        }
    };

    this.main = function() {
        // Make sure the file list is up to date
        this.initStatus();

        // At the moment the page needs to be refreshed before doing another
        // upload, so leave the form disabled
        config.uploadButton.disabled = true;
        config.fileChooser.disabled = true;

        config.statusMessage.innerHTML = "0 %";

        var canvas = document.createElement('canvas');
        var files = config.fileChooser.files;

        // total is defined outside of this function
        total = files.length * config.copies.length;

        for (var i = 0; i < files.length; i++) {
            var image = files[i];

            for (var c = 0; c < config.copies.length; c++) {
                processImage(i, c, canvas, image.name, image);
            }
        }
    };
};
