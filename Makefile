all: front

front:
	sleep 3 && firefox "localhost:6789/lilypad.html" &
	cd frontend && python -m SimpleHTTPServer 6789

back:
	cd backend && python backend.py

