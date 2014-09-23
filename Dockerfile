FROM ubuntu:14.04

RUN apt-get update && \
 apt-get install -y autoconf build-essential \
 zlib1g-dev uuid-dev libpcre3-dev libssl-dev libpq-dev libxslt-dev \
 libapr1-dev libaprutil1-dev xsltproc libncurses5-dev python \
 libssh2-1-dev libsnmp-dev openjdk-6-jdk libprotobuf-c0-dev uuid-runtime telnet vim git lsof supervisor


ADD deps/noit /opt/noit
ADD conf /noitconf
ADD conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
RUN mkdir "/var/log/noitd.feed(stratcon)"
RUN mkdir -p /var/log/supervisor

RUN cd /opt/noit && autoconf && export LDFLAGS="-ldl -lm" && ./configure && make && make install

RUN cp /usr/local/etc/config_templates.conf /noitconf/config_templates.conf

RUN cd  /opt/noit/test && cp test-*.crt test-*.key /usr/local/etc/
RUN uuidgen


RUN apt-get clean

EXPOSE 32322 43191 8888

CMD ["/usr/bin/supervisord" ,"-c", "/etc/supervisor/conf.d/supervisord.conf"]
