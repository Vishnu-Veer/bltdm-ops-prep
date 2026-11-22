#!/bin/sh
# Copies the study site into the app, builds it and installs it on your plugged-in iPhone.
# Free Apple IDs: apps expire after 7 days, so re-run this then.
# Usage: sh install-device.sh [device-id]   (device ids: xcrun devicectl list devices)
set -eu
cd "$(dirname "$0")"
DEVICE=${1:-00008150-00161DEE2112401C}
TEAM=${TEAM:-G6395A74Q7}
BUILD=/tmp/bltdmprep-device
for f in index.html style.css data.js app.js favicon.svg accessibility.html; do cp "../$f" "BLTDMPrep/$f"; done
xcodebuild -project BLTDMPrep.xcodeproj -scheme BLTDMPrep -configuration Release -destination "id=$DEVICE" \
  -derivedDataPath "$BUILD" -allowProvisioningUpdates DEVELOPMENT_TEAM="$TEAM" build > "$BUILD.log" 2>&1 \
  || { grep -E "error:" "$BUILD.log" | head; echo "Build failed (full log: $BUILD.log)"; exit 1; }
xcrun devicectl device install app --device "$DEVICE" "$BUILD/Build/Products/Release-iphoneos/BLTDMPrep.app" >/dev/null
xcrun devicectl device process launch --device "$DEVICE" com.vishnuveer.bltdmprep >/dev/null || echo "Installed. If it won't open: Settings > General > VPN & Device Management > trust your Apple ID."
echo "Installed BLTDM Prep on your iPhone."
