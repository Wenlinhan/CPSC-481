@echo off
cd /d "%~dp0..\.."
"C:\Program Files\nodejs\node.exe" lecture\meeting-04\record-lecture.mjs --reuse-narration 1> output\lecture\meeting-04\record.stdout.log 2> output\lecture\meeting-04\record.stderr.log
