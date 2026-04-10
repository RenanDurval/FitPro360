@echo off
set ANDROID_HOME=C:\Users\renan\AppData\Local\Android\Sdk
set ANDROID_SDK_ROOT=%ANDROID_HOME%
cd /d "%~dp0android"
call gradlew.bat assembleRelease
