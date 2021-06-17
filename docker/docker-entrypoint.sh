#!/bin/sh
origin="/etc/nginx/conf.c/"
target="/etc/nginx/conf.d/"
for conf in `ls ${origin}`;do
    envsubst \
    '${SERVER_API}' \
    < ${origin}/${conf} > ${target}/${conf}
done
exec "$@"
