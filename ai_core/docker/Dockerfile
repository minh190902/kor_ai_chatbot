FROM python:3.12-slim

WORKDIR /src

COPY requirements.txt /src/

RUN apt-get update \
&& apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libpq-dev \
&& apt-get clean \
&& rm -rf /var/lib/apt/lists/* /root/.cache \
&& pip install --upgrade pip \
&& pip install --no-cache-dir -r requirements.txt

COPY . /src/
# COPY docker/entrypoint.sh /src/entrypoint.sh
# RUN chmod +x /src/entrypoint.sh

# ENTRYPOINT ["/src/entrypoint.sh"]
EXPOSE 8080

# CMD ["uvicorn", "app.api:api", "--host", "0.0.0.0", "--port", "8888", "--reload"]