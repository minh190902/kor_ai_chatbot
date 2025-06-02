#!/bin/sh
set -e

# Đợi DB sẵn sàng (tuỳ chọn, nếu cần)
# python -c "import time; time.sleep(5)"

python src/db/db_config.py

exec "$@"