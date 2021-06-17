FROM registry.medway.cloud/containers/nginx:1.18.0-alpine

COPY ./docker/conf/ /etc/nginx/

COPY ./docker/docker-entrypoint.sh /docker-entrypoint.sh

ENV SERVER_API="http://performance-appraisal-server:8080/"

ARG PROJECT_NAME="performance-appraisal-ui"

COPY ./dist/ /usr/share/nginx/html/

ENTRYPOINT [ "/docker-entrypoint.sh" ]

CMD ["nginx", "-g", "daemon off;"]
