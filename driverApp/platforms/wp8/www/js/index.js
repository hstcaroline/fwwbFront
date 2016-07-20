function showStaffInfo() {
    $("#readCardBtn").hide();
    $("#readCard").animate({
        paddingTop: '5%',
        paddingBottom: '5%',
    });
    $("#staffInfo").hide();
    $("#staffInfo").slideDown("slow");
}
var app = {
    initialize: function () {
        $("#scan_info").val("app ready");
        this.bind();
    },
    bind: function () {
        document.addEventListener('deviceready', this.deviceready, false);
    },
    deviceready: function () {
        function failure(reason) {
            $("#scan_info").val("there was a problem");
            navigator.notification.alert(reason, function() {}, "There was a problem");
        }
        nfc.addNdefListener(
            app.onNdef,
            function() {
                console.log("Listening for NDEF tags.");
            },
            failure
        );
        if (device.platform == "Android") {
            // Android reads non-NDEF tag. BlackBerry and Windows don't.
            nfc.addTagDiscoveredListener(
                app.onNfc,
                function() {
                    console.log("Listening for non-NDEF tags.");
                },
                failure
            );
            // Android launches the app when tags with mime type text/pg are scanned
            // because of an intent in AndroidManifest.xml.
            // phonegap-nfc fires an ndef-mime event (as opposed to an ndef event)
            // the code reuses the same onNfc handler
            nfc.addMimeTypeListener(
                'text/pg',
                app.onNdef,
                function() {
                    console.log("Listening for NDEF mime tags with type text/pg.");
                },
                failure
            );
        }
    },
    onNfc: function (nfcEvent) {
        var tag = nfcEvent.tag;
        var temInfo = JSON.stringify(tag);
        $("#scan_info").val("onNfc "+temInfo);
        showStaffInfo();
    },
    onNdef: function (nfcEvent) {
        var tag = nfcEvent.tag;
        var temInfo = JSON.stringify(tag);
        $("#scan_info").val("onNdef "+temInfo);
        // BB7 has different names, copy to Android names
        if (tag.serialNumber) {
            tag.id = tag.serialNumber;
            tag.isWritable = !tag.isLocked;
            tag.canMakeReadOnly = tag.isLockable;
        }
    }
};
