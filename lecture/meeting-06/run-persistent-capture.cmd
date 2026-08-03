@echo off
cd /d "%~dp0..\.."
"C:\Program Files\nodejs\node.exe" lecture\meeting-06\record-lecture.mjs --reuse-narration 1> output\lecture\meeting-06\record.stdout.log 2> output\lecture\meeting-06\record.stderr.log
