init:
	rm -rf venv && python3 -m venv venv && . venv/bin/activate && python3 -m pip install -r requirement.txt
app-local:
	. venv/bin/activate && python3 manage.py runserver
react:
	cd utils && bash reactor.sh && cd ..
init-localDB:
	python3 manage.py migrate
createadmin:
	python3 manage createsuperuser
