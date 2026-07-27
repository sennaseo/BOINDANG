FROM python:3.10
WORKDIR /app
# libgl1-mesa-glx 는 Debian bookworm 에서 제거됨 — opencv 런타임 의존성은 libgl1+libglib2.0-0
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 && rm -rf /var/lib/apt/lists/*
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8083"]