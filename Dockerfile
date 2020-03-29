FROM python:3.8-slim-buster
WORKDIR /launcher
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY launcher .
