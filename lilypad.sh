#!/bin/bash
control_c()
{
    kill $1
    kill $2
    echo "Done!"
    exit 0
}
cd backend
python backend.py &
backendPID=$(echo $!)
echo $backendPID
cd ..
sleep 3 
firefox "localhost:6789/lilypad.html" &
cd frontend 
python -m SimpleHTTPServer 6789 &
frontendPID=$(echo $!)
echo $frontendPID
trap 'control_c $backendPID $frontendPID' SIGINT
sleep infinity
