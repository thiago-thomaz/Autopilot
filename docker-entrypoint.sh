#!/bin/sh
set -e

echo "🚀 Executando prisma db push para sincronizar banco de dados..."
node ./node_modules/prisma/build/index.js db push --skip-generate || true

exec "$@"
