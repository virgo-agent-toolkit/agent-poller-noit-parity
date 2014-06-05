FROM ubuntu:12.04

RUN apt-get update && apt-get install -y apache2 && apt-get clean && apt-get autoremove

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2

RUN rm /var/www/index.html
ADD index.html /var/www/index.html

EXPOSE 80

ENTRYPOINT ["/usr/sbin/apache2", "-D", "FOREGROUND"]
