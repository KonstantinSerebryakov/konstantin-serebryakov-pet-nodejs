@echo off
echo Application Name: %1
nx generate @nrwl/nest:application %1 --unitTestRunner=jest
