all: front

front:
	sleep 3 && google-chrome "localhost:6789" &
	cd frontend && python -m SimpleHTTPServer 6789

back:
	cd backend && python backend.py

