FROM docker.io/library/nginx:latest
COPY conf/nginx.conf /etc/nginx/nginx.conf
COPY conf/conn_handler.js /etc/nginx/njs/conn_handler.js

ENTRYPOINT [ "/usr/sbin/nginx", "-g", "daemon off;" ]
