FROM python:3.8-slim-buster
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src .
ENV FLASK_APP=main.py
ENV FLASK_ENV=development
CMD ["flask", "run"]