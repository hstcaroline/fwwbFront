cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "com.blackberry.invoke.client",
        "file": "plugins/com.blackberry.invoke/www/client.js",
        "pluginId": "com.blackberry.invoke",
        "clobbers": [
            "blackberry.invoke"
        ]
    },
    {
        "id": "com.chariotsolutions.nfc.plugin.NFC",
        "file": "plugins/com.chariotsolutions.nfc.plugin/www/phonegap-nfc.js",
        "pluginId": "com.chariotsolutions.nfc.plugin",
        "runs": true
    },
    {
        "id": "org.apache.cordova.device.device",
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "pluginId": "org.apache.cordova.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "id": "org.apache.cordova.vibration.notification",
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "pluginId": "org.apache.cordova.vibration",
        "merges": [
            "navigator.notification"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.blackberry.invoke": "1.0.0",
    "com.chariotsolutions.nfc.plugin": "0.4.6",
    "cordova-plugin-whitelist": "1.2.2",
    "org.apache.cordova.device": "0.2.4",
    "org.apache.cordova.vibration": "0.3.4"
};
// BOTTOM OF METADATA
});