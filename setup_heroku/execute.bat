@echo off

:: Set the path to the Git Bash executable
set GIT_BASH_PATH="C:\Program Files\Git\bin\bash.exe"

:: Get the full path to the directory containing the batch script
set currentDir=%~dp0
:: Set the path to your Bash script
set BASH_SCRIPT_PATH=%currentDir%\"push.sh"

:: Check if Git Bash executable exists
if not exist %GIT_BASH_PATH% (
    echo Git Bash is not found. Please install Git Bash and set the correct path.
    exit /b 1
)

:: Check if the Bash script exists
if not exist %BASH_SCRIPT_PATH% (
    echo Bash script not found at %BASH_SCRIPT_PATH%.
    exit /b 1
)

:: Execute the Bash script using Git Bash
%GIT_BASH_PATH% --login -i %BASH_SCRIPT_PATH%

:: Exit the batch script
exit /b 0
