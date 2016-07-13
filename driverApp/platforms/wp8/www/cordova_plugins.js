cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/org.apache.cordova.vibration/www/vibration.js",
        "id": "org.apache.cordova.vibration.notification",
        "pluginId": "org.apache.cordova.vibration",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "pluginId": "org.apache.cordova.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.chariotsolutions.nfc.plugin/www/phonegap-nfc.js",
        "id": "com.chariotsolutions.nfc.plugin.NFC",
        "pluginId": "com.chariotsolutions.nfc.plugin",
        "runs": true
    },
    {
        "file": "plugins/com.blackberry.invoke/www/client.js",
        "id": "com.blackberry.invoke.client",
        "pluginId": "com.blackberry.invoke",
        "clobbers": [
            "blackberry.invoke"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "org.apache.cordova.vibration": "0.3.4",
    "org.apache.cordova.device": "0.2.4",
    "com.chariotsolutions.nfc.plugin": "0.4.6",
    "com.blackberry.invoke": "1.0.0"
}
// BOTTOM OF METADATA
});