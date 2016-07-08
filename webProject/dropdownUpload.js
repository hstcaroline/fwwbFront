/**
 * Created by zouwenyun on 2016/7/7.
 */
Dropzone.options.dropzoneForm = {
    init: function () {
        this.on("addedfile", function(file) {
            window.alert(file.name);
        });
        this.on("complete", function (data) {
            var res = eval('(' + data.xhr.responseText + ')');
            window.alert(res.Message);
        });
    }
};