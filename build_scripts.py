import os
os.system("ionic cordova build --release android")
os.system("jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk alias_name")
os.system("~/Library/Android/sdk/build-tools/27.0.3/zipalign -v 4 platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk platforms/android/app/build/outputs/apk/release/Gully.apk")


# iOS
# run -> ionic cordova build ios -- --buildFlag="-UseModernBuildSystem=0"