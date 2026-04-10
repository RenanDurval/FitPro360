@echo off
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot
set ANDROID_HOME=C:\Users\renan\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%
cd android
echo Starting gradle build...
call gradlew.bat assembleRelease
echo Gradle build finished with error level: %ERRORLEVEL%
