::=================================config==================================
set Version=1.0.0
set AppID=182301976032601
set AccessToken=EAAYsfZAxiFmMBAI5fVJT1UpJl2cUfogfiPnx3ORVpZAa62OHsW2gFa8C92RIlavxgpxsAae5e5AOi48WnLQ6LRqHVg8eXkFRVZCAcsQpSZAJUZCeYtLtARBTgXj7PAUsdccwEcvdgWQHxWL1YrvgJOuKYiqe2ikFSrcLDqtMYbgZDZD
set imgQuality=50-70
::imgQuality=min-max, default 40-50
set mobileIP=192.168.3.8

::=================================common==================================
xcopy .\Tools\key.pem .\ /h /y
xcopy .\Tools\cert.pem .\ /h /y

::=================================build options==================================
::mobile
if "%1"=="-m" (
    node .\Tools\removeFBScript.js
    http-server -c-1 -p 8080 -a %mobileIP%
)

::PC
if "%1"=="-p" (
    node .\Tools\addFBScript.js
    http-server --ssl -c-1 -p 8080 -a localhost
)

::upload test
if "%1"=="-t" (
    set comment=Test
    node .\Tools\addFBScript.js
    call :testPrepare
    call :export
    call :upload
    http-server ./Build/ --ssl -c-1 -p 8080 -a localhost
)

::upload release
if "%1"=="-r" (
    set comment=Release_minified
    call :releasePrepare
    call :minifyJS
    call :minifyImage
    call :export
    call :upload
    http-server ./Build/ --ssl -c-1 -p 8080 -a localhost
)

::=================================functions==================================
:testPrepare
    rmdir /S /Q .\Build
    mkdir .\Build
    xcopy .\Assets .\Build\Assets /e /i /h /y
    copy .\index.html .\Build\index.html /y
    copy .\Tools\fbapp-config.json .\Build\fbapp-config.json /y
EXIT /B 0

:releasePrepare
    rmdir /S /Q .\Build
    mkdir .\Build
    xcopy .\Assets\Audio .\Build\Assets\Audio /e /i /h /y
    xcopy .\Assets\Models .\Build\Assets\Models /e /i /h /y
    xcopy .\Assets\Textures .\Build\Assets\Textures /e /i /h /y
    copy .\Tools\index_release.html .\Build\index.html /y
    copy .\Tools\fbapp-config.json .\Build\fbapp-config.json /y
EXIT /B 0

:minifyJS
    node .\Tools\biMinify.js
    call .\Tools\biMinify.bat
    del .\Tools\biMinify.bat
EXIT /B 0

:minifyImage
    set imgDir=./Build/Assets/Textures
    .\Tools\pngquant --ext .png --force --speed=1 --quality=%imgQuality% %imgDir%/*.png %imgDir%/*/*.png %imgDir%/*/*/*.png
EXIT /B 0

:export
    for %%I in (.) do set ProjectName=%%~nxI
    set Filename=%ProjectName%-FB-%Version%.zip

    del .\Build\%Filename%
    7z a -tzip .\Build\%Filename% .\Build\*
EXIT /B 0

:upload
    curl -x http://127.0.0.1:1080 -X POST https://graph-video.facebook.com/%AppID%/assets ^
    -F access_token=%AccessToken% ^
    -F type=BUNDLE ^
    -F asset=@Build/%Filename% ^
    -F comment=%comment%

    start https://developers.facebook.com/apps/%AppID%/instant-games/hosting/?business_id=2032974016957223
EXIT /B 0