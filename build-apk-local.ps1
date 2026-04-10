$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot"
$env:ANDROID_HOME = "C:\Users\renan\AppData\Local\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
Set-Location "C:\Users\renan\Desktop\teste app Fitnes\fitpro360\android"
Write-Host "Running Java 17 Check:"
& "$env:JAVA_HOME\bin\java.exe" -version
Write-Host "Executing Gradle Wrapper..."
& "$env:JAVA_HOME\bin\java.exe" -cp "gradle\wrapper\gradle-wrapper.jar" org.gradle.wrapper.GradleWrapperMain assembleRelease
