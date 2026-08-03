@echo off
cd /d "%~dp0..\.."
"C:\Program Files\nodejs\node.exe" lecture\meeting-08\record-lecture.mjs --reuse-narration 1> output\lecture\meeting-08\record.stdout.log 2> output\lecture\meeting-08\record.stderr.log

