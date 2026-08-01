#!/bin/sh
set -e

echo "🚀 Executando prisma db push para sincronizar banco de dados..."
npx prisma db push --skip-generate || true

exec "$@"
