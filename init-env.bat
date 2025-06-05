@echo off
for /r %%f in (example.env) do (
  if not exist "%%~dpf.env" (
    copy "%%f" "%%~dpf.env" >nul
  )
)