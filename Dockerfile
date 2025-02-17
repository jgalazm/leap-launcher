FROM python:3.8-slim-buster
WORKDIR /code
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src .
ENV QUART_APP=main:app
CMD ["quart", "run"]