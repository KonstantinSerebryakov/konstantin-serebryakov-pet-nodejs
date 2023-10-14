@echo off

:: Define your Heroku app name
set APP_NAME=share-portfolio-accounts
set TEMP_NAME=heroku-set-commands.txt

if [%1] == [] (
    set ENV_FILE=.env
) else (
    set ENV_FILE=%1
)

if not exist %ENV_FILE% (
    echo The specified .env file "%ENV_FILE%" does not exist.
    exit /b 1
)

if exist %TEMP_NAME% (
  del "%TEMP_NAME%"
)
echo.>"%TEMP_NAME%"

for /F "tokens=1,2 delims==" %%A in (%ENV_FILE%) do (
@REM for /F "tokens=*" %%A in (%ENV_FILE%) do (
  set TEMP_NAME=tempfile_%random%_%time:~6,5%.bat
  call heroku config:set %%A="%%B" --app %APP_NAME%>%TEMP_NAME%

  @REM start cmd /c /wait heroku config:set %%A --app %APP_NAME%>%TEMP_NAME%
  echo heroku config:set %%A="%%B" --app %APP_NAME%>>"%TEMP_NAME%"
)

call temp.bat
echo Config vars updated on Heroku app: %APP_NAME%

:: Exit the batch script
exit /b 0
